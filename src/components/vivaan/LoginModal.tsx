
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Smartphone, Mail, User as UserIcon, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore } from '@/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  updateProfile,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Form Fields
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tempUid, setTempUid] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setStep('phone');
      setPhone('');
      setOtp('');
      setName('');
      setEmail('');
      setError(null);
    }
  }, [isOpen]);

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

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
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
        setError("Phone authentication is not enabled in Firebase Console.");
      } else {
        setError(err.message || "Failed to send OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await confirmationResult.confirm(otp);
      if (result.user) {
        setTempUid(result.user.uid);
        // Check if user already has profile details (simple check for prototype)
        // In a real app, we'd check Firestore here
        setStep('profile');
      }
    } catch (e: any) {
      setError('Incorrect OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please provide your name and email');
      return;
    }

    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        await setDoc(doc(db, 'userProfiles', tempUid), {
          id: tempUid,
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
          email: email.toLowerCase().trim(),
          phoneNumber: phone,
          purityCoins: 500,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });

        toast({
          title: "Welcome to Vivaan Farms!",
          description: `Logged in successfully as ${name}`,
        });
        
        onSuccess?.();
        onClose();
      }
    } catch (e: any) {
      setError("Failed to save profile details.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div id="recaptcha-container"></div>
      
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all backdrop-blur-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Visual Section */}
        <div className="relative h-56 w-full">
          <Image 
            src="https://picsum.photos/seed/vivaanlogin/800/600" 
            alt="Vivaan Farms Login" 
            fill 
            className="object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-0 w-full text-center">
            <div className="w-16 h-16 bg-white rounded-2xl mx-auto shadow-xl flex items-center justify-center p-3">
              <Image 
                src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pb-10">
          <div className="text-center mb-8">
            <h2 className="font-headline text-3xl font-extrabold text-[#100C06]">Sign In</h2>
          </div>

          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-5 pr-4 border-r border-[#DDD0B5]/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🇮🇳</span>
                    <span className="text-sm font-bold text-[#100C06]">+91</span>
                  </div>
                </div>
                <Input 
                  placeholder="10-digit mobile number" 
                  className="h-16 pl-[100px] pr-[100px] rounded-2xl border-2 border-[#DDD0B5] focus-visible:ring-primary focus-visible:border-primary font-bold text-lg"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  required
                />
                <button 
                  disabled={loading || phone.length < 10}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-[#0D3520] hover:bg-[#1B5E3B] text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {loading ? '...' : 'Login'}
                </button>
              </div>

              {error && <div className="text-[11px] font-bold text-destructive text-center bg-destructive/5 py-2 rounded-lg">{error}</div>}

              <div className="flex items-start gap-3 px-2">
                <Info className="w-4 h-4 text-[#7A6848] shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#7A6848] font-medium leading-relaxed uppercase tracking-wider">
                  By proceeding, you are agreeing to our <strong className="text-primary cursor-pointer hover:underline">T&C</strong> and <strong className="text-primary cursor-pointer hover:underline">Privacy Policy</strong>.
                </p>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <p className="text-sm text-[#7A6848] font-medium">Enter 6-digit code sent to +91 {phone}</p>
                <button type="button" onClick={() => setStep('phone')} className="text-[10px] font-black uppercase text-primary mt-1 hover:underline">Change Number</button>
              </div>
              <Input 
                placeholder="· · · · · ·" 
                className="h-20 rounded-2xl border-2 border-primary/20 font-headline text-5xl text-center font-extrabold tracking-[12px] focus-visible:ring-primary"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
              {error && <div className="text-[11px] font-bold text-destructive text-center">{error}</div>}
              <Button disabled={loading} className="w-full h-16 bg-primary text-white rounded-full font-black uppercase tracking-[2px] shadow-xl">
                {loading ? 'Verifying...' : 'Verify OTP →'}
              </Button>
            </form>
          )}

          {step === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-2">
                <div className="text-[10px] font-black text-primary uppercase tracking-[3px] mb-1">Nearly There!</div>
                <p className="text-xs text-[#7A6848] font-medium">Complete your profile to earn 500 Purity Coins.</p>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                  <Input 
                    placeholder="Your Full Name" 
                    className="h-14 pl-12 rounded-2xl bg-[#F9F6EF] border-transparent font-bold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                  <Input 
                    type="email"
                    placeholder="Email Address" 
                    className="h-14 pl-12 rounded-2xl bg-[#F9F6EF] border-transparent font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <div className="text-[11px] font-bold text-destructive text-center">{error}</div>}
              <Button disabled={loading} className="w-full h-16 bg-primary text-white rounded-full font-black uppercase tracking-[2px] shadow-xl">
                {loading ? 'Saving...' : 'Complete Registration 🌿'}
              </Button>
            </form>
          )}

          <div className="mt-10 flex items-center justify-center gap-2 opacity-40">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#7A6848]">Powered by</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-2 h-2 text-white" />
              </div>
              <span className="text-[10px] font-black text-primary italic">Shiprocket</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
