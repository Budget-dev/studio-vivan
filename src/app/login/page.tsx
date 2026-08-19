"use client";

import React, { useState, useEffect, Suspense, useId } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ShieldCheck, Mail, Lock, User as UserIcon, LogIn, Sparkles, Phone } from 'lucide-react';

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
    <div className="w-full max-w-[440px] bg-white rounded-[40px] shadow-2xl border border-[#F1EAD8]/40 overflow-hidden p-10 md:p-12">
      <div className="flex flex-col items-center gap-8 mb-12">
        {/* Logo */}
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm overflow-hidden p-3">
          <div className="relative w-full h-full">
            <Image 
              src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png" 
              alt="Vivaan Farms" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-headline text-4xl font-extrabold text-primary tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Join the Farm'}
          </h1>
          <p className="text-[#7A6848] text-base font-medium px-4">
            {mode === 'login' 
              ? 'Enter your credentials to login to your account.' 
              : 'Create your purity account to start earning rewards.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-6">
        <div className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor={`${id}-name`} className="text-[11px] font-black uppercase tracking-wider text-[#AFA18B]">Full Name</Label>
                <Input 
                  id={`${id}-name`} 
                  placeholder="Farmer Name" 
                  className="h-13 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base focus-visible:ring-primary/20"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-phone`} className="text-[11px] font-black uppercase tracking-wider text-[#AFA18B]">Phone Number</Label>
                <Input 
                  id={`${id}-phone`} 
                  type="tel"
                  placeholder="+91 00000 00000" 
                  className="h-13 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base focus-visible:ring-primary/20"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor={`${id}-email`} className="text-[11px] font-black uppercase tracking-wider text-[#AFA18B]">Email Address</Label>
            <Input 
              id={`${id}-email`} 
              type="email"
              placeholder="pure@farm.com" 
              className="h-13 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base focus-visible:ring-primary/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${id}-password`} className="text-[11px] font-black uppercase tracking-wider text-[#AFA18B]">Password</Label>
            <Input 
              id={`${id}-password`} 
              type="password"
              placeholder="••••••••" 
              className="h-13 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base focus-visible:ring-primary/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor={`${id}-confirm`} className="text-[11px] font-black uppercase tracking-wider text-[#AFA18B]">Confirm Password</Label>
              <Input 
                id={`${id}-confirm`} 
                type="password"
                placeholder="••••••••" 
                className="h-13 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base focus-visible:ring-primary/20"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-remember`} className="rounded-md border-[#DDD0B5] data-[state=checked]:bg-primary" />
            <Label htmlFor={`${id}-remember`} className="text-xs font-bold text-[#7A6848] cursor-pointer">
              Remember me
            </Label>
          </div>
          <button type="button" className="text-xs font-black uppercase text-primary underline hover:no-underline tracking-widest">
            Forgot password?
          </button>
        </div>

        <Button disabled={loading} className="w-full h-16 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[2px] shadow-xl text-sm transition-all active:scale-[0.98]">
          {loading ? 'Processing...' : (mode === 'login' ? 'Sign In →' : 'Create Account →')}
        </Button>

        <div className="text-center pt-2">
          <button 
            type="button" 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[11px] font-black uppercase tracking-[2px] text-[#AFA18B] hover:text-primary transition-colors"
          >
            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3 my-10 before:h-px before:flex-1 before:bg-[#F1EAD8] after:h-px after:flex-1 after:bg-[#F1EAD8]">
        <span className="text-[10px] font-black uppercase text-[#AFA18B] tracking-widest">Or</span>
      </div>

      <Button 
        onClick={handleGoogleAuth} 
        variant="outline" 
        disabled={loading}
        className="w-full h-16 rounded-full border-[#F1EAD8] hover:bg-primary/5 flex items-center justify-center gap-4 transition-all"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
        <span className="font-black uppercase tracking-widest text-xs">Continue with Google</span>
      </Button>

      <p className="text-[10px] text-center text-[#AFA18B] font-bold mt-12 uppercase tracking-widest leading-relaxed opacity-60">
        By proceeding, you agree to our <br /><strong>Terms of Service</strong> & <strong>Privacy Policy</strong>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06]">
      <Ticker />
      <Header onOpenCart={() => {}} cartCount={0} onFilter={() => {}} onSearch={() => {}} />

      <main className="max-w-[1200px] mx-auto px-5 py-12 md:py-24 flex flex-col items-center justify-center">
        <Suspense fallback={<div className="w-full max-w-[440px] h-[700px] bg-white rounded-[40px] animate-pulse" />}>
          <LoginContent />
        </Suspense>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
