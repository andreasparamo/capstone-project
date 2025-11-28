#  LearnToType 

**Live Site:** [learntotype.xyz](https://learntotype.xyz)

**Deployment Links:**
- Firebase Hosting: [learntotype-f5e3c.web.app](https://learntotype-f5e3c.web.app)
- Firebase App: [learntotype-f5e3c.firebaseapp.com](https://learntotype-f5e3c.firebaseapp.com)

## About

A modern, interactive typing practice platform that combines the best features of [Monkeytype](https://monkeytype.com), [TypeRacer](https://play.typeracer.com), and [Typing.com](https://www.typing.com).  
Built with a focus on **speed, accuracy, analytics, and fun**, LearnToType is designed to help users improve their typing skills through customizable tests, multiplayer races, and progress tracking.

---

##  Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" />
</p>

---

##  Features

-  **Customizable Typing Tests**  
  Practice by time, word count, or quotes with support for punctuation, numbers, and code syntax.

-  **Multiplayer Typing Races**  
  Compete with friends in real time using Firebase’s realtime updates.

-  **Progress Tracking & Analytics**  
  Track WPM, accuracy, error trends, and performance history with visual dashboards.

-  **Modern UI/UX**  
  Built with React and styled with Tailwind CSS. Includes dark/light theme support.

-  **Educational Mode**  
  Lessons and progressive modules to improve typing skills step by step.

-  **SEO-Friendly**  
  Built-in SEO handling for better search engine visibility.

-  **Google Analytics Integration**  
  Track user activity and engagement with a custom analytics hook.

## Run Instructions

### Prerequisites
Make sure to have the following installed:
- Node.js
- npm
- Firebase CLI
- Next.js

### Environment Setup
Create a `.env.local` file in the root directory with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

**To get your Firebase configuration values:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **gear icon** next to "Project Overview" in the left sidebar
4. Select **Project settings**
5. In General, Scroll down to **Your apps** section
6. Click on the **</>** Web app icon for LearnToType
7. Under **SDK setup and configuration**, select **Config**
8. Copy the values from the `firebaseConfig` object to your `.env.local` file

### Development Mode
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Firebase Emulators (Optional)
To test with Firebase emulators:
```bash
firebase emulators:start
```

### Deployment
To deploy new changes to Firebase Hosting:
```bash
npm run build
firebase deploy
```

---
