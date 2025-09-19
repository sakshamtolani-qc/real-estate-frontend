Real Estate CRM Frontend Project Structure

Project Overview

This is a React.js + TypeScript + Tailwind CSS frontend application for the Real Estate CRM platform. The project is structured to allow 4 team members to work independently without conflicts.

Folder Structure

```
real-estate-frontend/
├── public/                     # Static files
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/             # Reusable components
│   │   ├── common/            # Common UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.css
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   ├── Form/
│   │   │   ├── Badge/
│   │   │   ├── Card/
│   │   │   ├── Loading/
│   │   │   └── index.ts       # Export all common components
│   │   ├── forms/             # Form-specific components
│   │   │   ├── LeadForm/
│   │   │   ├── PropertyForm/
│   │   │   ├── ClientForm/
│   │   │   └── index.ts
│   │   ├── layout/            # Layout components
│   │   │   ├── DashboardLayout/
│   │   │   ├── AuthLayout/
│   │   │   ├── CustomerLayout/
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   └── index.ts
│   │   └── ui/                # Complex UI components
│   │       ├── PropertyCard/
│   │       ├── DealPipeline/
│   │       ├── ActivityTimeline/
│   │       ├── Charts/
│   │       └── index.ts
│   ├── pages/                  # Page components (TEAM ASSIGNMENT AREA)
│   │   ├── auth/             
│   │   │   ├── login/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── LoginPage.css
│   │   │   ├── register/
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   └── RegisterPage.css
│   │   │   └── forgot-password/
│   │   │       ├── ForgotPasswordPage.tsx
│   │   │       └── ForgotPasswordPage.css
│   │   ├── dashboard/          
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Dashboard.css
│   │   │   └── components/     # Dashboard-specific components
│   │   │       ├── StatsCards/
│   │   │       ├── RecentActivities/
│   │   │       ├── PipelineChart/
│   │   │       └── QuickActions/
│   │   ├── leads/              
│   │   │   ├── LeadsPage.tsx
│   │   │   ├── LeadsPage.css
│   │   │   ├── lead-detail/
│   │   │   │   ├── LeadDetailPage.tsx
│   │   │   │   └── LeadDetailPage.css
│   │   │   └── components/
│   │   │       ├── LeadsList/
│   │   │       ├── LeadFilters/
│   │   │       └── LeadModal/
│   │   ├── properties/         
│   │   │   ├── PropertiesPage.tsx
│   │   │   ├── PropertiesPage.css
│   │   │   ├── property-detail/
│   │   │   │   ├── PropertyDetailPage.tsx
│   │   │   │   └── PropertyDetailPage.css
│   │   │   ├── add-property/
│   │   │   │   ├── AddPropertyPage.tsx
│   │   │   │   └── AddPropertyPage.css
│   │   │   └── components/
│   │   │       ├── PropertyGrid/
│   │   │       ├── PropertyFilters/
│   │   │       ├── PropertyModal/
│   │   │       └── PhotoUpload/
│   │   ├── clients/            # Additional pages to be assigned
│   │   │   ├── ClientsPage.tsx
│   │   │   ├── ClientsPage.css
│   │   │   └── client-detail/
│   │   ├── deals/
│   │   │   ├── DealsPage.tsx
│   │   │   ├── DealsPage.css
│   │   │   └── deal-detail/
│   │   ├── activities/
│   │   ├── invoices/
│   │   ├── transactions/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── profile/
│   │   ├── customer/           # Customer portal pages
│   │   │   ├── dashboard/
│   │   │   ├── properties/
│   │   │   ├── deals/
│   │   │   ├── invoices/
│   │   │   └── documents/
│   │   ├── home/               # Public pages
│   │   ├── properties-listing/
│   │   └── not-found/
│   ├── hooks/                  # Custom React hooks
│   │   ├── useApi.ts
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   ├── usePagination.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   ├── services/               # API services
│   │   ├── api.ts              # Base API configuration
│   │   ├── auth.service.ts
│   │   ├── leads.service.ts
│   │   ├── properties.service.ts
│   │   ├── clients.service.ts
│   │   ├── deals.service.ts
│   │   ├── invoices.service.ts
│   │   └── index.ts
│   ├── context/                # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   ├── formatters.ts       # Date, currency, text formatters
│   │   ├── validators.ts       # Form validation functions
│   │   ├── constants.ts        # App constants
│   │   ├── helpers.ts          # Helper functions
│   │   └── index.ts
│   ├── assets/                 # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx                 # Main App component
│   ├── index.tsx               # App entry point
│   └── index.css               # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.js
├── .prettierrc
└── README.md
```

