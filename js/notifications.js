// ============================================
// Notifications Logic
// ============================================

// Dummy notifications
const dummyNotifications = [
    {
        id: 1,
        title: 'New Patient Registered',
        message: 'Rajesh Kumar has been registered in your area',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'info'
    },
    {
        id: 2,
        title: 'Low Supplies Alert',
        message: 'Vaccination supplies running low. Please contact PHC',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'warning'
    },
    {
        id: 3,
        title: 'PHC Announcement',
        message: 'Monthly meeting scheduled for next Friday at 10 AM',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'info'
    },
    {
        id: 4,
        title: 'High-Risk Patient Alert',
        message: 'Priya Sharma (Pregnant) needs immediate attention',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'danger'
    }
];

function loadNotifications() {
    let notifications = JSON.parse(localStorage.getItem('asha_notifications') || '[]');
    
    // If no notifications, use dummy data
    if (notifications.length === 0) {
        notifications = dummyNotifications;
        localStorage.setItem('asha_notifications', JSON.stringify(notifications));
    }
    
    renderNotifications(notifications);
}

function renderNotifications(notifications) {
    const list = document.getElementById('notifications-list');
    if (!list) return;
    
    // Sort by timestamp (newest first)
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (notifications.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--grey); padding: 2rem;">No notifications</p>';
        return;
    }
    
    list.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.read ? '' : 'unread'}" data-id="${notif.id}">
            <div class="notification-title">${notif.title}</div>
            <div class="notification-message">${notif.message}</div>
            <div class="notification-time">${formatTime(notif.timestamp)} • ${formatDate(notif.timestamp)}</div>
        </div>
    `).join('');
    
    // Mark as read on click
    list.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.getAttribute('data-id'));
            markAsRead(id);
            item.classList.remove('unread');
        });
    });
}

function markAsRead(id) {
    const notifications = JSON.parse(localStorage.getItem('asha_notifications') || '[]');
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        localStorage.setItem('asha_notifications', JSON.stringify(notifications));
    }
}

// Initialize
if (document.getElementById('notifications-list')) {
    loadNotifications();
}

