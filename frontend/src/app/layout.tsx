import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CreditSea | Premium Loan Management System",
  description: "A fast, beautiful, and secure loan management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-white text-slate-900`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
