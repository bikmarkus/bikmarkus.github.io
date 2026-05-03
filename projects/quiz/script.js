const initialQuestions = [
    { q: "Кто из этих писателей отказался от Нобелевской премии по литературе?", a: ["Альбер Камю", "Жан-Поль Сартр", "Габриэль Гарсиа Маркес", "Эрнест Хемингуэй"], correct: "Жан-Поль Сартр", desc: "Сартр отказался от премии в 1964 году." },
    { q: "Первый психологический роман в русской литературе?", a: ["«Евгений Онегин»", "«Преступление и наказание»", "«Герой нашего времени»", "«Анна Каренина»"], correct: "«Герой нашего времени»", desc: "Лермонтов сосредоточился на «истории души человеческой»." },
    { q: "В каком городе происходит действие «Ромео и Джульетты»?", a: ["Флоренция", "Венеция", "Верона", "Рим"], correct: "Верона", desc: "Верона — город любви и шекспировской трагедии." },
    { q: "Как звали коня Дон Кихота?", a: ["Буцефал", "Росинант", "Инцитат", "Боливар"], correct: "Росинант", desc: "Росинант — звучное имя для старой клячи." },
    { q: "Автор антиутопии «451 градус по Фаренгейту»?", a: ["Джордж Оруэлл", "Олдос Хаксли", "Рэй Брэдбери", "Евгений Замятин"], correct: "Рэй Брэдбери", desc: "Рэй Брэдбери писал о мире без книг." },
    { q: "Фамилия главного героя романа «Отцы и дети»?", a: ["Кирсанов", "Обломов", "Базаров", "Раскольников"], correct: "Базаров", desc: "Евгений Базаров — символ русского нигилизма." },
    { q: "Сколько томов в романе «Отверженные» Виктора Гюго?", a: ["2 тома", "3 тома", "4 тома", "5 томов"], correct: "5 томов", desc: "Классическое деление Гюго включает 5 частей." }
];

const sounds = {
    correct: new Audio('https://amazonaws.com'),
    wrong: new Audio('https://amazonaws.com'),
    finish: new Audio('https://amazonaws.com')
};

let questions = [];
let currentQuestion = 0, score = 0, combo = 0, bestScore = localStorage.getItem('litBest') || 0;
let timer, timeLeft = 30, fastestTime = 30;

// Функция перемешивания (Fisher-Yates Shuffle)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initQuiz() {
    // Клонируем и перемешиваем вопросы
    questions = shuffle([...initialQuestions]).map(q => {
        // Перемешиваем ответы внутри каждого вопроса
        return { ...q, a: shuffle([...q.a]) };
    });
    showQuestion();
}

function showQuestion() {
    clearInterval(timer);
    timeLeft = 30;
    const qData = questions[currentQuestion];
    document.getElementById("progress-bar").style.width = (currentQuestion / questions.length) * 100 + "%";
    document.getElementById("best-score-label").innerText = `Рекорд: ${bestScore}`;
    document.getElementById("question").innerText = qData.q;
    document.getElementById("explanation").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";
    
    qData.a.forEach((text) => {
        const btn = document.createElement("button");
        btn.innerText = text;
        btn.className = "answer-btn";
        btn.onclick = () => checkAnswer(text, btn);
        answersDiv.appendChild(btn);
    });

    startTimerLogic();
}

function startTimerLogic() {
    const timerLine = document.querySelector(".timer-line");
    document.getElementById("timer-text").innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer-text").innerText = timeLeft;
        timerLine.style.strokeDashoffset = 113.1 - (timeLeft / 30) * 113.1;
        if (timeLeft <= 0) { clearInterval(timer); handleFail(); }
    }, 1000);
}

function checkAnswer(selectedText, btn) {
    clearInterval(timer);
    const qData = questions[currentQuestion];
    const isCorrect = selectedText === qData.correct;

    if (isCorrect) {
        let timeUsed = 30 - timeLeft;
        if (timeUsed < fastestTime) fastestTime = timeUsed;
        score++;
        combo++;
        sounds.correct.play();
        btn.classList.add("correct");
        if (combo >= 2) {
            document.getElementById("combo-indicator").innerText = `🔥 COMBO X${combo}`;
            document.getElementById("combo-indicator").style.display = "block";
        }
    } else {
        combo = 0;
        document.getElementById("combo-indicator").style.display = "none";
        btn.classList.add("wrong");
        sounds.wrong.play();
        // Находим и подсвечиваем правильный текст
        document.querySelectorAll(".answer-btn").forEach(b => {
            if (b.innerText === qData.correct) b.classList.add("correct");
        });
    }

    document.getElementById("score-counter").innerText = `Очки: ${score}`;
    document.getElementById("explanation").innerText = qData.desc;
    document.getElementById("explanation").style.display = "block";
    document.querySelectorAll(".answer-btn").forEach(b => b.disabled = true);
    document.getElementById("next-btn").style.display = "inline-block";
}

function handleFail() {
    combo = 0;
    document.getElementById("combo-indicator").style.display = "none";
    sounds.wrong.play();
    document.querySelectorAll(".answer-btn").forEach(b => {
        if (b.innerText === questions[currentQuestion].correct) b.classList.add("correct");
    });
    document.querySelectorAll(".answer-btn").forEach(b => b.disabled = true);
    document.getElementById("next-btn").style.display = "inline-block";
}

document.getElementById("next-btn").onclick = () => {
    currentQuestion++;
    if (currentQuestion < questions.length) showQuestion();
    else finishQuiz();
};

function finishQuiz() {
    sounds.finish.play();
    document.getElementById("rocket").classList.add("rocket-fly");
    if (score > bestScore) localStorage.setItem('litBest', score);

    document.getElementById("quiz-container").innerHTML = `
        <div style="padding: 40px 20px;">
            <h2>Викторина окончена!</h2>
            <p style="font-size: 1.4em;">Ваш счёт: <b>${score}</b> из ${questions.length}</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <p>⚡ Самый быстрый ответ: <b>${fastestTime === 30 ? '—' : fastestTime + ' сек.'}</b></p>
                <p>🏆 Рекорд: ${Math.max(score, bestScore)}</p>
            </div>
            <button class="restart-btn" onclick="location.reload()">Заново</button>
        </div>
    `;
}

// Запуск
initQuiz();