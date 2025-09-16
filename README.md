# Temple — Mind, Body & Goals in Harmony

A wellness companion app that treats your body, mind, and goals as a temple — unified, intentional, and thoughtfully tracked.

## 🎯 Purpose

Temple is built to bring everything that keeps you centered — nutrition, workouts, journaling, and mindfulness — into one clean, beautiful app. We often scatter our self-care across too many tools. Temple gives you a single home to track everything that makes you feel whole.

## 🧩 Core Features

### **🏠 Home Screen**
- Daily overview and motivation
- Quick access to all wellness areas
- Progress tracking and insights

### **🍎 Nutrition**
- **Calories Tracking**: iOS-style glass tiles with progress visualization
- **Macro Monitoring**: Protein, carbs, and fat tracking with visual cards
- **Meal Logging**: Quick food entry and saved meals
- **Water Intake**: Daily hydration tracking with charts
- **Weight Tracking**: Progress visualization with 3-month charts
- **Today's Summary**: 4-section meal overview grid

### **💪 Body (Workouts)**
- **Quick Workout Logging**: Fast exercise entry
- **Run Tracking**: Cardio and calorie burn monitoring
- **Template System**: Pre-built workout templates
- **Activity History**: Progress tracking and analytics

### **🧠 Mind (Journaling)**
- **Journal Entries**: Clean, modern entry interface
- **Multiple Views**: List, Calendar, Media, and Map views
- **Journal Management**: Multiple journals with entry counts
- **Prompts System**: Guided journaling with topic-based prompts
- **Media Support**: Photo, video, audio, and PDF attachments

### **🕉️ Temple (Meditation)**
- **Daily Quotes**: Inspirational content
- **Topic-Based Meditations**: Organized by themes
- **Meditation Player**: Audio playback with descriptions
- **Progress Tracking**: Meditation history and insights

## 🔧 Technical Stack

### **Framework & Build Tools**
- **Core Framework**: Expo + React Native (TypeScript)
- **Build System**: Expo CLI with managed workflow
- **Target Platforms**: iOS (primary), Android (secondary)
- **Development**: Expo Go app for testing

### **UI & Styling**
- **Design System**: Custom iOS-style glass tiles and components
- **Animation**: React Native Animated API with spring physics
- **Components**: Custom-built reusable components
- **Styling**: StyleSheet with iOS-inspired design language
- **Icons**: Emoji-based icon system with custom SVG support

### **State Management**
- **Primary**: Zustand for global state
- **Persistence**: AsyncStorage for local data
- **Stores**: 
  - `nutritionStore.ts` - Nutrition and meal data
  - `weightStore.ts` - Weight tracking and progress
  - `meditationStore.ts` - Meditation topics and quotes
  - `templateStore.ts` - Workout templates
  - `useStore.ts` - General app state

### **Navigation**
- **Stack Navigation**: `@react-navigation/native-stack`
- **Tab Navigation**: `@react-navigation/bottom-tabs`
- **Structure**: 
  - Main tabs: Home, Nutrition, Mind, Body, Temple
  - Nested stacks for each section
  - Modal presentations for detailed views

### **Backend & Services**
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **API Integration**: USDA Food Database
- **File Storage**: Firebase Storage (planned)

### **Development Tools**
- **TypeScript**: Full type safety
- **Babel**: Module resolution and transforms
- **ESLint**: Code quality and consistency
- **Testing**: Jest + React Native Testing Library (planned)

## 📱 Current UI Components

### **Core Components**
- `IOSTile.tsx` - iOS App Store-style animated tiles
- `AnimatedTile.tsx` - Basic animation wrapper
- `AppStoreTile.tsx` - Specialized App Store animations
- `CaloriesCard.tsx` - Nutrition calorie display
- `MacroCards.tsx` - Protein, carbs, fat visualization
- `TodaySummary.tsx` - Meal overview grid
- `WaterIntakeWidget.tsx` - Hydration tracking
- `WeightTrackingWidget.tsx` - Weight progress charts

### **Screen Components**
- `HomeScreen.tsx` - Main dashboard
- `NutritionScreen.tsx` - Nutrition tracking hub
- `BodyScreen.tsx` - Workout and fitness tracking
- `MindScreen.tsx` - Journaling and mindfulness
- `TempleScreen.tsx` - Meditation and spiritual practices

### **Navigation Structure**
```
AppNavigator.tsx
├── HomeStack
├── NutritionStack
│   ├── NutritionScreen
│   ├── WeightTrackingScreen
│   └── [Nutrition-related screens]
├── BodyStack
│   ├── BodyScreen
│   ├── QuickWorkoutScreen
│   └── RunLoggingScreen
├── MindStack
│   ├── MindScreen
│   ├── JournalEntryScreen
│   └── PromptsScreen
└── TempleStack
    ├── TempleScreen
    ├── MeditationTopicScreen
    └── MeditationPlayerScreen
```

## 🎨 Design Philosophy

