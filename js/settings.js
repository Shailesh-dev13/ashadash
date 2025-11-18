// ============================================
// Settings Page Logic
// ============================================

function loadSettings() {
    // Load user profile
    const user = JSON.parse(localStorage.getItem('asha_user') || '{}');
    if (user.name) {
        document.getElementById('profile-name').textContent = user.name;
    }
    
    // Load language
    const lang = getCurrentLanguage();
    const langNames = {
        en: 'English',
        hi: 'हिंदी (Hindi)',
        or: 'ଓଡ଼ିଆ (Odia)',
        bn: 'বাংলা (Bengali)',
        te: 'తెలుగు (Telugu)',
        ta: 'தமிழ் (Tamil)'
    };
    document.getElementById('current-language').textContent = langNames[lang] || 'English';
    
    // Load theme
    const theme = localStorage.getItem('asha_theme') || 'light-mode';
    document.getElementById('current-theme').textContent = theme === 'dark-mode' ? 'Dark' : 'Light';
    
    // Load offline queue count
    const queue = JSON.parse(localStorage.getItem('asha_offline_queue') || '[]');
    document.getElementById('offline-queue-count').textContent = `${queue.length} pending`;
    
    // Calculate storage (simplified)
    let storageSize = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
                    storageSize += localStorage[key].length + key.length;
        }
    }
    const storageMB = (storageSize / 1024 / 1024).toFixed(2);
    document.getElementById('storage-used').textContent = `${storageMB} MB`;
}

// Edit profile
document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.classList.add('active');
    }
});

document.getElementById('close-edit-profile')?.addEventListener('click', () => {
    document.getElementById('edit-profile-modal')?.classList.remove('active');
});

document.getElementById('save-profile-btn')?.addEventListener('click', () => {
    const name = document.getElementById('edit-name-input').value;
    const phone = document.getElementById('edit-phone-input').value;
    
    const user = JSON.parse(localStorage.getItem('asha_user') || '{}');
    user.name = name;
    user.mobile = phone;
    localStorage.setItem('asha_user', JSON.stringify(user));
    
    document.getElementById('profile-name').textContent = name;
    document.getElementById('edit-profile-modal').classList.remove('active');
    showToast('Profile updated successfully', 'success');
});

// Change language
document.getElementById('change-language-btn')?.addEventListener('click', () => {
    window.location.href = 'language-selection.html';
});

// Dark mode toggle
document.getElementById('dark-mode-toggle')?.addEventListener('change', (e) => {
    toggleTheme();
    const theme = e.target.checked ? 'Dark' : 'Light';
    document.getElementById('current-theme').textContent = theme;
});

// Sync now
document.getElementById('sync-now-settings-btn')?.addEventListener('click', () => {
    if (typeof syncOfflineQueue === 'function') {
        syncOfflineQueue();
        setTimeout(() => {
            loadSettings();
        }, 2500);
    }
});

// Clear cache
document.getElementById('clear-cache-btn')?.addEventListener('click', () => {
    if (confirm('Clear all cached data? This will not delete patient records.')) {
        // Clear non-essential data
        localStorage.removeItem('asha_notifications');
        showToast('Cache cleared', 'success');
        setTimeout(() => {
            loadSettings();
        }, 500);
    }
});

// Logout
document.getElementById('logout-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('asha_user');
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
});

// Initialize
if (document.getElementById('profile-name')) {
    loadSettings();
}

