# REST API Design

## Authentication Endpoints
- `POST /api/auth/register` - Register a new borrower.
- `POST /api/auth/login` - Login and get JWT token (for all roles).

## Borrower Endpoints (Requires `Borrower` role)
- `POST /api/loans/apply` - Submit personal details, upload slip, configure loan. Runs BRE.
- `GET /api/loans/my-loans` - Get borrower's loan status and details.

## Operations Dashboard Endpoints (Requires specific Roles or Admin)
- `GET /api/admin/loans/sales`
  - Role: Sales or Admin
  - Description: Get users who registered but haven't applied (`status: REGISTERED`).

- `GET /api/admin/loans/sanction`
  - Role: Sanction or Admin
  - Description: Get loans in `PENDING` status.

- `POST /api/admin/loans/:id/sanction`
  - Role: Sanction or Admin
  - Description: Approve or Reject a loan. Body: `{ action: 'APPROVE' | 'REJECT', reason?: string }`

- `GET /api/admin/loans/disbursement`
  - Role: Disbursement or Admin
  - Description: Get loans in `APPROVED` status.

- `POST /api/admin/loans/:id/disburse`
  - Role: Disbursement or Admin
  - Description: Mark loan as `DISBURSED`.

- `GET /api/admin/loans/collection`
  - Role: Collection or Admin
  - Description: Get loans in `DISBURSED` status.

- `POST /api/admin/loans/:id/payment`
  - Role: Collection or Admin
  - Description: Record a payment. Body: `{ utrNumber, amount, date }`. Auto-closes loan if outstanding balance hits 0.

## Middleware Requirements
- `verifyToken`: Ensure valid JWT.
- `requireRole(roleArray)`: Checks if the `req.user.role` is in the allowed `roleArray` (e.g. `['Sanction', 'Admin']`). Return `403` if not.
