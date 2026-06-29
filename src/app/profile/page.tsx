
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, updateDoc, collection, query, where, limit } from 'firebase/firestore';
import { User, MapPin, Package, Coins, ChevronRight, LogOut, ShieldCheck, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { UserProfile, Address } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const userRef = useMemoFirebase(() => user ? doc(db, 'userProfiles', user.uid) : null, [db, user]);
  const { data: profile, isLoading: profileLoading } = useDoc<UserProfile>(userRef);

  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'orders'), where('userId', '==', user.uid), limit(3));
  }, [db, user]);
  const { data: recentOrders } = useCollection(ordersQuery);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phoneNumber: '' });

  const handleEditToggle = () => {
    if (profile) {
      setFormData({ 
        firstName: profile.firstName || '', 
        lastName: profile.lastName || '', 
        phoneNumber: profile.phoneNumber || '' 
      });
      setIsEditing(!isEditing);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userRef) return;
    try {
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Profile Updated", description: "Your changes have been saved." });
      setIsEditing(false);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'home') router.push('/');
    else if (tab === 'wishlist') router.push('/wishlist');
    else if (tab === 'account') router.push('/track');
    else if (tab === 'profile') router.push('/profile');
  };

  if (isUserLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex flex-col items-center justify-center p-10 text-center">
        <User className="w-20 h-20 text-primary/10 mb-6" />
        <h1 className="font-headline text-4xl font-extrabold text-primary mb-4">Please login to view profile</h1>
        <Button onClick={() => router.push('/login')} className="bg-primary text-white rounded-full px-10 h-14 font-black uppercase tracking-widest">Sign In Now</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-[100px] md:pb-0">
      <Ticker />
      <Header onOpenCart={() => router.push('/checkout')} cartCount={0} onFilter={() => {}} onSearch={() => {}} />

      <main className="max-w-[1200px] mx-auto px-5 py-10 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar / User Info */}
          <aside className="lg:w-1/3 space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-primary/5 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <ShieldCheck className="w-24 h-24 text-primary" />
               </div>
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                 <span className="text-3xl font-headline font-black text-primary">
                   {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                 </span>
               </div>
               <h2 className="font-headline text-3xl font-extrabold text-primary">
                 {profile?.firstName} {profile?.lastName}
               </h2>
               <p className="text-sm text-[#7A6848] font-medium">{profile?.email}</p>
               
               <div className="mt-8 pt-8 border-t border-[#F9F6EF] flex justify-center gap-10">
                 <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-[#AFA18B] mb-1">Coins</div>
                   <div className="flex items-center justify-center gap-1.5 font-headline text-2xl font-black text-primary">
                     <Coins className="w-4 h-4 text-[#D4A94D]" /> {profile?.purityCoins || 0}
                   </div>
                 </div>
                 <div className="w-px h-10 bg-[#F9F6EF]"></div>
                 <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-[#AFA18B] mb-1">Orders</div>
                   <div className="font-headline text-2xl font-black text-primary">
                     {recentOrders?.length || 0}
                   </div>
                 </div>
               </div>
            </div>

            <nav className="bg-white rounded-[32px] p-4 shadow-xl border border-primary/5 space-y-1">
              {[
                { label: 'My Orders', icon: Package, href: '/track' },
                { label: 'Saved Addresses', icon: MapPin, action: () => document.getElementById('addresses')?.scrollIntoView({ behavior: 'smooth' }) },
                { label: 'Terms & Conditions', icon: ShieldCheck, href: '/about' },
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={item.action || (() => item.href && router.push(item.href))}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary/60 group-hover:text-primary transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-[#100C06]">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#DDD0B5]" />
                </button>
              ))}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-destructive/5 text-destructive transition-all group mt-4"
              >
                <div className="w-10 h-10 bg-destructive/5 rounded-xl flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Logout Account</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-10">
            {/* Account Settings */}
            <section className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-primary/5">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="font-headline text-3xl font-extrabold text-primary">Account Details</h3>
                  <p className="text-xs text-[#7A6848] font-medium mt-1">Keep your farm-direct profile updated.</p>
                </div>
                <Button onClick={handleEditToggle} variant="outline" className="rounded-full h-11 px-6 border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest">
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#AFA18B]">First Name</label>
                  <Input 
                    disabled={!isEditing} 
                    value={isEditing ? formData.firstName : (profile?.firstName || '')} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#AFA18B]">Last Name</label>
                  <Input 
                    disabled={!isEditing} 
                    value={isEditing ? formData.lastName : (profile?.lastName || '')}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#AFA18B]">Email Address</label>
                  <Input 
                    disabled 
                    value={profile?.email || ''} 
                    className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#AFA18B]">Phone Number</label>
                  <Input 
                    disabled={!isEditing} 
                    value={isEditing ? formData.phoneNumber : (profile?.phoneNumber || 'Not provided')}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-10 pt-10 border-t border-[#F9F6EF]">
                  <Button onClick={handleUpdateProfile} className="w-full h-16 bg-primary text-white rounded-full font-black uppercase tracking-[2px] shadow-xl">
                    Save Changes ✦
                  </Button>
                </div>
              )}
            </section>

            {/* Saved Locations */}
            <section id="addresses" className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-primary/5">
               <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="font-headline text-3xl font-extrabold text-primary">Saved Locations</h3>
                  <p className="text-xs text-[#7A6848] font-medium mt-1">Faster checkout for your next harvest.</p>
                </div>
                <Button variant="ghost" className="text-primary font-black uppercase text-[10px] tracking-widest gap-2">
                  <Plus className="w-4 h-4" /> Add New
                </Button>
              </div>

              <div className="space-y-4">
                {profile?.addresses && profile.addresses.length > 0 ? (
                  profile.addresses.map((addr, i) => (
                    <div key={i} className="group relative p-6 rounded-[24px] border-2 border-[#F9F6EF] hover:border-primary/20 transition-all flex items-start gap-5">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-primary/40" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-sm text-[#100C06]">{addr.name}</span>
                          {addr.isDefault && <span className="bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        <p className="text-xs text-[#7A6848] leading-relaxed font-medium">
                          {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-[10px] text-[#7A6848]/40 font-bold mt-2">{addr.phone}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 rounded-xl bg-[#F9F6EF] text-primary/60 hover:text-primary transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                         <button className="p-2 rounded-xl bg-destructive/5 text-destructive/40 hover:text-destructive transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center bg-[#FDFBFA] rounded-[32px] border-2 border-dashed border-[#DDD0B5]">
                    <MapPin className="w-10 h-10 text-primary/10 mx-auto mb-4" />
                    <p className="text-sm text-[#7A6848] font-medium">No saved addresses found.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      
      <BottomNav activeTab="profile" onTabChange={handleTabChange} cartCount={0} />
    </div>
  );
}
