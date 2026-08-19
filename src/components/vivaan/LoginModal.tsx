"use client";

import React, { useState, useEffect, useId } from 'react';
import Image from 'next/image';
import { X, Mail, Lock, User as UserIcon, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuth, useFirestore } from '@/firebase';
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

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const id = useId();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setMode('login');
      resetFields();
    }
  }, [isOpen]);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPhone('');
  };

  const syncProfile = async (user: any) => {
    await setDoc(doc(db, 'userProfiles', user.uid), {
      id: user.uid,
      firstName: user.displayName?.split(' ')[0] || name.split(' ')[0] || '',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || name.split(' ').slice(1).join(' ') || '',
      email: user.email?.toLowerCase().trim(),
      phoneNumber: phone || user.phoneNumber || '',
      purityCoins: 500,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncProfile(result.user);
      toast({ title: "Welcome!", description: "Logged in with Google." });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Login Failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords Mismatch", description: "Please ensure both passwords are the same." });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await syncProfile(result.user);
        toast({ title: "Account Created", description: "Welcome to Vivaan Farms!" });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Success", description: "Logged in successfully." });
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Authentication Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[420px] p-8 md:p-10 rounded-[28px] border-none shadow-2xl font-body">
        <div className="flex flex-col items-center gap-6">
          {/* Logo Container */}
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm overflow-hidden p-2">
            <div className="relative w-full h-full">
              <Image 
                src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png" 
                alt="Vivaan Farms" 
                fill 
                className="object-contain"
              />
            </div>
          </div>

          <DialogHeader className="space-y-2">
            <DialogTitle className="text-center font-headline text-3xl font-extrabold text-primary">
              {mode === 'login' ? 'Welcome back' : 'Join the Farm'}
            </DialogTitle>
            <DialogDescription className="text-center text-[#7A6848] text-sm font-medium">
              {mode === 'login' 
                ? 'Enter your credentials to login to your account.' 
                : 'Create your purity account to start earning rewards.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleAuth} className="space-y-6 mt-8">
          <div className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor={`${id}-name`} className="text-[11px] font-black uppercase tracking-wider text-[#AFA18B]">Full Name</Label>
                  <Input 
                    id={`${id}-name`} 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold focus-visible:ring-primary/20" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${id}-phone`} className="text-[11px] font-black uppercase tracking-wider text-[#AFA18B]">Phone Number</Label>
                  <Input 
                    id={`${id}-phone`} 
                    type="tel"
                    placeholder="+91 00000 00000" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold focus-visible:ring-primary/20" 
                    required 
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`} className="text-[11px] font-black uppercase tracking-wider text-[#AFA18B]">Email Address</Label>
              <Input 
                id={`${id}-email`} 
                placeholder="name@email.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold focus-visible:ring-primary/20" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-password`} className="text-[11px] font-black uppercase tracking-wider text-[#AFA18B]">Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold focus-visible:ring-primary/20"
                required
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor={`${id}-confirm`} className="text-[11px] font-black uppercase tracking-wider text-[#AFA18B]">Confirm Password</Label>
                <Input
                  id={`${id}-confirm`}
                  placeholder="Re-enter your password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold focus-visible:ring-primary/20"
                  required
                />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-remember`} className="rounded-md border-[#DDD0B5] data-[state=checked]:bg-primary" />
              <Label htmlFor={`${id}-remember`} className="text-xs font-medium text-[#7A6848] cursor-pointer">
                Remember me
              </Label>
            </div>
            <button type="button" className="text-xs font-bold text-primary underline hover:no-underline">
              Forgot password?
            </button>
          </div>

          <Button disabled={loading} type="submit" className="w-full h-14 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]">
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In →' : 'Create Account →')}
          </Button>

          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[10px] font-black uppercase tracking-widest text-[#7A6848] hover:text-primary transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3 my-6 before:h-px before:flex-1 before:bg-[#F1EAD8] after:h-px after:flex-1 after:bg-[#F1EAD8]">
          <span className="text-[10px] font-black uppercase text-[#AFA18B]">Or</span>
        </div>

        <Button 
          onClick={handleGoogleAuth}
          disabled={loading}
          variant="outline" 
          className="w-full h-14 rounded-full border-[#F1EAD8] hover:bg-[#F9F6EF] flex items-center justify-center gap-4 transition-all"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest text-xs">Continue with Google</span>
        </Button>

        <p className="text-[9px] text-center text-[#AFA18B] font-bold mt-8 uppercase tracking-widest leading-relaxed opacity-60 px-4">
          By proceeding, you agree to our <strong>Terms of Service</strong> & <strong>Privacy Policy</strong>
        </p>
      </DialogContent>
    </Dialog>
  );
};
