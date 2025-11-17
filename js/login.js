// ============================================
// Login System Logic
// ============================================

let generatedOTP = '';
let mobileNumber = '';

// Mobile step
document.getElementById('get-otp-btn')?.addEventListener('click', () => {
    const mobileInput = document.getElementById('mobile-input');
    const mobile = mobileInput.value.trim();
    
    if (!validateMobile(mobile)) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        return;
    }
    
    mobileNumber = mobile;
    generateOTP();
    showOTPStep();
});

// Biometric login
document.getElementById('biometric-btn')?.addEventListener('click', () => {
    // Simulate biometric authentication
    showToast('Biometric authentication in progress...', 'info');
    
    setTimeout(() => {
        // Mock successful biometric login
        const user = {
            name: 'Priya Sharma',
            mobile: '9876543210',
            id: 'ASHA-12345',
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('asha_user', JSON.stringify(user));
        showToast('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'language-selection.html';
        }, 1000);
    }, 1500);
});

// OTP verification
document.getElementById('verify-otp-btn')?.addEventListener('click', () => {
    const otpInputs = document.querySelectorAll('.otp-input');
    const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
    
    if (enteredOTP.length !== 6) {
        showToast('Please enter complete OTP', 'error');
        return;
    }
    
    if (enteredOTP === generatedOTP) {
        // Successful login
        const user = {
            name: 'Priya Sharma',
            mobile: mobileNumber,
            id: 'ASHA-12345',
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('asha_user', JSON.stringify(user));
        showToast('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'language-selection.html';
        }, 1000);
    } else {
        showToast('Invalid OTP. Please try again.', 'error');
        // Clear OTP inputs
        otpInputs.forEach(input => input.value = '');
        otpInputs[0].focus();
    }
});

// Back to mobile step
document.getElementById('back-to-mobile')?.addEventListener('click', () => {
    showMobileStep();
});

// Resend OTP
document.getElementById('resend-otp')?.addEventListener('click', () => {
    generateOTP();
    showToast('OTP resent successfully', 'success');
});

// OTP input auto-focus
document.querySelectorAll('.otp-input').forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < 5) {
            document.querySelectorAll('.otp-input')[index + 1].focus();
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            document.querySelectorAll('.otp-input')[index - 1].focus();
        }
    });
});

// Voice assistant for login
document.getElementById('voice-assistant-btn')?.addEventListener('click', () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new Recognition();
        recognition.lang = 'en-IN';
        recognition.continuous = false;
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            // Extract mobile number from transcript
            const numbers = transcript.match(/\d+/g);
            if (numbers) {
                const mobile = numbers.join('').slice(-10);
                if (mobile.length === 10) {
                    document.getElementById('mobile-input').value = mobile;
                    showToast('Mobile number filled from voice input', 'success');
                }
            }
        };
        
        recognition.start();
        showToast('Listening... Speak your mobile number', 'info');
    } else {
        showToast('Voice recognition not supported in your browser', 'error');
    }
});

function validateMobile(mobile) {
    return /^[0-9]{10}$/.test(mobile);
}

function generateOTP() {
    // Generate 6-digit OTP
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', generatedOTP); // For testing purposes
    showToast(`OTP sent to ${mobileNumber}. OTP: ${generatedOTP}`, 'info');
}

function showOTPStep() {
    document.getElementById('mobile-step').classList.remove('active');
    document.getElementById('otp-step').classList.add('active');
    document.getElementById('mobile-display').textContent = mobileNumber;
    
    // Focus first OTP input
    setTimeout(() => {
        document.querySelectorAll('.otp-input')[0].focus();
    }, 100);
}

function showMobileStep() {
    document.getElementById('otp-step').classList.remove('active');
    document.getElementById('mobile-step').classList.add('active');
}

