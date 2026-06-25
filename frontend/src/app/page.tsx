import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 -left-64 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="container flex-1 flex flex-col items-center justify-center px-4 text-center z-10 py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium">Business Rule Engine v2.0 is Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-150">
          The future of <span className="text-gradient">instant lending</span> is here.
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
          Experience lightning-fast loan approvals with our automated Business Rule Engine. Secure, transparent, and built for modern borrowers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-500">
          <Link href="/register">
            <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-xl shadow-primary/20 hover:scale-105 transition-transform bg-primary">
              Apply in Minutes <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium hover:bg-black/5 border-black/10 backdrop-blur-md text-foreground">
              Sign In to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-5xl w-full animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-700">
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Approvals</h3>
            <p className="text-muted-foreground">Our intelligent BRE evaluates your eligibility in milliseconds.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Bank-Grade Security</h3>
            <p className="text-muted-foreground">End-to-end encryption and strict RBAC keeps your data safe.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Tracking</h3>
            <p className="text-muted-foreground">Track your application from registered to disbursed in real-time.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
