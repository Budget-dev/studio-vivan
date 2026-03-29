
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState(PlaceHolderImages.filter(img => img.id.startsWith('hero-banner')));

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#100C06]">Hero Banners</h1>
          <p className="text-[#7A6848] text-sm mt-2 font-medium">Manage promotional content and storefront visuals.</p>
        </div>
        <button className="h-12 px-8 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-secondary transition-all flex items-center gap-2">
          <i className="fa-solid fa-cloud-arrow-up"></i> Upload New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {banners.map((banner, i) => (
          <Card key={banner.id} className="border-none shadow-2xl rounded-[40px] overflow-hidden group">
            <div className="relative aspect-[21/9] overflow-hidden">
              <Image 
                src={banner.imageUrl} 
                alt={banner.description} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[3px] text-primary shadow-lg">
                Banner #{i + 1}
              </div>
              <div className="absolute bottom-6 right-6 flex gap-2">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-xl hover:bg-primary hover:text-white transition-all">
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-destructive shadow-xl hover:bg-destructive hover:text-white transition-all">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Alt Description</label>
                  <Input 
                    value={banner.description} 
                    className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold"
                    readOnly
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Currently Live</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Mobile Optimized</span>
                    <i className="fa-solid fa-check-circle text-primary"></i>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-xl rounded-[40px] p-10 bg-[#EBF5EE] text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <i className="fa-solid fa-wand-magic-sparkles text-3xl"></i>
        </div>
        <h3 className="font-headline text-3xl font-extrabold text-primary mb-4">Want more banners?</h3>
        <p className="text-[#7A6848] text-sm leading-relaxed mb-8 font-medium">Use high-resolution 1600x600 images for best results. Banners with Bilona churning or Gir cows perform 40% better on average.</p>
        <button className="h-14 px-10 bg-primary text-white rounded-full text-xs font-black uppercase tracking-[3px] shadow-xl hover:bg-secondary transition-all">
          Launch Visual Designer
        </button>
      </Card>
    </div>
  );
}
