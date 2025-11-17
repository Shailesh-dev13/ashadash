// ============================================
// Support Page Logic
// ============================================

document.getElementById('call-phc-btn')?.addEventListener('click', () => {
    if (confirm('Call PHC at +91 123 456 7890?')) {
        window.location.href = 'tel:+911234567890';
    }
});

document.getElementById('emergency-btn')?.addEventListener('click', () => {
    if (confirm('Call Emergency Hotline 108?')) {
        window.location.href = 'tel:108';
    }
});

document.getElementById('chat-phc-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('phc-chat-modal');
    if (modal) {
        modal.classList.add('active');
    }
});

document.getElementById('close-phc-chat')?.addEventListener('click', () => {
    document.getElementById('phc-chat-modal')?.classList.remove('active');
});

// PHC chat voice input
document.getElementById('phc-voice-btn')?.addEventListener('click', () => {
    if (typeof startAIVoiceInput === 'function') {
        startAIVoiceInput('support');
    }
});

