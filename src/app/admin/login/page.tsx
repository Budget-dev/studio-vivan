"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useUser, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';
import { fetchSignInMethodsForEmail } from 'firebase/auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { auth } = useAuth();
  const { user, isUserLoading } = useUser();

  const ADMIN_EMAIL = 'vivanfarmsnatural@gmail.com';

  useEffect(() => {
    if (user && user.email === ADMIN_EMAIL) {
      router.push('/admin');
    }
  }, [user, router]);

  const checkUserExists = async (email: string) => {
    if (!auth || email !== ADMIN_EMAIL) return;
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      setIsNewUser(methods.length === 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email.toLowerCase() !== ADMIN_EMAIL) {
      setError("Unauthorized access. This area is for registered Vivaan Admin only.");
      return;
    }

    setIsLoading(true);

    if (isNewUser) {
      // First time initialization
      initiateEmailSignUp(auth, email, password);
    } else {
      initiateEmailSignIn(auth, email, password);
    }
    
    // We don't await here as per non-blocking pattern.
    // The useUser hook/useEffect will handle redirection on success.
    // We add a timeout to reset loading state if no success happens within 5 seconds.
    setTimeout(() => setIsLoading(false), 5000);
  };

  if (isUserLoading) {
    return <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center font-headline text-3xl font-extrabold text-primary animate-pulse">Verifying Identity...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF] p-4 font-body">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-[32px] overflow-hidden">
        <div className="bg-primary p-8 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <i className="fa-solid fa-shield-halved text-3xl"></i>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-white">Vivaan Admin</h1>
          <p className="text-white/60 text-sm mt-1">Authorized Personnel Only</p>
        </div>
        <CardContent className="p-8 pt-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#7A6848]">Admin Email</label>
              <Input 
                type="email" 
                placeholder="vivanfarmsnatural@gmail.com"
                className="h-12 rounded-xl bg-[#F9F6EF] border-transparent focus:border-primary transition-all font-bold"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value === ADMIN_EMAIL) checkUserExists(e.target.value);
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#7A6848]">
                {isNewUser ? 'Set New Password' : 'Password'}
              </label>
              <Input 
                type="password" 
                placeholder={isNewUser ? "Create strong password" : "Enter admin password"}
                className="h-12 rounded-xl bg-[#F9F6EF] border-transparent focus:border-primary transition-all font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-wider text-center animate-in slide-in-from-top-1">
                {error}
              </div>
            )}

            {isNewUser && (
              <div className="p-3 rounded-xl bg-primary/5 text-primary text-[10px] font-bold text-center">
                <i className="fa-solid fa-info-circle mr-1"></i> First time setup: Set your password now.
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading || (email && email.toLowerCase() !== ADMIN_EMAIL)}
              className="w-full h-14 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-widest shadow-xl transition-all"
            >
              {isLoading ? 'Processing...' : isNewUser ? 'Initialize Admin' : 'Secure Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
