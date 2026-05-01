$ErrorActionPreference = "Continue"

git add package.json package-lock.json .gitignore AGENTS.md
git commit -m "chore: Initialize project root configurations"

git add server/package.json server/package-lock.json server/.env.example server/src/index.js server/src/app.js server/eslint.config.js
git commit -m "feat(server): Add Express application setup and entry points"

git add server/src/models
git commit -m "feat(server): Define Mongoose database models"

git add server/src/controllers
git commit -m "feat(server): Implement API controllers"

git add server/src/routes
git commit -m "feat(server): Setup Express API routing"

git add server/src/middleware server/src/utils
git commit -m "feat(server): Add utility functions and middleware"

git add server/
git commit -m "feat(server): Add remaining server services and configurations"

git add client/package.json client/package-lock.json client/vite.config.js client/tailwind.config.js client/postcss.config.js client/jsconfig.json client/eslint.config.js
git commit -m "chore(client): Initialize Vite React app configurations"

git add client/index.html client/src/main.jsx client/src/App.jsx client/src/index.css client/src/assets
git commit -m "feat(client): Add React application entry points and assets"

git add client/src/store
git commit -m "feat(client): Setup Redux store and slices"

git add client/src/components/ui
git commit -m "feat(client): Implement reusable UI components"

git add client/src/components/layout
git commit -m "feat(client): Add layout components and navigation"

git add client/src/components
git commit -m "feat(client): Implement shared and feature-specific components"

git add client/src/pages/auth client/src/pages/ProfilePage.jsx
git commit -m "feat(client): Add authentication and user profile pages"

git add client/src/pages/courses client/src/pages/instructor
git commit -m "feat(client): Implement course catalog and instructor studio pages"

git add client/src/pages client/src/utils
git commit -m "feat(client): Add remaining pages and frontend utilities"

git add client/
git commit -m "feat(client): Add any remaining frontend files"

git add .github/
git commit -m "ci: Setup GitHub Actions workflows"

git add .
git commit -m "chore: Add remaining files and assets"

git push -u origin main
