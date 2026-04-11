
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Admin Login Page
 * Strictly hardcodes the master admin email and provides initialization guidance.
 */
export default function AdminLoginPage() {
  const ADMIN_EMAIL = 'vivanfarmsnatural@gmail.com';
  // Initial password set for one-time initialization in Firebase Console
  const INITIAL_PASSWORD = 'Vivaan@Admin2025'; 

  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      router.push('/admin');
    }
  }, [user, router, ADMIN_EMAIL]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Direct sign in with hardcoded email and user-entered password
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      toast({
        title: "Admin Verified",
        description: "Welcome back to the Vivaan Farms Dashboard.",
      });
      router.push('/admin');
    } catch (e: any) {
      console.error("Auth Error:", e.code, e.message);
      setError("Access Denied. Please ensure this email is registered in Firebase with the initialized password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="font-headline text-3xl font-extrabold text-primary animate-pulse">Verifying Admin Identity...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF] p-4 font-body">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-[32px] overflow-hidden">
        <div className="bg-primary p-12 text-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          <div className="w-20 h-20 bg-white/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 text-white rotate-3">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="font-headline text-4xl font-extrabold text-white">Admin Portal</h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mt-2">Secure Dashboard Access</p>
        </div>
        
        <CardContent className="p-10">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#7A6848]">Authorized Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <Input 
                  type="email" 
                  value={ADMIN_EMAIL}
                  disabled
                  className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base px-14 opacity-60 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#7A6848]">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base px-14 focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-destructive/5 text-destructive rounded-2xl text-[11px] font-bold text-center leading-relaxed">
                {error}
              </div>
            )}

            <Button disabled={isLoading} className="w-full h-16 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[3px] shadow-xl mt-4">
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard →'}
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-[#DDD0B5]/30 text-center">
            <p className="text-[10px] text-[#7A6848] font-bold leading-relaxed uppercase tracking-widest opacity-60">
              One-Time Initialization Password:<br />
              <strong className="text-primary">{INITIAL_PASSWORD}</strong>
            </p>
            <p className="text-[9px] text-[#7A6848] font-medium mt-4 italic">
              Please register this user in your Firebase Authentication Console if you haven't already.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
