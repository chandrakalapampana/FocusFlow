// ==========================================
// FocusFlow - Task Manager
// ==========================================

let tasks = Storage.get("focusflow_tasks", []);

let currentTaskFilter = "all";


// ==========================================
// Save Tasks
// ==========================================

function saveTasks() {
    Storage.set("focusflow_tasks", tasks);
}


// ==========================================
// Render Tasks
// ==========================================

function renderTasks(filter = currentTaskFilter) {

    currentTaskFilter = filter;

    const taskList =
        document.getElementById("taskList");

    const dashboardTasks =
        document.getElementById("dashboardTasks");

    if (!taskList) return;


    let filteredTasks = tasks;


    // Active tasks
    if (filter === "active") {

        filteredTasks =
            tasks.filter(task => !task.completed);

    }


    // Completed tasks
    if (filter === "completed") {

        filteredTasks =
            tasks.filter(task => task.completed);

    }


    // ==========================================
    // MAIN TASK LIST
    // ==========================================

    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        let message = "No tasks yet.";
        let subMessage = "Add a task to get started.";

        if (filter === "active") {

            message = "No active tasks";
            subMessage = "All your tasks are completed.";

        }

        if (filter === "completed") {

            message = "No completed tasks";
            subMessage = "Complete a task and it will appear here.";

        }


        taskList.innerHTML = `

            <div class="empty-state task-empty">

                <div class="task-empty-icon">
                    ✨
                </div>

                <strong>
                    ${message}
                </strong>

                <span>
                    ${subMessage}
                </span>

            </div>

        `;

    }

    else {

        filteredTasks.forEach(task => {

            const item =
                document.createElement("div");


            const priority =
                String(
                    task.priority || "Medium"
                ).toLowerCase();


            const status =
                task.completed
                    ? "Completed"
                    : "Active";


            item.className =
                `task-item
                 ${task.completed ? "completed" : ""}
                 priority-${priority}`;


            item.innerHTML = `

                <!-- CHECK BUTTON -->

                <button
                    class="task-check"
                    type="button"
                    aria-label="${
                        task.completed
                            ? "Mark task active"
                            : "Mark task completed"
                    }"
                    onclick="toggleTask(${task.id})"
                >
                    ${
                        task.completed
                            ? "✓"
                            : ""
                    }
                </button>


                <!-- TASK INFORMATION -->

                <div class="task-content">

                    <strong>
                        ${escapeHTML(
                            task.title || "Untitled task"
                        )}
                    </strong>


                    <div class="task-meta">

                        <!-- STATUS -->

                        <span
                            class="task-status ${
                                task.completed
                                    ? "status-completed"
                                    : "status-active"
                            }"
                        >

                            ${
                                task.completed
                                    ? "✓ Completed"
                                    : "● Active"
                            }

                        </span>


                        <!-- PRIORITY -->

                        <span
                            class="task-priority priority-${priority}"
                        >

                            ${escapeHTML(
                                task.priority || "Medium"
                            )}

                        </span>

                    </div>

                </div>


                <!-- DELETE BUTTON -->

                <button
                    class="delete-task"
                    type="button"
                    aria-label="Delete task"
                    title="Delete task"
                    onclick="deleteTask(${task.id})"
                >

                    🗑️

                </button>

            `;


            taskList.appendChild(item);

        });

    }


    // ==========================================
    // DASHBOARD TASK PREVIEW
    // ==========================================

    if (dashboardTasks) {

        dashboardTasks.innerHTML = "";


        const dashboardItems =
            tasks.slice(0, 4);


        if (dashboardItems.length === 0) {

            dashboardTasks.innerHTML = `

                <div class="empty-state task-empty">

                    <div class="task-empty-icon">
                        ✨
                    </div>

                    <strong>
                        No tasks yet
                    </strong>

                    <span>
                        Add your first task!
                    </span>

                </div>

            `;

        }

        else {

            dashboardItems.forEach(task => {

                const item =
                    document.createElement("div");


                item.className =
                    `dashboard-task
                     ${task.completed ? "completed" : ""}`;


                item.innerHTML = `

                    <button
                        class="dashboard-task-check"
                        type="button"
                        onclick="toggleTask(${task.id})"
                        aria-label="${
                            task.completed
                                ? "Mark task active"
                                : "Mark task completed"
                        }"
                    >

                        ${
                            task.completed
                                ? "✓"
                                : ""
                        }

                    </button>


                    <div class="dashboard-task-content">

                        <strong>

                            ${escapeHTML(
                                task.title || "Untitled task"
                            )}

                        </strong>


                        <small>

                            ${
                                task.completed
                                    ? "✓ Completed"
                                    : "● Active"
                            }

                            &nbsp;•&nbsp;

                            ${escapeHTML(
                                task.priority || "Medium"
                            )}

                        </small>

                    </div>

                `;


                dashboardTasks.appendChild(item);

            });

        }

    }


    // Update statistics
    updateTaskStats();

}


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

    const input =
        document.getElementById("taskInput");

    const priority =
        document.getElementById("priority");


    if (!input) return;


    const title =
        input.value.trim();


    if (!title) {

        alert(
            "Please enter a task first."
        );

        input.focus();

        return;

    }


    const newTask = {

        id: Date.now(),

        title: title,

        priority:
            priority
                ? priority.value
                : "Medium",

        completed: false

    };


    tasks.unshift(newTask);


    saveTasks();


    input.value = "";


    // Always show all tasks after adding
    currentTaskFilter = "all";


    renderTasks("all");

}


