const questionsData = [
    // Вставьте здесь ранее предоставленные 115 вопросов.
    // Для примера оставлены несколько ключевых.
    { q: "Как назывался космический корабль, на котором Юрий Алексеевич Гагарин совершил первый в истории пилотируемый полет?", a: "«Восток-1»", o: ["«Восход-1»", "«Союз-1»", "«Салют-1»"] },
    { q: "Какой радиопозывной был закреплен за Юрием Гагариным в ходе миссии 12 апреля 1961 года?", a: "«Кедр»", o: ["«Чайка»", "«Сокол»", "«Береза»"] },
    { q: "Как называется космический корабль Хана Соло в киносаге «Звездные войны»?", a: "«Тысячелетний сокол»", o: ["«Энтерпрайз»", "«Звезда смерти»", "«Серенити»"] }
    // ... + 112 остальных вопросов
];

let selectedQuestions = [];
let userAnswers = [];
let currentIdx = 0;
let score = 0;
let timeLeft = 20;
let timerInterval;

function startQuiz() {
    const countSelect = document.getElementById('question-count');
    const count = parseInt(countSelect.value);
    selectedQuestions = [...questionsData].sort(() => Math.random() - 0.5).slice(0, count);
    
    userAnswers = [];
    currentIdx = 0;
    score = 0;
    
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    render();
}

function render() {
    if (currentIdx >= selectedQuestions.length) return end();

    clearInterval(timerInterval);
    timeLeft = 20;
    updateTimerUI();
    startTimer();

    const q = selectedQuestions[currentIdx];
    document.getElementById('question-number').innerText = `Миссия: ${currentIdx + 1}/${selectedQuestions.length}`;
    document.getElementById('question-text').innerText = q.q;

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    const options = [q.a, ...q.o].sort(() => Math.random() - 0.5);
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => check(opt, q.a);
        container.appendChild(btn);
    });

    document.getElementById('progress-bar').style.width = (currentIdx / selectedQuestions.length * 100) + "%";
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) check(null, selectedQuestions[currentIdx].a);
    }, 1000);
}

function updateTimerUI() {
    const t = document.getElementById('timer');
    const w = document.getElementById('timer-wrapper');
    t.innerText = timeLeft;
    timeLeft <= 5 ? w.classList.add('timer-low') : w.classList.remove('timer-low');
}

function check(selected, correct) {
    const isCorrect = selected === correct;
    if (isCorrect) score++;
    
    userAnswers.push({
        q: selectedQuestions[currentIdx].q,
        isCorrect: isCorrect,
        user: selected || "Время вышло",
        correct: correct
    });

    currentIdx++;
    render();
}

function toggleStats() {
    const el = document.getElementById('detailed-stats');
    el.classList.toggle('active');
}

function end() {
    clearInterval(timerInterval);
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    
    document.getElementById('score-summary').innerHTML = `<p style="font-size: 1.5rem;">Результат: ${score} / ${selectedQuestions.length}</p>`;

    const stats = document.getElementById('detailed-stats');
    stats.innerHTML = userAnswers.map((ans, i) => `
        <div class="stat-item">
            <div class="${ans.isCorrect ? 'correct-stat' : 'wrong-stat'}">
                <span>#${i + 1}</span> ${ans.isCorrect ? 'УСПЕХ' : 'ПРОВАЛ'}
            </div>
            <div>${ans.q}</div>
            <div style="opacity: 0.6; font-size: 0.75rem;">Ваш ответ: ${ans.user} | Верно: ${ans.correct}</div>
        </div>
    `).join('');

    if (score === selectedQuestions.length && score > 0) launchRocket();
}

function launchRocket() {
    const r = document.createElement('div');
    r.className = 'rocket'; r.innerText = '🚀';
    document.getElementById('rocket-container').appendChild(r);
}