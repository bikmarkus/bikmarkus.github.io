let habits = JSON.parse(localStorage.getItem('habits_v2')) || [];
let daysCount = parseInt(localStorage.getItem('days_count')) || 5;

// Добавление по Enter
document.getElementById('habitInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
});

function getDates() {
    const dates = [];
    for (let i = 0; i < daysCount; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i); // Начинаем с сегодня и идем вперед
        dates.push(d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }));
    }
    return dates;
}

function render() {
    const dates = getDates();
    const header = document.getElementById('headerRow');
    const body = document.getElementById('habitBody');

    header.innerHTML = '<th>Привычка</th>' + dates.map(d => `<th>${d}</th>`).join('');

    body.innerHTML = habits.map((habit, hIdx) => `
        <tr>
            <td class="habit-name-cell">
                <span>${habit.name}</span>
                <button class="delete-btn" onclick="removeHabit(${hIdx})">&times;</button>
            </td>
            ${dates.map(date => `
                <td>
                    <input type="checkbox" 
                        ${habit.history?.[date] ? 'checked' : ''} 
                        onclick="toggle(${hIdx}, '${date}')">
                </td>
            `).join('')}
        </tr>
    `).join('');

    localStorage.setItem('habits_v2', JSON.stringify(habits));
    localStorage.setItem('days_count', daysCount);
}

function addHabit() {
    const input = document.getElementById('habitInput');
    if (input.value.trim()) {
        habits.push({ name: input.value.trim(), history: {} });
        input.value = '';
        render();
    }
}

function removeHabit(index) {
    if (confirm('Удалить привычку?')) {
        habits.splice(index, 1);
        render();
    }
}

function toggle(hIdx, date) {
    if (!habits[hIdx].history) habits[hIdx].history = {};
    habits[hIdx].history[date] = !habits[hIdx].history[date];
    render();
}

function changeDays(val) {
    daysCount = Math.max(1, Math.min(14, daysCount + val));
    render();
}

render();