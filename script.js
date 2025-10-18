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
