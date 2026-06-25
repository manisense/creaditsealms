# Loan Status Transitions

## Valid States
1. `REGISTERED` - User signed up, no application submitted yet. (Tracked by Sales).
2. `PENDING` - Borrower completed application. Passed BRE. (Tracked by Sanction).
3. `APPROVED` - Sanction executive approved the loan. (Tracked by Disbursement).
4. `REJECTED` - BRE failed during application, OR Sanction executive rejected.
5. `DISBURSED` - Funds released to the borrower. Active loan. (Tracked by Collection).
6. `CLOSED` - All repayments completed.

## Transitions Workflow
- **User Signup** -> Status: `REGISTERED`
- **Borrower Application (BRE Pass)** -> Status: `PENDING`
- **Borrower Application (BRE Fail)** -> Status: `REJECTED` (Terminal State)
- **Sanction Executive Approval** -> Status: `APPROVED`
- **Sanction Executive Rejection** -> Status: `REJECTED` (Terminal State)
- **Disbursement Action** -> Status: `DISBURSED`
- **Collection (Outstanding Balance hits 0)** -> Status: `CLOSED` (Terminal State)

## Business Rule Engine (BRE) Conditions
Run these checks on the server during the `apply` step. If any condition matches, instantly reject the loan.
Reject if:
- Age < 23 or Age > 50
- Salary < 25000
- PAN format is invalid (Use Regex: `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`)
- Employment Mode is 'Unemployed'
