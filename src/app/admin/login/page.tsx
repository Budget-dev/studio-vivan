"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ShieldCheck, Lock, Mail, Sparkles, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Admin Login Page
 * Strictly hardcodes the master admin email and provides a one-time initialization flow.
 * Also ensures admin status is synced to Firestore adminRoles collection.
 */
export default function AdminLoginPage() {
  const ADMIN_EMAIL = 'vivanfarmsnatural@gmail.com';
  
  const [password, setPassword] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      // Ensure admin role document exists upon successful landing
      setDoc(doc(db, 'adminRoles', user.uid), {
        email: ADMIN_EMAIL,
        role: 'admin',
        lastVerifiedAt: new Date().toISOString()
      }, { merge: true });
      
      router.push('/admin');
    }
  }, [user, router, ADMIN_EMAIL, db]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let userCredential;
      if (isSetupMode) {
        // One-time initialization logic
        userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, password);
        
        // Explicitly create the admin role document in Firestore to grant DB access
        // The security rules allow vivanfarmsnatural@gmail.com to self-provision
        await setDoc(doc(db, 'adminRoles', userCredential.user.uid), {
          email: ADMIN_EMAIL,
          role: 'admin',
          initializedAt: new Date().toISOString()
        });

        toast({
          title: "Admin Initialized",
          description: "Your master credentials have been set. Welcome to Vivaan Farms.",
        });
      } else {
        // Standard Sign In
        userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
        
        // Ensure the admin role document exists (synchronize privileges)
        await setDoc(doc(db, 'adminRoles', userCredential.user.uid), {
          email: ADMIN_EMAIL,
          role: 'admin',
          lastLoginAt: new Date().toISOString()
        }, { merge: true });

        toast({
          title: "Admin Verified",
          description: "Welcome back to the Vivaan Farms Dashboard.",
        });
      }
      router.push('/admin');
    } catch (e: any) {
      console.error("Auth Error:", e.code, e.message);
      if (e.code === 'auth/email-already-in-use') {
        setError("Admin account is already initialized. Please use the Sign In form.");
        setIsSetupMode(false);
      } else if (e.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else if (e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        setError("Invalid credentials. Please check your password.");
      } else {
        setError("Access Denied. Ensure you are an authorized administrator.");
      }
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
        <div className={`p-12 text-center relative transition-colors duration-500 ${isSetupMode ? 'bg-secondary' : 'bg-primary'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          <div className="w-20 h-20 bg-white/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 text-white rotate-3">
            {isSetupMode ? <KeyRound className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
          </div>
          <h1 className="font-headline text-4xl font-extrabold text-white">
            {isSetupMode ? 'Admin Setup' : 'Admin Portal'}
          </h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mt-2">
            {isSetupMode ? 'Initialize Master Password' : 'Secure Dashboard Access'}
          </p>
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
              <label className="text-[11px] font-black uppercase tracking-widest text-[#7A6848]">
                {isSetupMode ? 'New Admin Password' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSetupMode ? "Create a strong password" : "Enter your secret password"}
                  className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base px-14 focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-destructive/5 text-destructive rounded-2xl text-[11px] font-bold text-center leading-relaxed animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <Button 
              disabled={isLoading} 
              className={`w-full h-16 rounded-full font-black uppercase tracking-[3px] shadow-xl mt-4 transition-all ${isSetupMode ? 'bg-secondary hover:bg-primary' : 'bg-primary hover:bg-secondary'}`}
            >
              {isLoading 
                ? (isSetupMode ? 'Initializing...' : 'Authenticating...') 
                : (isSetupMode ? 'Set Password & Initialize →' : 'Sign In to Dashboard →')
              }
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#DDD0B5]/30 text-center space-y-4">
            {!isSetupMode ? (
              <button 
                onClick={() => { setIsSetupMode(true); setError(null); }}
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                <Sparkles className="w-3.5 h-3.5" /> First-time use? Initialize Credentials
              </button>
            ) : (
              <button 
                onClick={() => { setIsSetupMode(false); setError(null); }}
                className="text-[10px] font-black uppercase tracking-widest text-[#7A6848] hover:underline"
              >
                ← Back to Login
              </button>
            )}
            
            <p className="text-[9px] text-[#7A6848] font-medium leading-relaxed italic opacity-60">
              Only authorized farm administrators can access this secure environment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}