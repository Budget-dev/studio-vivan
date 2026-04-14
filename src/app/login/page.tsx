
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
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  updateProfile,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Smartphone, Mail, User as UserIcon, Info, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

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

  const setupRecaptcha = () => {
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch (e) {}
    }
    try {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {}
      });
    } catch (err) {
      console.error("Recaptcha initialization failed", err);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!name || !email) {
      setError('Please provide your name and email');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const formattedPhone = `+91${phone}`;
      
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to +91 ${phone}`,
      });
    } catch (err: any) {
      console.error("Auth Error:", err.code, err.message);
      
      if (err.code === 'auth/operation-not-allowed') {
        setError("PHONE_AUTH_DISABLED");
      } else if (err.code === 'auth/invalid-phone-number') {
        setError("The phone number provided is invalid. Please check the format.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err.message || "Failed to send OTP. Please check your connection.");
      }

      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {}
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) {
      setError('Verification session expired. Please request a new OTP.');
      setStep('details');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await confirmationResult.confirm(otp);
      const authenticatedUser = result.user;

      if (authenticatedUser) {
        // Update profile display name
        await updateProfile(authenticatedUser, { displayName: name });
        
        // Save/Sync profile to Firestore
        await setDoc(doc(db, 'userProfiles', authenticatedUser.uid), {
          id: authenticatedUser.uid,
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
          email: email.toLowerCase().trim(),
          phoneNumber: phone,
          purityCoins: 500, // Welcome coins
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });

        toast({
          title: "Login Successful",
          description: `Welcome to Vivaan Farms, ${name}!`,
        });
        
        router.push(returnTo);
      }
    } catch (e: any) {
      setError(e.message || 'Verification failed. Please check the OTP and try again.');
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
        <div id="recaptcha-container"></div>
        
        <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-primary/5 overflow-hidden">
          <div className="bg-primary p-10 text-center relative overflow-hidden">
            <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>
            <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-white rotate-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-headline text-3xl font-extrabold text-white">Secure Login</h1>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[3px] mt-2">Vivaan Farms Mobile Gateway</p>
          </div>

          <div className="p-8 md:p-10">
            {error === "PHONE_AUTH_DISABLED" ? (
              <div className="space-y-6">
                <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 rounded-2xl p-6">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle className="font-bold mb-2">Setup Required</AlertTitle>
                  <AlertDescription className="text-xs leading-relaxed opacity-90">
                    Phone Authentication is not yet enabled in your Firebase Console. 
                    <br /><br />
                    Please go to <strong>Authentication &gt; Sign-in method</strong>, add <strong>Phone</strong>, and click <strong>Enable</strong>.
                  </AlertDescription>
                </Alert>
                <Button onClick={() => setError(null)} variant="outline" className="w-full h-14 rounded-full border-[#DDD0B5] font-black uppercase tracking-widest text-[#7A6848]">
                  Try Again
                </Button>
              </div>
            ) : step === 'details' ? (
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
                  {loading ? 'Requesting OTP...' : 'Get SMS OTP Verification →'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-[#7A6848] font-medium">Verification SMS sent to <strong>+91 {phone}</strong></p>
                  <button type="button" onClick={() => setStep('details')} className="text-xs text-primary font-black uppercase mt-2 hover:underline">Change Details</button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Enter 6-Digit Code</label>
                  <Input 
                    placeholder="· · · · · ·" 
                    className="h-18 rounded-2xl bg-[#F9F6EF] border-transparent font-headline text-4xl text-center font-extrabold focus-visible:ring-primary tracking-[8px]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <div className="flex items-center gap-2 justify-center text-[10px] text-primary/60 font-bold mt-2">
                    <Info className="w-3 h-3" /> Please check your phone messages
                  </div>
                </div>

                {error && <div className="p-4 bg-destructive/5 text-destructive rounded-2xl text-xs font-bold text-center">{error}</div>}

                <Button disabled={loading} className="w-full h-16 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[2px] shadow-xl">
                  {loading ? 'Verifying...' : 'Verify & Complete Login →'}
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
