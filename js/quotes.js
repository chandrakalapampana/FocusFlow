// ==========================================
// FocusFlow - Motivational Quotes
// ==========================================

const quotes = [
    "Small progress is still progress.",
    "The secret of getting ahead is getting started.",
    "Focus on progress, not perfection.",
    "Your future is created by what you do today.",
    "One focused hour can change your entire day.",
    "Success starts with showing up.",
    "Dream big. Start small. Act now.",
    "Consistency beats motivation.",
    "Don't stop until you're proud.",
    "Great things take time. Keep going.",
    "Your only limit is the effort you give today.",
    "Stay focused. Stay consistent. Keep growing."
];


// ==========================================
// Get Random Quote
// ==========================================

function getRandomQuote() {

    const randomIndex =
        Math.floor(
            Math.random() * quotes.length
        );

    return quotes[randomIndex];
}


// ==========================================
// Display Quote
// ==========================================

function displayQuote() {

    const quoteElement =
        document.getElementById("quote");

    if (!quoteElement) return;

    quoteElement.textContent =
        getRandomQuote();
}


// ==========================================
// Initialize
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    displayQuote
);