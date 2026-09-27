// ==========================================
// FocusFlow - Habit Tracker
// ==========================================

let habits = Storage.get("focusflow_habits", []);


// ==========================================
// SAVE HABITS
// ==========================================

function saveHabits() {
    Storage.set("focusflow_habits", habits);
}


// ==========================================
// RENDER HABITS
// ==========================================

function renderHabits() {

    const habitList =
        document.getElementById("habitList");

    if (!habitList) return;

    habitList.innerHTML = "";


    if (habits.length === 0) {

        habitList.innerHTML = `
            <div class="empty-state">
                🔥 Create your first habit.
            </div>
        `;

        return;
    }


    habits.forEach(habit => {

        const card =
            document.createElement("div");

        card.className =
            "card habit-card";


        card.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:15px;
            ">

                <div>

                    <h3>
                        ${escapeHTML(habit.name)}
                    </h3>

                    <p>
                        ${habit.progress}% completed
                    </p>

                </div>


                <strong style="
                    font-size:18px;
                    color:var(--primary);
                ">
                    ${habit.progress}%
                </strong>

            </div>


            <div class="habit-progress">

                <span
                    style="width:${habit.progress}%">
                </span>

            </div>


            <div style="
                display:flex;
                gap:8px;
                margin-top:16px;
            ">


                <!-- Increase -->

                <button
                    onclick="increaseHabit(${habit.id})"
                    style="
                        flex:1;
                        padding:10px;
                        border:0;
                        border-radius:10px;
                        background:linear-gradient(
                            135deg,
                            #8b5cf6,
                            #6366f1
                        );
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    +10%
                </button>


                <!-- Reset -->

                <button
                    onclick="resetHabit(${habit.id})"
                    style="
                        padding:10px 14px;
                        border-radius:10px;
                        background:var(--card-hover);
                        color:var(--text);
                        border:1px solid var(--border);
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    ↻
                </button>


                <!-- Delete -->

                <button
                    onclick="deleteHabit(${habit.id})"
                    title="Delete habit"
                    style="
                        padding:10px 14px;
                        border-radius:10px;
                        background:rgba(251,113,133,.10);
                        color:#fb7185;
                        border:1px solid rgba(251,113,133,.20);
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    🗑️
                </button>

            </div>

        `;


        habitList.appendChild(card);

    });

}


// ==========================================
// ADD HABIT
// ==========================================

function addHabit() {

    const input =
        document.getElementById("habitInput");

    if (!input) return;


    const name =
        input.value.trim();


    if (!name) {

        alert("Please enter a habit.");

        input.focus();

        return;
    }


    habits.push({

        id: Date.now(),

        name: name,

        progress: 0

    });


    saveHabits();

    input.value = "";

    renderHabits();

}


// ==========================================
// INCREASE HABIT
// ==========================================

function increaseHabit(id) {

    habits = habits.map(habit => {

        if (habit.id === id) {

            return {
                ...habit,
                progress: Math.min(
                    habit.progress + 10,
                    100
                )
            };

        }

        return habit;

    });


    saveHabits();

    renderHabits();

}


// ==========================================
// RESET HABIT
// ==========================================

function resetHabit(id) {

    habits = habits.map(habit => {

        if (habit.id === id) {

            return {
                ...habit,
                progress: 0
            };

        }

        return habit;

    });


    saveHabits();

    renderHabits();

}


// ==========================================
// DELETE HABIT
// ==========================================

function deleteHabit(id) {

    const habit =
        habits.find(
            habit => habit.id === id
        );


    if (!habit) return;


    const confirmed =
        confirm(
            `Delete "${habit.name}"?`
        );


    if (!confirmed) return;


    habits =
        habits.filter(
            habit => habit.id !== id
        );


    saveHabits();

    renderHabits();

}


// ==========================================
// ADD HABIT BUTTON
// ==========================================

function setupHabitButton() {

    const button =
        document.getElementById("addHabit");

    const input =
        document.getElementById("habitInput");


    if (button) {

        button.addEventListener(
            "click",
            addHabit
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Enter") {

                    addHabit();

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
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ==========================================
// INITIALIZE
// ==========================================

function initializeHabits() {

    renderHabits();

    setupHabitButton();

}


document.addEventListener(
    "DOMContentLoaded",
    initializeHabits
);