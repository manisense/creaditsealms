# Folder Structure Recommendation

To keep the system organized for both frontend and backend, use two distinct top-level folders within this repository: `frontend/` and `backend/`.

```
/frontend
  /src
    /app            # Next.js App Router pages (e.g. /login, /dashboard, /apply)
    /components     # Reusable UI components (Tailwind CSS styled)
    /lib            # Utility functions (API callers, formatters)
    /hooks          # Custom React hooks
    /store          # State management (Zustand/Context if needed)
  tailwind.config.ts
  package.json

/backend
  /src
    /controllers    # Request handlers parsing inputs and returning JSON
    /middlewares    # verifyToken, requireRole, multer (file upload)
    /models         # Mongoose schemas (User, Loan, Payment)
    /routes         # Express API route definitions
    /services       # Business logic (BRE Engine, Loan Math)
    /utils          # Helper functions (Hash passwords, etc.)
  /scripts
    seed.ts         # Script to generate Admin and Executive accounts
  .env
  package.json
```
