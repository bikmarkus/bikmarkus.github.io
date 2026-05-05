const questionsData = [
    { q: "Какая планета самая большая в Солнечной системе?", a: ["Юпитер", "Сатурн", "Нептун", "Марс"] },
    { q: "Кто был первым человеком в космосе?", a: ["Юрий Гагарин", "Нил Армстронг", "Алексей Леонов", "Джон Гленн"] },
    { q: "Какая планета известна как 'Красная планета'?", a: ["Марс", "Венера", "Меркурий", "Сатурн"] },
    { q: "Как называется наша галактика?", a: ["Млечный Путь", "Андромеда", "Сомбреро", "Центтавр"] },
    { q: "Какая звезда находится в центре нашей системы?", a: ["Солнце", "Полярная", "Сириус", "Бетельгейзе"] },
    { q: "Сколько планет в Солнечной системе?", a: ["8", "9", "7", "10"] },
    { q: "Самая горячая планета?", a: ["Венера", "Меркурий", "Марс", "Юпитер"] },
    { q: "Естественный спутник Земли?", a: ["Луна", "Ио", "Титан", "Фобос"] },
    { q: "Первая женщина-космонавт?", a: ["Валентина Терешкова", "Светлана Савицкая", "Салли Райд", "Джессика Мейр"] },
    { q: "Какая планета лежит на боку?", a: ["Уран", "Нептун", "Сатурн", "Юпитер"] },
    { q: "Из чего в основном состоят кольца Сатурна?", a: ["Лёд и пыль", "Газ", "Жидкий металл", "Камни"] },
    { q: "Самая высокая гора в Солнечной системе?", a: ["Олимп (Марс)", "Эверест (Земля)", "Реасильвия (Веста)", "Тор (Ио)"] },
    { q: "Как называется защитный слой Земли от радиации?", a: ["Магнитосфера", "Озоновый слой", "Ионосфера", "Тропосфера"] },
    { q: "Сколько времени свет идет от Солнца до Земли?", a: ["8 минут", "1 час", "30 секунд", "24 часа"] },
    { q: "Какая планета самая маленькая?", a: ["Меркурий", "Плутон", "Марс", "Венера"] },
    { q: "Что такое Плутон сейчас?", a: ["Карликовая планета", "Астероид", "Комета", "Газовый гигант"] },
    { q: "Первый искусственный спутник Земли назывался...", a: ["Спутник-1", "Восток-1", "Союз", "Мир"] },
    { q: "В каком году состоялся полет Гагарина?", a: ["1961", "1957", "1969", "1975"] },
    { q: "Как называется плотное скопление звезд?", a: ["Звездное скопление", "Туманность", "Черная дыра", "Квазар"] },
    { q: "Какая планета вращается в обратную сторону?", a: ["Венера", "Уран", "Марс", "Нептун"] },
    { q: "Что находится в центре Млечного Пути?", a: ["Черная дыра", "Белый карлик", "Пустота", "Планета X"] },
    { q: "На какой планете идут дожди из алмазов?", a: ["Нептун", "Марс", "Меркурий", "Венера"] },
    { q: "Сколько времени длится один день на Венере?", a: ["Больше года на Венере", "10 часов", "24 часа", "1 месяц"] },
    { q: "Как назывался корабль Нила Армстронга?", a: ["Аполлон-11", "Дискавери", "Челленджер", "Восток"] },
    { q: "Какого цвета закат на Марсе?", a: ["Голубой", "Красный", "Зеленый", "Желтый"] }
];

let currentIdx = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
let shuffledQuestions = [];

function initQuiz() {
    shuffledQuestions = questionsData.sort(() => Math.random() - 0.5);
    showQuestion();
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function showQuestion() {
    if (currentIdx >= shuffledQuestions.length) return endGame();

    const qData = shuffledQuestions[currentIdx];
    const correctAns = qData.a[0];
    const shuffledAns = [...qData.a].sort(() => Math.random() - 0.5);

    document.getElementById('question-number').innerText = `Вопрос ${currentIdx + 1}/25`;
    document.getElementById('question-text').innerText = qData.q;
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    shuffledAns.forEach(text => {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = () => checkAnswer(text, correctAns);
        container.appendChild(btn);
    });

    const progress = ((currentIdx) / shuffledQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = progress + "%";
}

function checkAnswer(selected, correct) {
    if (selected === correct) score++;
    currentIdx++;
    if (currentIdx < shuffledQuestions.length) {
        showQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById('progress-bar').style.width = "100%";
    const box = document.getElementById('question-box');
    box.innerHTML = `<h2>Квиз завершен!</h2><p>Ваш результат: ${score} из 25</p>`;
    
    if (score === 25) {
        launchRocket();
    }
}

function launchRocket() {
    const rocket = document.createElement('div');
    rocket.className = 'rocket';
    rocket.innerText = '🚀';
    document.getElementById('rocket-container').appendChild(rocket);
}

initQuiz();