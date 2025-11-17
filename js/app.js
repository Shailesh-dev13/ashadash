// ============================================
// Global App Configuration and Utilities
// ============================================

// LocalStorage Keys
const STORAGE_KEYS = {
    LANGUAGE: 'asha_language',
    THEME: 'asha_theme',
    USER: 'asha_user',
    PATIENTS: 'asha_patients',
    OFFLINE_QUEUE: 'asha_offline_queue',
    NOTIFICATIONS: 'asha_notifications',
    SETTINGS: 'asha_settings'
};

// Language translations
const translations = {
    en: {
        welcome: 'Welcome',
        dashboard: 'Dashboard',
        patientRegister: 'Patient Register',
        dailyChecklist: 'Daily Checklist',
        notifications: 'Notifications',
        support: 'Support',
        resources: 'Resources',
        settings: 'Settings'
    },
    hi: {
        welcome: 'स्वागत',
        dashboard: 'डैशबोर्ड',
        patientRegister: 'रोगी पंजीकरण',
        dailyChecklist: 'दैनिक चेकलिस्ट',
        notifications: 'सूचनाएं',
        support: 'सहायता',
        resources: 'संसाधन',
        settings: 'सेटिंग्स'
    }
};

// Get current language
function getCurrentLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
}

// Set language
function setLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    updateUIText();
}

// Update UI text based on language
function updateUIText() {
    const lang = getCurrentLanguage();
    const texts = translations[lang] || translations.en;
    
    // Update common elements
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (texts[key]) {
            el.textContent = texts[key];
        }
    });
}

// Theme management
function initTheme() {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) toggle.checked = true;
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
}

// Navigation helper
function navigateTo(page) {
    window.location.href = page;
}

// Format date
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Format time
function formatTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations for toast
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            to {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Check online/offline status
function isOnline() {
    return navigator.onLine;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateUIText();
    
    // Add online/offline listeners
    window.addEventListener('online', () => {
        showToast('Connection restored. Syncing data...', 'success');
        if (typeof syncOfflineQueue === 'function') {
            syncOfflineQueue();
        }
    });
    
    window.addEventListener('offline', () => {
        showToast('You are offline. Data will sync when connection is restored.', 'info');
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STORAGE_KEYS,
        getCurrentLanguage,
        setLanguage,
        updateUIText,
        toggleTheme,
        navigateTo,
        formatDate,
        formatTime,
        showToast,
        isOnline
    };
}

