# Database Schema Design (MongoDB + Mongoose)

## 1. User Collection
Stores both borrowers and internal executives.
- `_id`: ObjectId
- `name`: String, required
- `email`: String, required, unique
- `passwordHash`: String, required
- `role`: Enum `['Borrower', 'Sales', 'Sanction', 'Disbursement', 'Collection', 'Admin']`, default: 'Borrower'
- `createdAt`: Date
- `updatedAt`: Date

## 2. Loan Collection
Stores the application and loan details.
- `_id`: ObjectId
- `borrowerId`: ObjectId (Ref to User)
- `panNumber`: String
- `dateOfBirth`: Date
- `monthlySalary`: Number
- `employmentMode`: Enum `['Salaried', 'Self-Employed', 'Unemployed']`
- `salarySlipUrl`: String (URL to uploaded file, e.g., Cloudinary/AWS S3 or local uploads)
- `loanAmount`: Number
- `tenureDays`: Number
- `interestRate`: Number (Fixed 12)
- `totalRepayment`: Number
- `status`: Enum `['REGISTERED', 'PENDING', 'APPROVED', 'REJECTED', 'DISBURSED', 'CLOSED']`
- `rejectionReason`: String (Optional, filled by BRE or Sanction executive)
- `outstandingBalance`: Number
- `createdAt`: Date
- `updatedAt`: Date

## 3. Payment Collection
Stores repayments made by the borrower on active (DISBURSED) loans.
- `_id`: ObjectId
- `loanId`: ObjectId (Ref to Loan)
- `utrNumber`: String, required, unique
- `amount`: Number, required
- `paymentDate`: Date, required
- `recordedBy`: ObjectId (Ref to User, the Collection executive)
- `createdAt`: Date
