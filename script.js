// Pomodoro Timer Logic
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const timerDisplay = document.getElementById('timer');
    const modeDisplay = document.getElementById('mode');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modeToggleBtn = document.getElementById('modeToggleBtn');
    const modeToggleIcon = document.getElementById('modeToggleIcon');
    const body = document.body;
    const workDurationInput = document.getElementById('workDuration');
    const restDurationInput = document.getElementById('restDuration');
    const title = document.querySelector('title');
    const newTaskInput = document.getElementById('newTask');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Timer variables
    let workDuration = parseInt(workDurationInput.value);
    let restDuration = parseInt(restDurationInput.value);
    let timeLeft = workDuration * 60; // 25 minutes in seconds
    let timerInterval;
    let isRunning = false;
    let isWorkMode = true;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Initialize
    updateDisplay();
    setModeStyles();
    renderTasks();

    // Event Listeners
    startPauseBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    modeToggleBtn.addEventListener('click', toggleMode);
    addTaskBtn.addEventListener('click', addTask);

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${task}
                <button class="deleteTaskBtn" data-index="${index}">Delete</button>
            `;
            taskList.appendChild(li);
        });

        // Add event listeners to delete buttons
        const deleteTaskBtns = document.querySelectorAll('.deleteTaskBtn');
        deleteTaskBtns.forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }

    function addTask() {
        const task = newTaskInput.value.trim();
        if (task !== '') {
            tasks.push(task);
            newTaskInput.value = '';
            updateLocalStorage();
            renderTasks();
        }
    }

    function deleteTask(event) {
        const index = event.target.dataset.index;
        tasks.splice(index, 1);
        updateLocalStorage();
        renderTasks();
    }

    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Timer functions
    function toggleTimer() {
        if (!isRunning) {
            startTimer();
        } else {
            pauseTimer();
        }
    }

    function startTimer() {
        isRunning = true;
        startPauseBtn.textContent = 'Pause';
        timerInterval = setInterval(updateTime, 1000);
    }

    function pauseTimer() {
        isRunning = false;
        startPauseBtn.textContent = 'Start';
        clearInterval(timerInterval);
    }

    function resetTimer() {
        pauseTimer();
        isWorkMode = true;
        workDuration = parseInt(workDurationInput.value);
        restDuration = parseInt(restDurationInput.value);
        timeLeft = isWorkMode ? workDuration * 60 : restDuration * 60;
        updateDisplay();
        setModeStyles();
        startPauseBtn.textContent = 'Start';
    }

    function toggleMode() {
        pauseTimer();
        isWorkMode = !isWorkMode;
        workDuration = parseInt(workDurationInput.value);
        restDuration = parseInt(restDurationInput.value);
        timeLeft = isWorkMode ? workDuration * 60 : restDuration * 60;
        updateDisplay();
        setModeStyles();
        startPauseBtn.textContent = 'Start';
    }

    function updateTime() {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            // Switch modes when timer reaches 0
            pauseTimer();
            isWorkMode = !isWorkMode;
             workDuration = parseInt(workDurationInput.value);
            restDuration = parseInt(restDurationInput.value);
            timeLeft = isWorkMode ? workDuration * 60 : restDuration * 60;
            updateDisplay();
            setModeStyles();
            startPauseBtn.textContent = 'Start';
        }
    }

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        modeDisplay.textContent = isWorkMode ? 'Work' : 'Relax';
        title.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - Pomodoro Timer`;

        // Update progress circle
        const totalTime = isWorkMode ? workDuration * 60 : restDuration * 60;
        const percentage = ((totalTime - timeLeft) / totalTime) * 100;
        document.querySelector('.progress-circle').style.background = `conic-gradient(var(--primary) ${percentage}%, var(--light) 0%)`;
    }

    function setModeStyles() {
        if (isWorkMode) {
            body.classList.add('work-mode');
            body.classList.remove('relax-mode');
            modeToggleIcon.src = "https://img.icons8.com/ios-filled/50/000000/sun.png";
        } else {
            body.classList.add('relax-mode');
            body.classList.remove('work-mode');
            modeToggleIcon.src = "https://img.icons8.com/ios-filled/50/000000/moon.png";
        }
    }
});
