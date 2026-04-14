
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Mail, Lock, User as UserIcon, ShieldCheck, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const [mode, setMode] = useState<'login' | 'register' | 'social'>('social');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setMode('social');
      setEmail('');
      setPassword('');
      setName('');
    }
  }, [isOpen]);

  const syncProfile = async (user: any) => {
    await setDoc(doc(db, 'userProfiles', user.uid), {
      id: user.uid,
      firstName: user.displayName?.split(' ')[0] || '',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
      email: user.email?.toLowerCase().trim(),
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all backdrop-blur-md"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-primary p-8 text-center relative overflow-hidden">
          <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full bg-white/5 pointer-events-none"></div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-headline text-2xl font-extrabold text-white">Purity Account</h2>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[2px] mt-1">Vivaan Farms Traditional Goods</p>
        </div>

        <div className="p-8">
          {mode === 'social' ? (
            <div className="space-y-4">
              <Button 
                onClick={handleGoogleAuth} 
                disabled={loading}
                className="w-full h-14 bg-white border-2 border-[#DDD0B5] text-foreground hover:bg-[#F9F6EF] rounded-2xl flex items-center justify-center gap-3"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-[10px]">Continue with Google</span>
              </Button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#DDD0B5]"></span></div>
                <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest text-[#7A6848]"><span className="bg-white px-2">Or use Email</span></div>
              </div>
              <Button 
                onClick={() => setMode('login')}
                className="w-full h-14 bg-[#F9F6EF] text-[#7A6848] hover:bg-[#DDD0B5] rounded-2xl flex items-center justify-center gap-3"
              >
                <Mail className="w-4 h-4" />
                <span className="font-black uppercase tracking-widest text-[10px]">Sign In with Password</span>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[#7A6848]">Full Name</label>
                  <Input 
                    placeholder="Your Name" 
                    className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[#7A6848]">Email</label>
                <Input 
                  type="email"
                  placeholder="name@email.com" 
                  className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[#7A6848]">Password</label>
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button disabled={loading} className="w-full h-14 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg mt-4">
                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In →' : 'Register →')}
              </Button>
              <div className="flex justify-between items-center mt-4">
                <button type="button" onClick={() => setMode('social')} className="text-[9px] font-black uppercase text-[#7A6848] hover:underline">← Back</button>
                <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-[9px] font-black uppercase text-primary hover:underline">
                  {mode === 'login' ? "New here? Register" : "Existing user? Sign In"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