### **iOS-Native Aesthetic**
- **Glass Tiles**: Semi-transparent backgrounds with subtle borders
- **Spring Animations**: Physics-based animations matching iOS behavior
- **Typography**: System fonts with proper hierarchy
- **Color Scheme**: iOS-inspired colors with proper contrast
- **Shadows**: Subtle elevation effects

### **Visual Hierarchy**
- **Primary Actions**: Prominent buttons with clear visual weight
- **Secondary Actions**: Subtle styling for less important actions
- **Information Density**: Balanced content with proper spacing
- **Progressive Disclosure**: Information revealed as needed

### **Interaction Design**
- **Touch Feedback**: Immediate visual response to interactions
- **Gesture Support**: Swipe, tap, and long-press interactions
- **Loading States**: Smooth transitions and loading indicators
- **Error Handling**: Clear error states and recovery options

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- Yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### **Installation**

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd temple
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**:
   ```bash
   yarn start
   ```

5. **Run on device/simulator**:
   ```bash
   yarn ios      # iOS Simulator
   yarn android  # Android Emulator
   yarn web      # Web browser
   ```

## 🧱 Project Structure

```
temple/
├── assets/                    # Static assets and images
│   ├── *.PNG                 # Design reference images
│   └── *.jpeg                # UI mockups and screenshots
├── components/               # Reusable UI components
│   ├── IOSTile.tsx          # iOS-style animated tiles
│   ├── CaloriesCard.tsx     # Nutrition display components
│   ├── WaterIntakeWidget.tsx # Hydration tracking
│   └── [other components]
├── constants/                # App constants and configuration
│   └── theme.ts             # Color and styling constants
├── docs/                    # Documentation
│   └── USDA_API_INTEGRATION.md
├── navigation/              # Navigation configuration
│   └── AppNavigator.tsx     # Main navigation setup
├── screens/                 # Screen components
│   ├── HomeScreen.tsx       # Main dashboard
│   ├── NutritionScreen.tsx  # Nutrition tracking
│   ├── BodyScreen.tsx       # Workout tracking
│   ├── MindScreen.tsx       # Journaling
│   ├── TempleScreen.tsx     # Meditation
│   └── [other screens]
├── services/                # External service integrations
│   ├── firebase.ts          # Firebase configuration
│   └── foodApi.ts           # USDA API integration
├── stores/                  # Zustand state management
│   ├── nutritionStore.ts    # Nutrition data
│   ├── weightStore.ts       # Weight tracking
│   ├── meditationStore.ts   # Meditation data
│   └── [other stores]
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
│   └── mealUtils.ts         # Meal calculation helpers
├── App.tsx                  # Root component
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── babel.config.js          # Babel configuration
```

## 📱 Development Commands

```bash
# Development
yarn start          # Start Expo development server
yarn ios            # Run on iOS Simulator
yarn android        # Run on Android Emulator
yarn web            # Run in web browser

# Code Quality
yarn lint           # Run ESLint
yarn type-check     # Run TypeScript type checking

# Testing (planned)
yarn test           # Run Jest tests
yarn test:watch     # Run tests in watch mode
```

## 🔄 Current Development Status

### **✅ Completed Features**
- iOS-style glass tile animations
- Nutrition tracking with calories and macros
- Water intake tracking with charts
- Weight tracking with progress visualization
- Journaling system with multiple views
- Meditation topic organization
- Workout logging and templates
- Navigation structure and routing

### **🚧 In Progress**
- Firebase integration and data persistence
- Advanced animation refinements
- User authentication system
- Data synchronization

### **📋 Planned Features**
- Dark mode support
- Haptic feedback integration
- Advanced analytics and insights
- Social features and sharing
- Apple Health integration
- Push notifications
- Offline support

## 🎯 iOS-Specific Features

### **Current Implementation**
- **iOS-Style Animations**: Spring physics matching iOS behavior
- **Glass Morphism**: Semi-transparent tiles with blur effects
- **System Typography**: Native iOS font hierarchy
- **Touch Interactions**: iOS-standard touch feedback

### **Planned iOS Features**
- **Dynamic Type**: Accessibility text scaling
- **Haptic Feedback**: iOS-native vibration patterns
- **Blur Effects**: Native iOS blur backgrounds
- **Dark Mode**: System appearance integration
- **Apple Health**: HealthKit data synchronization
- **Shortcuts**: Siri integration for quick actions

## 🐛 Known Issues & Limitations

- **iOS Simulator**: Some animations may not render perfectly in simulator
- **Firebase**: Authentication and data persistence still in development
- **Testing**: Test suite not yet implemented
- **Performance**: Some complex animations may need optimization

## 📄 License

MIT — open to self-improvement and contribution.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🧘 Inspiration

Temple is inspired by the idea that discipline, clarity, and care should not be chaotic. This app helps you become the version of yourself you already are — just with the right tools and space.

---

**Built with ❤️ for wellness, mindfulness, and personal growth.**