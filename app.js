// 1. АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// 2. ПЕЧАТНАЯ МАШИНКА
const textToType = "«Не забывайте маму. Спешите к ней всегда.».";
const typewriterElement = document.getElementById('typewriter-text');
let typeIndex = 0;
function typeWriter() {
    if (typeIndex < textToType.length) {
        typewriterElement.innerHTML += textToType.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 50);
    }
}
const quoteObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { typeWriter(); quoteObserver.disconnect(); }
}, { threshold: 0.5 });
quoteObserver.observe(document.querySelector('.glass-panel'));

// 3. ЧАСТИЦЫ МЫШИ
const cursorParticles = document.getElementById('cursor-particles');
let lastMouseX = 0, lastMouseY = 0;
document.addEventListener('mousemove', (e) => {
    if (Math.abs(e.clientX - lastMouseX) < 10 && Math.abs(e.clientY - lastMouseY) < 10) return;
    lastMouseX = e.clientX; lastMouseY = e.clientY;
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = e.clientX + 'px'; particle.style.top = e.clientY + 'px';
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px'; particle.style.height = size + 'px';
    cursorParticles.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
});

// 4. ЛЕТЯЩИЕ ТЕЛЕГРАММЫ
function launchTelegram() {
    const container = document.getElementById('flying-container');
    const telegram = document.createElement('div');
    telegram.classList.add('flying-telegram');
    telegram.textContent = '✉️'; 
    telegram.style.left = (Math.random() * window.innerWidth) + 'px';
    telegram.style.top = window.innerHeight + 'px';
    container.appendChild(telegram);
    setTimeout(() => telegram.remove(), 3000);
}

// 5. КНОПКА "ПОЙМАТЬ СИГНАЛ"
const telegramBtn = document.getElementById('telegramBtn');
const gameResult = document.getElementById('game-result');
const messages = [
    '«Дочка, приезжай, пока я жива...»', '«Катерина Петровна при смерти. Приезжай немедленно».',
    '«Поздно. Опоздала».', '«Нет ничего страшнее, чем осознание того, что ты не успел сказать самое важное».',
    '«Тихон отправил телеграмму. Настя получила её на выставке...»'
];
telegramBtn.addEventListener('click', () => {
    gameResult.textContent = '';
    telegramBtn.disabled = true;
    telegramBtn.textContent = '📡 Ловим сигнал...';
    for (let i = 0; i < 5; i++) setTimeout(launchTelegram, i * 200);
    setTimeout(() => {
        gameResult.textContent = messages[Math.floor(Math.random() * messages.length)];
        telegramBtn.disabled = false;
        telegramBtn.textContent = '📨 Поймать ещё раз';
    }, 1500);
});

// 6. НАСТРОЕНИЕ
const moodBtns = document.querySelectorAll('.mood-btn');
const moodResult = document.getElementById('moodResult');
moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        moodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mood = btn.dataset.mood;
        let msg = mood === 'light' ? 'Светлая печаль. Фильм учит нас ценить время.' : 
                  mood === 'sad' ? 'Слезы — это нормально. Главное — сделай выводы.' : 'Отлично. А теперь позвони маме!';
        moodResult.textContent = msg;
    });
});

// 7. НЕЙРОСЕТЬ ЧУВСТВ (ИГРА С ЛИНИЯМИ)
const svg = document.getElementById('lines-svg');
const gameMessage = document.getElementById('game-message');
const gameBoard = document.getElementById('game-board');
let selectedEmotion = null;
let selectedEmotionElement = null;
let matchedCount = 0;

function drawLine(startEl, endEl, isCorrect) {
    const startRect = startEl.getBoundingClientRect();
    const endRect = endEl.getBoundingClientRect();
    const boardRect = gameBoard.getBoundingClientRect();
    
    const startX = startRect.right - boardRect.left;
    const startY = startRect.top + (startRect.height / 2) - boardRect.top;
    const endX = endRect.left - boardRect.left;
    const endY = endRect.top + (endRect.height / 2) - boardRect.top;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const controlX = (startX + endX) / 2;
    const d = `M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`;
    
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-linecap', 'round');
    
    if (isCorrect) {
        path.setAttribute('stroke', 'var(--accent)');
        path.setAttribute('filter', 'drop-shadow(0 0 5px var(--accent-glow))');
        path.classList.add('line-path');
    } else {
        path.setAttribute('stroke', '#e74c3c');
        path.classList.add('line-error');
        setTimeout(() => path.remove(), 500);
    }
    svg.appendChild(path);
}

document.querySelectorAll('.emotion-item').forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('matched')) return;
        document.querySelectorAll('.emotion-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        selectedEmotion = item.getAttribute('data-emotion');
        selectedEmotionElement = item;
        gameMessage.textContent = 'Теперь выбери героя справа...';
        gameMessage.style.color = 'var(--text-color)';
    });
});

