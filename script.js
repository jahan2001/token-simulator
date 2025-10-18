// ======== سیستم دستاوردها ========
const achievements = {
    firstClick: { name: "شروع کننده", description: "اولین کلیک توکن", earned: false },
    firstUpgrade: { name: "سرمایه گذار", description: "اولین آپگرید را بخر", earned: false },
    thousandaire: { name: "ثروتمند", description: "به 1000 توکن برس", earned: false },
    tycoon: { name: "تایکون", description: "به 10000 توکن برس", earned: false },
    proMiner: { name: "ماینر حرفه ای", description: "10+ توکن در ثانیه داشته باش", earned: false }
};
let tokens = 0;
let tokensPerSecond = 0;

// ======== ذخیره‌سازی و بازیابی پیشرفت ========

// تابع برای ذخیره وضعیت بازی
function saveGame() {
    const gameState = {
        tokens: tokens,
        tokensPerSecond: tokensPerSecond,
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
        
        // محاسبه توکن‌های از دست رفته در زمان عدم فعالیت
        if (gameState.lastSaveTime) {
            const timePassed = Date.now() - gameState.lastSaveTime;
            const tokensMissed = (timePassed / 1000) * tokensPerSecond;
            tokens += tokensMissed;
        }
        
        updateDisplay();
        alert('پیشرفت شما بازیابی شد! 🎮');
    }function updateDisplay() {
    document.getElementById('tokens').innerText = Math.floor(tokens);
    // ذخیره خودکار هر ۱۰ ثانیه
    if (Math.floor(tokens) % 10 === 0) {
        saveGame();function saveGame() {
    const gameState = {
        tokens: tokens,
        tokensPerSecond: tokensPerSecond,
        achievements: achievements,
        lastSaveTime: Date.now()
    };
    localStorage.setItem('tokenSimulatorSave', JSON.stringify(gameState));
}
    }
    // بررسی دستاوردها در هر بروزرسانی
    checkAchievements();
}
}

// تابع پاک کردن ذخیره‌سازی (برای تست)
function resetGame() {
    if (confirm('آیا مطمئنید می‌خواهید بازی را ریست کنید؟')) {
        localStorage.removeItem('tokenSimulatorSave');
        tokens = 0;
        tokensPerSecond = 0;
        updateDisplay();
        alert('بازی ریست شد!');
    }
}

// تابع برای خرید آپگرید
function buyUpgrade(addTokensPerSecond, cost) {
    if(tokens >= cost) {
        tokens -= cost;
        tokensPerSecond += addTokensPerSecond;
        updateDisplay();
        saveGame(); // ذخیره پس از هر خرید
        alert(`آپگرید با موفقیت خریداری شد! +${addTokensPerSecond} توکن در ثانیه`);
    } else {
        alert('توکن کافی ندارید!');
    }
}

// تابع برای بروزرسانی صفحه
function updateDisplay() {
    document.getElementById('tokens').innerText = Math.floor(tokens);
    // ذخیره خودکار هر ۱۰ ثانیه
    if (Math.floor(tokens) % 10 === 0) {
        saveGame();
    }
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
    alert(`🎉 دستاورد باز شد: ${achievementName}!`);
}
