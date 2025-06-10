# 🛕 Temple — Mind, Body & Goals in Harmony

A wellness companion app that treats your body, mind, and goals as a temple — unified, intentional, and thoughtfully tracked.

## 🧠 Purpose

Temple is built to bring everything that keeps you centered — nutrition, workouts, journaling, and mindfulness — into one clean, beautiful app.

We often scatter our self-care across too many tools. Temple gives you a single home to track everything that makes you feel whole.

## 🧩 Features

- **Nutrition**: Log meals, calories, macros, daily summaries
- **Mind**: Daily journal, goal writing, reflection prompts
- **Body**: Workout tracker with logging & history
- **Temple**: Meditation timers, gratitude tracker, stress logs
- **Weekly Review**: Summarize and reflect on your progress across all domains

## 🔧 Tech Stack

- **Core Framework**: Expo + React Native (TypeScript)
- **UI System**: shadcn/ui
- **State Management**: Zustand + AsyncStorage
- **Validation**: React Hook Form + Zod
- **Backend**: Firebase (Auth + Firestore)
- **Testing**: Jest + React Native Testing Library

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

3. Start the development server:
   ```bash
   yarn start
   ```

4. Run tests:
   ```bash
   yarn test
   ```

## 📱 Development

- `yarn start` - Start the Expo development server
- `yarn android` - Start the Android app
- `yarn ios` - Start the iOS app
- `yarn test` - Run tests
- `yarn lint` - Run ESLint
- `yarn type-check` - Run TypeScript type checking

## 🧱 Project Structure

```
TempleApp/
├── assets/          # Images, fonts, and other static assets
├── components/      # Reusable UI components
├── constants/       # App constants and configuration
├── docs/           # Documentation
├── navigation/     # Navigation configuration
├── screens/        # Screen components
├── services/       # API and external service integrations
├── stores/         # Zustand store definitions
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── .env           # Environment variables
├── app.config.js  # Expo configuration
└── App.tsx        # Root component
```

## 📄 License

MIT — open to self-improvement and contribution.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 🧘 Inspiration

Temple is inspired by the idea that discipline, clarity, and care should not be chaotic. This app helps you become the version of yourself you already are — just with the right tools and space. 