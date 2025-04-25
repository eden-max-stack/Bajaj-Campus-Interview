# Bajaj Campus Interview Portal 🏪🏥

An interactive doctor listing platform built for campus interviews and medical consultation simulations. This single-page React app demonstrates frontend routing, reusable components, and static deployment using GitHub Pages.

# Note !

This was made for the hiring process of Bajaj Finserv Summer Internship (Campus Placement) 2025.

## 🚀 Features

- 🧑‍⚕️ Doctor Listing UI
- 🗭 Navigation Bar
- ⚛️ Built with React + TypeScript + Vite
- 🌐 Deployed on GitHub Pages
- 🎯 Client-side routing with React Router

---

## 📦 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Routing**: `react-router-dom`
- **Styling**: Material UI
- **Deployment**: GitHub Pages via `gh-pages`

---

## 📁 Folder Structure (Client)

```
client/
├── public/
├── src/
│   ├── components/
│   │   └── NavBar.tsx
|   |   ├── FilterPanel.tsx
│   ├── DoctorListing.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── vite.config.ts
├── package.json
└── README.md
```

---

## 🛠️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/eden-max-stack/Bajaj-Campus-Interview.git
   cd Bajaj-Campus-Interview/client
   ```

2. **Install dependencies**
   ```bash
   npm i
   npm i axios react-router-dom @mui/material @emotion/react @emotion/styled
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

---

## 🔧 Deployment Notes

- Make sure `vite.config.ts` contains the correct base path:

  ```ts
  base: "/Bajaj-Campus-Interview/"
  ```

- And in `App.tsx`, wrap the router with:

  ```tsx
  <BrowserRouter basename="/Bajaj-Campus-Interview/">
  ```

---

## 🌐 Live Demo

👉 [https://eden-max-stack.github.io/Bajaj-Campus-Interview/](https://eden-max-stack.github.io/Bajaj-Campus-Interview/)

---

## 📄 License

MIT License. Feel free to fork, extend, and use.

---

## ✨ Credits

Made with ❤️ by [@eden-max-stack](https://github.com/eden-max-stack)

