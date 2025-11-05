# TaxSage Mobile App

AI-Powered CA Advisor mobile application built with React Native and Expo.

## Features

- 🔐 **Secure Authentication** - Email/password login with validation
- 🤖 **AI Chat Interface** - Talk to your CA advisor powered by AI
- 🗺️ **Financial Roadmaps** - Create and view personalized financial plans
- 📊 **Dashboard Analytics** - Track your financial journey progress
- 👤 **User Profile** - Manage your account and app settings
- 💾 **Offline Storage** - All data stored locally with AsyncStorage

## Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: React Hooks
- **Storage**: AsyncStorage
- **UI**: Custom components with Linear Gradients
- **Icons**: Expo Vector Icons
- **Backend**: Connects to existing TaxSage API

## Prerequisites

Before running this app, make sure you have:

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation & Setup

1. **Clone and navigate to the project:**
   ```bash
   cd TaxSageApp
   npm install
   ```

2. **Configure API endpoint:**
   - Open `src/constants/index.ts`
   - Update `API_CONFIG.BASE_URL` to your backend URL
   - For local development: `http://your-ip:3000`
   - For production: `https://your-domain.com`

3. **Start the development server:**
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on device/emulator:**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator

## Building APK

### Method 1: EAS Build (Recommended)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Build APK:**
   ```bash
   # Development build
   eas build --platform android --profile development
   
   # Preview APK (installable)
   eas build --platform android --profile preview
   
   # Production AAB
   eas build --platform android --profile production
   ```

### Method 2: Local Build with Expo

1. **Eject to bare React Native (if needed):**
   ```bash
   npx expo eject
   ```

2. **Build with Android Studio:**
   - Open `android/` folder in Android Studio
   - Build > Generate Signed Bundle/APK
   - Choose APK and follow signing process

### Method 3: Direct Expo Export

For development testing:
```bash
npx expo export --platform android
```

## App Structure

```
src/
├── constants/          # App configuration and constants
├── navigation/         # React Navigation setup
├── screens/           # Main app screens
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── ChatScreen.tsx
│   ├── RoadmapScreen.tsx
│   └── ProfileScreen.tsx
└── services/          # API and storage services
    ├── ApiService.ts
    └── StorageService.ts
```

## API Integration

The app connects to your existing TaxSage backend:

- **Authentication**: `/api/auth/login` and `/api/auth/signup`
- **Chat**: `/api/chat` for AI conversations
- **Analytics**: `/api/analytics` for dashboard data
- **Profile**: `/api/me` for user information

## Key Features Implementation

### Authentication
- Email validation (gmail.com, gmai.com, joho.com domains)
- Password strength indicator
- Secure token storage
- Auto-logout functionality

### Chat Interface
- Real-time messaging UI
- Message history persistence
- Roadmap detection and export
- Connection error handling

### Roadmap Viewer
- Formatted step-by-step display
- Share functionality
- Delete and manage roadmaps
- Mobile-optimized text formatting

### Dashboard
- Usage statistics
- Quick action buttons
- Recent activity display
- Navigation shortcuts

## Configuration

### API Endpoint
Update the API base URL in `src/constants/index.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-api-domain.com', // Change this
  // ... rest of config
};
```

### App Metadata
Update app information in `app.json`:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure backend server is running
   - Check network connectivity
   - Verify API_CONFIG.BASE_URL is correct

2. **Build Errors**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules && npm install`
   - Clear Expo cache: `npx expo r -c`

3. **Android Build Issues**
   - Ensure Android SDK is properly installed
   - Check Java version compatibility
   - Verify signing configuration

### Performance Tips

- Enable Hermes for better performance
- Optimize images and assets
- Use FlashList for large data sets
- Implement proper error boundaries

## Deployment

### Google Play Store

1. Build production AAB: `eas build --platform android --profile production`
2. Upload to Google Play Console
3. Complete store listing
4. Submit for review

### Alternative Distribution

- Direct APK installation
- Internal distribution via Firebase App Distribution
- Enterprise distribution

## Development Commands

```bash
# Start development server
npm start

# Start with cache clear
npm run start:fresh

# Type checking
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build
```

## License

This project is part of the TaxSage AI-Powered CA Advisor system.

## Support

For technical support or issues:
- Check the troubleshooting section above
- Review React Native and Expo documentation
- Contact the development team

---

Built with ❤️ using React Native and Expo