Team Assignment Strategy

Core Principle: Isolated Development
Each team member works in their assigned folder with minimal conflicts.


**Folder:** `src/pages/auth/`
**Responsibilities:**
- Login page with form validation
- Registration page with customer signup
- Forgot password functionality
- User profile management
- Password reset flows

**Files to create:**
```
src/pages/auth/
├── login/
│   ├── LoginPage.tsx
│   ├── LoginPage.css
│   └── components/
├── register/
│   ├── RegisterPage.tsx
│   ├── RegisterPage.css
│   └── components/
└── forgot-password/
    ├── ForgotPasswordPage.tsx
    ├── ForgotPasswordPage.css
    └── components/
```

**Folder:** `src/pages/dashboard/`
**Responsibilities:**
- Admin/Agent dashboard with KPIs
- Charts and analytics
- Recent activities widget
- Quick actions panel
- Performance metrics

**Files to create:**
```
src/pages/dashboard/
├── Dashboard.tsx
├── Dashboard.css
└── components/
    ├── StatsCards/
    ├── RecentActivities/
    ├── PipelineChart/
    ├── QuickActions/
    └── PerformanceMetrics/
```

**Folder:** `src/pages/leads/`
**Responsibilities:**
- Leads listing with filters
- Lead detail page
- Lead creation and editing
- Lead assignment functionality
- Follow-up management

**Files to create:**
```
src/pages/leads/
├── LeadsPage.tsx
├── LeadsPage.css
├── lead-detail/
│   ├── LeadDetailPage.tsx
│   └── LeadDetailPage.css
└── components/
    ├── LeadsList/
    ├── LeadFilters/
    ├── LeadModal/
    ├── LeadForm/
    └── FollowUpManager/
```

**Folder:** `src/pages/properties/`
**Responsibilities:**
- Properties listing with advanced filters
- Property detail page with photo gallery
- Add/Edit property forms
- Property photo upload
- Property status management

**Files to create:**
```
src/pages/properties/
├── PropertiesPage.tsx
├── PropertiesPage.css
├── property-detail/
│   ├── PropertyDetailPage.tsx
│   └── PropertyDetailPage.css
├── add-property/
│   ├── AddPropertyPage.tsx
│   └── AddPropertyPage.css
└── components/
    ├── PropertyGrid/
    ├── PropertyFilters/
    ├── PropertyModal/
    ├── PhotoGallery/
    └── PropertyForm/
```

## Development Guidelines

### 1. Page Structure Convention
Each page should follow this structure:
```typescript
// PageName.tsx
import React from 'react';
import './PageName.css';

interface PageNameProps {
  // Props interface
}

const PageName: React.FC<PageNameProps> = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        {/* Page content */}
      </div>
    </div>
  );
};

export default PageName;
```

### 2. CSS Naming Convention
Use BEM methodology with your page prefix:
```css
/* LoginPage.css */
.login-page {
  /* Main container */
}

.login-page__form {
  /* Form container */
}

.login-page__input {
  /* Input fields */
}

.login-page__button {
  /* Buttons */
}
```

### 3. Component Folder Structure
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.css
├── index.ts           # Export file
└── types.ts          # Component-specific types
```

### 4. Import Order
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. External library imports
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';

// 3. Internal imports (using path aliases)
import { Button, Modal } from '@/components/common';
import { useAuth } from '@/hooks';
import { Lead } from '@/types';
import { leadsService } from '@/services';

// 4. Relative imports
import './ComponentName.css';
```

```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Available Scripts
```bash
npm run build          # Build for production
npm run test           # Run tests
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors
npm run format         # Format code with Prettier
npm run type-check     # TypeScript type checking
```

### 4. Team Member Setup
1. Clone the repository
2. Install dependencies
3. Create your assigned page folder
4. Follow the naming conventions
5. Use global CSS classes for consistency
6. Test your pages individually

### Technical Stack

- **React 18** with TypeScript
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **React Query** for API state management
- **React Hook Form** for form handling
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Date-fns** for date manipulation
- **Axios** for HTTP requests

## Responsive Design

All pages should be responsive and work on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)  
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

Use Tailwind's responsive prefixes:
```css
sm:   /* >= 640px */
md:   /* >= 768px */
lg:   /* >= 1024px */
xl:   /* >= 1280px */
2xl:  /* >= 1536px */
```


## License

This project is proprietary software for Real Estate CRM platform.

