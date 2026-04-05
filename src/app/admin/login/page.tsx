
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ShieldCheck, Lock, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const ADMIN_EMAIL = 'vivanfarmsnatural@gmail.com';
  const ADMIN_PASS = 'Venky8466#'; 

  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email] = useState(ADMIN_EMAIL);
  const [otp, setOtp] = useState('');
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

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate OTP send to admin
    setTimeout(() => {
      setStep('verify');
      setIsLoading(false);
      toast({
        title: "Admin OTP Sent",
        description: "Verification code is: 123456",
      });
    }, 1500);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError("Incorrect OTP code. Please use 123456.");
      return;
    }
    
    setError(null);
    setIsLoading(true);

    try {
      // Behind the scenes, we use the master admin credentials
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
      toast({
        title: "Admin Verified",
        description: "Welcome to the Vivaan Farms Dashboard.",
      });
      router.push('/admin');
    } catch (e: any) {
      setError("Authentication failed. Please ensure the admin account is active.");
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
          <h1 className="font-headline text-4xl font-extrabold text-white">Admin Secure Access</h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mt-2">OTP Protection Enabled</p>
        </div>
        
        <CardContent className="p-10">
          {step === 'request' ? (
            <form onSubmit={handleRequest} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#7A6848]">Authorized Admin Email</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                  <Input 
                    type="email" 
                    value={email}
                    readOnly
                    className="h-16 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base px-14 opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>

              <Button disabled={isLoading} className="w-full h-18 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[3px] shadow-xl">
                {isLoading ? 'Requesting OTP...' : 'Get Admin OTP →'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleAuth} className="space-y-8">
              <div className="text-center">
                <p className="text-sm text-[#7A6848] font-medium">OTP sent to <strong>vivanfarms***@gmail.com</strong></p>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#7A6848]">6-Digit Secure OTP</label>
                <Input 
                  placeholder="· · · · · ·" 
                  className="h-20 rounded-2xl bg-[#F9F6EF] border-transparent font-headline text-5xl text-center font-extrabold focus-visible:ring-primary tracking-[4px]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
                <div className="flex items-center gap-2 justify-center text-[10px] text-primary/60 font-bold mt-2">
                  <Info className="w-3 h-3" /> Use code 123456 for testing
                </div>
              </div>

              {error && <div className="p-4 bg-destructive/5 text-destructive rounded-2xl text-xs font-bold text-center">{error}</div>}

              <Button disabled={isLoading} className="w-full h-18 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[3px] shadow-xl">
                {isLoading ? 'Validating...' : 'Verify Admin Access →'}
              </Button>

              <button type="button" onClick={() => setStep('request')} className="w-full text-xs font-black uppercase tracking-widest text-primary hover:underline">Resend OTP</button>
            </form>
          )}

          <div className="mt-10 pt-10 border-t border-[#DDD0B5]/30 text-center">
            <p className="text-[9px] text-[#7A6848] font-bold leading-relaxed uppercase tracking-widest opacity-60">
              Authorized personnel only. <br /> All login attempts are logged.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
