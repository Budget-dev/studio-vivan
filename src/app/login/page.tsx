
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ShieldCheck, Mail, Lock, User as UserIcon, LogIn, Sparkles } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const returnTo = searchParams.get('returnTo') || '/';
  
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();

  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push(returnTo);
    }
  }, [user, isUserLoading, router, returnTo]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        
        await setDoc(doc(db, 'userProfiles', result.user.uid), {
          id: result.user.uid,
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
          email: email.toLowerCase().trim(),
          purityCoins: 500,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });

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
      
      // Sync Profile
      await setDoc(doc(db, 'userProfiles', result.user.uid), {
        id: result.user.uid,
        firstName: result.user.displayName?.split(' ')[0] || '',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: result.user.email?.toLowerCase().trim(),
        purityCoins: 500,
        updatedAt: new Date().toISOString()
      }, { merge: true });

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
    <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-primary/5 overflow-hidden">
      <div className="bg-primary p-10 text-center relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-white rotate-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="font-headline text-3xl font-extrabold text-white">Join Vivaan Farms</h1>
        <p className="text-white/40 text-[9px] font-black uppercase tracking-[3px] mt-2">Authentic Purity Gateway</p>
      </div>

      <div className="p-8 md:p-10">
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12 rounded-xl bg-[#F9F6EF] p-1">
            <TabsTrigger value="email" className="rounded-lg font-bold text-xs uppercase tracking-widest">Email</TabsTrigger>
            <TabsTrigger value="social" className="rounded-lg font-bold text-xs uppercase tracking-widest">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailAuth} className="space-y-5">
              {authMode === 'register' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                    <Input 
                      placeholder="Farmer Name" 
                      className="h-14 pl-12 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base focus-visible:ring-primary"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={authMode === 'register'}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                  <Input 
                    type="email"
                    placeholder="pure@farm.com" 
                    className="h-14 pl-12 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base focus-visible:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    className="h-14 pl-12 rounded-2xl bg-[#F9F6EF] border-transparent font-bold text-base focus-visible:ring-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button disabled={loading} className="w-full h-16 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[2px] shadow-xl">
                {loading ? 'Processing...' : (authMode === 'login' ? 'Sign In →' : 'Create Account →')}
              </Button>

              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-[10px] font-black uppercase text-primary hover:underline"
                >
                  {authMode === 'login' ? "Don't have an account? Register" : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="social">
            <div className="space-y-4">
              <Button 
                onClick={handleGoogleAuth} 
                variant="outline" 
                disabled={loading}
                className="w-full h-16 rounded-full border-2 border-[#DDD0B5] hover:bg-primary/5 flex items-center justify-center gap-4 transition-all"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                <span className="font-black uppercase tracking-widest text-xs">Continue with Google</span>
              </Button>
              <p className="text-[10px] text-center text-[#7A6848] font-bold uppercase tracking-widest px-10 leading-relaxed">
                Fast & Secure sign-in using your verified Google credentials.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-[9px] text-center text-[#7A6848] font-bold mt-10 uppercase tracking-wider leading-relaxed opacity-60">
          By proceeding, you agree to our <br /><strong>Terms of Service</strong> & <strong>Privacy Policy</strong>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06]">
      <Ticker />
      <Header onOpenCart={() => {}} cartCount={0} onFilter={() => {}} onSearch={() => {}} />

      <main className="max-w-[1200px] mx-auto px-5 py-12 md:py-20 flex flex-col items-center justify-center">
        <Suspense fallback={<div className="w-full max-w-md h-[600px] bg-white rounded-[40px] animate-pulse" />}>
          <LoginContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
