// ============================================
// Dashboard Logic
// ============================================

// Load user data
function loadDashboard() {
    const user = JSON.parse(localStorage.getItem('asha_user') || '{}');
    if (user.name) {
        document.getElementById('asha-name').textContent = user.name;
    }
    
    // Load stats
    loadStats();
    
    // Load notifications
    loadNotifications();
}

// Load statistics
function loadStats() {
    const patients = JSON.parse(localStorage.getItem('asha_patients') || '[]');
    const today = new Date().toDateString();
    
    // Calculate today's visits (mock data for now)
    const todayVisits = 8;
    const pendingTasks = 5;
    
    document.getElementById('total-patients').textContent = patients.length || 24;
    document.getElementById('today-visits').textContent = todayVisits;
    document.getElementById('pending-tasks').textContent = pendingTasks;
}

// Load notifications
function loadNotifications() {
    const notifications = JSON.parse(localStorage.getItem('asha_notifications') || '[]');
    const unreadCount = notifications.filter(n => !n.read).length;
    
    const badge = document.getElementById('notification-badge');
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Notification drawer
document.getElementById('notification-btn')?.addEventListener('click', () => {
    const drawer = document.getElementById('notification-drawer');
    if (drawer) {
        drawer.classList.toggle('active');
        loadNotificationDrawer();
    }
});

document.getElementById('close-notifications')?.addEventListener('click', () => {
    document.getElementById('notification-drawer')?.classList.remove('active');
});

function loadNotificationDrawer() {
    const notifications = JSON.parse(localStorage.getItem('asha_notifications') || '[]');
    const list = document.getElementById('notification-list');
    
    if (!list) return;
    
    if (notifications.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--grey); padding: 2rem;">No notifications</p>';
        return;
    }
    
    list.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.read ? '' : 'unread'}" data-id="${notif.id}">
            <div class="notification-title">${notif.title}</div>
            <div class="notification-message">${notif.message}</div>
            <div class="notification-time">${formatTime(notif.timestamp)}</div>
        </div>
    `).join('');
    
    // Mark as read on click
    list.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            markNotificationAsRead(id);
            item.classList.remove('unread');
        });
    });
}

function markNotificationAsRead(id) {
    const notifications = JSON.parse(localStorage.getItem('asha_notifications') || '[]');
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        localStorage.setItem('asha_notifications', JSON.stringify(notifications));
        loadNotifications();
    }
}

// Language button
document.getElementById('language-btn')?.addEventListener('click', () => {
    window.location.href = 'language-selection.html';
});

// Profile button
document.getElementById('profile-btn')?.addEventListener('click', () => {
    window.location.href = 'settings.html';
});

// Help button
document.getElementById('help-btn')?.addEventListener('click', () => {
    window.location.href = 'support.html';
});

// Initialize dashboard
if (document.querySelector('.dashboard-header')) {
    loadDashboard();
}

