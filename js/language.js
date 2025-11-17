// ============================================
// Language Selection Logic
// ============================================

const languageNames = {
    en: 'English',
    hi: 'हिंदी (Hindi)',
    or: 'ଓଡ଼ିଆ (Odia)',
    bn: 'বাংলা (Bengali)',
    te: 'తెలుగు (Telugu)',
    ta: 'தமிழ் (Tamil)'
};

document.querySelectorAll('.language-card').forEach(card => {
    card.addEventListener('click', () => {
        const lang = card.getAttribute('data-lang');
        selectLanguage(lang);
    });
});

function selectLanguage(lang) {
    // Save language preference
    setLanguage(lang);
    
    // Show feedback
    showToast(`Language set to ${languageNames[lang]}`, 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500);
}

