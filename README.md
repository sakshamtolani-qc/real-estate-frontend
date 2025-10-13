# Real Estate CRM - Frontend Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16.0.0 or higher
- **npm** v7.0.0 or higher
- **Git** (for version control)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd real-estate-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_API_TIMEOUT=30000
```

4. **Start development server**
```bash
npm start
```

The application will open at `http://localhost:3000`

---

## 📁 Project Structure

```
real-estate-frontend/
├── public/                 # Static files (images, icons, etc.)
├── src/
│   ├── components/        # Reusable components
│   │   ├── common/       # Common UI components (Header, Footer, Loader, etc.)
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Landing/      # Public landing page
│   │   ├── auth/         # Login, Signup pages
│   │   ├── Admin/        # Admin dashboard, leads, properties
│   │   ├── Agent/        # Agent dashboard and features
│   │   ├── Properties/   # Property listing and details
│   │   └── PropertyDetail/
│   ├── context/          # React Context (Auth, etc.)
│   ├── services/         # API services
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main app component
├── .env                   # Environment variables
└── package.json
```

---

## 🛠️ Available Scripts

### Development
```bash
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests
npm run eject          # Eject from Create React App (irreversible)
```

---

## 🔧 Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Lucide React** - Icons
- **CSS Modules** - Styling

---

## 🔐 Authentication

The app uses JWT-based authentication:

1. **Login/Signup** → Receives JWT tokens
2. **Tokens stored** in `localStorage`
3. **Auto-refresh** on token expiry
4. **Protected routes** require authentication

**User Roles:**
- **Admin** - Full access to dashboard, leads, properties, agents
- **Agent** - Access to assigned leads, properties
- **Customer** - View properties, contact inquiries

---

## 🎨 Features

### Public Pages
- **Landing Page** - Hero section, property types, featured properties
- **Properties Listing** - Browse all properties with filters
- **Property Details** - Detailed property view with image gallery
- **Contact Forms** - General inquiry, call scheduling, property inquiry

### Admin Dashboard
- **Dashboard** - Stats overview, recent activities
- **Leads Management** - Create, view, update, delete leads
- **Properties Management** - Add, edit, delete properties
- **Agent Management** - Manage staff members
- **Notifications** - Real-time notifications

### Agent Dashboard
- **Dashboard** - Assigned leads, scheduled visits
- **My Leads** - View and manage assigned leads
- **Properties** - View all properties
- **Visit Scheduling** - Schedule property visits

---

## 🌐 API Integration

Base API URL is configured via environment variable `REACT_APP_API_URL`

**API Services:**
- `api.ts` - Base Axios configuration
- Auto-includes JWT token in requests
- Handles token refresh
- Error handling and interceptors

---

## 🎯 Key Components

### Loaders
- **PageLoader** - Full-screen loading animation
- **ButtonLoader** - Button loading state
- **SearchLoader** - Search bar loading

### Header Components
- **Header** - Public header with navigation
- **AdminHeader** - Admin navigation and notifications
- **AgentHeader** - Agent navigation

### Common Components
- **Footer** - Site footer
- **ContactModal** - Contact form modal

---

## 📱 Responsive Design

All pages are fully responsive:
- **Desktop** - 1024px+
- **Tablet** - 768px - 1024px
- **Mobile** - 320px - 768px

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm start
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clear build cache
npm run build -- --reset-cache
```

---

## 🔄 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8000/api` |
| `REACT_APP_API_TIMEOUT` | API request timeout (ms) | `30000` |

---

## 📦 Deployment

### Production Build
```bash
npm run build
```

Build output will be in the `build/` directory.

### Deploy to Production
1. Build the project
2. Upload `build/` folder to your web server
3. Configure web server to serve `index.html` for all routes (SPA)

**Example nginx configuration:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 👥 Development Team

Each team member should:
1. Create feature branches
2. Follow naming conventions
3. Test locally before pushing
4. Create pull requests for review

---

## 📝 License

This project is proprietary software for the Real Estate CRM platform.

---

## 📞 Support

For issues or questions, contact the development team.
