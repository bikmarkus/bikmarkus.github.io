const habitForm = document.getElementById('habit-form');
const habitList = document.getElementById('habit-list');
const dateInput = document.getElementById('date-input');

// Устанавливаем текущую дату в формате ДД.ММ.ГГГГ при старте
const now = new Date();
dateInput.value = now.toLocaleDateString('ru-RU');

let habits = JSON.parse(localStorage.getItem('habitsData')) || [];

function save() {
    localStorage.setItem('habitsData', JSON.stringify(habits));
}

// Превращает строку ДД.ММ.ГГГГ в объект даты
function parseDate(str) {
    const [d, m, y] = str.split('.').map(Number);
    return new Date(y, m - 1, d);
}

function getFormattedDate(startDateStr, daysOffset) {
    const date = parseDate(startDateStr);
    date.setDate(date.getDate() + daysOffset);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

function render() {
    habitList.innerHTML = '';
    habits.forEach((habit, hIdx) => {
        const habitItem = document.createElement('div');
        habitItem.className = 'habit-item';

        const header = document.createElement('div');
        header.className = 'habit-header';

        const nameLabel = document.createElement('div');
        nameLabel.className = 'habit-name';
        nameLabel.contentEditable = true;
        nameLabel.innerText = habit.name;
        nameLabel.onblur = () => { habit.name = nameLabel.innerText; save(); };

        const actions = document.createElement('div');
        actions.className = 'actions';
        actions.append(
            createBtn('-', () => { if(habit.days > 1) { habit.days--; save(); render(); }}, 'btn-adjust'),
            createBtn('+', () => { habit.days++; save(); render(); }, 'btn-adjust'),
            createBtn('×', () => { habits.splice(hIdx, 1); save(); render(); }, 'btn-delete')
        );

        header.append(nameLabel, actions);

        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';

        for (let i = 0; i < habit.days; i++) {
            const dayBox = document.createElement('div');
            dayBox.className = 'day-box';
            dayBox.innerHTML = `<span class="day-date">${getFormattedDate(habit.startDate, i)}</span>`;

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = (habit.completed || []).includes(i);
            cb.onclick = () => {
                if (!habit.completed) habit.completed = [];
                if (cb.checked) habit.completed.push(i);
                else habit.completed = habit.completed.filter(d => d !== i);
                save();
            };
            dayBox.appendChild(cb);
            daysGrid.appendChild(dayBox);
        }
        habitItem.append(header, daysGrid);
        habitList.appendChild(habitItem);
    });
}

function createBtn(text, onclick, className) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.className = className;
    btn.onclick = (e) => { e.preventDefault(); onclick(); };
    return btn;
}

habitForm.onsubmit = (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('habit-input');
    const daysInput = document.getElementById('days-input');
    
    // Проверка корректности формата даты
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dateInput.value)) {
        alert("Введите дату в формате ДД.ММ.ГГГГ");
        return;
    }

    habits.push({
        name: nameInput.value,
        days: parseInt(daysInput.value) || 7,
        startDate: dateInput.value,
        completed: []
    });

    nameInput.value = '';
    save();
    render();
};

render();