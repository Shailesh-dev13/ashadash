// ============================================
// Daily Checklist Logic
// ============================================

// Dummy task data
const dummyTasks = [
    {
        id: 1,
        title: 'Visit Rajesh Kumar',
        category: 'chronic',
        address: 'House No. 12, Street 5',
        priority: 'high',
        time: '09:00 AM',
        completed: false,
        patientType: 'Chronic Illness',
        notes: 'Diabetes checkup'
    },
    {
        id: 2,
        title: 'Check Priya Sharma (Pregnant)',
        category: 'pregnant',
        address: 'House No. 25, Street 3',
        priority: 'high',
        time: '10:30 AM',
        completed: false,
        patientType: 'Pregnant - 7 months',
        notes: 'Antenatal checkup'
    },
    {
        id: 3,
        title: 'Vaccination - Rohan (Child)',
        category: 'vaccination',
        address: 'House No. 8, Street 7',
        priority: 'medium',
        time: '11:00 AM',
        completed: false,
        patientType: 'Child - 6 months',
        notes: 'DPT vaccine due'
    },
    {
        id: 4,
        title: 'Visit Meera Devi',
        category: 'pregnant',
        address: 'House No. 15, Street 2',
        priority: 'medium',
        time: '02:00 PM',
        completed: false,
        patientType: 'Pregnant - 5 months',
        notes: 'Regular checkup'
    },
    {
        id: 5,
        title: 'Check Ankit (Child)',
        category: 'child',
        address: 'House No. 30, Street 4',
        priority: 'low',
        time: '03:30 PM',
        completed: false,
        patientType: 'Child - 2 years',
        notes: 'Growth monitoring'
    },
    {
        id: 6,
        title: 'Visit Suresh (Chronic)',
        category: 'chronic',
        address: 'House No. 5, Street 6',
        priority: 'medium',
        time: '04:00 PM',
        completed: false,
        patientType: 'Hypertension',
        notes: 'BP check'
    }
];

let tasks = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    initViewToggle();
    initFilters();
    initMap();
    initAIRoute();
    updateSummary();
});

