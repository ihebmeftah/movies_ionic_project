# Movies Ionic Project

A mobile-first movie application built with Ionic Framework and Angular, featuring Firebase authentication and Firestore database integration.

## 📱 Features

- **User Authentication**

  - Email/Password login and registration
  - Social authentication support (Google, Facebook, Apple)
  - Protected routes with authentication guards
  - User profile management

- **Movie Management**

  - Browse movies by category
  - Favorites list
  - Movies listing with search and filter capabilities
  - Home page with featured content

- **Cross-Platform Support**
  - iOS support via Capacitor
  - Android support via Capacitor
  - Progressive Web App (PWA) capabilities

## 🛠️ Tech Stack

- **Framework**: Ionic 8.0.0
- **Angular**: 20.0.0
- **Capacitor**: 7.4.3
- **Firebase**: 12.5.0
- **TypeScript**: Latest
- **RxJS**: 7.8.0

### Key Dependencies

- `@angular/fire` - Firebase integration for Angular
- `@capacitor/camera` - Camera functionality
- `@capacitor/haptics` - Haptic feedback
- `@ionic/pwa-elements` - PWA components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Ionic CLI](https://ionicframework.com/docs/cli) (`npm install -g @ionic/cli`)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

For mobile development:

- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd movies_ionic_project
```

2. Install dependencies:

```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and desired social providers)
   - Enable Firestore Database
   - Update `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your Firebase configuration

### Development

Run the application in development mode:

```bash
# Start development server
npm start
# or
ionic serve
```

The application will open at `http://localhost:8100/`

### Build

Build the application for production:

```bash
npm run build
```

### Testing

Run unit tests:

```bash
npm test
```

## 📱 Mobile Development

### iOS

1. Add iOS platform:

```bash
ionic capacitor add ios
```

2. Build and sync:

```bash
npm run build
ionic capacitor sync ios
```

3. Open in Xcode:

```bash
ionic capacitor open ios
```

### Android

1. Add Android platform:

```bash
ionic capacitor add android
```

2. Build and sync:

```bash
npm run build
ionic capacitor sync android
```

3. Open in Android Studio:

```bash
ionic capacitor open android
```

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/                 # Authentication module
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── category/            # Category browsing
│   ├── components/          # Reusable components
│   │   └── social-button-component/
│   ├── guards/              # Route guards
│   │   ├── auth.guard.ts    # Protect authenticated routes
│   │   └── no-auth.guard.ts # Redirect authenticated users
│   ├── services/            # Application services
│   │   ├── auth.service.ts
│   │   ├── firebase-config-checker.service.ts
│   │   └── firestore.service.ts
│   └── tabs/                # Tab navigation
│       ├── home/            # Home page
│       ├── movies-list/     # Movies listing
│       ├── favorites/       # Favorites page
│       └── profile/         # User profile
├── assets/                  # Static assets
├── environments/            # Environment configurations
└── theme/                   # Styling and theming
```

## 🔐 Firebase Configuration

Create a `src/environments/environment.ts` file with your Firebase credentials:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
  },
};
```

And `src/environments/environment.prod.ts` for production:

```typescript
export const environment = {
  production: true,
  firebaseConfig: {
    // Your production Firebase config
  },
};
```

## 🎨 Customization

- **Theming**: Modify `src/theme/variables.scss` to customize the app's color scheme
- **Global Styles**: Edit `src/global.scss` for global styling
- **Icons**: Replace icons in `src/assets/icon/`

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint
- `npm run watch` - Build in watch mode

## 🔒 Security

- Route protection with authentication guards
- Firebase security rules should be configured
- Environment variables for sensitive data
- Secure authentication flows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Ionic Framework Team (Base Template)
- Your Name - Custom Implementation

## 🙏 Acknowledgments

- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [Firebase](https://firebase.google.com/)
- [Capacitor](https://capacitorjs.com/)

## 📞 Support

For support, email <your-email@example.com> or open an issue in the repository.

---

Made with ❤️ using Ionic Framework
