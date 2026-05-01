document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const doneCountEl = document.getElementById('doneCount');
    const pendingCountEl = document.getElementById('pendingCount');

    let tasks = JSON.parse(localStorage.getItem('todoData')) || [];

    const saveToStorage = () => localStorage.setItem('todoData', JSON.stringify(tasks));

    const updateStats = () => {
        const done = tasks.filter(t => t.completed).length;
        const pending = tasks.length - done;
        doneCountEl.innerText = done;
        pendingCountEl.innerText = pending;
    };

    const render = () => {
        todoList.innerHTML = '';
        const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);

        sortedTasks.forEach((task) => {
            const originalIndex = tasks.findIndex(t => t === task);
            const li = document.createElement('li');
            li.draggable = true;
            if (task.completed) li.classList.add('completed');

            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <button class="delete-btn" title="Delete task">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            `;

            li.querySelector('input').addEventListener('change', () => {
                tasks[originalIndex].completed = !tasks[originalIndex].completed;
                saveToStorage();
                render();
            });

            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks.splice(originalIndex, 1);
                saveToStorage();
                render();
            });

            li.addEventListener('dragstart', () => li.classList.add('dragging'));
            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
                updateTasksOrder();
            });

            todoList.appendChild(li);
        });
        updateStats();
    };

    todoList.addEventListener('dragover', e => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        const afterElement = [...todoList.querySelectorAll('li:not(.dragging)')].reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = e.clientY - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset, element: child };
            else return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
        
        if (afterElement == null) todoList.appendChild(dragging);
        else todoList.insertBefore(dragging, afterElement);
    });

    const updateTasksOrder = () => {
        const newOrder = [];
        todoList.querySelectorAll('li').forEach(item => {
            newOrder.push({
                text: item.querySelector('span').innerText,
                completed: item.classList.contains('completed')
            });
        });
        tasks = newOrder;
        saveToStorage();
        updateStats();
    };

    const addTask = () => {
        const text = input.value.trim();
        if (text) {
            tasks.unshift({ text, completed: false });
            input.value = '';
            saveToStorage();
            render();
        }
    };

    input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
    clearAllBtn.addEventListener('click', () => { tasks = []; saveToStorage(); render(); });

    render();
});