document.querySelectorAll('.characters-column .character-card').forEach(card => {
    card.addEventListener('click', () => {
        if (!selectedEmotion) {
            gameMessage.textContent = 'Сначала выбери эмоцию слева! 👈';
            gameMessage.style.color = 'var(--accent)';
            return;
        }
        if (card.classList.contains('correct')) return;
        const match = card.getAttribute('data-match');

        if (selectedEmotion === match) {
            card.classList.add('correct');
            selectedEmotionElement.classList.add('matched');
            selectedEmotionElement.classList.remove('selected');
            drawLine(selectedEmotionElement, card, true);
            matchedCount++;
            gameMessage.textContent = `✅ Верно! Это действительно ${selectedEmotionElement.textContent.trim()}`;
            gameMessage.style.color = '#4ade80';
            selectedEmotion = null; selectedEmotionElement = null;
            if (matchedCount === 4) {
                gameMessage.textContent = '🎉 Схема собрана! Ты чувствуешь героев.';
                for (let i = 0; i < 15; i++) setTimeout(launchTelegram, i * 100);
            }
        } else {
            drawLine(selectedEmotionElement, card, false);
            card.classList.add('wrong-anim');
            gameMessage.textContent = '❌ Не сходится. Попробуй другого героя.';
            gameMessage.style.color = '#e74c3c';
            setTimeout(() => card.classList.remove('wrong-anim'), 400);
            selectedEmotionElement.classList.remove('selected');
            selectedEmotion = null; selectedEmotionElement = null;
        }
    });
});

window.addEventListener('resize', () => {
    svg.innerHTML = '';
    document.querySelectorAll('.characters-column .character-card.correct').forEach(card => {
        const match = card.getAttribute('data-match');
        const emotionEl = document.querySelector(`.emotion-item[data-emotion="${match}"]`);
        if (emotionEl) drawLine(emotionEl, card, true);
    });
});

// 8. СЕКРЕТНЫЙ КЛИК ПО ПЛАКАТУ
let posterClicks = 0;
document.getElementById('secretPoster').addEventListener('click', () => {
    posterClicks++;
    if (posterClicks === 3) {
        alert('🎬 СЕКРЕТ:\n\nВ этой короткометражке нет ни одного лишнего кадра. Роль Насти исполняет актриса, которой удалось передать всю боль осознания того, что маму уже не вернуть.');
        posterClicks = 0;
    }
});

// 9. СВЕТ В ФАКТАХ
const lightSwitch = document.getElementById('lightSwitch');
const factsContainer = document.getElementById('factsContainer');
lightSwitch.addEventListener('click', () => {
    lightSwitch.classList.toggle('on');
    factsContainer.classList.toggle('lit');
});

// 10. ШКАТУЛКА ВРЕМЕНИ
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
});

// 11. КНОПКА "ПОЗВОНИТЬ МАМЕ"
const callMomBtn = document.getElementById('callMomBtn');
const callMomResult = document.getElementById('callMomResult');
callMomBtn.addEventListener('click', () => {
    callMomResult.textContent = '📞 Вызов отправлен... Не забудь сказать, что любишь её!';
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '❤️';
            heart.style.cssText = `position:fixed; left:${Math.random()*window.innerWidth}px; bottom:-20px; font-size:${Math.random()*20+20}px; z-index:9999; pointer-events:none; transition: transform 2s ease-out, opacity 2s ease-out;`;
            document.body.appendChild(heart);
            setTimeout(() => { heart.style.transform = `translateY(-${window.innerHeight}px) scale(1.5)`; heart.style.opacity = '0'; }, 10);
            setTimeout(() => heart.remove(), 2000);
        }, i * 100);
    }
});

// 12. ЗОЛОТОЙ ДОЖДЬ НА ФОНЕ (CANVAS)
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
const letters = "✉ 1971 ПАУСТОВСКИЙ ЩЕРБАКОВ ТЕЛЕГРАММА МАМА".split("");
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];
for (let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    ctx.fillStyle = "rgba(15, 17, 26, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(212, 175, 55, 0.8)";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const newColumns = canvas.width / fontSize;
    for (let x = drops.length; x < newColumns; x++) drops[x] = 1;
});

// 13. ГОЛУБЬ С ПИСЬМОМ
const pigeonContainer = document.getElementById('pigeonContainer');
const quotePopup = document.getElementById('quotePopup');
const popupText = document.getElementById('popupText');
const closePopup = document.getElementById('closePopup');

const pigeonQuotes = [
    "«Сердце матери — это бездна, в глубине которой всегда найдется прощение» (Оноре де Бальзак).",
    "«Мы не всегда можем быть с теми, кого любим, но мы всегда можем помнить о них».",
    "«Самое большое счастье в жизни — это уверенность, что тебя любят» (Виктор Гюго).",
    "«Время бежит так быстро, что мы не замечаем, как меняются лица близких».",
    "«Иногда одно короткое слово может спасти человека от самого страшного одиночества».",
    "«Не откладывай на завтра то, что можно сказать сегодня. Завтра может не наступить».",
    "«Любовь матери — единственная бескорыстная любовь в мире»."
];

pigeonContainer.addEventListener('click', () => {
    if (pigeonContainer.classList.contains('clicked')) return;
    pigeonContainer.classList.add('clicked');
    setTimeout(() => {
        const randomQuote = pigeonQuotes[Math.floor(Math.random() * pigeonQuotes.length)];
        popupText.textContent = randomQuote;
        quotePopup.classList.add('active');
    }, 300);
    setTimeout(() => pigeonContainer.classList.remove('clicked'), 1200);
});

closePopup.addEventListener('click', () => quotePopup.classList.remove('active'));
quotePopup.addEventListener('click', (e) => { if (e.target === quotePopup) quotePopup.classList.remove('active'); });