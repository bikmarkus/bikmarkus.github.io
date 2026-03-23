// Получаем элементы
const popupOverlay = document.getElementById('popupOverlay');
const popupContent = document.getElementById('popupContent');
const closePopupBtn = document.getElementById('closePopupBtn');

// Функция для открытия окна с контентом
function openPopupWithContent(url) {
    // Очищаем содержимое окна
    popupContent.innerHTML = '';

    // Создаём элемент для контента
    let contentElement;

    contentElement = document.createElement('img');
    contentElement.src = url;
    contentElement.alt = 'Изображение';

    // Добавляем контент в окно
    popupContent.appendChild(contentElement);

    // Добавляем кнопку закрытия
    popupContent.appendChild(closePopupBtn);

    // Показываем окно
    popupOverlay.classList.add('active');
}

// Функция для закрытия окна
function closePopup() {
    popupOverlay.classList.remove('active');
}

// Находим все ссылки с классом popup-link
const popupLinks = document.querySelectorAll('.popup-link');

// Назначаем обработчики кликов на каждую ссылку
popupLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Отменяем стандартное поведение ссылки
        const href = link.getAttribute('href');
        openPopupWithContent(href);
    });
});

// Обработчик для закрытия по клику на фон
popupOverlay.addEventListener('click', (event) => {
    if (event.target === popupOverlay) {
        closePopup();
    }
});

// Обработчик для кнопки закрытия
closePopupBtn.addEventListener('click', closePopup);