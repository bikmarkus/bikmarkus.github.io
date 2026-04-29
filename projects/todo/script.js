document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
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
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.draggable = true;
            if (task.completed) li.classList.add('completed');

            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <button class="delete-btn" title="Delete task">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            `;

            li.addEventListener('dragstart', () => li.classList.add('dragging'));
            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
                updateTasksOrder();
            });

            li.querySelector('input').addEventListener('change', () => {
                tasks[index].completed = !tasks[index].completed;
                saveToStorage();
                render();
            });

            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveToStorage();
                render();
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
            tasks.push({ text, completed: false });
            input.value = '';
            saveToStorage();
            render();
        }
    };

    addBtn.addEventListener('click', addTask);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
    clearAllBtn.addEventListener('click', () => { tasks = []; saveToStorage(); render(); });

    render();
});