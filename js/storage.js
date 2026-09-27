// ==========================================
// FocusFlow - Local Storage Manager
// ==========================================

const Storage = {

    // Save data
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Storage save error:", error);
        }
    },

    // Get data
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);

            if (data === null) {
                return defaultValue;
            }

            return JSON.parse(data);

        } catch (error) {
            console.error("Storage read error:", error);
            return defaultValue;
        }
    },

    // Remove data
    remove(key) {
        localStorage.removeItem(key);
    },

    // Clear all FocusFlow data
    clear() {
        localStorage.clear();
    }
};


// ==========================================
// Default Application Data
// ==========================================

const defaultTasks = [
    {
        id: 1,
        title: "Complete Python assignment",
        category: "Study",
        completed: false
    },
    {
        id: 2,
        title: "Practice Data Structures",
        category: "Study",
        completed: true
    },
    {
        id: 3,
        title: "Work on portfolio",
        category: "Project",
        completed: false
    }
];


const defaultHabits = [
    {
        id: 1,
        name: "Study 2 Hours",
        progress: 70
    },
    {
        id: 2,
        name: "Read 20 Pages",
        progress: 45
    },
    {
        id: 3,
        name: "Practice Coding",
        progress: 85
    }
];


// ==========================================
// Initialize Data
// ==========================================

function initializeStorage() {

    if (!Storage.get("focusflow_tasks")) {
        Storage.set("focusflow_tasks", defaultTasks);
    }

    if (!Storage.get("focusflow_habits")) {
        Storage.set("focusflow_habits", defaultHabits);
    }

    if (!Storage.get("focusflow_notes")) {
        Storage.set("focusflow_notes", "");
    }

    if (!Storage.get("focusflow_theme")) {
        Storage.set("focusflow_theme", "dark");
    }
}


// Initialize when page loads
initializeStorage();