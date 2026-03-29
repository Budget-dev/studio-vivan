"use client";

import React, { useState, useMemo } from 'react';
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
import { Search, Plus, ExternalLink, Pen, Trash2, LayoutGrid } from 'lucide-react';

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
  const [stock, setStock] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleAdd = () => {
    const newProduct = {
      name,
      basePrice: Number(price),
      stockQuantity: Number(stock),
      description: desc,
      categoryId: category.toLowerCase(),
      imageUrls: [image || 'https://picsum.photos/seed/vivaan/400/400'],
      isLive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      volumeValue: category === 'ghee' ? 500 : 250,
      volumeUnit: category === 'ghee' ? 'ml' : 'g',
      variants: [{ s: 'Standard', p: Number(price), on: true }]
    };

    addDocumentNonBlocking(collection(db, 'products'), newProduct);
    setIsAddOpen(false);
    // Reset form
    setName(''); setPrice(''); setStock(''); setDesc(''); setImage('');
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
            <DialogContent className="max-w-2xl rounded-[40px] p-10 border-none shadow-2xl font-body overflow-y-auto max-h-[90vh]">
              <DialogHeader className="mb-8">
                <DialogTitle className="font-headline text-3xl font-extrabold text-primary">Register {category}</DialogTitle>
                <p className="text-xs text-[#7A6848] font-medium">Add a new item to your {title} collection.</p>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Product Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="e.g. A2 Gir Cow Ghee" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Price (₹)</label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Stock Quantity</label>
                  <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="0" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Image URL</label>
                  <Input value={image} onChange={(e) => setImage(e.target.value)} className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="https://..." />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Description</label>
                  <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="rounded-xl bg-[#F9F6EF] border-transparent px-5 py-4 font-bold min-h-[120px]" placeholder="Product details..." />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1 h-14 rounded-full border-[#DDD0B5] font-black uppercase tracking-widest text-[#7A6848]">Discard</Button>
                <Button onClick={handleAdd} className="flex-1 h-14 bg-primary hover:bg-secondary rounded-full font-black uppercase tracking-widest shadow-xl">Save Product</Button>
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
            <span className="uppercase tracking-widest">{products?.length || 0} Products Total</span>
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-[#FDFBFA]">
            <TableRow className="border-b-[#F9F6EF]">
              <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Image</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Name</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Base Price</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Stock</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Status</TableHead>
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
                <TableCell className="text-sm font-bold text-[#100C06]">{p.name}</TableCell>
                <TableCell className="text-sm font-black text-foreground">₹{p.basePrice?.toLocaleString('en-IN')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-bold",
                      (p.stockQuantity || 0) <= 5 ? "text-destructive" : "text-[#7A6848]"
                    )}>{p.stockQuantity || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                    p.isLive ? "bg-[#EBF5EE] text-[#1B5E3B]" : "bg-gray-100 text-gray-400"
                  )}>
                    {p.isLive ? 'active' : 'draft'}
                  </span>
                </TableCell>
                <TableCell className="text-right px-8 space-x-2">
                  <button className="w-9 h-9 rounded-xl text-[#7A6848] hover:bg-primary/5 transition-all">
                    <ExternalLink className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="w-9 h-9 rounded-xl text-[#7A6848] hover:bg-primary/5 transition-all">
                    <Pen className="w-4 h-4 mx-auto" />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="w-9 h-9 rounded-xl text-destructive/40 hover:text-destructive hover:bg-destructive/5 transition-all"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center text-[#7A6848] font-medium italic">
                  No {category} products found. Click "Add New" to begin.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