// ==========================================
// TOGGLE TASK
// ==========================================

function toggleTask(id) {

    tasks =
        tasks.map(task => {

            if (task.id === id) {

                return {

                    ...task,

                    completed:
                        !task.completed

                };

            }

            return task;

        });


    saveTasks();


    renderTasks(currentTaskFilter);

}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    const confirmed =
        confirm(
            `Delete "${task.title}"?`
        );


    if (!confirmed) return;


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();


    renderTasks(currentTaskFilter);

}


// ==========================================
// TASK STATISTICS
// ==========================================

function updateTaskStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const active =
        total - completed;


    const progress =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    const taskCount =
        document.getElementById(
            "taskCount"
        );


    const progressElement =
        document.getElementById(
            "progress"
        );


    if (taskCount) {

        taskCount.textContent =
            total;

    }


    if (progressElement) {

        progressElement.textContent =
            `${progress}%`;

    }


    // Optional dashboard active task counter
    const activeTaskCount =
        document.getElementById(
            "activeTaskCount"
        );


    if (activeTaskCount) {

        activeTaskCount.textContent =
            active;

    }

}


// ==========================================
// FILTER BUTTONS
// ==========================================

function setupTaskFilters() {

    const filters =
        document.querySelectorAll(
            ".filter"
        );


    filters.forEach(
        (button, index) => {

            button.addEventListener(
                "click",
                function () {

                    filters.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    if (index === 0) {

                        renderTasks("all");

                    }


                    if (index === 1) {

                        renderTasks("active");

                    }


                    if (index === 2) {

                        renderTasks("completed");

                    }

                }
            );

        }
    );

}


// ==========================================
// ADD TASK BUTTON
// ==========================================

function setupAddTask() {

    const button =
        document.getElementById(
            "addTask"
        );


    const input =
        document.getElementById(
            "taskInput"
        );


    if (button) {

        button.addEventListener(
            "click",
            addTask
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    addTask();

                }

            }
        );

    }

}


// ==========================================
// HTML SAFETY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent = text;


    return div.innerHTML;

}


// ==========================================
// INITIALIZE
// ==========================================

function initializeTasks() {

    renderTasks("all");

    setupTaskFilters();

    setupAddTask();

}


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeTasks
);