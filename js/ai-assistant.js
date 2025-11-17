// ============================================
// AI Assistant Logic
// ============================================

// AI responses database
const aiResponses = {
    greetings: [
        "Hello! I'm AshaAI, your virtual assistant. How can I help you today?",
        "Hi there! I'm here to assist you with your ASHA work. What do you need?",
        "Welcome! I'm AshaAI. Feel free to ask me anything about patient care or your daily tasks."
    ],
    patientHelp: [
        "I can help you fill patient forms. Try saying: 'Patient name is Rajesh Kumar, age 35, male, height 170 cm, weight 75 kg'",
        "For patient registration, I can extract information from your voice input. Just speak the details naturally.",
        "I can validate patient data. For example, if weight seems unusually high, I'll alert you."
    ],
    routeHelp: [
        "I can optimize your daily route to visit all households efficiently. Just click the 'AI Route' button.",
        "I'll analyze all your tasks and suggest the best order to visit patients, saving you time and travel.",
        "My route optimization considers patient priority, distance, and time constraints."
    ],
    medical: {
        "fever": "For fever above 102°F: 1) Give paracetamol as per weight, 2) Keep patient hydrated, 3) Use cold compress, 4) Monitor temperature every 2 hours, 5) If persists >24 hours or worsens, refer to PHC immediately.",
        "child fever": "For child with fever: 1) Check temperature, 2) Give age-appropriate paracetamol, 3) Ensure adequate fluid intake, 4) Monitor for signs of dehydration, 5) If fever >102°F or child is lethargic, refer to PHC urgently.",
        "pregnancy": "For pregnancy concerns: 1) Check blood pressure, 2) Monitor fetal movement, 3) Check for any bleeding or discharge, 4) Ensure regular antenatal checkups, 5) If any complications, refer to PHC immediately.",
        "vaccination": "For vaccination queries: 1) Check immunization schedule, 2) Ensure no contraindications, 3) Maintain cold chain, 4) Document properly, 5) Monitor for adverse reactions post-vaccination."
    }
};

// Initialize AI Assistant
function initAIAssistant() {
    // Dashboard AI widget
    const aiFloatBtn = document.getElementById('ai-float-btn');
    const aiChatModal = document.getElementById('ai-chat-modal');
    const closeAIChat = document.getElementById('close-ai-chat');
    const sendAIMessage = document.getElementById('send-ai-message');
    const aiChatInput = document.getElementById('ai-chat-input');
    const voiceInputBtn = document.getElementById('voice-input-btn');
    
    if (aiFloatBtn && aiChatModal) {
        aiFloatBtn.addEventListener('click', () => {
            aiChatModal.classList.toggle('active');
            if (aiChatModal.classList.contains('active')) {
                aiChatInput.focus();
            }
        });
    }
    
    if (closeAIChat) {
        closeAIChat.addEventListener('click', () => {
            aiChatModal?.classList.remove('active');
        });
    }
    
    if (sendAIMessage && aiChatInput) {
        sendAIMessage.addEventListener('click', () => {
            handleAIMessage(aiChatInput.value, 'dashboard');
            aiChatInput.value = '';
        });
        
        aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAIMessage(aiChatInput.value, 'dashboard');
                aiChatInput.value = '';
            }
        });
    }
    
    // Voice input for AI
    if (voiceInputBtn) {
        voiceInputBtn.addEventListener('click', () => {
            startAIVoiceInput('dashboard');
        });
    }
    
    // Patient register AI sidebar
    const sidebarSendBtn = document.getElementById('sidebar-send-btn');
    const sidebarInput = document.getElementById('sidebar-ai-input');
    const sidebarVoiceBtn = document.getElementById('sidebar-voice-btn');
    
    if (sidebarSendBtn && sidebarInput) {
        sidebarSendBtn.addEventListener('click', () => {
            handleAIMessage(sidebarInput.value, 'patient');
            sidebarInput.value = '';
        });
        
        sidebarInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAIMessage(sidebarInput.value, 'patient');
                sidebarInput.value = '';
            }
        });
    }
    
    if (sidebarVoiceBtn) {
        sidebarVoiceBtn.addEventListener('click', () => {
            startAIVoiceInput('patient');
        });
    }
    
    // Support page AI chat
    const phcSendBtn = document.getElementById('phc-send-btn');
    const phcChatInput = document.getElementById('phc-chat-input');
    const phcVoiceBtn = document.getElementById('phc-voice-btn');
    
    if (phcSendBtn && phcChatInput) {
        phcSendBtn.addEventListener('click', () => {
            handleAIMessage(phcChatInput.value, 'support');
            phcChatInput.value = '';
        });
        
        phcChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAIMessage(phcChatInput.value, 'support');
                phcChatInput.value = '';
            }
        });
    }
    
    if (phcVoiceBtn) {
        phcVoiceBtn.addEventListener('click', () => {
            startAIVoiceInput('support');
        });
    }
}

