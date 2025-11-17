// ============================================
// Resources Page Logic
// ============================================

// Dummy resources data
const resources = {
    guides: [
        {
            id: 1,
            title: 'ASHA Worker Handbook',
            description: 'Complete guide for ASHA workers',
            type: 'guide',
            icon: '📖'
        },
        {
            id: 2,
            title: 'Maternal Health Guidelines',
            description: 'Best practices for maternal care',
            type: 'guide',
            icon: '🤱'
        },
        {
            id: 3,
            title: 'Child Health Protocols',
            description: 'Guidelines for child healthcare',
            type: 'guide',
            icon: '👶'
        }
    ],
    videos: [
        {
            id: 1,
            title: 'Vaccination Techniques',
            description: 'Learn proper vaccination procedures',
            type: 'video',
            icon: '💉',
            duration: '15 min'
        },
        {
            id: 2,
            title: 'Antenatal Care Basics',
            description: 'Essential antenatal care practices',
            type: 'video',
            icon: '🤰',
            duration: '20 min'
        },
        {
            id: 3,
            title: 'First Aid Training',
            description: 'Basic first aid for common situations',
            type: 'video',
            icon: '🩹',
            duration: '25 min'
        }
    ],
    pdfs: [
        {
            id: 1,
            title: 'Immunization Schedule',
            description: 'Complete vaccination schedule',
            type: 'pdf',
            icon: '📄'
        },
        {
            id: 2,
            title: 'Health Record Forms',
            description: 'Downloadable health record templates',
            type: 'pdf',
            icon: '📋'
        },
        {
            id: 3,
            title: 'PHC Contact Directory',
            description: 'Directory of PHC contacts',
            type: 'pdf',
            icon: '📞'
        }
    ]
};

function initResources() {
    initTabs();
    loadResources();
}

function initTabs() {
    document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update tab content
            document.querySelectorAll('.resource-tab').forEach(t => t.classList.remove('active'));
            document.getElementById(`${tab}-tab`).classList.add('active');
            
            // Load resources for selected tab
            loadResources(tab);
        });
    });
}

function loadResources(tab = 'guides') {
    const resourceList = document.getElementById(`${tab}-list`);
    if (!resourceList) return;
    
    const items = resources[tab] || [];
    
    if (items.length === 0) {
        resourceList.innerHTML = '<p style="text-align: center; color: var(--grey); padding: 2rem;">No resources available</p>';
        return;
    }
    
    resourceList.innerHTML = items.map(item => `
        <div class="resource-item" onclick="openResource('${item.type}', ${item.id})">
            <div class="resource-icon">${item.icon}</div>
            <div class="resource-content">
                <div class="resource-title">${item.title}</div>
                <div class="resource-description">${item.description}${item.duration ? ` • ${item.duration}` : ''}</div>
            </div>
            <div style="font-size: 1.5rem;">→</div>
        </div>
    `).join('');
}

function openResource(type, id) {
    showToast(`Opening ${type} resource...`, 'info');
    // In a real app, this would open the actual resource
    // For now, just show a message
    setTimeout(() => {
        showToast('Resource opened. In a real app, this would display the content.', 'info');
    }, 500);
}

// Initialize
if (document.getElementById('guides-list')) {
    initResources();
}

// Make function globally available
window.openResource = openResource;

