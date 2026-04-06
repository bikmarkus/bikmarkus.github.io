let habits = JSON.parse(localStorage.getItem('habitTracker')) || [];
const daysToShow = 7; // Показываем последние 7 дней

function getDates() {
    const dates = [];
    for (let i = daysToShow - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }));
    }
    return dates;
}

function render() {
    const dates = getDates();
    const headerRow = document.getElementById('headerRow');
    const body = document.getElementById('habitBody');

    // Рендер шапки (даты)
    headerRow.innerHTML = '<th>Привычка</th>' + dates.map(d => `<th>${d}</th>`).join('');

    // Рендер строк
    body.innerHTML = habits.map((habit, hIdx) => `
        <tr>
            <td class="habit-name">${habit.name}</td>
            ${dates.map(date => `
                <td>
                    <input type="checkbox" 
                        ${habit.completed?.[date] ? 'checked' : ''} 
                        onclick="toggleHabit(${hIdx}, '${date}')">
                </td>
            `).join('')}
        </tr>
    `).join('');
    
    localStorage.setItem('habitTracker', JSON.stringify(habits));
}

function addHabit() {
    const input = document.getElementById('habitInput');
    if (input.value.trim()) {
        habits.push({ name: input.value, completed: {} });
        input.value = '';
        render();
    }
}

function toggleHabit(hIdx, date) {
    if (!habits[hIdx].completed) habits[hIdx].completed = {};
    habits[hIdx].completed[date] = !habits[hIdx].completed[date];
    render();
}

render();