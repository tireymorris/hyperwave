# hyperwave

A modern, full-stack web application framework combining the benefits of traditional server-rendered applications with the flexibility of modern development practices.

**🌐 [Live Demo](https://hyperwave-demo.fly.dev)** - Try it now to see hyperwave in action!

## 🌊 What is hyperwave?

hyperwave represents a return to **simplicity without sacrificing power**. In an era dominated by complex frontend frameworks and overwhelming toolchains, hyperwave offers a different approach:

### **🎯 Core Philosophy**

- **Server-First**: HTML is generated on the server and enhanced progressively
- **Minimal JavaScript**: HTMX provides rich interactions without React/Vue complexity
- **Type-Safe Everything**: Full TypeScript coverage from database to UI
- **Single Binary**: Deploy anywhere with zero dependencies
- **Developer Joy**: Hot reload, excellent DX, minimal configuration

### **🚀 Perfect For**

- **Rapid Prototyping**: Go from idea to working app in minutes
- **Production Apps**: Scales efficiently with built-in authentication and database
- **Teams**: Clean architecture that's easy to understand and maintain
- **Indie Hackers**: Everything you need in one lightweight package

### **💡 Why Not a SPA?**

While single-page applications have their place, they often introduce unnecessary complexity for most web applications. hyperwave delivers:

- **Faster Initial Loads**: Server-rendered HTML appears instantly
- **Better SEO**: Search engines index your content without gymnastics
- **Simpler Mental Model**: Request → Response → HTML (just like the web was designed)
- **Progressive Enhancement**: Add interactivity where it matters, not everywhere

## Getting started

Follow these steps to start developing with hyperwave:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/tireymorris/hyperwave.git
   cd hyperwave
   ```

2. **Install dependencies:**

   ```sh
   bun install
   ```

3. **Start the development server:**

   ```sh
   bun dev
   ```

4. **Visit the application:**
   - Open `http://localhost:3000` in your browser
   - Try the authentication flow with any email address
   - Check console logs for magic link URLs in development mode

## 🏛️ Architecture Overview

### **Authentication Flow**

```typescript
// Magic link authentication with JWT tokens
app.post('/auth/login', async (c) => {
  const { email } = await c.req.parseBody();

  // Create or find user in SQLite database
  const user = await authProvider.createUser(email);

  // Generate magic link token
  const token = await generateToken({ type: 'magic', email, role: 'user' });

  // Send beautiful email with magic link
  await sendMagicLink(email);

  return c.html(<CheckEmailPage email={email} />);
});
```

### **Database Integration**

```typescript
// High-performance SQLite with Bun
import { Database } from "bun:sqlite";

const db = new Database("app.db");
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Auto-cleanup expired tokens
setInterval(
  () => {
    db.query("DELETE FROM tokens WHERE expires_at < ?").run(Date.now());
  },
  15 * 60 * 1000,
);
```

### **Theming with UnoCSS**

hyperwave uses a sophisticated theming system built on UnoCSS with custom design tokens:

```typescript
// Custom theme configuration in src/styles/uno.config.ts
export default defineConfig({
  theme: {
    colors: {
      // App backgrounds - Terminal-inspired dark theme
      "app-background": "#0c0a14", // Primary dark background
      "app-background-alt": "#161421", // Slightly lighter surfaces
      "app-surface": "#2a2735", // Interactive surfaces

      // Text hierarchy
      "text-primary": "#fafafa", // Main text
      "text-secondary": "#e5e5e5", // Secondary text
      "text-tertiary": "#a3a3a3", // Muted text

      // Interactive elements - Purple accent system
      "interactive-primary": "#8b5cf6", // Primary buttons/links
      "border-primary": "#8b5cf6", // Focus states

      // Status colors
      "status-success": "#34d399", // Success states
      "status-error": "#f87171", // Error states
      "status-warning": "#fbbf24", // Warning states
    },
  },
});
```

**Using the theme:**

```typescript
// Components automatically use theme variables
<button class="bg-interactive-primary hover:bg-interactive-primary-hover text-text-primary">
  Sign In
</button>

// CSS variables are available in custom styles
.custom-element {
  background: var(--un-bg-app-background);
  border: 1px solid var(--un-border-primary);
}
```

**HTMX Integration:**

```typescript
// Special variants for HTMX states
<div class="htmx-request:opacity-50 htmx-settling:scale-105">
  Content that dims during requests and scales during settling
</div>
```

### **Middleware Pipeline**

```typescript
// Comprehensive middleware stack
app.use("*", errorHandler); // Global error handling
app.use("*", logger); // Request/response logging
app.use("/dashboard/*", requireAuth); // Protected routes
app.use("/api/*", requireAuth); // API authentication
```

## 🧪 Testing

Run the comprehensive test suite:

```sh
# Run all tests
bun test

# Type checking
bun run typecheck

# Linting
bun run lint

# Pre-commit checks
bun run precommit
```

## 🚀 Deployment

Build a production executable:

```sh
bun run build
```

The build process:

1. **CSS Generation**: UnoCSS processes and optimizes styles
2. **Binary Compilation**: Creates a single executable file
3. **Asset Bundling**: Includes all necessary static files

Deploy the `server` binary and `public/` directory to any platform.

## 🔧 Environment Configuration

Create a `.env` file for local development:

```env
# App Configuration
APP_NAME="hyperwave"
HOST="http://localhost:3000"
PORT=3000

# Email Configuration (Production)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
```

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── auth/           # Authentication system
│   │   ├── tokens.ts   # JWT token management
│   │   ├── magic.ts    # Magic link functionality
│   │   └── session.ts  # Session management
│   ├── providers/      # Service providers
│   │   ├── auth.ts     # SQLite auth provider
│   │   └── email.ts    # Email service provider
│   └── database.ts     # SQLite database management
├── routers/
│   ├── auth.tsx        # Authentication routes
│   ├── dashboard.tsx   # Main application
│   ├── profile.tsx     # User profile management
│   └── settings.tsx    # Application settings
├── middleware/
│   ├── requireAuth.ts  # Authentication middleware
│   ├── logger.ts       # Request logging
│   └── error-handler.ts# Global error handling
├── components/         # Reusable UI components
├── styles/
│   └── uno.config.ts   # UnoCSS theme configuration
├── utils/             # Utility functions
└── __tests__/         # Test suites

public/styles/
├── app.css            # Global base styles
├── modal.css          # Modal-specific styles
└── uno.css            # Generated UnoCSS utilities
```

## 🛠️ Technology Stack

### **Core Framework**

- **[Bun](https://bun.sh/)** - Runtime, bundler, test runner, and package manager
- **[Hono](https://hono.dev)** - Fast, lightweight web framework
- **[SQLite](https://bun.sh/docs/api/sqlite)** - Built-in database with excellent performance

### **Authentication & Security**

- **[jose](https://github.com/panva/jose)** - JWT token generation and verification
- **[zod](https://zod.dev/)** - Runtime type validation and schema parsing
- **Magic Links** - Passwordless authentication system

### **Frontend & Styling**

- **[HTMX](https://htmx.org/)** - Dynamic interactions without JavaScript complexity
- **[UnoCSS](https://unocss.dev/)** - Atomic CSS engine with Tailwind compatibility
  - **Custom Theme**: Terminal-inspired dark theme with purple accents
  - **Design Tokens**: Comprehensive color system and spacing
  - **HTMX Variants**: Special CSS states for loading/settling animations
  - **Web Fonts**: Google Fonts integration (Inter + Fira Code/JetBrains Mono)
- **[Hyperscript](https://hyperscript.org/)** - Lightweight scripting for enhanced UX

### **Development & Quality**

- **TypeScript** - Full type safety with strict configuration
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Bun Test** - Fast, built-in testing framework

## 🎯 Key Benefits

### **Performance**

- **Server-Side Rendering**: Fast initial page loads
- **Minimal JavaScript**: HTMX eliminates most client-side complexity
- **SQLite**: Single-file database with excellent performance
- **Optimized Builds**: UnoCSS generates only used styles

### **Developer Experience**

- **Hot Reload**: Instant feedback during development
- **Type Safety**: Comprehensive TypeScript coverage
- **Testing**: Built-in test runner with good coverage
- **Single Binary**: Deploy anywhere with zero dependencies

### **Security**

- **Magic Links**: Eliminate password-related vulnerabilities
- **JWT Tokens**: Stateless authentication with proper expiration
- **CSRF Protection**: Built-in request validation
- **SQL Injection**: Parameterized queries prevent attacks

### **Scalability**

- **Modular Architecture**: Easy to extend and maintain
- **Provider Pattern**: Swappable authentication and email providers
- **Middleware System**: Clean separation of concerns
- **Database**: SQLite scales to millions of rows efficiently

---

## 📝 Example Usage

### **Protected Route**

```typescript
// Automatic authentication check
app.get('/dashboard', requireAuth, async (c) => {
  const user = c.get('user'); // Injected by middleware

  return c.html(
    <DashboardLayout user={user}>
      <UserStats userId={user.id} />
      <RecentActivity />
    </DashboardLayout>
  );
});
```

### **Themed Component**

```typescript
// Using the custom theme system
function StatusCard({ type, message }: { type: 'success' | 'error' | 'warning', message: string }) {
  const styles = {
    success: 'bg-status-success text-text-inverse',
    error: 'bg-status-error text-text-inverse',
    warning: 'bg-status-warning text-text-inverse'
  };

  return (
    <div class={`p-4 rounded-lg border border-border-subtle ${styles[type]}`}>
      <p class="font-mono text-sm">{message}</p>
    </div>
  );
}
```

### **Database Operations**

```typescript
// Type-safe database operations
const stats = getDatabaseStats();
console.log(`Users: ${stats.userCount}, Tokens: ${stats.tokenCount}`);

// Clean up expired tokens
const deletedCount = cleanupExpiredTokens();
console.log(`Cleaned up ${deletedCount} expired tokens`);
```

### **Interactive Component with HTMX**

```typescript
// Server-rendered components with HTMX enhancements
function UserProfile({ user }: { user: User }) {
  return (
    <div class="bg-app-surface p-6 rounded-lg border border-border-primary transition-all duration-300 hover:border-border-primary-hover">
      <h2 class="text-text-primary font-primary text-xl">{user.email}</h2>
      <p class="text-text-secondary">Member since {user.createdAt.toLocaleDateString()}</p>
      <button
        hx-delete={`/api/users/${user.id}`}
        hx-confirm="Are you sure?"
        class="mt-4 bg-interactive-danger hover:bg-interactive-danger-hover text-text-primary px-4 py-2 rounded htmx-request:opacity-50"
      >
        Delete Account
      </button>
    </div>
  );
}
```

---

This modern hyperwave setup provides everything needed for building secure, performant web applications with minimal complexity and maximum developer productivity.
