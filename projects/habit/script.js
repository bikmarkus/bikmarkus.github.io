const habitForm = document.getElementById('habit-form');
const habitList = document.getElementById('habit-list');

let habits = JSON.parse(localStorage.getItem('habitsData')) || [];

function save() {
    localStorage.setItem('habitsData', JSON.stringify(habits));
}

function getFormattedDate(daysOffset) {
    const date = new Date();
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

        const btnMinus = createBtn('-', () => { if(habit.days > 1) { habit.days--; save(); render(); } }, 'btn-adjust');
        const btnPlus = createBtn('+', () => { habit.days++; save(); render(); }, 'btn-adjust');
        // Удаление без подтверждения
        const btnDel = createBtn('×', () => {
            habits.splice(hIdx, 1);
            save();
            render();
        }, 'btn-delete');

        actions.append(btnMinus, btnPlus, btnDel);
        header.append(nameLabel, actions);

        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';

        for (let i = 0; i < habit.days; i++) {
            const dayBox = document.createElement('div');
            dayBox.className = 'day-box';

            const dateSpan = document.createElement('span');
            dateSpan.className = 'day-date';
            dateSpan.innerText = getFormattedDate(i);

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

            dayBox.append(dateSpan, cb);
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

    habits.push({
        name: nameInput.value,
        days: parseInt(daysInput.value) || 7,
        completed: []
    });

    nameInput.value = '';
    save();
    render();
};

render();