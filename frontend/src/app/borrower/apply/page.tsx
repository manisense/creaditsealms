"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UploadCloud, Calculator } from "lucide-react";

export default function ApplyLoan() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    panNumber: "",
    dateOfBirth: "",
    monthlySalary: "",
    employmentMode: "Salaried",
    loanAmount: "100000",
    tenureDays: "180"
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Live Calculator Logic (12% SI)
  const mathPreview = useMemo(() => {
    const p = parseFloat(formData.loanAmount) || 0;
    const t = parseInt(formData.tenureDays) || 0;
    if (p < 50000 || p > 500000 || t < 30 || t > 365) return null;
    
    const rate = 12;
    const si = (p * rate * t) / (365 * 100);
    return {
      interest: si,
      total: p + si
    };
  }, [formData.loanAmount, formData.tenureDays]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload your salary slip");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("salarySlip", file);

    setLoading(true);
    try {
      await api.post("/loans/apply", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Application submitted successfully! Passed BRE.");
      router.push("/borrower/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Application failed");
      if (error.response?.data?.reason) {
         toast.error(`BRE Rejected: ${error.response.data.reason}`, { duration: 8000 });
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in duration-500">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Apply for a Loan</h1>
        <p className="text-muted-foreground">Fill in your details. Our BRE will process it instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 md:p-8 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input 
                  id="panNumber" 
                  placeholder="ABCDE1234F" 
                  className="glass-input uppercase"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
                  required 
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  type="date" 
                  className="glass-input"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlySalary">Monthly Salary (₹)</Label>
                <Input 
                  id="monthlySalary" 
                  type="number" 
                  placeholder="50000" 
                  className="glass-input"
                  value={formData.monthlySalary}
                  onChange={(e) => setFormData({...formData, monthlySalary: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentMode">Employment Mode</Label>
                <Select value={formData.employmentMode} onValueChange={(val) => setFormData({...formData, employmentMode: val as string})}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salaried">Salaried</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (₹50k - ₹5L)</Label>
                <Input 
                  id="loanAmount" 
                  type="number" 
                  min="50000"
                  max="500000"
                  className="glass-input"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenureDays">Tenure (30 - 365 Days)</Label>
                <Input 
                  id="tenureDays" 
                  type="number" 
                  min="30"
                  max="365"
                  className="glass-input"
                  value={formData.tenureDays}
                  onChange={(e) => setFormData({...formData, tenureDays: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <Label>Salary Slip (PDF/JPG/PNG max 5MB)</Label>
              <div className="border-2 border-dashed border-black/10 rounded-2xl p-8 text-center bg-white/50 hover:bg-white transition-colors cursor-pointer relative group">
                <Input 
                  type="file" 
                  accept=".pdf,image/jpeg,image/png,image/jpg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
                <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                <p className="text-sm font-medium">
                  {file ? file.name : "Click or drag file to upload"}
                </p>
                {file && <p className="text-xs text-primary mt-2">Ready to upload</p>}
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Submit Application"}
            </Button>
          </form>
        </div>

        {/* Live Calculator Widget */}
        <div className="glass-card p-6 md:p-8 rounded-3xl h-fit sticky top-24">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <div className="p-3 bg-primary/20 rounded-xl text-primary">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Live Calculator</h3>
              <p className="text-xs text-muted-foreground">Fixed 12% p.a. Simple Interest</p>
            </div>
          </div>

          {!mathPreview ? (
            <div className="text-center p-6 bg-black/5 rounded-xl border border-black/5">
              <p className="text-sm text-muted-foreground">Enter a valid amount (50k-5L) and tenure (30-365 days) to see preview.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Principal Amount</p>
                <p className="text-2xl font-semibold">₹{parseFloat(formData.loanAmount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Interest Component</p>
                <p className="text-2xl font-semibold text-yellow-500">+ ₹{mathPreview.interest.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
              </div>
              <div className="pt-6 border-t border-black/10">
                <p className="text-sm text-muted-foreground mb-1">Total Repayment</p>
                <p className="text-4xl font-bold text-primary">₹{mathPreview.total.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
