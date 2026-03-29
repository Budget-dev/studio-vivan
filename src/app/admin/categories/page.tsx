
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';

const CATEGORIES = [
  { id: 1, name: 'A2 Ghee', icon: 'fa-cow', count: 12, sales: '₹2,45,000', color: 'bg-primary' },
  { id: 2, name: 'Pickles', icon: 'fa-pepper-hot', count: 8, sales: '₹85,200', color: 'bg-secondary' },
  { id: 3, name: 'Sweets', icon: 'fa-gift', count: 6, sales: '₹62,400', color: 'bg-[#3AAA60]' },
  { id: 4, name: 'Honey', icon: 'fa-jar', count: 4, sales: '₹35,900', color: 'bg-[#D4EDE0]' },
];

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#100C06]">Store Categories</h1>
          <p className="text-[#7A6848] text-sm mt-2 font-medium">Organize and segment your product collections.</p>
        </div>
        <button className="h-12 px-8 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-secondary transition-all flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Create Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => (
          <Card key={cat.id} className="border-none shadow-xl rounded-[32px] overflow-hidden group hover:scale-[1.05] transition-all cursor-pointer">
            <CardContent className="p-8">
              <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center text-white mb-6 transition-transform group-hover:rotate-12", cat.color)}>
                <i className={cn("fa-solid text-2xl", cat.icon)}></i>
              </div>
              <h3 className="font-headline text-2xl font-extrabold mb-1">{cat.name}</h3>
              <p className="text-[10px] text-[#7A6848] font-black uppercase tracking-[2px]">{cat.count} Products Listed</p>
              <div className="mt-6 pt-6 border-t border-[#DDD0B5]/30 flex items-center justify-between">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Revenue</span>
                <span className="text-sm font-black">{cat.sales}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F9F6EF]">
            <TableRow className="border-b-[#DDD0B5]/30">
              <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Category Info</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Product Count</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Total Sales</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-[#7A6848] text-right px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CATEGORIES.map((cat) => (
              <TableRow key={cat.id} className="border-b-[#DDD0B5]/20 hover:bg-primary/[0.02] transition-colors group">
                <TableCell className="py-6 px-8">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm", cat.color)}>
                      <i className={cn("fa-solid", cat.icon)}></i>
                    </div>
                    <span className="text-sm font-bold text-[#100C06]">{cat.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-bold text-[#7A6848]">{cat.count} Items</TableCell>
                <TableCell className="text-sm font-black text-foreground">{cat.sales}</TableCell>
                <TableCell>
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary">Active</span>
                </TableCell>
                <TableCell className="text-right px-8 space-x-2">
                  <button className="w-9 h-9 rounded-xl bg-[#F9F6EF] text-[#7A6848] hover:bg-primary/10 hover:text-primary transition-all">
                    <i className="fa-solid fa-pen text-xs"></i>
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-destructive/5 text-destructive/40 hover:bg-destructive hover:text-white transition-all shadow-sm">
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
