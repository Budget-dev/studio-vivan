"use client";

import React, { useState, useEffect, Suspense, useId } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Ticker } from '@/components/vivaan/Ticker';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function LoginContent() {
  const id = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const returnTo = searchParams.get('returnTo') || '/';
  
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push(returnTo);
    }
  }, [user, isUserLoading, router, returnTo]);

  const syncProfile = async (user: any) => {
    await setDoc(doc(db, 'userProfiles', user.uid), {
      id: user.uid,
      firstName: user.displayName?.split(' ')[0] || name.split(' ')[0] || '',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || name.split(' ').slice(1).join(' ') || '',
      email: user.email?.toLowerCase().trim(),
      phoneNumber: phone || '',
      purityCoins: 500,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords Mismatch" });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await syncProfile(result.user);
        toast({ title: "Welcome!", description: "Account created successfully." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome Back", description: "Logged in successfully." });
      }
      router.push(returnTo);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Auth Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncProfile(result.user);
      toast({ title: "Welcome!", description: `Logged in as ${result.user.displayName}` });
      router.push(returnTo);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Google Login Failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary font-bold animate-pulse">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[900px] bg-white md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      {/* Left Column: Image (Desktop Only) */}
      <div className="hidden md:block w-1/2 relative bg-[#F9F6EF]">
        <Image 
          src="https://vivanfa.sirv.com/ChatGPT%20Image%20Aug%201%2C%202026%2C%2010_06_35%20AM.png"
          alt="Vivaan Farms Purity"
          fill
          className="object-cover"
          priority
        />
        {/* Pagination Dots to match reference image */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-white" : "bg-white/40")} />
          ))}
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-[#100C06] tracking-tight mb-1">
            {mode === 'login' ? 'Welcome Back' : 'Join the Farm'}
          </h1>
          <p className="text-[#7A6848] text-xs font-medium">
            {mode === 'login' 
              ? 'Enter your credentials to access your account.' 
              : 'Create your purity account to start earning rewards.'}
          </p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button 
            variant="outline" 
            onClick={handleGoogleAuth}
            className="h-11 rounded-xl border-[#E5E7EB] hover:bg-gray-50 flex items-center justify-center gap-2 font-bold text-[11px]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
            Google
          </Button>
          <Button 
            variant="outline" 
            className="h-11 rounded-xl border-[#E5E7EB] hover:bg-gray-50 flex items-center justify-center gap-2 font-bold text-[11px]"
          >
            <i className="fa-brands fa-apple text-sm"></i>
            Apple
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-6 before:h-px before:flex-1 before:bg-[#F3F4F6] after:h-px after:flex-1 after:bg-[#F3F4F6]">
          <span className="text-[9px] font-black uppercase text-[#9CA3AF] tracking-widest">Or continue with</span>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-3">
            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <Label htmlFor={`${id}-name`} className="text-[10px] font-bold text-[#100C06] uppercase tracking-wider">Full Name</Label>
                  <Input 
                    id={`${id}-name`} 
                    placeholder="Enter your name" 
                    className="h-11 rounded-xl border-[#E5E7EB] font-medium focus-visible:ring-primary/20"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`${id}-phone`} className="text-[10px] font-bold text-[#100C06] uppercase tracking-wider">Phone Number</Label>
                  <Input 
                    id={`${id}-phone`} 
                    type="tel"
                    placeholder="+91 00000 00000" 
                    className="h-11 rounded-xl border-[#E5E7EB] font-medium focus-visible:ring-primary/20"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <Label htmlFor={`${id}-email`} className="text-[10px] font-bold text-[#100C06] uppercase tracking-wider">Email</Label>
              <Input 
                id={`${id}-email`} 
                type="email"
                placeholder="m@example.com" 
                className="h-11 rounded-xl border-[#E5E7EB] font-medium focus-visible:ring-primary/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label htmlFor={`${id}-password`} className="text-[10px] font-bold text-[#100C06] uppercase tracking-wider">Password</Label>
                <button type="button" className="text-[10px] font-bold text-[#100C06] hover:underline">Forgot password?</button>
              </div>
              <Input 
                id={`${id}-password`} 
                type="password"
                placeholder="••••••••" 
                className="h-11 rounded-xl border-[#E5E7EB] font-medium focus-visible:ring-primary/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-1">
                <Label htmlFor={`${id}-confirm`} className="text-[10px] font-bold text-[#100C06] uppercase tracking-wider">Confirm Password</Label>
                <Input 
                  id={`${id}-confirm`} 
                  type="password"
                  placeholder="••••••••" 
                  className="h-11 rounded-xl border-[#E5E7EB] font-medium focus-visible:ring-primary/20"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <Button 
            disabled={loading} 
            className="w-full h-12 bg-[#100C06] hover:bg-[#1f1a0d] text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] mt-2"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Log In' : 'Sign Up')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[11px] font-medium text-[#7A6848]"
          >
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <span className="font-bold text-[#100C06] hover:underline">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06]">
      <Ticker />
      <Header onOpenCart={() => {}} cartCount={0} onFilter={() => {}} onSearch={() => {}} />

      <main className="max-w-[1400px] mx-auto px-4 md:px-5 py-8 md:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-108px)]">
        <Suspense fallback={<div className="w-full max-w-[900px] h-[500px] bg-white md:rounded-[40px] animate-pulse" />}>
          <LoginContent />
        </Suspense>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
