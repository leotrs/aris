# Aris Frontend

This is the frontend for **Aris**, a web-native scientific publishing platform. Built
with **Vue 3** and the **Composition API**, it enables researchers to write, read, and
review manuscripts as responsive, interactive web documents.

## Tech Stack

- **Vue 3** – core framework
- **Vue Router** – client-side routing
- **@vueuse/core** – utilities for reactivity and responsiveness
- **Vite** – lightning-fast dev server and bundler
- **Axios** – API requests

## Features

- JWT-based login and token refresh
- Dynamic manuscript views with responsive layout
- Reponsive UI based on Tailwind breakpoints
- Soft-deleted resource handling
- Centralized file store abstraction (`FileStore.js`)

## Project Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run in development**

   ```bash
   npm run dev
   ```

3. **Build for production**

   ```bash
   npm run build
   ```

4. **Development Notes**

   + API instance is created and injected in App.vue and reused throughout.
   + Tokens are stored in localStorage and refreshed transparently.
   + Responsive design adapts to mobile via VueUse breakpoints.
