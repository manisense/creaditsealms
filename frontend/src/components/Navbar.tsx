"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
            C
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient">CreditSea</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'Borrower' ? (
                <>
                  <Link href="/borrower/dashboard">
                    <Button variant="ghost" className="text-sm font-medium">Dashboard</Button>
                  </Link>
                  <Link href="/borrower/apply">
                    <Button variant="default" className="text-sm font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">Apply for Loan</Button>
                  </Link>
                </>
              ) : (
                <Link href="/admin/dashboard">
                  <Button variant="ghost" className="text-sm font-medium">Admin Dashboard</Button>
                </Link>
              )}
              
              <div className="h-8 w-[1px] bg-white/10 mx-2" />
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                  {user.name}
                </span>
                <Button variant="ghost" size="icon" onClick={logout} className="hover:bg-destructive/20 hover:text-destructive transition-colors">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="text-sm font-medium bg-white text-black hover:bg-white/90 shadow-lg transition-all">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
