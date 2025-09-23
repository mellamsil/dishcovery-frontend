# Dishcovery – Stage 1 (Frontend)

## Project Overview

Dishcovery is a custom frontend project built using React and Vite. Stage 1 focuses on implementing a responsive and interactive UI where users can explore recipes, manage their personal cookbook, and interact with recipe cards.
The application adapts to multiple screen resolutions and provides a clean, user-friendly interface.

## Features

- Responsive Design: Works across multiple screen sizes with no horizontal scrolling.
- User Authentication: Registration and login modals with form validation.
- Personal Cookbook: Users can add, view, and delete recipes.
- Interactive Modals: Modals for adding items, registering, logging in, and confirming deletion.
- Reusable Components: Recipe cards, buttons, forms, headers, and modals are reusable.
- Navigation: Multi-route support with working internal and external links.

## Technical Details

- Framework: React 15 (functional components)
- Bundler: Vite
- Styling: Component-level CSS using BEM methodology
- State Management: React useState, useEffect, and useRef hooks
- Routing: React Router for navigation
- Form Handling: Validation with inline error messages and loading states
- Popups/Modals: Can be closed via cross button, overlay click, or ESC key

## API Integration (Mock)

- Data Source: Mock data for recipes and user information
- API Requests: Handled via Fetch API in utils/api.js
- Promises: Each request chain ends with a .then() for success and .catch() for errors
- Error Handling: User-friendly messages are displayed for API errors
- Configuration: Hard-coded constants stored in a separate configuration file
  Note: The mock API simulates asynchronous calls to demonstrate fetching and displaying data.

## Deployment

- Stage 1 Frontend Deployment: GitHub Pages
- URL: [Your GitHub Pages URL]

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
