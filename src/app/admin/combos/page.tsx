
"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Trash2, Pen, Plus, Camera, X, Layers, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Combo } from '@/types';
import { cn } from '@/lib/utils';

export default function AdminCombosPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const combosRef = useMemoFirebase(() => collection(db, 'combos'), [db]);
  const { data: combos, isLoading } = useCollection<Combo>(combosRef);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [offerText, setOfferText] = useState('');
  const [buttonText, setButtonText] = useState('Shop Now');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [mrpPrice, setMrpPrice] = useState('');
  const [order, setOrder] = useState('1');
  const [bgImage, setBgImage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) {
        toast({ variant: "destructive", title: "Image too large", description: "Limit: 800KB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setBgImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (c: Combo) => {
    setEditingId(c.id);
    setTitle(c.title);
    setSubtitle(c.subtitle);
    setOfferText(c.offerText);
    setButtonText(c.buttonText);
    setDesc(c.description);
    setPrice(String(c.price));
    setMrpPrice(String(c.mrpPrice));
    setOrder(String(c.order));
    setBgImage(c.backgroundImage);
    setIsAddOpen(true);
  };

  const handleAdd = () => {
    if (!title || !price || !bgImage) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Title, price and background are required." });
      return;
    }

    const comboData = {
      title,
      subtitle,
      offerText,
      buttonText,
      description: desc,
      price: Number(price),
      mrpPrice: Number(mrpPrice) || Number(price),
      order: Number(order),
      backgroundImage: bgImage,
      isActive: true,
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      setDocumentNonBlocking(doc(db, 'combos', editingId), comboData, { merge: true });
      toast({ title: "Combo Updated" });
    } else {
      addDocumentNonBlocking(collection(db, 'combos'), { ...comboData, createdAt: new Date().toISOString() });
      toast({ title: "Combo Published" });
    }
    
    resetForm();
    setIsAddOpen(false);
  };

  const resetForm = () => {
    setTitle(''); setSubtitle(''); setOfferText(''); setButtonText('Shop Now');
    setDesc(''); setPrice(''); setMrpPrice(''); setOrder('1'); setBgImage(''); setEditingId(null);
  };

  const toggleStatus = (id: string, current: boolean) => {
    updateDocumentNonBlocking(doc(db, 'combos', id), { isActive: !current });
  };

  if (isLoading) return <div className="min-h-[400px] flex items-center justify-center font-headline text-2xl font-extrabold text-primary animate-pulse">Syncing Combos...</div>;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#100C06]">Combo Management</h1>
          <p className="text-[#7A6848] text-sm mt-2 font-medium">Manage homepage promotions and the dedicated bundles page.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={(v) => { if(!v) resetForm(); setIsAddOpen(v); }}>
          <DialogTrigger asChild>
            <button className="h-12 px-8 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Combo
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl rounded-[40px] p-10 border-none shadow-2xl font-body overflow-y-auto max-h-[90vh]">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-headline text-3xl font-extrabold text-primary">{editingId ? 'Edit' : 'New'} Promo Combo</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#7A6848]">Main Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold" placeholder="e.g. A2 Ghee Combo" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#7A6848]">Subtitle / Badge</label>
                  <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold" placeholder="e.g. Limited Edition" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[#7A6848]">Sale Price (₹)</label>
                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[#7A6848]">MRP Price (₹)</label>
                    <Input type="number" value={mrpPrice} onChange={(e) => setMrpPrice(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#7A6848]">Combo Description</label>
                  <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="rounded-xl bg-[#F9F6EF] border-transparent font-bold min-h-[100px]" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#7A6848]">Background Image</label>
                  <div className="relative aspect-[16/9] rounded-2xl bg-[#F9F6EF] overflow-hidden border-2 border-dashed border-[#DDD0B5] flex items-center justify-center">
                    {bgImage ? (
                      <>
                        <Image src={bgImage} alt="Preview" fill className="object-cover" />
                        <button onClick={() => setBgImage('')} className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-destructive"><X className="w-4 h-4" /></button>
                      </>
                    ) : (
                      <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 text-[#7A6848]">
                        <Camera className="w-8 h-8" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Select Image (16:9)</span>
                      </button>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[#7A6848]">Offer Text</label>
                    <Input value={offerText} onChange={(e) => setOfferText(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold" placeholder="Save 19%" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[#7A6848]">Display Order</label>
                    <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#7A6848]">Button Text</label>
                  <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold" />
                </div>
              </div>
            </div>

            <Button onClick={handleAdd} className="w-full h-16 bg-primary text-white rounded-full font-black uppercase tracking-widest shadow-xl mt-10">
              {editingId ? 'Update Combo' : 'Publish Promo'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos?.map((c) => (
          <Card key={c.id} className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white group">
            <div className="aspect-[16/9] relative">
              <Image src={c.backgroundImage} alt={c.title} fill className="object-cover" />
              <div className={cn(
                "absolute top-4 right-4 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg",
                c.isActive ? "bg-primary text-white" : "bg-destructive text-white"
              )}>
                {c.isActive ? 'Active' : 'Hidden'}
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-headline font-black text-primary">{c.title}</h3>
                  <p className="text-[10px] font-bold text-[#7A6848] uppercase tracking-widest">{c.subtitle}</p>
                </div>
                <span className="text-sm font-black text-secondary">{c.offerText}</span>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={() => handleEdit(c)} variant="outline" className="flex-1 h-10 rounded-xl border-[#DDD0B5] text-[10px] font-black uppercase">Edit</Button>
                <Button onClick={() => toggleStatus(c.id, c.isActive)} variant="outline" className="flex-1 h-10 rounded-xl border-[#DDD0B5] text-[10px] font-black uppercase">
                  {c.isActive ? 'Hide' : 'Show'}
                </Button>
                <button onClick={() => deleteDocumentNonBlocking(doc(db, 'combos', c.id))} className="w-10 h-10 rounded-xl bg-destructive/5 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
