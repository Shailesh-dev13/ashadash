// ============================================
// Splash Screen Logic
// ============================================

let currentTip = 0;
const totalTips = 3;
let tipInterval;

function initSplash() {
    // Start tip rotation
    tipInterval = setInterval(rotateTips, 3000);
    
    // Auto redirect after 9 seconds (3 tips * 3 seconds)
    setTimeout(() => {
        clearInterval(tipInterval);
        // Check if user is logged in
        const user = localStorage.getItem('asha_user');
        if (user) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'login.html';
        }
    }, 9000);
}

function rotateTips() {
    // Hide current tip
    const currentCard = document.querySelector(`.tip-card[data-tip="${currentTip}"]`);
    const currentIndicator = document.querySelectorAll('.indicator')[currentTip];
    
    if (currentCard) {
        currentCard.classList.remove('active');
    }
    if (currentIndicator) {
        currentIndicator.classList.remove('active');
    }
    
    // Move to next tip
    currentTip = (currentTip + 1) % totalTips;
    
    // Show next tip
    const nextCard = document.querySelector(`.tip-card[data-tip="${currentTip}"]`);
    const nextIndicator = document.querySelectorAll('.indicator')[currentTip];
    
    if (nextCard) {
        nextCard.classList.add('active');
    }
    if (nextIndicator) {
        nextIndicator.classList.add('active');
    }
}

// Initialize on page load
if (document.querySelector('.splash-container')) {
    initSplash();
}

