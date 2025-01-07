const wheels = [document.getElementById('wheel1'),
    document.getElementById('wheel2'),
    document.getElementById('wheel3')];
const ctx = wheels.map(wheel => wheel.getContext('2d'));
const balanceDisplay = document.getElementById('balance');
const resultText = document.getElementById('result-text');
const historyList = document.getElementById('history-list');
let balance = 100000;

function drawWheel(ctx) {
    const radius = 100;
    const sectionAngle = (Math.PI * 2) / 6;
    const numbers = [1, 2, 3, 4, 5, 6];

    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, radius, i * sectionAngle, (i + 1) * sectionAngle);
        ctx.fillStyle = i % 2 === 0 ? '#f39c12' : '#3498db';
        ctx.fill();
        ctx.closePath();

        ctx.save(); 
        ctx.translate(150, 150);
        ctx.rotate((i + 0.5) * sectionAngle);
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(numbers[i], 60, 10);
        ctx.restore();
    }
}

wheels.forEach((wheel, index) => {
    wheel.width = 300;
    wheel.height = 300;
    drawWheel(ctx[index]);
});

document.getElementById('set-wallet-btn').addEventListener('click', () => {
    balance = parseInt(document.getElementById('wallet-amount').value);
    balanceDisplay.textContent = balance;
});

const spinButton = document.getElementById('spin-btn');
spinButton.addEventListener('click', () => {
    const betNumber = parseInt(document.getElementById('bet-number').value);
    const betAmount = parseInt(document.getElementById('bet-amount').value);

    if (betAmount > balance) {
        alert('Không đủ tiền cược!');
        return;
    }

    let hits = 0;
    let results = [];
    wheels.forEach((wheel, index) => {
        const randomDegree = Math.floor(360 + Math.random() * 1800);
        const result = Math.floor(((randomDegree % 360) + 30) / 60) % 6 + 1;
        results.push(result);
        wheel.style.transition = 'transform 4s ease-out';
      wheel.style.transform = `rotate(${randomDegree}deg)`
        if (result === betNumber) hits++;
    });

    setTimeout(() => {
        if (hits > 0) {
            const reward = betAmount * hits;
            balance += reward;
            resultText.textContent = Bạn thắng! Số tiền nhận: ${reward};
        } else {
            balance -= betAmount;
            resultText.textContent = 'Bạn thua, hãy thử lại!';
        }
        balanceDisplay.textContent = balance;
        const li = document.createElement('li');
        li.textContent = Cược: ${betAmount} VNĐ | Chọn số: ${betNumber} | Kết quả: ${results.join(', ')} | Số dư: ${balance};
        historyList.appendChild(li);

        setTimeout(() => {
            wheels.forEach(wheel => {
                wheel.style.transition = 'none';
                wheel.style.transform = 'rotate(0deg)';
            });
        }, 3000);
    }, 4000);
});

// Dark mode toggle
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
