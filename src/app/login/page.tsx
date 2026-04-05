
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Smartphone, Mail, User as UserIcon, Info } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const returnTo = searchParams.get('returnTo') || '/';
  
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push(returnTo);
    }
  }, [user, isUserLoading, router, returnTo]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError(null);

    // Simulation of OTP send
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
      toast({
        title: "OTP Sent (Simulated)",
        description: "For this prototype, please use code: 123456",
      });
    }, 1500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError('Invalid OTP. Please use 123456 for the simulation.');
      return;
    }
    setLoading(true);
    
    try {
      const simulatedEmail = email.toLowerCase().trim();
      const simulatedPass = `vivaan_user_${phone}`; // Consistent password for simulation
      
      let credential;
      try {
        credential = await createUserWithEmailAndPassword(auth, simulatedEmail, simulatedPass);
      } catch (e: any) {
        if (e.code === 'auth/email-already-in-use') {
          credential = await signInWithEmailAndPassword(auth, simulatedEmail, simulatedPass);
        } else {
          throw e;
        }
      }

      if (credential.user) {
        await updateProfile(credential.user, { displayName: name });
        
        // Save profile to Firestore
        await setDoc(doc(db, 'users', credential.user.uid), {
          id: credential.user.uid,
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
          email: simulatedEmail,
          phoneNumber: phone,
          purityCoins: 500, // Welcome coins
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });

        toast({
          title: "Login Successful",
          description: `Welcome back, ${name}!`,
        });
        
        router.push(returnTo);
      }
    } catch (e: any) {
      setError(e.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary font-bold animate-pulse">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06]">
      <Ticker />
      <Header onOpenCart={() => {}} cartCount={0} onFilter={() => {}} onSearch={() => {}} />

      <main className="max-w-[1200px] mx-auto px-5 py-12 md:py-20 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-primary/5 overflow-hidden">
          <div className="bg-primary p-10 text-center relative overflow-hidden">
            <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>
            <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-white rotate-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-headline text-3xl font-extrabold text-white">Secure Login</h1>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[3px] mt-2">Vivaan Farms OTP Gateway</p>
          </div>

          <div className="p-8 md:p-10">
            {step === 'details' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                    <Input 
                      placeholder="e.g. Rahul Sharma" 
                      className="h-14 pl-12 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base focus-visible:ring-primary"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                    <Input 
                      type="email"
                      placeholder="name@email.com" 
                      className="h-14 pl-12 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base focus-visible:ring-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                    <Input 
                      type="tel"
                      placeholder="10-digit number" 
                      className="h-14 pl-12 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base focus-visible:ring-primary"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {error && <div className="p-4 bg-destructive/5 text-destructive rounded-2xl text-xs font-bold text-center">{error}</div>}

                <Button disabled={loading} className="w-full h-16 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[2px] shadow-xl">
                  {loading ? 'Sending OTP...' : 'Get OTP Verification →'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-[#7A6848] font-medium">OTP sent to <strong>+91 {phone}</strong></p>
                  <button type="button" onClick={() => setStep('details')} className="text-xs text-primary font-black uppercase mt-2 hover:underline">Change Details</button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Enter 6-Digit OTP</label>
                  <Input 
                    placeholder="· · · · · ·" 
                    className="h-18 rounded-2xl bg-[#F9F6EF] border-transparent font-headline text-4xl text-center font-extrabold focus-visible:ring-primary tracking-[8px]"
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

                <Button disabled={loading} className="w-full h-16 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[2px] shadow-xl">
                  {loading ? 'Verifying...' : 'Verify & Continue →'}
                </Button>
              </form>
            )}

            <p className="text-[10px] text-center text-[#7A6848] font-bold mt-10 uppercase tracking-wider leading-relaxed">
              By continuing, you agree to our <br /><strong>Terms of Service</strong> & <strong>Privacy Policy</strong>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
