"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Search, Filter, ShieldCheck, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Loan {
  _id: string;
  borrower: { _id: string; name: string; email: string };
  loanAmount: number;
  tenureDays: number;
  status: string;
  totalRepayment: number;
  outstandingBalance: number;
  createdAt: string;
  salarySlipUrl: string;
  panNumber: string;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role === 'Borrower')) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchLoans();
  }, [user]);

  const fetchLoans = async () => {
    if (!user) return;
    try {
      const res = await api.get("/admin/loans");
      setLoans(res.data.loans);
    } catch (error) {
      toast.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedLoan) return;
    if (status === 'REJECTED' && !rejectionReason) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setActionLoading(true);
    try {
      await api.put(`/admin/loans/${selectedLoan._id}/status`, { 
        status, 
        rejectionReason: status === 'REJECTED' ? rejectionReason : undefined 
      });
      toast.success(`Loan status updated to ${status}`);
      setSelectedLoan(null);
      fetchLoans();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedLoan || !paymentAmount) return;
    
    setActionLoading(true);
    try {
      await api.post(`/admin/loans/${selectedLoan._id}/payments`, { 
        amount: Number(paymentAmount),
        utr: `UTR${Date.now()}` // Mock UTR for now
      });
      toast.success("Payment recorded successfully");
      setPaymentAmount("");
      setSelectedLoan(null);
      fetchLoans();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to record payment");
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredLoans = loans.filter(l => 
    l.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.panNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REGISTERED': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DISBURSED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'CLOSED': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">{user?.role} Portal</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Operations Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and track loan applications efficiently.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, PAN, status..." 
              className="pl-9 bg-white border-gray-200 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-gray-200 shadow-sm bg-white hover:bg-gray-50 text-slate-700">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Borrower</th>
                <th className="px-6 py-4">PAN Number</th>
                <th className="px-6 py-4">Amount & Tenure</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Outstanding</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No loans found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{loan.borrower.name}</div>
                      <div className="text-xs text-slate-500">{loan.borrower.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{loan.panNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">₹{loan.loanAmount.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">{loan.tenureDays} Days</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {['DISBURSED', 'CLOSED'].includes(loan.status) ? (
                        <span className="font-mono font-medium text-primary">
                          ₹{loan.outstandingBalance.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary hover:bg-primary/5 font-medium"
                        onClick={() => setSelectedLoan(loan)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedLoan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedLoan(null)} />
          
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Loan Details</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedLoan(null)} className="h-8 w-8 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Borrower Name</p>
                  <p className="font-medium text-slate-900">{selectedLoan.borrower.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">PAN Number</p>
                  <p className="font-mono font-medium text-slate-900">{selectedLoan.panNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Requested Amount</p>
                  <p className="font-bold text-slate-900 text-lg">₹{selectedLoan.loanAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Total Repayment</p>
                  <p className="font-bold text-primary text-lg">₹{selectedLoan.totalRepayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Current Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(selectedLoan.status)}`}>
                    {selectedLoan.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Document</p>
                  <a href={selectedLoan.salarySlipUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline">
                    <FileText className="h-4 w-4 mr-1" /> View Salary Slip
                  </a>
                </div>
              </div>

              <hr className="border-gray-100 mb-6" />

              {/* ACTION PANELS BASED ON ROLE AND STATUS */}
              {user?.role === 'Admin' || user?.role === 'Sanction' ? (
                selectedLoan.status === 'REGISTERED' || selectedLoan.status === 'PENDING' ? (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Sanction Actions</h4>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-sm" 
                      onClick={() => handleUpdateStatus('APPROVED')}
                      disabled={actionLoading}
                    >
                      {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve Loan"}
                    </Button>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Reason for rejection (required)"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="destructive" 
                        onClick={() => handleUpdateStatus('REJECTED')}
                        disabled={actionLoading}
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
                      </Button>
                    </div>
                  </div>
                ) : null
              ) : null}

              {user?.role === 'Admin' || user?.role === 'Disbursement' ? (
                selectedLoan.status === 'APPROVED' ? (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Disbursement Actions</h4>
                    <p className="text-xs text-slate-500">Please verify bank details off-platform before disbursing.</p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm" 
                      onClick={() => handleUpdateStatus('DISBURSED')}
                      disabled={actionLoading}
                    >
                      {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark as Disbursed"}
                    </Button>
                  </div>
                ) : null
              ) : null}

              {user?.role === 'Admin' || user?.role === 'Collection' ? (
                selectedLoan.status === 'DISBURSED' ? (
                  <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Record EMI Payment</h4>
                    <p className="text-xs text-slate-500 mb-3">Outstanding Balance: ₹{selectedLoan.outstandingBalance.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                    <div className="flex gap-2">
                      <Input 
                        type="number"
                        placeholder="Amount (₹)"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="flex-1 bg-white"
                        max={selectedLoan.outstandingBalance}
                      />
                      <Button 
                        className="bg-primary hover:bg-primary/90" 
                        onClick={handleRecordPayment}
                        disabled={actionLoading || !paymentAmount}
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Record"}
                      </Button>
                    </div>
                  </div>
                ) : null
              ) : null}
              
              {user?.role === 'Sales' && (
                <div className="text-center p-4 bg-slate-50 rounded-lg border border-gray-100">
                  <p className="text-sm text-slate-500">Sales role has read-only access to this loan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
