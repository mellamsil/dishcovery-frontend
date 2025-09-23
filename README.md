# Dishcovery – Stage 1 (Frontend)

Dishcovery is a custom recipe and cookbook management application built with **React + Vite**.  
This repository contains the **Stage 1 (Frontend)** implementation, including UI, routing, mock API integration, and deployment.

## Project Overview

The project provides users with an interactive platform to register, sign in, and manage personal cookbooks. Users can add recipes, upload images, and view their personalized profile. The application is designed with responsive layouts to adapt across devices.

## Features

- **User Authentication (mock data for Stage 1)**  
  Register, sign in, and switch between modals.
- **Profile Sidebar**  
  Displays user avatar, name, and "My Cookbook".
- **Recipe Management**  
  Add, view, and manage recipes in a cookbook.
- **Reusable Components**  
  Built with modular React components (Header, Footer, Modals, SideBar, RecipeCard).
- **Routing**  
  Navigation between key pages (e.g., Home, Profile).
- **Responsive Design**  
  Optimized for multiple screen resolutions without horizontal scrolling.
- **Error Handling**  
  Form validation and user-friendly error messages.

## Technical Details

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/en/main)
- **Styling**: CSS with BEM methodology
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

**Folder Structure Highlights**:

- `src/components` → Reusable UI components
- `src/modals` → Register, Login, AddItem, DeleteConfirm, etc.
- `src/pages` → Main page components (e.g., Home, Profile)
- `src/utils/api.js` → API request handling (mocked for Stage 1)

## API Integration (Mock)

For Stage 1, API calls are mocked. A real backend (Express + MongoDB) will be connected in later stages.

- Endpoints:
  - `/signup` → Register new user
  - `/signin` → Log in
  - `/users/me` → Fetch current user

## Deployment

The frontend is deployed on **GitHub Pages**.

**Live Demo**: [Dishcovery Frontend](https://mellamsil.github.io/dishcovery-frontend/)

## Usage

1. Clone the repository:
2. git clone https://github.com/<mellamsil>/dishcovery-frontend.git
3. Install dependencies:
4. npm install
5. Run the project locally:
6. npm run dev
7. Build for production:
8. npm run build
9. Deploy to GitHub Pages:
10. npm run deploy

## Next Steps

Stage 2: Connect to backend API (Express + MongoDB).

Stage 3: Full-stack deployment on Google Cloud.
