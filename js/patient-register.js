// ============================================
// Patient Register Logic
// ============================================

let currentInputMode = 'text';
let isRecording = false;
let recognition = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initInputModes();
    initBMI();
    initForm();
    initVoiceRecognition();
    checkOfflineQueue();
});

// Input mode tabs
function initInputModes() {
    document.querySelectorAll('.tab-btn[data-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-mode');
            switchInputMode(mode);
        });
    });
}

function switchInputMode(mode) {
    currentInputMode = mode;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });
    
    // Show/hide modals
    if (mode === 'voice') {
        openVoiceModal();
    } else if (mode === 'image') {
        openImageModal();
    } else {
        closeVoiceModal();
        closeImageModal();
    }
}

// BMI Calculator
function initBMI() {
    const heightInput = document.getElementById('patient-height');
    const weightInput = document.getElementById('patient-weight');
    
    [heightInput, weightInput].forEach(input => {
        input?.addEventListener('input', calculateBMI);
    });
}

function calculateBMI() {
    const height = parseFloat(document.getElementById('patient-height').value) / 100; // Convert cm to m
    const weight = parseFloat(document.getElementById('patient-weight').value);
    
    if (height > 0 && weight > 0) {
        const bmi = weight / (height * height);
        const bmiDisplay = document.getElementById('bmi-display');
        const bmiValue = document.getElementById('bmi-value');
        const bmiCategory = document.getElementById('bmi-category');
        
        bmiDisplay.style.display = 'block';
        bmiValue.textContent = bmi.toFixed(1);
        
        let category = '';
        let categoryClass = '';
        
        if (bmi < 18.5) {
            category = 'Underweight';
            categoryClass = 'underweight';
        } else if (bmi < 25) {
            category = 'Normal';
            categoryClass = 'normal';
        } else if (bmi < 30) {
            category = 'Overweight';
            categoryClass = 'overweight';
        } else {
            category = 'Obese';
            categoryClass = 'obese';
        }
        
        bmiCategory.textContent = category;
        bmiCategory.className = `bmi-category ${categoryClass}`;
        
        // AI validation
        if (bmi > 35) {
            showToast('BMI seems high. Please confirm the weight and height values.', 'warning');
        }
    }
}

// Form submission
function initForm() {
    const form = document.getElementById('patient-form');
    form?.addEventListener('submit', handleFormSubmit);
    
    document.getElementById('save-draft-btn')?.addEventListener('click', () => {
        saveDraft();
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = collectFormData();
    
    if (!validateForm(formData)) {
        return;
    }
    
    // Check if online
    if (isOnline()) {
        savePatient(formData);
    } else {
        // Save to offline queue
        addToOfflineQueue(formData);
        showToast('Patient saved to offline queue. Will sync when online.', 'info');
    }
}

function collectFormData() {
    return {
        id: 'PAT-' + Date.now(),
        name: document.getElementById('patient-name').value,
        age: parseInt(document.getElementById('patient-age').value),
        gender: document.getElementById('patient-gender').value,
        height: parseFloat(document.getElementById('patient-height').value),
        weight: parseFloat(document.getElementById('patient-weight').value),
        bmi: calculateBMINumber(),
        familyMembers: parseInt(document.getElementById('family-members').value) || 0,
        headOfFamily: document.getElementById('head-of-family').value,
        chronicIllness: document.getElementById('chronic-illness').value,
        allergies: document.getElementById('allergies').value,
        pregnancyMonth: parseInt(document.getElementById('pregnancy-month').value) || null,
        lastVaccineDate: document.getElementById('last-vaccine-date').value,
        address: document.getElementById('patient-address').value,
        notes: document.getElementById('patient-notes').value,
        registeredAt: new Date().toISOString(),
        registeredBy: JSON.parse(localStorage.getItem('asha_user') || '{}').id || 'ASHA-12345'
    };
}

function calculateBMINumber() {
    const height = parseFloat(document.getElementById('patient-height').value) / 100;
    const weight = parseFloat(document.getElementById('patient-weight').value);
    if (height > 0 && weight > 0) {
        return (weight / (height * height)).toFixed(1);
    }
    return null;
}

function validateForm(data) {
    if (!data.name || !data.age || !data.gender || !data.height || !data.weight || !data.address) {
        showToast('Please fill all required fields', 'error');
        return false;
    }
    
    if (data.age < 0 || data.age > 120) {
        showToast('Please enter a valid age', 'error');
        return false;
    }
    
    return true;
}

function savePatient(data) {
    const patients = JSON.parse(localStorage.getItem('asha_patients') || '[]');
    patients.push(data);
    localStorage.setItem('asha_patients', JSON.stringify(patients));
    
    showToast('Patient registered successfully!', 'success');
    
    // Reset form
    document.getElementById('patient-form').reset();
    document.getElementById('bmi-display').style.display = 'none';
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

function saveDraft() {
    const formData = collectFormData();
    localStorage.setItem('asha_patient_draft', JSON.stringify(formData));
    showToast('Draft saved successfully', 'success');
}

// Voice Recognition
function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new Recognition();
        recognition.lang = 'en-IN';
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            
            document.getElementById('voice-transcript').textContent = transcript;
            processVoiceInput(transcript);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            showToast('Voice recognition error. Please try again.', 'error');
            stopVoiceRecording();
        };
    }
}

