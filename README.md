# EduPulse

EduPulse is a comprehensive, production-ready Learning Management System (LMS) built with the MERN stack. It provides a highly interactive and engaging platform for students to learn, empowers educators to create and manage multimedia courses, and gives administrators full control over platform operations, revenue, and content moderation.

## Key Features

- **Immersive Student Experience:** Searchable course catalog, interactive video/article/quiz player, progress tracking, personal notes, and a gamified dashboard (XP, streaks, and achievements).
- **Instructor Course Studio:** A drag-and-drop curriculum builder, revenue analytics, enrollment monitoring, and a centralized Q&A dashboard for student engagement.
- **Administrative Control:** Complete oversight of user roles, course approvals, platform-wide order tracking, and a robust discount coupon generation system.
- **Secure Authentication:** Dual-token JWT system (Access and Refresh tokens) alongside Google OAuth 2.0 integration.
- **Reliable Payment Processing:** Stripe integration for secure checkout flows and automated webhook handling.

## Tech Stack

- **Language**: JavaScript (ES6+)
- **Frontend Framework**: React 18 (Vite)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS, Framer Motion
- **Backend Framework**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Passport.js, jsonwebtoken
- **Media Storage**: Cloudinary
- **Payment Gateway**: Stripe
- **Deployment**: Vercel (Client), Render/Railway (Server)

## Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account (or a local MongoDB instance)
- Cloudinary account for media storage
- Stripe Developer account for payment processing
- Google Cloud project for OAuth credentials

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Rishabhworkspace/Edupulse.git
cd edupulse
```

### 2. Install Dependencies

The project uses npm workspaces to manage both client and server dependencies from the root directory.

```bash
npm install
```

### 3. Environment Setup

Create an environment file for the backend server:

```bash
cp server/.env.example server/.env
```

Create an environment file for the frontend client:

```bash
cp client/.env.example client/.env
```

### 4. Database Setup

Ensure your MongoDB instance is running or your MongoDB Atlas cluster is accessible. The application will automatically connect and create collections upon startup. No manual migrations are required.

### 5. Start Development Server

Run the root workspace script to start both the frontend and backend servers concurrently:

```bash
npm run dev
```

- Client will run on `http://localhost:5173`
- Server will run on `http://localhost:5000`

## Architecture Overview

### Directory Structure

```text
├── client/                 # React frontend workspace
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Redux slices and API logic
│   │   ├── layouts/        # Global layout wrappers
│   │   ├── pages/          # Route components
│   │   ├── utils/          # Frontend helpers and hooks
│   │   └── App.jsx         # Main application router
│   ├── index.html          # Vite entry point
│   ├── tailwind.config.js  # Tailwind design system configuration
│   └── vite.config.js      # Vite bundler configuration
├── server/                 # Express backend workspace
│   ├── src/
│   │   ├── controllers/    # Route request handlers
│   │   ├── middleware/     # Auth, validation, and error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express router definitions
│   │   ├── services/       # Core business logic
│   │   ├── utils/          # Backend helpers (logger, token generation)
│   │   ├── app.js          # Express application configuration
│   │   └── index.js        # Server entry point
│   └── .env.example        # Required backend environment variables
├── package.json            # Root workspace configuration
└── .github/                # CI/CD pipelines
```

### Request Lifecycle

1. The client dispatches a Redux action or an Axios HTTP request.
2. The Axios interceptor attaches the current JWT Access Token to the `Authorization` header. If the token is expired, it silently fetches a new pair via the `/api/v1/auth/refresh` endpoint using the secure `HttpOnly` Refresh Token cookie.
3. The request hits the Express router and passes through global middleware (Helmet, CORS, Rate Limiter).
4. Route-specific middleware executes (Authentication verification, Role-based access control, express-validator schemas).
5. The Controller handles the request and delegates database operations to the corresponding Service layer.
6. The Service layer queries MongoDB via Mongoose and returns data to the Controller.
7. A JSON response is returned to the client, the Redux state updates, and the React UI re-renders.

### Key Components

**Authentication System**
- Dual-token architecture for enhanced security.
- Refresh tokens are stored in `HttpOnly`, `Secure`, `SameSite` cookies to prevent XSS attacks.
- Access tokens are stored in memory on the client.
- Google OAuth is integrated via Passport.js, bridging the gap between social logins and internal JWT sessions.

**Database Models**
- `User`: Handles authentication, gamification stats, and role-based access.
- `Course`: Contains curriculum references, pricing, and metadata.
- `Section` & `Lesson`: Hierarchical curriculum structures supporting video, article, and quiz types.
- `Order` & `Coupon`: Manages transaction states and discount calculations.

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment state | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/edupulse` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `JWT_ACCESS_SECRET` | Secret key for access tokens | `your-secure-random-string` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | `your-secure-random-string` |
| `STRIPE_SECRET_KEY` | Stripe API Secret Key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Signing Secret | `whsec_...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary instance name | `dxxxxxxxx` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `xxxxxxxxxxxxxxxxxxxx` |

### Client (`client/.env`)

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

## Available Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Starts both the client and server in development mode concurrently. |
| `npm run dev:server` | Starts only the Express backend server using nodemon. |
| `npm run dev:client` | Starts only the Vite frontend client. |
| `npm run build` | Builds the client application for production. |
| `npm run test` | Runs the test suites for both the client (Vitest) and server (Jest). |

## Testing

The project is equipped with automated testing for both the client and the server.

### Running Tests

```bash
# Run all tests
npm test

# Run server tests only
cd server
npm test

# Run client tests only
cd client
npm test
```

## Deployment

The application features an automated CI/CD pipeline defined in `.github/workflows/ci-cd.yml`. 

### Automated Frontend Deployment (Vercel)

1. Connect your GitHub repository to a new Vercel project.
2. In your GitHub repository settings, add the following secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Pushes to the `main` branch will automatically trigger linting, testing, and deployment to Vercel.

### Backend Deployment (Render or Railway)

1. Create a new Web Service on your hosting provider.
2. Set the Root Directory to `server`.
3. Set the Build Command to `npm install`.
4. Set the Start Command to `npm start`.
5. Populate the production environment variables, ensuring `CLIENT_URL` points to your deployed Vercel domain.

## Troubleshooting

### Infinite Loading in Course Player
**Issue:** The course player continuously shows a loading spinner or skeleton loader.
**Solution:** Ensure that your `server/.env` file contains valid Cloudinary credentials and that your IP address is whitelisted in MongoDB Atlas. Check the browser console for CORS errors, and verify that `CLIENT_URL` is correctly set in the backend environment variables.

### Authentication Failures
**Issue:** Cannot log in or register.
**Solution:** Verify that your `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are defined in `server/.env`. If you are testing locally, ensure you are accessing the frontend via `http://localhost:5173` rather than `127.0.0.1`, as cookie domains are strict.

### Database Connection Refused
**Issue:** The server crashes with a `MongooseServerSelectionError`.
**Solution:** Ensure MongoDB Atlas Network Access is set to allow your current IP address (or `0.0.0.0/0` for development). Verify the `MONGO_URI` is correctly formatted.

---
*Developed by Rishabh*
