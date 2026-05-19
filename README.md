# EduMap

An interactive degree planning tool that helps students visualize and manage their academic path through a visual course mapping interface.

## Overview

EduMap is a full-stack web application designed to help students:
- Visualize their degree requirements using an interactive node-based course map
- Plan their academic schedule across terms
- Track majors, minors, specializations, and program options
- Save and manage their degree plans
- Authenticate with secure user sessions

The application features a modern React frontend with Tailwind CSS and an Express.js backend connected to Supabase for data persistence.

## Project Structure

```
Edumap/
├── edumap-frontend/          # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── Components/       # Reusable UI components
│   │   ├── Hooks/            # Custom React hooks (database calls, logic)
│   │   ├── PlanningPage/     # Course mapping and planning interface
│   │   ├── LandingPage/      # Landing and authentication page
│   │   ├── Authentication/   # Supabase auth setup and logic
│   │   ├── config/           # API configuration
│   │   └── Requirements/     # Degree requirements data
│   ├── vite.config.ts        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── package.json
│
├── edumap-backend/           # Express.js + TypeScript backend
│   ├── src/
│   │   ├── routes/           # API endpoint routes
│   │   ├── controllers/      # Business logic for each entity
│   │   ├── middleware/       # Authentication and CORS middleware
│   │   ├── database/         # Supabase client configuration
│   │   ├── config/           # Config files
│   │   ├── scripts/          # Database seeding scripts
│   │   ├── server.ts         # Express app setup
│   │   └── handler.ts        # Entry point for handlers
│   ├── api/
│   │   └── index.ts          # Vercel serverless function entry
│   ├── data/                 # JSON data for courses, programs, terms
│   ├── vercel.json           # Vercel deployment configuration
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md       # Detailed Vercel deployment instructions
└── README.md                 # This file
```

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **@xyflow/react** - React Flow for interactive node-based mapping
- **Supabase JS Client** - Authentication and real-time database access

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Supabase** - Backend-as-a-Service (authentication, database)
- **Vercel** - Deployment platform (serverless functions)

### Database
- **Supabase** - PostgreSQL database with authentication, real-time updates, and REST API

## Getting Started Locally

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Edumap
   ```

2. **Setup Backend**
   ```bash
   cd edumap-backend
   npm install
   ```
   Create a `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key
   NODE_ENV=development
   ```

3. **Setup Frontend**
   ```bash
   cd ../edumap-frontend
   npm install
   ```
   Create a `.env.local` file:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=http://localhost:3001
   ```

### Running the Application

From the root directory, or in separate terminals:

**Backend:**
```bash
cd edumap-backend
npm run dev
```
Backend runs on `http://localhost:3001`

**Frontend:**
```bash
cd edumap-frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

Visit `http://localhost:5173` in your browser to access the application.

### Database Seeding

To populate the database with initial data (courses, programs, terms, etc.):

```bash
cd edumap-backend
npm run seed
```

## API Endpoints

The backend exposes the following main API routes:

- **Courses**: `/api/courses` - Get available courses
- **Programs**: `/api/programs` - Get degree programs
- **Terms**: `/api/terms` - Get academic terms
- **Users**: `/api/users` - User profile and data management
- **Minors**: `/api/minors` - Minor specialization data
- **Options**: `/api/options` - Program options/tracks
- **Specializations**: `/api/specializations` - Specialization data

All routes require authentication via Supabase JWT tokens (except public endpoints).

## Key Features

### Frontend Features
- **Interactive Course Map** - Visual representation of degree requirements using React Flow
- **Course Search** - Search and filter courses
- **Term Planning** - Organize courses by academic term
- **Degree Planning** - Select majors, minors, and specializations
- **Authentication** - Secure login via Supabase
- **Dark Mode** - Theme toggle for UI
- **Responsive Design** - Mobile-friendly interface

### Backend Features
- **REST API** - RESTful endpoints for all application data
- **Authentication Middleware** - JWT token validation
- **CORS Configuration** - Secure cross-origin requests
- **Database Integration** - Supabase for persistent storage
- **Error Handling** - Comprehensive error responses
- **Serverless Deployment** - Vercel serverless functions support

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=              # Your Supabase project URL
SUPABASE_ANON_KEY=         # Public anonymous key for client
SUPABASE_SERVICE_KEY=      # Service key for admin operations
NODE_ENV=development       # Environment (development/production)
```

### Frontend (.env.local or .env.production)
```
VITE_SUPABASE_URL=         # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=    # Public anonymous key
VITE_API_URL=              # Backend API URL (localhost or production)
```

## Deployment

### Vercel Deployment

This project is configured for deployment on Vercel. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions.

**Quick Summary:**
1. Deploy backend from `edumap-backend/` folder to Vercel
2. Update frontend `.env.production` with backend URL
3. Deploy frontend from `edumap-frontend/` folder to Vercel

**Current Deployments:**
- Frontend: https://edumap-vyi.vercel.app
- Backend: https://edumap-backend.vercel.app

## Available Scripts

### Backend
```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm run seed     # Seed database with initial data
npm start        # Run compiled application
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Development Notes

### Authentication Flow
1. User logs in via Supabase OAuth
2. Supabase returns JWT token
3. Token stored in user's browser session
4. Frontend sends token in Authorization header for API requests
5. Backend middleware validates token
6. Request processed with user context

### Database Architecture
- **Courses Table** - Course metadata and requirements
- **Programs Table** - Degree programs (majors, minors, etc.)
- **Terms Table** - Academic terms
- **User Plans** - Saved degree plans per user
- **Requirements** - Program-specific requirements

### Styling Approach
- **Tailwind CSS** for utility-first styling
- **PostCSS** for CSS processing
- **Module-based CSS** for component-specific styles where needed
- **Dark mode** support with theme toggle

## Contributing

When working on this project:
1. Create a feature branch from `main`
2. Make your changes with appropriate commits
3. Test locally before pushing
4. Submit a pull request with description
