document.addEventListener('DOMContentLoaded', () => {
    const quadrants = ['list-q1', 'list-q2', 'list-q3', 'list-q4'];
    let draggedItem = null;

    // Загрузка данных и настройка Drop-зон
    quadrants.forEach(id => {
        const list = document.getElementById(id);
        const saved = JSON.parse(localStorage.getItem(id) || '[]');
        saved.forEach(task => renderTask(id, task.text, task.completed));

        list.addEventListener('dragover', e => e.preventDefault());
        list.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem) {
                const oldListId = draggedItem.parentElement.id;
                list.appendChild(draggedItem);
                saveData(oldListId);
                saveData(id);
            }
        });
    });

    // Настройка кнопок добавления и очистки для каждого квадранта
    document.querySelectorAll('.quadrant').forEach((quad, index) => {
        const input = quad.querySelector('input');
        const btn = quad.querySelector('.add-btn');
        const clearBtn = quad.querySelector('.clear-btn');
        const listId = quadrants[index];

        const handleAdd = () => {
            const val = input.value.trim();
            if (val) {
                renderTask(listId, val);
                saveData(listId);
                input.value = '';
            }
        };

        btn.onclick = handleAdd;
        input.onkeypress = (e) => { if (e.key === 'Enter') handleAdd(); };

        clearBtn.onclick = () => {
            const list = document.getElementById(listId);
            list.querySelectorAll('.todo-item.completed').forEach(item => item.remove());
            saveData(listId);
        };
    });

    function renderTask(listId, text, completed = false) {
        const list = document.getElementById(listId);
        const li = document.createElement('li');
        li.className = `todo-item ${completed ? 'completed' : ''}`;
        li.draggable = true;
        
        li.innerHTML = `
            <input type="checkbox" ${completed ? 'checked' : ''}>
            <span>${text}</span>
            <button class="delete-btn">×</button>
        `;

        // Логика чекбокса
        li.querySelector('input').onchange = (e) => {
            li.classList.toggle('completed', e.target.checked);
            saveData(listId);
        };

        // Удаление
        li.querySelector('.delete-btn').onclick = () => {
            li.remove();
            saveData(listId);
        };

        // Drag & Drop
        li.ondragstart = () => {
            draggedItem = li;
            setTimeout(() => li.style.display = 'none', 0);
        };
        li.ondragend = () => {
            li.style.display = 'flex';
            draggedItem = null;
        };

        list.appendChild(li);
    }

    function saveData(listId) {
        const list = document.getElementById(listId);
        const tasks = Array.from(list.querySelectorAll('.todo-item')).map(item => ({
            text: item.querySelector('span').innerText,
            completed: item.querySelector('input').checked
        }));
        localStorage.setItem(listId, JSON.stringify(tasks));
    }
});
