# Loan Management System - Project Overview

This repository is designated for building a full-stack Loan Management System assignment.

## Objective
Build a lending platform where borrowers apply for loans and internal executives manage those loans through their lifecycle.

## Components
1. **Borrower Portal**: A multi-step application form ending with a loan request.
2. **Operations Dashboard**: Internal panel with 4 modules for different executive teams, guarded by role-based access control (RBAC).

## Setup & Rules
The AI agent rules and strict architectural guidelines have been configured for this project. When building, agents should refer to the following documentation located in the `docs/` folder:
- `DATABASE_SCHEMA.md`: MongoDB schema details.
- `API_DESIGN.md`: REST API specifications.
- `STATUS_TRANSITIONS.md`: Loan lifecycle and BRE logic.
- `ARCHITECTURE_AND_FOLDER_STRUCTURE.md`: Recommended folder structure.
- `.agents/AGENTS.md`: Global constraints (Tech stack, RBAC rules, UI expectations).

## Seed Script
The backend must contain a `seed.ts` script to generate default accounts for testing the dashboard (Admin, Sales, Sanction, Disbursement, Collection).
