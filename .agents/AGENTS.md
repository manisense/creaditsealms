# Project Context
This is a Loan Management System - a lending platform where borrowers apply for loans and internal executives manage those loans through their lifecycle.

# Core Rules
1. **Tech Stack**: Follow the specified tech stack strictly:
   - Frontend: Next.js (App Router), TypeScript, Tailwind CSS
   - Backend: Node.js, Express.js, TypeScript
   - Database: MongoDB via Mongoose
   - Auth: JWT + bcrypt
2. **Quality & Aesthetics**: The frontend MUST look visually stunning and premium. Use dark mode, glassmorphism, dynamic animations, and curated colors. Do not use generic, default, or simple designs.
3. **Role-Based Access Control (RBAC)**: Ensure backend API endpoints are fully protected, not just frontend components. Verify JWT and role via middleware. Return `403 Forbidden` for unauthorized roles.
4. **Business Rule Engine (BRE)**: The eligibility check MUST be run on the backend to avoid client-side tampering.
   - Reject if: Age < 23 or Age > 50
   - Reject if: Salary < 25000 / month
   - Reject if: PAN format is invalid
   - Reject if: Employment Mode is "Unemployed"
5. **Loan Math**: Use Simple Interest calculation on the server.
   `SI = (P × R × T) / (365 × 100)`
   `Total Repayment = P + SI`
6. **Seed Script**: Maintain a DB seed script for creating predefined roles for evaluators (Admin, Sales, Sanction, Disbursement, Collection).

# Important Project Files
Please refer to the following documentation before building features:
- `docs/DATABASE_SCHEMA.md` for MongoDB collections.
- `docs/API_DESIGN.md` for REST API endpoints.
- `docs/STATUS_TRANSITIONS.md` for loan lifecycle stages.
- `docs/ARCHITECTURE_AND_FOLDER_STRUCTURE.md` for file organization.

# AI Development & Quality Assurance Rules
To prevent hallucination, maintain bug-free code, and ensure production-readiness, ALL AI agents must strictly follow these rules:
1. **No Hallucination**: Do not assume the existence of files, variables, or API endpoints. ALWAYS use `view_file` or `grep_search` to verify code definitions, schema fields, and imports before writing or modifying code.
2. **Incremental Changes & Verification**: Write code in small, incremental steps. Immediately after modifying a file, verify the code is syntactically correct (e.g., run `npx tsc --noEmit` or ESLint).
3. **Rigorous Testing**: Before considering a feature complete, write and execute unit/integration tests for critical business logic (e.g., BRE logic, Loan Math, RBAC). Run the tests and ensure they pass.
4. **Edge-Case Handling & Production Readiness**: Always handle edge cases gracefully. Do not swallow errors; use proper error logging and return standardized JSON HTTP error responses to the client. Ensure no `.env` secrets are hardcoded.
5. **Code Integrity Checks**: Before submitting final code, ensure no unrelated comments or existing functional code were accidentally deleted or modified. Always double-check variable types in TypeScript.
