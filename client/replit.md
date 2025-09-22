Portfolio Alegria - Personal Portfolio Application
Overview
This is a modern personal portfolio application built for a Formation Alegria candidacy. The project is designed as a professional showcase featuring a hero section, about section, projects gallery, skills visualization, and contact form. The application uses a full-stack architecture with React frontend and Express backend, styled with Tailwind CSS and shadcn/ui components.

User Preferences
Preferred communication style: Simple, everyday language.

System Architecture
Frontend Architecture
Framework: React 18 with TypeScript for type safety and modern development experience
Build Tool: Vite for fast development server and optimized production builds
Routing: Wouter for lightweight client-side routing
State Management: TanStack Query for server state management and data fetching
UI Framework: Tailwind CSS with shadcn/ui component library for consistent, accessible design
Form Management: React Hook Form with Zod validation for robust form handling
Styling Approach: Design system based on Formation Alegria guidelines with sophisticated color palette (primary: dark blue-gray, secondary: off-white, accent: refined purple)
Backend Architecture
Runtime: Node.js with Express.js framework
Language: TypeScript for full-stack type safety
API Design: RESTful API with structured error handling and logging middleware
Data Validation: Zod schemas for runtime type checking and API validation
Storage Layer: Abstracted storage interface with in-memory implementation (ready for database integration)
Development: Hot module replacement with Vite integration for seamless full-stack development
Database Schema
ORM: Drizzle ORM configured for PostgreSQL
Tables:
Users table with UUID primary keys and authentication fields
Contact messages table for form submissions with validation
Migrations: Structured migration system with Drizzle Kit
Validation: Zod schemas derived from database schema for consistent validation
Component Architecture
Design System: Modular component library with consistent spacing (Tailwind 4,8,12,16 units)
Layout System: Responsive design with mobile-first approach and container max-width of 6xl
Section Components: Dedicated components for each portfolio section (Hero, About, Projects, Skills, Contact)
UI Components: Complete shadcn/ui component set with custom theming and dark mode support
Styling and Theming
Theme System: CSS custom properties with light/dark mode support
Typography: Inter for body text, Playfair Display for elegant headlines
Visual Hierarchy: 5-level heading system (48px/32px/24px/18px/16px)
Animations: Subtle hover effects, scale transforms, and smooth scroll behavior
Color System: HSL-based color palette with automatic border computation and elevation states
External Dependencies
Core Framework Dependencies
@tanstack/react-query: Server state management and caching
wouter: Lightweight React router
react-hook-form + @hookform/resolvers: Form management with validation
zod: Runtime schema validation
class-variance-authority + clsx: Utility-first styling with variant management
UI and Design Dependencies
@radix-ui/_: Complete set of unstyled, accessible UI primitives (accordion, dialog, dropdown, etc.)
tailwindcss: Utility-first CSS framework
lucide-react: Modern icon library
cmdk: Command palette functionality
embla-carousel-react: Carousel/slider component
Database and Backend Dependencies
drizzle-orm + drizzle-kit: Type-safe ORM with migration tooling
@neondatabase/serverless: Serverless PostgreSQL driver (configured but not actively used)
connect-pg-simple: PostgreSQL session store (configured for future authentication)
date-fns: Date utility library
Development and Build Tools
vite: Build tool and development server
typescript: Static type checking
@replit/vite-plugin-_: Replit-specific development enhancements
postcss + autoprefixer: CSS processing pipeline
Fonts and Assets
Google Fonts: Inter and Playfair Display via CDN
Generated Assets: Professional portrait and project mockup images stored in attached_assets directory
The application is configured to work seamlessly in the Replit environment with proper asset handling, hot module replacement, and environment-specific optimizations.
