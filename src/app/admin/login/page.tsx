"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useUser, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';
import { cn } from '@/lib/utils';

export default function AdminLoginPage() {
  const ADMIN_EMAIL = 'vivanfarmsnatural@gmail.com';
  const DEFAULT_PASS = 'Venky8466#';

  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASS);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'setup'>('setup'); // Default to setup for initial creation
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { auth } = useAuth();
  const { user, isUserLoading } = useUser();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      router.push('/admin');
    }
  }, [user, router, ADMIN_EMAIL]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetEmail = ADMIN_EMAIL.toLowerCase(); // Strictly hardcoded

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    if (mode === 'setup') {
      // First time initialization
      initiateEmailSignUp(auth, targetEmail, password);
    } else {
      // Regular login
      initiateEmailSignIn(auth, targetEmail, password);
    }
    
    // Reset loading after a timeout
    setTimeout(() => {
      setIsLoading(false);
      // If we are still here, something might have gone wrong
      if (!user) {
        setError(mode === 'setup' 
          ? "Could not initialize. Check if the user already exists (try 'Sign In') or if Email/Password is enabled in Firebase Console." 
          : "Invalid credentials. If this is your first time, use 'First Time Setup'.");
      }
    }, 5000);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="font-headline text-3xl font-extrabold text-primary animate-pulse">Verifying Identity...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF] p-4 font-body">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-[32px] overflow-hidden">
        <div className="bg-primary p-10 text-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white rotate-3">
            <i className="fa-solid fa-shield-halved text-3xl"></i>
          </div>
          <h1 className="font-headline text-4xl font-extrabold text-white">Vivaan Admin</h1>
          <p className="text-white/60 text-xs mt-2 font-bold tracking-[2px] uppercase">Secure Gateway</p>
        </div>
        
        <CardContent className="p-8 pt-10">
          <div className="flex bg-[#F9F6EF] p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => { setMode('login'); setError(null); }}
              className={cn(
                "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                mode === 'login' ? "bg-white text-primary shadow-sm" : "text-[#7A6848]/60"
              )}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setMode('setup'); setError(null); }}
              className={cn(
                "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                mode === 'setup' ? "bg-white text-primary shadow-sm" : "text-[#7A6848]/60"
              )}
            >
              First Time Setup
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#7A6848]">Master Email</label>
              <Input 
                type="email" 
                value={email}
                readOnly
                className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base px-6 opacity-70 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#7A6848]">
                {mode === 'setup' ? 'Desired Password' : 'Password'}
              </label>
              <Input 
                type="password" 
                placeholder="••••••••"
                className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent focus:border-primary transition-all font-bold text-base px-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-wider text-center animate-in slide-in-from-top-1">
                <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
              </div>
            )}

            {mode === 'setup' && !error && (
              <div className="p-4 rounded-2xl bg-primary/5 text-primary text-[10px] font-bold text-center leading-relaxed">
                <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> 
                Click below to create the master account with the pre-filled credentials.
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[3px] shadow-xl transition-all group overflow-hidden relative"
            >
              <span className={cn("relative z-10", isLoading && "opacity-0")}>
                {mode === 'setup' ? 'Initialize Admin →' : 'Enter Dashboard →'}
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fa-solid fa-circle-notch fa-spin text-xl"></i>
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#DDD0B5]/30 text-center">
            <p className="text-[10px] text-[#7A6848] font-medium leading-relaxed">
              <strong>Master Email:</strong> {ADMIN_EMAIL}<br />
              <strong>Master Pass:</strong> {DEFAULT_PASS}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