function loadTasks() {
    // Load from localStorage or use dummy data
    const savedTasks = localStorage.getItem('asha_daily_tasks');
    tasks = savedTasks ? JSON.parse(savedTasks) : dummyTasks;
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('asha_daily_tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;
    
    const categoryFilter = document.getElementById('category-filter')?.value || 'all';
    const filteredTasks = categoryFilter === 'all' 
        ? tasks 
        : tasks.filter(t => t.category === categoryFilter);
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: var(--grey); padding: 2rem;">No tasks found</p>';
        return;
    }
    
    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   data-id="${task.id}" onchange="toggleTask(${task.id})">
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-details">${task.patientType}</div>
                <div class="task-details">📍 ${task.address}</div>
                <div class="task-details">🕐 ${task.time}</div>
                <div>
                    <span class="task-category ${task.category}">${getCategoryLabel(task.category)}</span>
                    ${task.priority === 'high' ? '<span class="task-category" style="background-color: #fee2e2; color: #991b1b;">High Priority</span>' : ''}
                </div>
            </div>
            <div class="task-map-icon" onclick="showTaskOnMap(${task.id})">🗺️</div>
        </div>
    `).join('');
}

function getCategoryLabel(category) {
    const labels = {
        pregnant: 'Pregnant',
        child: 'Child',
        chronic: 'Chronic',
        vaccination: 'Vaccination'
    };
    return labels[category] || category;
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateSummary();
    }
}

function showTaskOnMap(id) {
    // Switch to map view and highlight task
    document.querySelector('.toggle-btn[data-view="map"]').click();
    // In a real app, this would zoom to the location
    showToast('Task location shown on map', 'info');
}

function initViewToggle() {
    document.querySelectorAll('.toggle-btn[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            
            // Update buttons
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update views
            document.querySelectorAll('.checklist-view').forEach(v => v.classList.remove('active'));
            document.getElementById(`${view}-view`).classList.add('active');
            
            if (view === 'map') {
                renderMap();
            }
        });
    });
}

function initFilters() {
    document.getElementById('category-filter')?.addEventListener('change', () => {
        renderTasks();
    });
}

function initMap() {
    // Map will be rendered when map view is selected
}

function renderMap() {
    const svg = document.getElementById('simple-map');
    if (!svg) return;
    
    // Clear existing markers
    svg.innerHTML = '';
    
    // Add markers for each task
    tasks.forEach((task, index) => {
        const x = 50 + (index % 4) * 90;
        const y = 50 + Math.floor(index / 4) * 80;
        
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        marker.setAttribute('cx', x);
        marker.setAttribute('cy', y);
        marker.setAttribute('r', 8);
        marker.setAttribute('fill', getCategoryColor(task.category));
        marker.setAttribute('class', 'map-marker');
        marker.setAttribute('data-id', task.id);
        marker.setAttribute('title', task.title);
        
        marker.addEventListener('click', () => {
            showToast(`Task: ${task.title}`, 'info');
        });
        
        svg.appendChild(marker);
    });
}

function getCategoryColor(category) {
    const colors = {
        pregnant: '#ec4899',
        child: '#3b82f6',
        chronic: '#f59e0b',
        vaccination: '#10b981',
        'high-risk': '#ef4444'
    };
    return colors[category] || '#6b7280';
}

function updateSummary() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const remaining = total - completed;
    
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('completed-tasks').textContent = completed;
    document.getElementById('remaining-tasks').textContent = remaining;
}

function initAIRoute() {
    document.getElementById('ai-route-btn')?.addEventListener('click', () => {
        generateOptimizedRoute();
    });
    
    document.getElementById('apply-route-btn')?.addEventListener('click', () => {
        applyOptimizedRoute();
    });
    
    document.getElementById('close-route-modal')?.addEventListener('click', () => {
        document.getElementById('ai-route-modal')?.classList.remove('active');
    });
}

function generateOptimizedRoute() {
    const modal = document.getElementById('ai-route-modal');
    const routeList = document.getElementById('optimized-route-list');
    
    if (!modal || !routeList) return;
    
    // Simulate AI route optimization
    showToast('AshaAI is optimizing your route...', 'info');
    
    setTimeout(() => {
        // Sort tasks by priority and location (simplified)
        const optimized = [...tasks]
            .filter(t => !t.completed)
            .sort((a, b) => {
                if (a.priority === 'high' && b.priority !== 'high') return -1;
                if (b.priority === 'high' && a.priority !== 'high') return 1;
                return 0;
            });
        
        routeList.innerHTML = optimized.map((task, index) => `
            <div class="route-item">
                <strong>${index + 1}. ${task.title}</strong><br>
                <small>${task.address} - ${task.time}</small>
            </div>
        `).join('');
        
        // Calculate estimated stats
        const estimatedTime = optimized.length * 45; // 45 minutes per visit
        const hours = Math.floor(estimatedTime / 60);
        const minutes = estimatedTime % 60;
        
        document.getElementById('route-time').textContent = `${hours}h ${minutes}m`;
        document.getElementById('route-distance').textContent = `${optimized.length * 2} km (approx)`;
        
        // Store optimized route
        localStorage.setItem('asha_optimized_route', JSON.stringify(optimized));
        
        modal.classList.add('active');
    }, 1500);
}

function applyOptimizedRoute() {
    const optimized = JSON.parse(localStorage.getItem('asha_optimized_route') || '[]');
    
    if (optimized.length === 0) return;
    
    // Reorder tasks based on optimized route
    const taskIds = optimized.map(t => t.id);
    tasks.sort((a, b) => {
        const aIndex = taskIds.indexOf(a.id);
        const bIndex = taskIds.indexOf(b.id);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });
    
    saveTasks();
    renderTasks();
    document.getElementById('ai-route-modal')?.classList.remove('active');
    showToast('Route optimized and applied!', 'success');
}

// Make functions globally available
window.toggleTask = toggleTask;
window.showTaskOnMap = showTaskOnMap;

