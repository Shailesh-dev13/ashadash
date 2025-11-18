// ============================================
// Daily Checklist Logic
// ============================================

// Dummy task data with real coordinates (spread out in different directions)
// Coordinates are around a typical Indian city area, non-colinear
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
        notes: 'Diabetes checkup',
        lat: 28.6139,
        lng: 77.2090
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
        notes: 'Antenatal checkup',
        lat: 28.6250,
        lng: 77.2150
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
        notes: 'DPT vaccine due',
        lat: 28.6050,
        lng: 77.2200
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
        notes: 'Regular checkup',
        lat: 28.6200,
        lng: 77.2000
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
        notes: 'Growth monitoring',
        lat: 28.6100,
        lng: 77.1950
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
        notes: 'BP check',
        lat: 28.6180,
        lng: 77.2100
    }
];

let tasks = [];
let map = null;
let markers = [];

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
    // Switch to map view
    document.querySelector('.toggle-btn[data-view="map"]').click();
    
    // Wait for map to initialize, then zoom to task
    setTimeout(() => {
        if (map) {
            const task = tasks.find(t => t.id === id);
            if (task && task.lat && task.lng) {
                map.setView([task.lat, task.lng], 16);
                // Find and open the marker popup
                const marker = markers.find(m => {
                    const lat = m.getLatLng().lat;
                    const lng = m.getLatLng().lng;
                    return Math.abs(lat - task.lat) < 0.0001 && Math.abs(lng - task.lng) < 0.0001;
                });
                if (marker) {
                    marker.openPopup();
                }
                showToast(`Showing location: ${task.title}`, 'info');
            }
        } else {
            // Map not initialized yet, initialize it
            if (typeof L !== 'undefined') {
                setTimeout(() => {
                    initMap();
                    setTimeout(() => showTaskOnMap(id), 200);
                }, 100);
            }
        }
    }, 300);
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
                // Initialize map if not already initialized
                if (!map && typeof L !== 'undefined') {
                    setTimeout(() => {
                        initMap();
                    }, 100);
                } else {
                    renderMap();
                }
            }
        });
    });
}

function initFilters() {
    document.getElementById('category-filter')?.addEventListener('change', () => {
        renderTasks();
        // Update map markers when filter changes
        if (map) {
            renderMap();
        }
    });
}

function initMap() {
    // Initialize Leaflet map when map view is selected
    if (document.getElementById('map') && typeof L !== 'undefined') {
        // Center map around the task locations (average coordinates)
        const centerLat = 28.6150;
        const centerLng = 77.2080;
        
        // Create map
        map = L.map('map').setView([centerLat, centerLng], 14);
        
        // Add CartoDB Positron tiles (cleaner, more modern look)
        const cartoDBLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        });
        
        // Add satellite/imagery layer option
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19
        });
        
        // Add standard OSM layer as fallback
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        });
        
        // Add default layer
        cartoDBLayer.addTo(map);
        
        // Create layer control
        const baseMaps = {
            "Map View": cartoDBLayer,
            "Satellite": satelliteLayer,
            "OpenStreetMap": osmLayer
        };
        
        L.control.layers(baseMaps).addTo(map);
        
        // Render markers
        renderMap();
    }
}

function renderMap() {
    if (!map) {
        // Map not initialized yet, will be initialized when view is switched
        return;
    }
    
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Filter tasks based on category filter
    const categoryFilter = document.getElementById('category-filter')?.value || 'all';
    const filteredTasks = categoryFilter === 'all' 
        ? tasks.filter(t => !t.completed)
        : tasks.filter(t => !t.completed && t.category === categoryFilter);
    
    if (filteredTasks.length === 0) {
        return;
    }
    
    // Add markers for each task
    filteredTasks.forEach((task) => {
        if (!task.lat || !task.lng) {
            // Skip tasks without coordinates
            return;
        }
        
        // Create custom icon based on category
        const iconColor = getCategoryColor(task.category);
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${getCategoryIcon(task.category)}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
        
        // Create marker
        const marker = L.marker([task.lat, task.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
                <div style="min-width: 200px;">
                    <strong>${task.title}</strong><br>
                    <small>${task.patientType}</small><br>
                    <small>📍 ${task.address}</small><br>
                    <small>🕐 ${task.time}</small><br>
                    ${task.priority === 'high' ? '<span style="color: red; font-weight: bold;">High Priority</span>' : ''}
                </div>
            `);
        
        // Add click handler
        marker.on('click', () => {
            showToast(`Task: ${task.title}`, 'info');
        });
        
        markers.push(marker);
    });
    
    // Fit map to show all markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
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

function getCategoryIcon(category) {
    const icons = {
        pregnant: '🤰',
        child: '👶',
        chronic: '🏥',
        vaccination: '💉'
    };
    return icons[category] || '📍';
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

