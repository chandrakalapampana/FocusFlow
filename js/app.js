/* =========================================================
   FOCUSFLOW — MAIN APPLICATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       USER
       ===================================================== */

    let currentUser = Storage.get(
        "focusflow_user",
        "Chandrakala"
    );


    /* =====================================================
       GREETING
       ===================================================== */

    function updateGreeting() {

        const heroTitle =
            document.querySelector(".hero h1");

        if (!heroTitle) return;


        const hour =
            new Date().getHours();


        let greeting = "Good morning";


        if (hour >= 12 && hour < 17) {

            greeting = "Good afternoon";

        }
        else if (hour >= 17 && hour < 21) {

            greeting = "Good evening";

        }
        else if (hour >= 21 || hour < 5) {

            greeting = "Good night";

        }


        heroTitle.textContent =
            `${greeting}, ${currentUser} 👋`;

    }


    /* =====================================================
       NAVIGATION
       ===================================================== */

    function setupNavigation() {

        const navLinks =
            document.querySelectorAll(".nav-link");


        const pages =
            document.querySelectorAll(".page");


        navLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const href =
                        link.getAttribute("href");


                    if (!href) return;


                    const targetId =
                        href.replace("#", "");


                    pages.forEach(function (page) {

                        page.classList.remove(
                            "active"
                        );

                    });


                    navLinks.forEach(function (item) {

                        item.classList.remove(
                            "active"
                        );

                    });


                    const targetPage =
                        document.getElementById(
                            targetId
                        );


                    if (targetPage) {

                        targetPage.classList.add(
                            "active"
                        );

                    }


                    link.classList.add(
                        "active"
                    );


                    window.location.hash =
                        targetId;


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );

        });


        /* Load page from URL hash */

        const hash =
            window.location.hash.replace(
                "#",
                ""
            );


        if (hash) {

            const targetLink =
                document.querySelector(
                    `.nav-link[href="#${hash}"]`
                );


            const targetPage =
                document.getElementById(
                    hash
                );


            if (
                targetLink &&
                targetPage
            ) {

                pages.forEach(function (page) {

                    page.classList.remove(
                        "active"
                    );

                });


                navLinks.forEach(function (link) {

                    link.classList.remove(
                        "active"
                    );

                });


                targetPage.classList.add(
                    "active"
                );


                targetLink.classList.add(
                    "active"
                );

            }

        }

    }


    /* =====================================================
       VIEW ALL TASKS
       ===================================================== */

    function setupViewAllTasks() {

        const viewButton =
            document.getElementById(
                "viewTasksBtn"
            );


        if (!viewButton) return;


        viewButton.addEventListener(
            "click",
            function () {

                const tasksLink =
                    document.querySelector(
                        '.nav-link[href="#tasks"]'
                    );


                if (tasksLink) {

                    tasksLink.click();

                }

            }
        );

    }


    /* =====================================================
       THEME
       ===================================================== */

    function setupTheme() {

        const themeBtn =
            document.getElementById(
                "themeBtn"
            );


        if (!themeBtn) return;


        const savedTheme =
            Storage.get(
                "focusflow_theme",
                "dark"
            );


        if (
            savedTheme === "light"
        ) {

            document.body.classList.add(
                "light"
            );

        }


        themeBtn.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "light"
                );


                const isLight =
                    document.body.classList.contains(
                        "light"
                    );


                Storage.set(
                    "focusflow_theme",
                    isLight
                        ? "light"
                        : "dark"
                );

            }
        );

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    function setupMobileMenu() {

        const menuBtn =
            document.querySelector(
                ".mobile-menu"
            );


        const sidebar =
            document.querySelector(
                ".sidebar"
            );


        if (
            !menuBtn ||
            !sidebar
        ) {

            return;

        }


        menuBtn.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "mobile-open"
                );

            }
        );


        document
            .querySelectorAll(".nav-link")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        sidebar.classList.remove(
                            "mobile-open"
                        );

                    }
                );

            });

    }


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    function setupNotifications() {

        const notificationBtn =
            document.getElementById(
                "notificationBtn"
            );


        if (!notificationBtn) return;


        let notificationPanel = null;

        let notificationInterval = null;

        let lastSignature = "";


        /* ---------------------------------------------
           GET NOTIFICATION DATA
           --------------------------------------------- */

        function getNotifications() {

            const tasks =
                Storage.get(
                    "focusflow_tasks",
                    []
                );


            const habits =
                Storage.get(
                    "focusflow_habits",
                    []
                );


            const sessions =
                Number(
                    Storage.get(
                        "focusflow_sessions",
                        0
                    )
                );


            const notifications = [];


            /* TASKS */

            const pendingTasks =
                tasks.filter(function (task) {

                    return !task.completed;

                });


            const completedTasks =
                tasks.filter(function (task) {

                    return task.completed;

                });


            if (pendingTasks.length > 0) {

                notifications.push({

                    icon: "📝",

                    title: "Active Tasks",

                    text:
                        `${pendingTasks.length} ` +
                        `task${
                            pendingTasks.length > 1
                                ? "s"
                                : ""
                        } still active`

                });

            }


            if (
                tasks.length > 0 &&
                pendingTasks.length === 0
            ) {

                notifications.push({

                    icon: "🎉",

                    title: "All Tasks Completed",

                    text:
                        "Amazing! All your tasks are completed."

                });

            }


            /* COMPLETED TASKS */

            if (completedTasks.length > 0) {

                notifications.push({

                    icon: "✅",

                    title: "Completed",

                    text:
                        `${completedTasks.length} ` +
                        `task${
                            completedTasks.length > 1
                                ? "s"
                                : ""
                        } completed`

                });

            }


            /* HABITS */

            if (habits.length > 0) {

                notifications.push({

                    icon: "🔥",

                    title: "Active Habits",

                    text:
                        `${habits.length} ` +
                        `habit${
                            habits.length > 1
                                ? "s"
                                : ""
                        } you're tracking`

                });

            }


            /* FOCUS */

            if (sessions > 0) {

                notifications.push({

                    icon: "🎯",

                    title: "Focus Progress",

                    text:
                        `${sessions} focus ` +
                        `session${
                            sessions > 1
                                ? "s"
                                : ""
                        } completed`

                });

            }


            /* NOTHING */

            if (
                notifications.length === 0
            ) {

                notifications.push({

                    icon: "✨",

                    title: "You're All Caught Up",

                    text:
                        "Start a task or focus session to see updates."

                });

            }


            return notifications;

        }


        /* ---------------------------------------------
           CREATE SIGNATURE
           --------------------------------------------- */

        function getSignature(
            notifications
        ) {

            return JSON.stringify(
                notifications
            );

        }


        /* ---------------------------------------------
           RENDER CONTENT ONLY
           --------------------------------------------- */

        function renderNotifications(
            force = false
        ) {

            if (!notificationPanel) {
                return;
            }


            const list =
                notificationPanel.querySelector(
                    ".notification-list"
                );


            if (!list) return;


            const notifications =
                getNotifications();


            const signature =
                getSignature(
                    notifications
                );


            /*
                If nothing changed,
                don't touch the DOM.
            */

            if (
                !force &&
                signature === lastSignature
            ) {

                return;

            }


            lastSignature =
                signature;


            list.innerHTML =
                notifications
                    .map(function (notification) {

                        return `

                            <div
                                class="notification-item"
                            >

                                <div
                                    class="notification-icon"
                                >
                                    ${
                                        notification.icon
                                    }
                                </div>


                                <div
                                    class="notification-content"
                                >

                                    <strong>
                                        ${
                                            notification.title
                                        }
                                    </strong>


                                    <span>
                                        ${
                                            notification.text
                                        }
                                    </span>

                                </div>

                            </div>

                        `;

                    })
                    .join("");

        }


        /* ---------------------------------------------
           CREATE PANEL
           --------------------------------------------- */

        function createNotificationPanel() {

            notificationPanel =
                document.createElement(
                    "div"
                );


            notificationPanel.id =
                "notificationPanel";


            notificationPanel.className =
                "notification-panel";


            notificationPanel.innerHTML = `

                <div
                    class="notification-header"
                >

                    <div>

                        <h3>
                            Notifications
                        </h3>

                        <span>
                            Your FocusFlow updates
                        </span>

                    </div>


                    <button
                        class="notification-close"
                        type="button"
                        aria-label="Close notifications"
                    >
                        ×
                    </button>

                </div>


                <div
                    class="notification-list"
                ></div>

            `;


            document.body.appendChild(
                notificationPanel
            );


            lastSignature = "";


            renderNotifications(
                true
            );


            const closeBtn =
                notificationPanel.querySelector(
                    ".notification-close"
                );


            if (closeBtn) {

                closeBtn.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                        closeNotificationPanel();

                    }
                );

            }

        }


        /* ---------------------------------------------
           CLOSE PANEL
           --------------------------------------------- */

        function closeNotificationPanel() {

            if (
                notificationInterval
            ) {

                clearInterval(
                    notificationInterval
                );


                notificationInterval =
                    null;

            }


            if (
                notificationPanel
            ) {

                notificationPanel.remove();


                notificationPanel =
                    null;

            }


            lastSignature = "";

        }


        /* ---------------------------------------------
           NOTIFICATION BUTTON
           --------------------------------------------- */

        notificationBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                /* CLOSE */

                if (
                    notificationPanel
                ) {

                    closeNotificationPanel();

                    return;

                }


                /* CLOSE PROFILE */

                const profilePanel =
                    document.getElementById(
                        "profilePanel"
                    );


                if (profilePanel) {

                    profilePanel.remove();

                }


                /* CREATE */

                createNotificationPanel();


                /*
                    Check every second,
                    but update the UI only
                    when data changes.
                */

                notificationInterval =
                    setInterval(
                        function () {

                            if (
                                notificationPanel
                            ) {

                                renderNotifications();

                            }

                        },
                        1000
                    );

            }
        );


        /* ---------------------------------------------
           CLICK OUTSIDE
           --------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    !notificationPanel
                ) {

                    return;

                }


                if (
                    !notificationPanel.contains(
                        event.target
                    ) &&
                    !notificationBtn.contains(
                        event.target
                    )
                ) {

                    closeNotificationPanel();

                }

            }
        );


        /* ---------------------------------------------
           GLOBAL CLOSE EVENT
           --------------------------------------------- */

        document.addEventListener(
            "focusflow:closeNotifications",
            function () {

                closeNotificationPanel();

            }
        );

    }


    /* =====================================================
       PROFILE
       ===================================================== */

    function setupProfile() {

        const profileBtn =
            document.getElementById(
                "profileBtn"
            );


        if (!profileBtn) return;


        profileBtn.textContent =
            currentUser
                .charAt(0)
                .toUpperCase();


        profileBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                const existingPanel =
                    document.getElementById(
                        "profilePanel"
                    );


                /* CLOSE */

                if (
                    existingPanel
                ) {

                    existingPanel.remove();

                    return;

                }


                /* CLOSE NOTIFICATIONS */

                document.dispatchEvent(
                    new Event(
                        "focusflow:closeNotifications"
                    )
                );


                /* CREATE PROFILE */

                const panel =
                    document.createElement(
                        "div"
                    );


                panel.id =
                    "profilePanel";


                panel.className =
                    "profile-panel";


                panel.innerHTML = `

                    <div
                        class="profile-avatar"
                    >

                        ${
                            currentUser
                                .charAt(0)
                                .toUpperCase()
                        }

                    </div>


                    <h3>
                        ${
                            escapeHTML(
                                currentUser
                            )
                        }
                    </h3>


                    <p>
                        FocusFlow Student
                    </p>


                    <div
                        class="profile-actions"
                    >

                        <button
                            class="profile-action"
                            id="changeNameBtn"
                            type="button"
                        >

                            <span>
                                ✏️
                            </span>

                            Change Name

                        </button>


                        <button
                            class="profile-action"
                            id="profileDashboardBtn"
                            type="button"
                        >

                            <span>
                                🏠
                            </span>

                            Dashboard

                        </button>


                        <button
                            class="profile-action"
                            id="closeProfileBtn"
                            type="button"
                        >

                            <span>
                                ✕
                            </span>

                            Close

                        </button>

                    </div>

                `;


                document.body.appendChild(
                    panel
                );


                /* ----------------------------------
                   CHANGE NAME
                   ---------------------------------- */

                const changeNameBtn =
                    document.getElementById(
                        "changeNameBtn"
                    );


                changeNameBtn.addEventListener(
                    "click",
                    function () {

                        const newName =
                            prompt(
                                "Enter your name:",
                                currentUser
                            );


                        if (
                            newName &&
                            newName.trim() !== ""
                        ) {

                            currentUser =
                                newName.trim();


                            Storage.set(
                                "focusflow_user",
                                currentUser
                            );


                            updateGreeting();


                            profileBtn.textContent =
                                currentUser
                                    .charAt(0)
                                    .toUpperCase();


                            panel.remove();

                        }

                    }
                );


                /* ----------------------------------
                   DASHBOARD
                   ---------------------------------- */

                const dashboardBtn =
                    document.getElementById(
                        "profileDashboardBtn"
                    );


                dashboardBtn.addEventListener(
                    "click",
                    function () {

                        const dashboardLink =
                            document.querySelector(
                                '.nav-link[href="#dashboard"]'
                            );


                        if (
                            dashboardLink
                        ) {

                            dashboardLink.click();

                        }


                        panel.remove();

                    }
                );


                /* ----------------------------------
                   CLOSE
                   ---------------------------------- */

                const closeBtn =
                    document.getElementById(
                        "closeProfileBtn"
                    );


                closeBtn.addEventListener(
                    "click",
                    function () {

                        panel.remove();

                    }
                );

            }
        );


        /* ---------------------------------------------
           CLICK OUTSIDE PROFILE
           --------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                const panel =
                    document.getElementById(
                        "profilePanel"
                    );


                if (!panel) return;


                if (
                    !panel.contains(
                        event.target
                    ) &&
                    !profileBtn.contains(
                        event.target
                    )
                ) {

                    panel.remove();

                }

            }
        );

    }


    /* =====================================================
       NOTES
       ===================================================== */

    function setupNotes() {

        const notesPage =
            document.getElementById(
                "notes"
            );


        if (!notesPage) return;


        const noteTitle =
            notesPage.querySelector(
                ".note-title"
            );


        const noteTextarea =
            notesPage.querySelector(
                "textarea"
            );


        /*
            Your current Notes page has
            a Save Note button in the
            first card.
        */

        const saveButton =
            notesPage.querySelector(
                ".card:first-child button"
            );


        if (
            !noteTitle ||
            !noteTextarea ||
            !saveButton
        ) {

            return;

        }


        saveButton.addEventListener(
            "click",
            function () {

                const title =
                    noteTitle.value.trim();


                const content =
                    noteTextarea.value.trim();


                if (
                    !title &&
                    !content
                ) {

                    alert(
                        "Please write something before saving."
                    );

                    return;

                }


                const note = {

                    title:
                        title ||
                        "Untitled Note",

                    content:
                        content,

                    time:
                        new Date()
                            .toLocaleString()

                };


                Storage.set(
                    "focusflow_note",
                    note
                );


                noteTitle.value = "";

                noteTextarea.value = "";


                renderSavedNote();


                alert(
                    "Note saved successfully! 📝"
                );

            }
        );


        renderSavedNote();

    }


    /* =====================================================
       SAVED NOTES
       ===================================================== */

    function renderSavedNote() {

        const notesPage =
            document.getElementById(
                "notes"
            );


        if (!notesPage) return;


        const cards =
            notesPage.querySelectorAll(
                ".card"
            );


        if (
            cards.length < 2
        ) {

            return;

        }


        const savedCard =
            cards[1];


        const savedNote =
            Storage.get(
                "focusflow_note",
                null
            );


        /* ---------------------------------------------
           EMPTY
           --------------------------------------------- */

        if (!savedNote) {

            savedCard.innerHTML = `

                <div
                    class="card-header"
                >

                    <div>

                        <span class="eyebrow">
                            YOUR NOTES
                        </span>

                        <h2>
                            Saved Notes
                        </h2>

                    </div>

                </div>


                <div
                    class="empty-state"
                >

                    <div
                        class="note-empty-icon"
                    >
                        📝
                    </div>


                    <strong>
                        No saved notes yet
                    </strong>


                    <span>
                        Write a note above and save it here.
                    </span>

                </div>

            `;


            return;

        }


        /* ---------------------------------------------
           SAFE CONTENT
           --------------------------------------------- */

        const safeTitle =
            escapeHTML(
                savedNote.title ||
                "Untitled Note"
            );


        const safeContent =
            escapeHTML(
                savedNote.content ||
                ""
            )
            .replace(
                /\n/g,
                "<br>"
            );


        const safeTime =
            escapeHTML(
                savedNote.time ||
                ""
            );


        /* ---------------------------------------------
           SAVED NOTE CARD
           --------------------------------------------- */

        savedCard.innerHTML = `

            <div
                class="card-header"
            >

                <div>

                    <span class="eyebrow">
                        YOUR NOTES
                    </span>

                    <h2>
                        Saved Notes
                    </h2>

                </div>

            </div>


            <div
                class="saved-note-box"
                id="savedNoteBox"
            >

                <div
                    class="saved-note-top"
                >

                    <div
                        class="saved-note-pin"
                    >
                        📌
                    </div>


                    <div>

                        <div
                            class="saved-note-title"
                        >
                            ${safeTitle}
                        </div>

                        <div
                            class="saved-note-label"
                        >
                            Personal note
                        </div>

                    </div>

                </div>


                <div
                    class="saved-note-content"
                >

                    ${safeContent}

                </div>


                <div
                    class="saved-note-footer"
                >

                    <span>
                        🕒 Saved ${safeTime}
                    </span>


                    <button
                        id="deleteSavedNote"
                        class="delete-note-btn"
                        type="button"
                    >

                        🗑️ Delete

                    </button>

                </div>

            </div>

        `;


        /* DELETE */

        const deleteButton =
            document.getElementById(
                "deleteSavedNote"
            );


        if (
            deleteButton
        ) {

            deleteButton.addEventListener(
                "click",
                function () {

                    const confirmed =
                        confirm(
                            "Delete this saved note?"
                        );


                    if (
                        !confirmed
                    ) {

                        return;

                    }


                    Storage.remove(
                        "focusflow_note"
                    );


                    renderSavedNote();

                }
            );

        }

    }


    /* =====================================================
       DASHBOARD
       ===================================================== */

    function updateDashboard() {

        const tasks =
            Storage.get(
                "focusflow_tasks",
                []
            );


        const sessions =
            Number(
                Storage.get(
                    "focusflow_sessions",
                    0
                )
            );


        const habits =
            Storage.get(
                "focusflow_habits",
                []
            );


        /* ---------------------------------------------
           TASK COUNT
           --------------------------------------------- */

        const taskCount =
            document.getElementById(
                "taskCount"
            );


        if (
            taskCount
        ) {

            taskCount.textContent =
                tasks.length;

        }


        /* ---------------------------------------------
           PROGRESS
           --------------------------------------------- */

        const progress =
            document.getElementById(
                "progress"
            );


        if (
            progress
        ) {

            if (
                tasks.length === 0
            ) {

                progress.textContent =
                    "0%";

            }
            else {

                const completed =
                    tasks.filter(
                        function (task) {

                            return task.completed;

                        }
                    ).length;


                const percentage =
                    Math.round(
                        (
                            completed /
                            tasks.length
                        ) * 100
                    );


                progress.textContent =
                    `${percentage}%`;

            }

        }


        /* ---------------------------------------------
           FOCUS
           --------------------------------------------- */

        const focusSessions =
            document.getElementById(
                "focusSessions"
            );


        if (
            focusSessions
        ) {

            focusSessions.textContent =
                sessions;

        }


        /* ---------------------------------------------
           HABIT STREAK
           --------------------------------------------- */

        const streak =
            document.getElementById(
                "streak"
            );


        if (
            streak
        ) {

            streak.textContent =
                habits.length;

        }


        const sidebarStreak =
            document.getElementById(
                "sidebarStreak"
            );


        if (
            sidebarStreak
        ) {

            sidebarStreak.textContent =
                `${habits.length} days 🔥`;

        }

    }


    /* =====================================================
       DATE
       ===================================================== */

    function updateDate() {

        const dateElement =
            document.getElementById(
                "currentDate"
            );


        if (!dateElement) return;


        dateElement.textContent =
            new Date()
                .toLocaleDateString(
                    undefined,
                    {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );

    }


    /* =====================================================
       KEYBOARD SHORTCUTS
       ===================================================== */

    function setupKeyboardShortcuts() {

        document.addEventListener(
            "keydown",
            function (event) {

                /* Ctrl + K */

                if (
                    event.ctrlKey &&
                    event.key.toLowerCase() === "k"
                ) {

                    event.preventDefault();


                    const taskInput =
                        document.getElementById(
                            "taskInput"
                        );


                    if (
                        taskInput
                    ) {

                        taskInput.focus();

                    }

                }


                /* Escape */

                if (
                    event.key === "Escape"
                ) {

                    document.dispatchEvent(
                        new Event(
                            "focusflow:closeNotifications"
                        )
                    );


                    const profilePanel =
                        document.getElementById(
                            "profilePanel"
                        );


                    if (
                        profilePanel
                    ) {

                        profilePanel.remove();

                    }

                }

            }
        );

    }


    /* =====================================================
       HTML ESCAPE
       ===================================================== */

    function escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            String(text);


        return div.innerHTML;

    }


    /* =====================================================
       REFRESH DASHBOARD
       ===================================================== */

    setInterval(
        function () {

            updateDashboard();

        },
        1000
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    updateGreeting();

    updateDate();

    setupNavigation();

    setupViewAllTasks();

    setupTheme();

    setupMobileMenu();

    setupNotifications();

    setupProfile();

    setupNotes();

    updateDashboard();

    setupKeyboardShortcuts();

});