# AshaConnect - ASHA Worker Dashboard

A mobile-first web application for ASHA (Accredited Social Health Activist) workers to manage patient records, daily checklists, and access healthcare resources.

## Features

### 🎯 Core Modules

1. **Splash Screen & Intro Tips**
   - Rotating health tips and ASHA best practices
   - Auto-redirect to login after 9 seconds

2. **Login System**
   - Mobile number + OTP authentication
   - Biometric login (simulated)
   - Voice assistant for form filling

3. **Language Selection**
   - Support for English, Hindi, Odia, Bengali, Telugu, Tamil
   - Language preference saved in localStorage

4. **Home Dashboard**
   - Quick access to all modules
   - Statistics overview
   - Notification badge

5. **Patient Register**
   - Multiple input modes: Text, Voice, Image
   - Auto BMI calculator
   - Offline queue for data sync
   - AI assistant for form filling and validation

6. **Daily Checklist**
   - Task management for field visits
   - Map view with markers
   - Category filters
   - AI-powered route optimization

7. **Notifications & Alerts**
   - Real-time notifications
   - Unread badge counter
   - Mark as read functionality

8. **Support Page**
   - PHC contact information
   - Emergency hotlines
   - AI-assisted chat with PHC staff

9. **Resources**
   - Training guides
   - Video tutorials
   - Downloadable PDFs

10. **Settings**
    - Profile management
    - Language switching
    - Dark mode toggle
    - Offline sync control
    - Logout

### 🤖 AI Features

- **AshaAI Assistant**: Floating AI helper available on all pages
- Voice input for forms and queries
- Route optimization for daily visits
- Medical guidance and safety protocols
- Form validation and suggestions

### 📱 Mobile-First Design

- Fully responsive layout
- Touch-friendly buttons (min 44px height)
- Optimized for smartphone screens
- Smooth animations and transitions

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom design system with CSS variables
- **Vanilla JavaScript**: No frameworks or libraries
- **LocalStorage**: Offline data persistence
- **Web Speech API**: Voice recognition (where supported)

## File Structure

```
ashadash/
├── index.html              # Splash screen
├── login.html              # Login page
├── language-selection.html # Language selection
├── dashboard.html          # Main dashboard
├── patient-register.html   # Patient registration
├── daily-checklist.html    # Daily tasks
├── notifications.html      # Notifications
├── support.html            # Support & help
├── resources.html          # Training resources
├── settings.html           # App settings
├── css/
│   ├── styles.css          # Global styles
│   └── components.css      # Component styles
├── js/
│   ├── app.js              # Core utilities
│   ├── splash.js           # Splash screen logic
│   ├── login.js            # Login logic
│   ├── language.js         # Language selection
│   ├── dashboard.js        # Dashboard logic
│   ├── patient-register.js # Patient form logic
│   ├── offline-sync.js     # Offline sync
│   ├── ai-assistant.js     # AI assistant
│   ├── daily-checklist.js  # Checklist logic
│   ├── notifications.js    # Notifications
│   ├── support.js          # Support page
│   ├── resources.js        # Resources page
│   └── settings.js         # Settings page
└── README.md               # This file
```

## Getting Started

1. **Open the application**
   - Simply open `index.html` in a web browser
   - For best experience, use a mobile device or browser's mobile emulation mode

2. **Login**
   - Enter any 10-digit mobile number
   - Click "Get OTP"
   - Enter the OTP shown in console (for testing: check browser console)
   - Or use "Login with Biometrics" for quick access

3. **Select Language**
   - Choose your preferred language
   - This will be saved for future sessions

4. **Start Using**
   - Navigate through the dashboard
   - Register patients, manage tasks, access resources

## Testing Credentials

- **Mobile Number**: Any 10-digit number (e.g., 9876543210)
- **OTP**: Check browser console after clicking "Get OTP"
- **Biometric Login**: Click the biometric button for instant login

## Offline Functionality

- Patient data is saved to localStorage when offline
- Offline queue indicator shows pending sync items
- Auto-sync when connection is restored
- Manual sync button available

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Voice Recognition**: Chrome/Edge (Web Speech API)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet

## Color Scheme

- **Primary Blue**: #2563eb
- **White**: #ffffff
- **Light Grey**: #f3f4f6
- **Success Green**: #10b981
- **Warning Yellow**: #f59e0b
- **Danger Red**: #ef4444

## Future Enhancements

- Backend API integration
- Real-time data sync
- Push notifications
- Advanced AI features
- Multi-language voice recognition
- GPS-based route tracking
- Photo upload to cloud storage

## Notes

- This is a frontend-only prototype
- All data is stored in browser localStorage
- Voice recognition requires HTTPS or localhost
- Some features are simulated (biometric, API calls)

## License

This project is created for demonstration purposes.

---

**Built with ❤️ for ASHA Workers**

