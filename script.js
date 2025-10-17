let tokens = 0;
let tokensPerSecond = 0;

// تابع برای خرید آپگرید
function buyUpgrade(addTokensPerSecond, cost) {
    if(tokens >= cost) {
        tokens -= cost;
        tokensPerSecond += addTokensPerSecond;
        updateDisplay();
        alert(`آپگرید با موفقیت خریداری شد! +${addTokensPerSecond} توکن در ثانیه`);
    } else {
        alert('توکن کافی ندارید!');
    }
}

// تابع برای بروزرسانی صفحه
function updateDisplay() {
    document.getElementById('tokens').innerText = Math.floor(tokens);
}

// حلقه اصلی - توکن را خودکار اضافه می‌کند
setInterval(function() {
    tokens += tokensPerSecond;
    updateDisplay();
}, 1000); // هر ۱ ثانیه

// اضافه کردن توکن با کلیک (برای شروع)
document.getElementById('tokens').addEventListener('click', function() {
    tokens += 1;
    updateDisplay();
});