function openVoiceModal() {
    const modal = document.getElementById('voice-modal');
    if (modal) {
        modal.classList.add('active');
        startVoiceRecording();
    }
}

function closeVoiceModal() {
    const modal = document.getElementById('voice-modal');
    if (modal) {
        modal.classList.remove('active');
        stopVoiceRecording();
    }
}

function startVoiceRecording() {
    if (recognition && !isRecording) {
        recognition.start();
        isRecording = true;
    }
}

function stopVoiceRecording() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
    }
}

document.getElementById('stop-voice-btn')?.addEventListener('click', () => {
    closeVoiceModal();
    switchInputMode('text');
});

function processVoiceInput(transcript) {
    // Simple voice processing - extract patient information
    const lowerTranscript = transcript.toLowerCase();
    
    // Extract name
    const nameMatch = transcript.match(/(?:name is|name|patient name)\s+([A-Za-z\s]+)/i);
    if (nameMatch) {
        document.getElementById('patient-name').value = nameMatch[1].trim();
    }
    
    // Extract age
    const ageMatch = transcript.match(/(?:age is|age)\s+(\d+)/i);
    if (ageMatch) {
        document.getElementById('patient-age').value = ageMatch[1];
    }
    
    // Extract gender
    if (lowerTranscript.includes('male') || lowerTranscript.includes('man')) {
        document.getElementById('patient-gender').value = 'male';
    } else if (lowerTranscript.includes('female') || lowerTranscript.includes('woman')) {
        document.getElementById('patient-gender').value = 'female';
    }
    
    // Extract height
    const heightMatch = transcript.match(/(?:height is|height)\s+(\d+(?:\.\d+)?)\s*(?:cm|centimeter)/i);
    if (heightMatch) {
        document.getElementById('patient-height').value = heightMatch[1];
        calculateBMI();
    }
    
    // Extract weight
    const weightMatch = transcript.match(/(?:weight is|weight)\s+(\d+(?:\.\d+)?)\s*(?:kg|kilogram)/i);
    if (weightMatch) {
        document.getElementById('patient-weight').value = weightMatch[1];
        calculateBMI();
    }
}

// Image Upload
function openImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

document.getElementById('image-input')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${event.target.result}" alt="Uploaded image">`;
            showToast('Image uploaded successfully. You can extract information manually.', 'success');
        };
        reader.readAsDataURL(file);
    }
});

// AI Helper Sidebar
document.getElementById('ai-helper-btn')?.addEventListener('click', () => {
    const sidebar = document.getElementById('ai-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
});

document.getElementById('close-ai-sidebar')?.addEventListener('click', () => {
    document.getElementById('ai-sidebar')?.classList.remove('active');
});

// Offline Queue
function checkOfflineQueue() {
    const queue = JSON.parse(localStorage.getItem('asha_offline_queue') || '[]');
    const queueIndicator = document.getElementById('offline-queue');
    
    if (queue.length > 0) {
        queueIndicator.style.display = 'flex';
        document.getElementById('queue-count').textContent = queue.length;
    } else {
        queueIndicator.style.display = 'none';
    }
}

function addToOfflineQueue(data) {
    const queue = JSON.parse(localStorage.getItem('asha_offline_queue') || '[]');
    queue.push(data);
    localStorage.setItem('asha_offline_queue', JSON.stringify(queue));
    checkOfflineQueue();
}

document.getElementById('sync-now-btn')?.addEventListener('click', () => {
    if (typeof syncOfflineQueue === 'function') {
        syncOfflineQueue();
    }
});

