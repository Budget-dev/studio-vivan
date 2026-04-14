"use client";

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, serverTimestamp, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Search, Plus, ExternalLink, Pen, Trash2, Camera, X, Zap, Star } from 'lucide-react';

interface ProductCategoryManagerProps {
  category: string;
  title: string;
  description: string;
  icon: string;
}

export const ProductCategoryManager: React.FC<ProductCategoryManagerProps> = ({ 
  category, 
  title, 
  description,
  icon
}) => {
  const db = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Strictly filter products by category to ensure the admin only sees relevant items
  const productsQuery = useMemoFirebase(() => 
    query(collection(db, 'products'), where('categoryId', '==', category.toLowerCase())), 
    [db, category]
  );
  const { data: products, isLoading } = useCollection(productsQuery);
  
  const [searchTerm, setSearchValue] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [mrpPrice, setMrpPrice] = useState('');
  const [stock, setStock] = useState('');
  const [desc, setDesc] = useState('');
  const [rating, setRating] = useState('4.9');
  const [reviews, setReviews] = useState('120');
  const [soldLabel, setSoldLabel] = useState('1.5k+');
  const [statusBadge, setStatusBadge] = useState('Selling Fast');
  const [topBadge, setTopBadge] = useState('New Launch');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (!name || !price) {
      alert("Please provide at least a name and price.");
      return;
    }

    const catId = category.toLowerCase();
    
    const newProduct = {
      name,
      basePrice: Number(price),
      mrpPrice: Number(mrpPrice) || Number(price),
      stockQuantity: Number(stock) || 100,
      description: desc || name,
      rating: Number(rating) || 4.9,
      reviewCount: Number(reviews) || 0,
      soldCountLabel: soldLabel || "New",
      statusBadge: statusBadge || "",
      badges: topBadge ? [topBadge] : [],
      categoryId: catId,
      imageUrls: uploadedImages.length > 0 ? uploadedImages : [],
      isLive: true, // Crucial for showing in storefront
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      volumeValue: catId === 'ghee' ? 500 : (catId === 'honey' ? 250 : 1),
      volumeUnit: catId === 'ghee' ? 'ml' : (catId === 'honey' ? 'g' : 'unit'),
      vars: [{ s: 'Standard', p: Number(price), on: true }]
    };

    addDocumentNonBlocking(collection(db, 'products'), newProduct);
    setIsAddOpen(false);
    
    // Reset form
    setName(''); setPrice(''); setMrpPrice(''); setStock(''); setDesc(''); setUploadedImages([]);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteDocumentNonBlocking(doc(db, 'products', id));
    }
  };

  if (isLoading) {
    return <div className="min-h-[400px] flex items-center justify-center font-headline text-2xl font-extrabold text-primary animate-pulse">Loading {title}...</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <i className={cn("fa-solid", icon)}></i>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#100C06]">{title}</h1>
          </div>
          <p className="text-[#7A6848] text-sm font-medium">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank">
            <Button variant="outline" className="h-12 px-6 rounded-2xl border-[#DDD0B5] text-[#7A6848] font-bold text-xs uppercase tracking-widest hidden lg:flex items-center gap-2">
              View Website <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <button className="h-12 px-8 bg-[#1B5E3B] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-secondary transition-all flex items-center gap-2">
                <i className="fa-solid fa-plus"></i> Add New {category}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl rounded-[40px] p-10 border-none shadow-2xl font-body overflow-y-auto max-h-[90vh]">
              <DialogHeader className="mb-8">
                <DialogTitle className="font-headline text-3xl font-extrabold text-primary">Register {category}</DialogTitle>
                <p className="text-xs text-[#7A6848] font-medium">Create a high-conversion product listing.</p>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Product Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="e.g. A2 Gir Cow Ghee" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Sale Price (₹)</label>
                      <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">MRP Price (₹)</label>
                      <Input type="number" value={mrpPrice} onChange={(e) => setMrpPrice(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="0.00" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Stock</label>
                      <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Rating</label>
                      <Input value={rating} onChange={(e) => setRating(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="4.9" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Description</label>
                    <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="rounded-xl bg-[#F9F6EF] border-transparent px-5 py-4 font-bold min-h-[100px]" placeholder="Brief story about the product..." />
                  </div>
                </div>

                {/* Right Column: Visuals & Badges */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Product Images (Main & Hover)</label>
                    <div className="flex flex-wrap gap-3">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/10">
                          <Image src={img} alt="Preview" fill className="object-cover" />
                          <div className="absolute top-0 left-0 bg-primary/90 text-white text-[7px] font-black px-1.5 py-0.5 rounded-br-lg uppercase">
                            {idx === 0 ? 'Main' : idx === 1 ? 'Hover' : `Gallery`}
                          </div>
                          <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-xl border-2 border-dashed border-[#DDD0B5] flex flex-col items-center justify-center gap-1 text-[#7A6848] hover:border-primary hover:text-primary transition-all bg-[#F9F6EF]">
                        <Camera className="w-5 h-5" />
                        <span className="text-[7px] font-black uppercase tracking-widest">Upload</span>
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
                    </div>
                    <p className="text-[9px] text-[#7A6848] font-bold italic mt-1">* 1st img: Static display | 2nd img: Shown on hover</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848] flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> Status Badge</label>
                      <Input value={statusBadge} onChange={(e) => setStatusBadge(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="e.g. Selling Fast" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848] flex items-center gap-1"><Star className="w-2.5 h-2.5" /> Top Badge</label>
                      <Input value={topBadge} onChange={(e) => setTopBadge(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="e.g. New Launch" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Social Proof (🔥)</label>
                      <Input value={soldLabel} onChange={(e) => setSoldLabel(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="e.g. 1.5k+" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Review Count</label>
                      <Input type="number" value={reviews} onChange={(e) => setReviews(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="278" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1 h-14 rounded-full border-[#DDD0B5] font-black uppercase tracking-widest text-[#7A6848]">Cancel</Button>
                <Button onClick={handleAdd} className="flex-1 h-14 bg-[#1B5E3B] hover:bg-secondary rounded-full font-black uppercase tracking-widest shadow-xl text-white">Save High-Converting Listing</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-none shadow-xl rounded-[40px] overflow-hidden bg-white">
        <div className="p-8 border-b border-[#F9F6EF] flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6848] w-4 h-4" />
            <Input 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-12 pl-11 rounded-full bg-[#F9F6EF] border-transparent focus-visible:bg-white focus-visible:border-primary/20 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-4 text-[#7A6848] font-bold text-xs">
            <span className="uppercase tracking-widest">{products?.length || 0} Products in {category}</span>
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-[#FDFBFA]">
            <TableRow className="border-b-[#F9F6EF]">
              <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Visual</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Product Info</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Price (₹)</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Performance</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Stock</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848] text-right px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? filteredProducts.map((p) => (
              <TableRow key={p.id} className="border-b-[#F9F6EF] hover:bg-[#FDFBFA] transition-colors group">
                <TableCell className="py-4 px-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#F9F6EF] overflow-hidden relative border border-[#DDD0B5]/30">
                    <Image 
                      src={p.imageUrls?.[0] || 'https://picsum.photos/seed/vivaan/100/100'} 
                      alt={p.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-[#100C06]">{p.name}</div>
                    <div className="flex gap-1">
                      {p.badges?.map((b, i: number) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-primary/5 text-primary text-[8px] font-black uppercase">{b}</span>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#7A6848] line-through opacity-50">₹{p.mrpPrice}</span>
                    <span className="text-sm font-black text-foreground">₹{p.basePrice?.toLocaleString('en-IN')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-xs font-bold"><Star className="w-3 h-3 text-primary fill-current" /> {p.rating}</div>
                    <div className="text-[10px] text-[#7A6848] font-medium">{p.soldCountLabel} sold</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "text-sm font-bold",
                    (p.stockQuantity || 0) <= 5 ? "text-destructive" : "text-[#7A6848]"
                  )}>{p.stockQuantity || 0}</span>
                </TableCell>
                <TableCell className="text-right px-8 space-x-2">
                  <button className="w-9 h-9 rounded-xl text-[#7A6848] hover:bg-primary/5 transition-all"><Pen className="w-4 h-4 mx-auto" /></button>
                  <button onClick={() => handleDelete(p.id)} className="w-9 h-9 rounded-xl text-destructive/40 hover:text-destructive hover:bg-destructive/5 transition-all"><Trash2 className="w-4 h-4 mx-auto" /></button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center text-[#7A6848] font-medium italic">
                  No {category} listings yet. Start with a high-quality photo!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
