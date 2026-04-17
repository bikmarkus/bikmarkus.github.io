const habitForm = document.getElementById('habit-form');
const habitList = document.getElementById('habit-list');
const dateInput = document.getElementById('date-input');

// Устанавливаем сегодня как дату по умолчанию
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

let habits = JSON.parse(localStorage.getItem('habitsData')) || [];

function save() {
    localStorage.setItem('habitsData', JSON.stringify(habits));
}

// Форматирование даты ДД.ММ
function getFormattedDate(startDateStr, daysOffset) {
    const date = new Date(startDateStr);
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
        nameLabel.onblur = () => {
            if (habit.name !== nameLabel.innerText) {
                habit.name = nameLabel.innerText;
                save();
            }
        };

        const actions = document.createElement('div');
        actions.className = 'actions';

        // Кнопки управления диапазоном и удаление
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
                if (cb.checked) {
                    habit.completed.push(i);
                } else {
                    habit.completed = habit.completed.filter(d => d !== i);
                }
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
    const nameVal = document.getElementById('habit-input').value;
    const daysVal = parseInt(document.getElementById('days-input').value) || 7;
    const startVal = dateInput.value;

    habits.push({
        name: nameVal,
        days: daysVal,
        startDate: startVal,
        completed: []
    });

    document.getElementById('habit-input').value = '';
    save();
    render();
};

render();