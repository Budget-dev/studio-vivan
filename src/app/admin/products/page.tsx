"use client";

import React, { useState } from 'react';
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
import { collection } from 'firebase/firestore';

export default function AdminProductsPage() {
  const db = useFirestore();
  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const { data: products, isLoading } = useCollection(productsRef);
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (isLoading) {
    return <div className="min-h-[400px] flex items-center justify-center font-headline text-2xl font-extrabold text-primary animate-pulse">Loading Inventory...</div>;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#100C06]">Inventory & Products</h1>
          <p className="text-[#7A6848] text-sm mt-2 font-medium">Manage your Vivaan Farms catalog and stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <button className="h-12 px-8 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-secondary transition-all flex items-center gap-2">
                <i className="fa-solid fa-plus"></i> Add New Product
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[40px] p-10 border-none shadow-2xl font-body overflow-y-auto max-h-[90vh]">
              <DialogHeader className="mb-8">
                <DialogTitle className="font-headline text-3xl font-extrabold text-primary">Register New Product</DialogTitle>
                <p className="text-xs text-[#7A6848] font-medium">Enter product details to list on the storefront.</p>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Product Name</label>
                  <Input className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="e.g. A2 Gir Cow Ghee" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Category</label>
                  <select className="w-full h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold appearance-none">
                    <option>A2 Ghee</option>
                    <option>Pickles</option>
                    <option>Sweets</option>
                    <option>Honey</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Base Price (₹)</label>
                  <Input type="number" className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Stock Quantity</label>
                  <Input type="number" className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Unit Volume</label>
                  <Input className="h-12 rounded-xl bg-[#F9F6EF] border-transparent px-5 font-bold" placeholder="e.g. 500ml / 1kg" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Description</label>
                  <Textarea className="rounded-xl bg-[#F9F6EF] border-transparent px-5 py-4 font-bold min-h-[120px]" placeholder="Tell customers about this pure product..." />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Media Upload (Images/Videos)</label>
                  <div className="h-32 border-2 border-dashed border-[#DDD0B5] rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-[#F9F6EF] transition-all cursor-pointer">
                    <i className="fa-solid fa-cloud-arrow-up text-2xl text-primary/40"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Drop files here or Click to Browse</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1 h-14 rounded-full border-[#DDD0B5] font-black uppercase tracking-widest text-[#7A6848]">Discard</Button>
                <Button className="flex-1 h-14 bg-primary hover:bg-secondary rounded-full font-black uppercase tracking-widest shadow-xl">Confirm & Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Low Stock Alerts', value: products?.filter(p => (p.stockQuantity || 0) <= 10).length + ' Products', icon: 'fa-triangle-exclamation', color: 'text-destructive' },
          { label: 'Active Listings', value: (products?.length || 0) + ' SKUs', icon: 'fa-box', color: 'text-primary' },
          { label: 'Total Stock Value', value: '₹' + (products?.reduce((acc, p) => acc + ((p.basePrice || 0) * (p.stockQuantity || 0)), 0).toLocaleString('en-IN') || '0'), icon: 'fa-money-bill-trend-up', color: 'text-primary' },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[32px] overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="w-14 h-14 bg-[#F9F6EF] rounded-2xl flex items-center justify-center">
                <i className={cn("fa-solid text-xl", item.icon, item.color)}></i>
              </div>
              <div>
                <div className="text-[10px] font-black text-[#7A6848] uppercase tracking-widest mb-1">{item.label}</div>
                <div className="font-headline text-2xl font-extrabold">{item.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F9F6EF]">
            <TableRow className="border-b-[#DDD0B5]/30">
              <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Product Details</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Category</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Stock Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Price</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848] text-right px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? products.map((p) => (
              <TableRow key={p.id} className="border-b-[#DDD0B5]/20 hover:bg-primary/[0.02] transition-colors group">
                <TableCell className="py-6 px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#F9F6EF] rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {p.name?.toLowerCase().includes('ghee') ? '🧈' : p.name?.toLowerCase().includes('pickle') ? '🌶️' : p.name?.toLowerCase().includes('sweet') ? '🎁' : '🍯'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#100C06]">{p.name}</div>
                      <div className="text-[10px] text-[#7A6848] font-black uppercase tracking-wider mt-0.5">{p.volumeValue} {p.volumeUnit}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary">
                    {p.categoryId || 'General'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between max-w-[120px]">
                      <span className="text-[10px] font-bold text-[#7A6848]">{p.stockQuantity || 0} Units</span>
                      <span className={cn("text-[9px] font-black", (p.stockQuantity || 0) <= 10 ? 'text-destructive' : 'text-primary')}>
                        {(p.stockQuantity || 0) <= 10 ? 'LOW' : 'GOOD'}
                      </span>
                    </div>
                    <div className="h-1.5 w-[120px] bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", (p.stockQuantity || 0) <= 10 ? 'bg-destructive' : 'bg-primary')} 
                        style={{ width: `${Math.min(100, ((p.stockQuantity || 0) / 20) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-black text-foreground">₹{(p.basePrice || 0).toLocaleString('en-IN')}</TableCell>
                <TableCell>
                  <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider", p.isLive ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400")}>
                    {p.isLive ? 'Live' : 'Draft'}
                  </span>
                </TableCell>
                <TableCell className="text-right px-8 space-x-2">
                  <button className="w-9 h-9 rounded-xl bg-[#F9F6EF] text-[#7A6848] hover:bg-primary/10 hover:text-primary transition-all">
                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-destructive/5 text-destructive/40 hover:bg-destructive hover:text-white transition-all shadow-sm">
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center text-[#7A6848] font-medium italic">
                  No products found. Start by adding your first pure farm product.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