function handleAIMessage(message, context) {
    if (!message.trim()) return;
    
    // Add user message to chat
    addAIMessage(message, 'user', context);
    
    // Process and generate AI response
    setTimeout(() => {
        const response = generateAIResponse(message, context);
        addAIMessage(response, 'bot', context);
    }, 500);
}

function addAIMessage(message, sender, context) {
    let messagesContainer;
    
    if (context === 'dashboard') {
        messagesContainer = document.getElementById('ai-chat-messages');
    } else if (context === 'patient') {
        messagesContainer = document.getElementById('ai-sidebar-messages');
    } else if (context === 'support') {
        messagesContainer = document.getElementById('phc-chat-messages');
    }
    
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender === 'user' ? 'ai-user' : 'ai-bot'}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(message, context) {
    const lowerMessage = message.toLowerCase();
    
    // Greetings
    if (lowerMessage.match(/hello|hi|hey|greetings/)) {
        return aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)];
    }
    
    // Patient registration help
    if (context === 'patient') {
        if (lowerMessage.match(/help|how|what|patient|form|register/)) {
            return aiResponses.patientHelp[Math.floor(Math.random() * aiResponses.patientHelp.length)];
        }
        
        // Extract and fill form fields
        if (lowerMessage.match(/name is|age is|height is|weight is/)) {
            return "I've extracted the information from your message. Please check the form fields. If anything is missing, let me know!";
        }
    }
    
    // Medical queries
    if (lowerMessage.match(/fever|temperature/)) {
        if (lowerMessage.match(/child|baby|infant/)) {
            return aiResponses.medical["child fever"];
        }
        return aiResponses.medical["fever"];
    }
    
    if (lowerMessage.match(/pregnancy|pregnant|antenatal/)) {
        return aiResponses.medical["pregnancy"];
    }
    
    if (lowerMessage.match(/vaccine|vaccination|immunization/)) {
        return aiResponses.medical["vaccination"];
    }
    
    // Route optimization
    if (lowerMessage.match(/route|path|visit|optimize|plan/)) {
        return aiResponses.routeHelp[Math.floor(Math.random() * aiResponses.routeHelp.length)];
    }
    
    // Default response
    return "I understand you're asking about: '" + message + "'. I'm here to help! Could you provide more details? For medical emergencies, please contact PHC immediately.";
}

function startAIVoiceInput(context) {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new Recognition();
        recognition.lang = 'en-IN';
        recognition.continuous = false;
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            
            // Set input value based on context
            if (context === 'dashboard') {
                document.getElementById('ai-chat-input').value = transcript;
                handleAIMessage(transcript, context);
            } else if (context === 'patient') {
                document.getElementById('sidebar-ai-input').value = transcript;
                handleAIMessage(transcript, context);
            } else if (context === 'support') {
                document.getElementById('phc-chat-input').value = transcript;
                handleAIMessage(transcript, context);
            }
        };
        
        recognition.start();
        showToast('Listening...', 'info');
    } else {
        showToast('Voice recognition not supported', 'error');
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIAssistant);
} else {
    initAIAssistant();
}

