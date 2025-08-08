# FreshMart - Modern Grocery Delivery App

A production-ready grocery delivery application inspired by Milk Basket, built with React 18, TypeScript, and modern web technologies. FreshMart provides a seamless shopping experience for fresh groceries, dairy products, and daily essentials with features like 30-minute delivery, subscription management, and real-time order tracking.

![FreshMart Banner](https://via.placeholder.com/1200x400/22c55e/ffffff?text=FreshMart+-+Fresh+Groceries+Delivered+Daily)

## 🚀 Live Demo

- **Preview**: [View Live App](#open-preview)
- **Development Server**: Running on port 8080

## ✨ Features

### 🛒 **Core Shopping Experience**

- **Product Catalog**: Browse fresh produce, dairy, bakery items, and household essentials
- **Smart Categories**: Organized product categories with visual icons and quick navigation
- **Interactive Cart**: Add/remove items with quantity controls and real-time counter
- **Wishlist**: Save favorite products for later purchase
- **Product Search**: Find products quickly with integrated search functionality

### 🚚 **Delivery & Subscriptions**

- **30-Minute Delivery**: Lightning-fast delivery for urgent grocery needs
- **Subscription Management**: Set up recurring deliveries for regular items
- **Free Delivery**: No charges on orders above ₹299
- **Real-time Tracking**: Track your delivery status in real-time

### 🎨 **Modern UI/UX**

- **Mobile-First Design**: Responsive across all devices (mobile, tablet, desktop)
- **Fresh Branding**: Green-themed design representing freshness and sustainability
- **Smooth Animations**: Micro-interactions and hover effects for enhanced UX
- **Accessibility**: WCAG-compliant design with proper contrast and navigation

### 🔐 **User Management**

- **Profile Management**: Customer profiles with multiple delivery addresses
- **Order History**: Track past orders and reorder favorites
- **Rating System**: Rate products and delivery experience
- **Customer Support**: In-app support for queries and issues

## 🏗 Architecture Overview

### **Frontend Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React SPA)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Pages     │ │ Components  │ │   Hooks     │           │
│  │             │ │             │ │             │           │
│  │ • Index     │ │ • UI Lib    │ │ • useToast  │           │
│  │ • Products  │ │ • Cards     │ │ • useMobile │           │
│  │ • Categories│ │ • Forms     │ │ • Custom    │           │
│  │ • Auth      │ │ • Navigation│ │   Hooks     │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│              Routing (React Router 6 SPA)                   │
├─────────────────────────────────────────────────────────────┤
│         State Management (React Query + Local State)        │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Express.js API Server                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Routes    │ │ Middleware  │ │  Services   │           │
│  │             │ │             │ │             │           │
│  │ • /api/demo │ │ • CORS      │ │ • Auth      │           │
│  │ • /api/ping │ │ • Express   │ │ • Products  │           │
│  │ • Products  │ │ • Validation│ │ • Orders    │           │
│  │ • Orders    │ │ • Error     │ │ • Delivery  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│              Shared Types & Interfaces                      │
│           (TypeScript Definitions)                          │
└─────────────────────────────────────────────────────────────┘
```

### **Tech Stack**

| Layer          | Technology               | Purpose                                   |
| -------------- | ------------------------ | ----------------------------------------- |
| **Frontend**   | React 18 + TypeScript    | UI components and type safety             |
| **Routing**    | React Router 6 (SPA)     | Client-side navigation                    |
| **Styling**    | TailwindCSS 3 + Radix UI | Utility-first CSS + accessible components |
| **State**      | React Query + useState   | Server state + local state management     |
| **Backend**    | Express.js + TypeScript  | RESTful API server                        |
| **Build**      | Vite                     | Fast development and optimized builds     |
| **Testing**    | Vitest                   | Unit and integration testing              |
| **Validation** | Zod                      | Runtime type validation                   |

## 📁 Project Structure

```
freshmart/
├── client/                    # React frontend application
│   ├── components/           # Reusable UI components
│   │   └── ui/              # Radix UI component library
│   │       ├── button.tsx   # Button variations
│   │       ├── card.tsx     # Product cards
│   │       ├── input.tsx    # Form inputs
│   │       └── ...          # Other UI components
│   ├── hooks/               # Custom React hooks
│   │   ├── use-toast.ts     # Toast notifications
│   │   └── use-mobile.tsx   # Mobile detection
│   ├── lib/                 # Utility functions
│   │   └── utils.ts         # Class name utilities (cn)
│   ├── pages/               # Route components
│   │   ├── Index.tsx        # Homepage (/)
│   │   ├── Categories.tsx   # Category listing (/categories)
│   │   ├── Products.tsx     # Product catalog (/products)
│   │   ├── Placeholder.tsx  # Generic placeholder component
│   │   └── NotFound.tsx     # 404 error page
│   ├── App.tsx              # Main app with routing setup
│   ├── global.css           # Global styles + CSS variables
│   └── vite-env.d.ts        # Vite type definitions
├── server/                   # Express backend application
│   ├── routes/              # API route handlers
│   │   └── demo.ts          # Example API endpoints
│   ├── index.ts             # Server configuration + routes
│   └── node-build.ts        # Production server entry
├── shared/                   # Shared TypeScript types
│   └── api.ts               # API interface definitions
├── public/                   # Static assets
│   ├── placeholder.svg      # Product placeholder images
│   └── robots.txt           # SEO robots file
├── netlify/                  # Netlify deployment config
│   ├── functions/           # Serverless functions
│   └── netlify.toml         # Netlify build settings
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # Project documentation
```

### **Key Architectural Decisions**

#### 1. **Single Page Application (SPA)**

- React Router 6 for client-side routing
- Faster navigation between pages
- Better user experience with smooth transitions

#### 2. **Component Architecture**

- **Atomic Design**: Small, reusable components
- **Separation of Concerns**: UI components separate from business logic
- **Composition**: Higher-order components built from smaller ones

#### 3. **State Management Strategy**

- **Server State**: React Query for API data caching and synchronization
- **Local State**: React useState/useReducer for component-specific state
- **Global State**: Context API for app-wide state (theme, user auth)

#### 4. **Styling Architecture**

- **TailwindCSS**: Utility-first CSS for rapid development
- **CSS Variables**: Theme customization via CSS custom properties
- **Component Variants**: Class Variance Authority for consistent styling
- **Design System**: Radix UI for accessible, unstyled components

#### 5. **Type Safety**

- **Full TypeScript**: Frontend, backend, and shared interfaces
- **Runtime Validation**: Zod schemas for API data validation
- **Shared Types**: Common interfaces between client and server

## 🎨 Design System

### **Color Palette**

```css
/* Fresh Green Theme */
:root {
  /* Primary Colors */
  --primary: 120 60% 40%; /* Fresh Green */
  --primary-foreground: 0 0% 100%; /* White */

  /* Secondary Colors */
  --secondary: 120 15% 95%; /* Light Green */
  --secondary-foreground: 120 60% 25%; /* Dark Green */

  /* Accent Colors */
  --accent: 120 25% 92%; /* Subtle Green */
  --accent-foreground: 120 60% 25%; /* Dark Green */

  /* Fresh Color Scale */
  --fresh-50: 120 70% 97%; /* Lightest */
  --fresh-500: 120 60% 40%; /* Primary */
  --fresh-900: 120 80% 15%; /* Darkest */
}
```

### **Typography Scale**

- **Headings**: Inter font family with weight variations
- **Body**: Optimized for readability across devices
- **Responsive**: Fluid typography scaling

### **Spacing System**

- **8px Grid**: Consistent spacing using 8px increments
- **Container**: Max-width containers for content alignment
- **Responsive**: Adaptive spacing for different screen sizes

## 📱 Responsive Design

### **Breakpoint Strategy**

```css
/* Mobile First Approach */
/* Default: 320px+ (Mobile) */
.grid-cols-1             /* Single column on mobile */

/* sm: 640px+ (Large Mobile/Small Tablet) */
.sm:grid-cols-2          /* Two columns on small tablets */

/* md: 768px+ (Tablet) */
.md:grid-cols-3          /* Three columns on tablets */
.md:flex-row             /* Horizontal layout on tablets */

/* lg: 1024px+ (Desktop) */
.lg:grid-cols-4          /* Four columns on desktop */
.lg:grid-cols-6          /* Six columns for categories */

/* xl: 1280px+ (Large Desktop) */
.xl:container            /* Constrained width on large screens */
```

### **Mobile Optimization**

#### **Touch-Friendly Design**

- **44px minimum** touch targets for buttons
- **Adequate spacing** between interactive elements
- **Swipe gestures** for product carousels

#### **Performance Optimizations**

- **Lazy loading** for product images
- **Virtual scrolling** for large product lists
- **Optimized bundle size** with code splitting

#### **Mobile-Specific Features**

- **Pull-to-refresh** for product updates
- **Infinite scroll** for category browsing
- **Native-like transitions** between screens

## 🛠 Development Workflow

### **Getting Started**

```bash
# Install dependencies
npm install

# Start development server (client + server)
npm run dev

# Open in browser
# Client: http://localhost:8080
# API: http://localhost:8080/api
```

### **Available Scripts**

```bash
# Development
npm run dev           # Start dev server with hot reload

# Building
npm run build         # Build for production
npm run build:client  # Build client only
npm run build:server  # Build server only

# Production
npm start            # Start production server

# Testing
npm test             # Run test suite
npm run typecheck    # TypeScript validation

# Code Quality
npm run format.fix   # Format code with Prettier
```

### **Development Features**

- **Hot Module Replacement (HMR)**: Instant updates during development
- **TypeScript**: Real-time type checking
- **Auto-formatting**: Prettier integration
- **Path Aliases**: Clean imports with `@/` and `@shared/`

## 🔌 API Integration

### **Shared Type Safety**

```typescript
// shared/api.ts
export interface ProductResponse {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

// client/pages/Products.tsx
import { ProductResponse } from '@shared/api';

const fetchProducts = async (): Promise<ProductResponse[]> => {
  const response = await fetch('/api/products');
  return response.json();
};

// server/routes/products.ts
import { ProductResponse } from '@shared/api';

export const getProducts: RequestHandler = (req, res) => {
  const products: ProductResponse[] = [...];
  res.json(products);
};
```

### **API Endpoints**

| Endpoint          | Method | Description      |
| ----------------- | ------ | ---------------- |
| `/api/ping`       | GET    | Health check     |
| `/api/demo`       | GET    | Demo data        |
| `/api/products`   | GET    | Product listing  |
| `/api/categories` | GET    | Category listing |
| `/api/cart`       | POST   | Add to cart      |
| `/api/orders`     | POST   | Place order      |

## 🚀 Deployment

### **Netlify Deployment (Recommended)**

The project is pre-configured for Netlify deployment:

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist/spa`
3. **Environment Variables**: Set up any required environment variables
4. **Deploy**: Automatic deployments on git push

### **Build Configuration**

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist/spa"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Alternative Deployment Options**

- **Vercel**: Zero-config deployment with automatic optimizations
- **Railway**: Full-stack deployment with database support
- **DigitalOcean App Platform**: Scalable container deployment
- **Self-hosted**: Docker container with nginx

## 🔧 Configuration

### **Environment Variables**

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8080
VITE_STRIPE_PUBLIC_KEY=pk_test_...
NODE_ENV=development
PORT=8080
```

### **Customization**

#### **Theme Customization**

```css
/* client/global.css */
:root {
  --primary: 200 100% 50%; /* Change primary color */
  --radius: 0.75rem; /* Adjust border radius */
}
```

#### **Adding New Routes**

```typescript
// client/App.tsx
<Route path="/checkout" element={<Checkout />} />
```

#### **Creating API Endpoints**

```typescript
// server/routes/newEndpoint.ts
export const handleNewEndpoint: RequestHandler = (req, res) => {
  res.json({ message: "New endpoint" });
};

// server/index.ts
app.get("/api/new-endpoint", handleNewEndpoint);
```

## 🧪 Testing Strategy

### **Testing Pyramid**

```
    ┌─────────────────┐
    │   E2E Tests     │  ← Integration tests with real workflows
    │   (Playwright)  │
    ├─────────────────┤
    │ Component Tests │  ← UI component testing
    │    (Vitest)     │
    ├─────────────────┤
    │   Unit Tests    │  ← Business logic and utilities
    │   (Vitest)      │
    └─────────────────┘
```

### **Test Examples**

```typescript
// client/lib/utils.spec.ts
import { cn } from "./utils";

describe("cn utility", () => {
  it("combines class names correctly", () => {
    expect(cn("base", "additional")).toBe("base additional");
  });
});
```

## 🔍 Performance Optimization

### **Core Web Vitals**

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### **Optimization Techniques**

1. **Code Splitting**: Route-based lazy loading
2. **Image Optimization**: WebP format with fallbacks
3. **Bundle Analysis**: webpack-bundle-analyzer for size monitoring
4. **Caching Strategy**: Service worker for offline support
5. **CDN**: Static asset delivery via CDN

## 📊 Analytics & Monitoring

### **Performance Monitoring**

- **Web Vitals**: Real user monitoring
- **Error Tracking**: Sentry integration ready
- **Analytics**: Google Analytics 4 ready

### **Development Metrics**

- **Bundle Size**: Tracked in CI/CD
- **Type Coverage**: TypeScript strict mode
- **Test Coverage**: Jest coverage reports

## 🤝 Contributing

### **Development Guidelines**

1. **Code Style**: Prettier + ESLint configuration
2. **Commit Convention**: Conventional commits
3. **Branch Strategy**: Feature branches with PR reviews
4. **Documentation**: Update README for new features

### **Adding Features**

1. **Plan**: Create GitHub issue with feature description
2. **Design**: Create component mockups if needed
3. **Implement**: Follow existing patterns and conventions
4. **Test**: Add appropriate test coverage
5. **Document**: Update README and code comments

## 📚 Additional Resources

### **Documentation**

- [React Documentation](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [React Router](https://reactrouter.com/)

### **Design Resources**

- [Figma Design System](https://www.figma.com/community/plugin/747985167520967365)
- [Component Storybook](#) (Coming Soon)
- [Design Tokens Export](#) (Coming Soon)

### **Community**

- [GitHub Issues](https://github.com/your-username/freshmart/issues)
- [Discord Community](#) (Coming Soon)
- [Contributors Guide](#) (Coming Soon)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for fresh grocery delivery experiences**

_FreshMart - Bringing farm-fresh groceries to your doorstep in 30 minutes or less._
