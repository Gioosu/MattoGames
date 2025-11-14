# 🎉 mattoGames

**mattoGames** is a multiplatform **Progressive Web App (PWA)** designed to spice up hangouts with friends through a collection of quick, intuitive, and fully offline **mini party games**.  
Built with **React** (powered by Vite), it runs smoothly on both mobile and desktop devices and can be installed like a native app on **iOS**, **Android**, and **desktop**, without needing any app store.

---

## 🚀 Features

- 🕹️ **Multiple mini-games** (Codenames-style, Werewolf-style, random wheels, quizzes, and more)  
- 📱 **Installable PWA** — works like a real app on any platform  
- 🌐 **Offline support** via service worker  
- ⚡ **Fast development** thanks to Vite  
- 🎨 **Modern responsive UI**, optionally with Tailwind CSS  
- 🧩 **Modular architecture** — each game is an independent module  
- 💡 **No Apple/Google developer accounts required**

---

## 🛠️ Tech Stack

- **React**  
- **Vite**  
- **JavaScript/TypeScript** (optional)  
- **Service Worker** + **Web App Manifest**  
- **Tailwind CSS** (optional)

---

## 📦 Project Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

📁 Project Structure
mattoGames/
│
├─ public/              # manifest.json, icons, static files
├─ src/
│  ├─ games/            # each mini-game in its own folder
│  ├─ components/       # shared UI components
│  ├─ hooks/            # custom hooks
│  ├─ pages/            # main screens
│  ├─ App.jsx           # root component
│  ├─ main.jsx          # entry point
│  └─ service-worker.js # offline handling
│
├─ package.json
├─ vite.config.js
└─ README.md

🎯 Goal of the Project

The goal is to create a single hub for group games, random generators, and interactive mini-activities to use during hangouts, parties, or events —
no internet required, no complicated setup, no app stores.

🗺️ Roadmap

 Add first mini-game module

 Create shared UI components

 Integrate service worker for offline mode

 Add installation prompts for iOS/Android

 Add light/dark theme support

 Add multiplayer local modes

 Add sound effects and animations
