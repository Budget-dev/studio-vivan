
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded credentials as requested
    if (username === 'admin' && password === 'admin@123') {
      localStorage.setItem('vivaan_admin_auth', 'true');
      toast({
        title: "Login Successful",
        description: "Welcome to Vivaan Farms Admin Panel",
      });
      router.push('/admin');
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid username or password",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF] p-4 font-body">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-[32px] overflow-hidden">
        <div className="bg-primary p-8 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <i className="fa-solid fa-shield-halved text-3xl"></i>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-white">Vivaan Admin</h1>
          <p className="text-white/60 text-sm mt-1">Authorized Personnel Only</p>
        </div>
        <CardContent className="p-8 pt-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#7A6848]">Username</label>
              <Input 
                type="text" 
                placeholder="Enter admin username"
                className="h-12 rounded-xl bg-[#F9F6EF] border-transparent focus:border-primary transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#7A6848]">Password</label>
              <Input 
                type="password" 
                placeholder="Enter password"
                className="h-12 rounded-xl bg-[#F9F6EF] border-transparent focus:border-primary transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-widest shadow-xl transition-all"
            >
              {isLoading ? 'Verifying...' : 'Access Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
