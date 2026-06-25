"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">
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
              
              <div className="h-8 w-[1px] bg-gray-200 mx-2" />
              
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
                <Button className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
