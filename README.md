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

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/andreasparamo/capstone-project.git
   cd capstone-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory with your Firebase configuration:
   
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
   *(See Firebase Console > Project Settings > General > Your apps > Config to get these values)*

### Running Locally

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development Workflow

### Project Structure
- `src/app`: Next.js App Router pages and layouts
- `src/components`: Custom UI components
- `src/components/ui`: Reusable shadcn/aceternity components (e.g. Sparkles)
- `src/lib` / `lib`: Utility functions and Firebase configuration
- `public`: Static assets

### Styling & Components
This project uses **Tailwind CSS v3** and **shadcn/ui**.

- **Tailwind**: Use standard utility classes (e.g., `flex`, `p-4`).
- **Theme**: The app uses CSS variables for theming, mapped to Tailwind colors:
  - `bg-background`, `text-foreground`
  - `bg-accent`, `text-accent` (Devolver Red)
  - `border-border`
- **Adding Components**: To add a new shadcn component:
  ```bash
  npx shadcn@latest add [component-name]
  ```

### Deployment
Build for production:
```bash
npm run build
```
Deploy to Firebase:
```bash
firebase deploy
```

---
