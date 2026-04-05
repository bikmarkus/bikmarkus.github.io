document.addEventListener('DOMContentLoaded', () => {
    const quadrants = ['list-q1', 'list-q2', 'list-q3', 'list-q4'];
    let draggedItem = null;

    quadrants.forEach(id => {
        const list = document.getElementById(id);
        const saved = JSON.parse(localStorage.getItem(id) || '[]');
        saved.forEach(task => renderTask(id, task.text, task.completed));

        list.addEventListener('dragover', e => e.preventDefault());
        list.addEventListener('dragenter', () => list.classList.add('drag-over'));
        list.addEventListener('dragleave', () => list.classList.remove('drag-over'));
        
        list.addEventListener('drop', (e) => {
            e.preventDefault();
            list.classList.remove('drag-over');
            if (draggedItem) {
                const oldListId = draggedItem.parentElement.id;
                list.appendChild(draggedItem);
                saveData(oldListId);
                saveData(id);
            }
        });
    });

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

        // Очистка без подтверждения
        clearBtn.onclick = () => {
            document.getElementById(listId).innerHTML = '';
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

        li.querySelector('input').onchange = (e) => {
            li.classList.toggle('completed', e.target.checked);
            saveData(listId);
        };

        li.querySelector('.delete-btn').onclick = () => {
            li.remove();
            saveData(listId);
        };

        li.ondragstart = () => {
            draggedItem = li;
            setTimeout(() => li.style.opacity = '0.5', 0);
        };
        li.ondragend = () => {
            li.style.opacity = '1';
            draggedItem = null;
        };

        list.appendChild(li);
    }

    function saveData(listId) {
        const list = document.getElementById(listId);
        if(!list) return;
        const tasks = Array.from(list.querySelectorAll('.todo-item')).map(item => ({
            text: item.querySelector('span').innerText,
            completed: item.querySelector('input').checked
        }));
        localStorage.setItem(listId, JSON.stringify(tasks));
    }
});