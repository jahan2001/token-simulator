let tokens = 0;
let tokensPerSecond = 0;

// ======== سیستم دستاوردها ========
const achievements = {
    firstClick: { name: "First Click", description: "Make your first click", earned: false },
    firstUpgrade: { name: "First Investor", description: "Buy your first upgrade", earned: false },
    thousandaire: { name: "Thousandaire", description: "Reach 1,000 tokens", earned: false },
    tycoon: { name: "Tycoon", description: "Reach 10,000 tokens", earned: false },
    proMiner: { name: "Pro Miner", description: "Reach 10+ tokens per second", earned: false }
};

// ======== ذخیره‌سازی و بازیابی پیشرفت ========

// تابع برای ذخیره وضعیت بازی
function saveGame() {
    const gameState = {
        tokens: tokens,
        tokensPerSecond: tokensPerSecond,
        achievements: achievements,
        lastSaveTime: Date.now()
    };
    localStorage.setItem('tokenSimulatorSave', JSON.stringify(gameState));
}

// تابع برای بارگذاری وضعیت بازی
function loadGame() {
    const saved = localStorage.getItem('tokenSimulatorSave');
    if (saved) {
        const gameState = JSON.parse(saved);
        tokens = gameState.tokens || 0;
        tokensPerSecond = gameState.tokensPerSecond || 0;
        
        // بارگذاری دستاوردها
        if (gameState.achievements) {
            for (const key in gameState.achievements) {
                if (achievements[key]) {
                    achievements[key].earned = gameState.achievements[key].earned;
                }
            }
        }
        
        // محاسبه توکن‌های از دست رفته در زمان عدم فعالیت
        if (gameState.lastSaveTime) {
            const timePassed = Date.now() - gameState.lastSaveTime;
            const tokensMissed = (timePassed / 1000) * tokensPerSecond;
            tokens += tokensMissed;
        }
        
        updateDisplay();
    }
}

// تابع پاک کردن ذخیره‌سازی (برای تست)
function resetGame() {
    if (confirm('Are you sure you want to reset the game?')) {
        localStorage.removeItem('tokenSimulatorSave');
        tokens = 0;
        tokensPerSecond = 0;
        
        // ریست کردن دستاوردها
        for (const key in achievements) {
            achievements[key].earned = false;
        }
        
        updateDisplay();
        alert('Game reset!');
    }
}

// تابع برای خرید آپگرید
function buyUpgrade(addTokensPerSecond, cost) {
    if(tokens >= cost) {
        tokens -= cost;
        tokensPerSecond += addTokensPerSecond;
        updateDisplay();
        saveGame(); // ذخیره پس از هر خرید
        checkAchievements(); // بررسی دستاوردها
        alert(`Upgrade purchased! +${addTokensPerSecond} tokens/sec`);
    } else {
        alert('Not enough tokens!');
    }
}

// تابع برای بروزرسانی صفحه
function updateDisplay() {
    document.getElementById('tokens').innerText = Math.floor(tokens);
    // ذخیره خودکار هر ۱۰ ثانیه
    if (Math.floor(tokens) % 10 === 0) {
        saveGame();
    }
    // بررسی دستاوردها در هر بروزرسانی
    checkAchievements();
}

// ======== سیستم دستاوردها ========

// تابع بررسی دستاوردها
function checkAchievements() {
    // دستاورد اولین کلیک
    if (tokens >= 1 && !achievements.firstClick.earned) {
        unlockAchievement('firstClick');
    }
    
    // دستاورد اولین آپگرید
    if (tokensPerSecond > 0 && !achievements.firstUpgrade.earned) {
        unlockAchievement('firstUpgrade');
    }
    
    // دستاورد ثروتمند
    if (tokens >= 1000 && !achievements.thousandaire.earned) {
        unlockAchievement('thousandaire');
    }
    
    // دستاورد تایکون
    if (tokens >= 10000 && !achievements.tycoon.earned) {
        unlockAchievement('tycoon');
    }
    
    // دستاورد ماینر حرفه‌ای
    if (tokensPerSecond >= 10 && !achievements.proMiner.earned) {
        unlockAchievement('proMiner');
    }
}

// تابع باز کردن قفل دستاورد
function unlockAchievement(achievementKey) {
    achievements[achievementKey].earned = true;
    showAchievementNotification(achievements[achievementKey].name);
    saveGame(); // ذخیره دستاورد جدید
}

// تابع نمایش اعلان دستاورد
function showAchievementNotification(achievementName) {
    alert(`🎉 Achievement Unlocked: ${achievementName}!`);
}

// تابع نمایش لیست دستاوردها
function showAchievements() {
    let achievementsList = "Your Achievements:\n\n";
    let earnedCount = 0;
    
    for (const key in achievements) {
        const achievement = achievements[key];
        if (achievement.earned) {
            achievementsList += `✅ ${achievement.name}\n   ${achievement.description}\n\n`;
            earnedCount++;
        } else {
            achievementsList += `❌ ${achievement.name}\n   ${achievement.description}\n\n`;
        }
    }
    
    achievementsList += `\nTotal: ${earnedCount} of ${Object.keys(achievements).length} achievements`;
    alert(achievementsList);
}

// حلقه اصلی - توکن را خودکار اضافه می‌کند
setInterval(function() {
    tokens += tokensPerSecond;
    updateDisplay();
}, 1000);

// اضافه کردن توکن با کلیک (برای شروع)
document.getElementById('tokens').addEventListener('click', function() {
    tokens += 1;
    updateDisplay();
});

// بارگذاری خودکار هنگام شروع بازی
window.addEventListener('load', function() {
    loadGame();
    
    // ذخیره‌سازی خودکار هر ۳۰ ثانیه
    setInterval(saveGame, 30000);
});
