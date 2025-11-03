# TaxSage CA Advisor Mobile App

A React Native mobile application for the TaxSage AI-Powered CA Advisor, providing personalized financial planning, tax advice, and roadmap creation on mobile devices.

## 📱 Features

- **AI-Powered CA Chat**: Get instant financial advice from our AI assistant
- **Financial Roadmaps**: Create and manage personalized financial planning roadmaps
- **Dashboard Analytics**: Track your financial goals and progress
- **Cross-Platform**: Works on both Android and iOS
- **Glass Morphism UI**: Modern, beautiful interface with gradient themes
- **Offline Storage**: Save roadmaps locally with AsyncStorage

## 🛠 Technology Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for smooth navigation
- **Expo Linear Gradient** for beautiful gradients
- **AsyncStorage** for local data persistence
- **Expo Vector Icons** for consistent iconography

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- For Android APK: Android Studio or Expo EAS

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   # or
   expo start
   ```

3. **Run on Device/Simulator**
   ```bash
   # Android
   npm run android
   
   # iOS (macOS only)
   npm run ios
   
   # Web
   npm run web
   ```

## 📱 Building APK

### Method 1: Expo EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS Build**
   ```bash
   eas build:configure
   ```

4. **Build APK**
   ```bash
   # For development build
   eas build --platform android --profile development
   
   # For production build
   eas build --platform android --profile production
   ```

### Method 2: Local Build with Expo

1. **Install Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

2. **Build locally (requires Android Studio)**
   ```bash
   npx expo run:android --variant release
   ```

## 🎨 App Structure

```
src/
├── components/          # Reusable UI components
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx # Main navigation stack
├── screens/            # App screens
│   ├── AuthScreen.tsx  # Authentication screen
│   ├── DashboardScreen.tsx # Main dashboard
│   ├── ChatScreen.tsx  # AI chat interface
│   └── RoadmapScreen.tsx # Roadmap management
├── services/           # API and utility services
└── styles/            # Global styles and themes
    └── globalStyles.ts # Theme and styling constants
```

## 🎯 Key Features Explained

### 1. Authentication Screen
- User registration and login
- Guest access option
- Modern glass morphism design

### 2. Dashboard
- Financial statistics overview
- Quick action buttons
- Recent activity feed
- Personalized greeting

### 3. CA Chat Assistant
- AI-powered financial advice
- Real-time chat interface
- Automatic roadmap generation
- Export functionality

### 4. Roadmap Management
- View all created roadmaps
- Detailed roadmap display with proper formatting
- Share and delete options
- Local storage persistence

## 🎨 UI/UX Features

- **Glass Morphism Design**: Modern translucent glass effects
- **Gradient Themes**: Beautiful color gradients throughout
- **Dark Theme**: Optimized for dark mode interface
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Fluid transitions and interactions

## 🔧 Configuration

### Theme Customization
Edit `src/styles/globalStyles.ts` to customize:
- Colors and gradients
- Typography
- Component styles
- Animation properties

### App Configuration
Edit `app.json` for:
- App name and metadata
- Platform-specific settings
- Build configurations
- Permissions

## 📱 Testing

```bash
# Run on Android emulator
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Run on web browser
npm run web

# Run with Expo Go app
npm start
# Scan QR code with Expo Go app
```

## 🚀 Deployment

### Android Play Store
1. Build production APK using EAS
2. Sign up for Google Play Console
3. Upload APK and complete store listing
4. Submit for review

### iOS App Store
1. Build for iOS using EAS (requires macOS)
2. Sign up for Apple Developer Program
3. Upload to App Store Connect
4. Submit for review

## 🛠 Development

### Adding New Screens
1. Create screen component in `src/screens/`
2. Add navigation route in `AppNavigator.tsx`
3. Update tab navigator if needed

### Styling Guidelines
- Use `globalStyles` for consistent theming
- Follow glass morphism design patterns
- Maintain gradient color schemes
- Ensure responsive design

## 📝 Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Run ESLint
- `npm run build` - Build for production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**TaxSage CA Advisor Mobile** - Your AI-powered financial companion on the go! 🚀📱