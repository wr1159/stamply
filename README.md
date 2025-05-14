# Mobile App

A cross-platform mobile application built with Expo and React Native.

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS development: macOS and Xcode
- For Android development: Android Studio and Android SDK

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Run on specific platforms:

- iOS: `npm run ios`
- Android: `npm run android`
- Web: `npm run web`

## Development

- Use `npm start` to start the Expo development server
- Scan the QR code with the Expo Go app on your device
- Press 'a' to open on Android emulator
- Press 'i' to open on iOS simulator (macOS only)

## Project Structure

```
├── App.js              # Main application component
├── assets/            # Images, fonts, and other static assets
├── components/        # Reusable components
├── screens/          # Screen components
└── package.json      # Project dependencies and scripts
```

## Building for Production

1. Create a production build:

```bash
expo build:android  # For Android
expo build:ios      # For iOS
```

2. Or use EAS Build:

```bash
eas build --platform android
eas build --platform ios
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
