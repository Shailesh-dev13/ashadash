// ============================================
// Offline Sync Logic
// ============================================

function syncOfflineQueue() {
    if (!isOnline()) {
        showToast('You are offline. Cannot sync now.', 'error');
        return;
    }
    
    const queue = JSON.parse(localStorage.getItem('asha_offline_queue') || '[]');
    
    if (queue.length === 0) {
        showToast('No pending items to sync', 'info');
        return;
    }
    
    showToast(`Syncing ${queue.length} item(s)...`, 'info');
    
    // Simulate API sync
    setTimeout(() => {
        // Move queued items to patients list
        const patients = JSON.parse(localStorage.getItem('asha_patients') || '[]');
        queue.forEach(item => {
            patients.push(item);
        });
        
        localStorage.setItem('asha_patients', JSON.stringify(patients));
        localStorage.setItem('asha_offline_queue', JSON.stringify([]));
        
        showToast(`Successfully synced ${queue.length} item(s)!`, 'success');
        
        // Update UI
        if (typeof checkOfflineQueue === 'function') {
            checkOfflineQueue();
        }
        
        // Reload page if on patient register
        if (window.location.pathname.includes('patient-register')) {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }, 2000);
}

// Auto-sync when coming online
window.addEventListener('online', () => {
    const queue = JSON.parse(localStorage.getItem('asha_offline_queue') || '[]');
    if (queue.length > 0) {
        syncOfflineQueue();
    }
});

