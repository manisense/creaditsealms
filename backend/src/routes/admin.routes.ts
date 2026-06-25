import { Router } from 'express';
import { getLoans, updateLoanStatus, recordPayment } from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Allow any internal executive role to view loans
router.get('/loans', requireRole([Role.Admin, Role.Sales, Role.Sanction, Role.Disbursement, Role.Collection]), getLoans);

// Status updates can be done by Admin, Sanction, or Disbursement
router.put('/loans/:loanId/status', requireRole([Role.Admin, Role.Sanction, Role.Disbursement]), updateLoanStatus);

// Payments can only be recorded by Collection or Admin
router.post('/loans/:loanId/payments', requireRole([Role.Admin, Role.Collection]), recordPayment);

export default router;
