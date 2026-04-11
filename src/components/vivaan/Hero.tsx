
"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export const Hero: React.FC = () => {
  const db = useFirestore();
  const bannersRef = useMemoFirebase(() => query(collection(db, 'banners'), where('isActive', '==', true), where('placement', '==', 'Hero')), [db]);
  const { data: banners, isLoading } = useCollection(bannersRef);

  if (isLoading) {
    return <div className="w-full h-[220px] md:h-[350px] bg-primary/5 animate-pulse flex items-center justify-center border-b border-border/10"></div>;
  }

  // Fallback banners if none are in the DB yet
  const displayBanners = (banners && banners.length > 0) ? banners : [
    {
      id: 'default-1',
      title: 'Experience Pure Purity',
      description: 'Traditional Bilona A2 Ghee directly from our Gujarat Farm.',
      imageUrl: 'https://picsum.photos/seed/vivaan1/1600/600',
    }
  ];

  return (
    <section className="relative w-full border-b border-border/10">
      <Carousel 
        opts={{ loop: true }} 
        className="w-full h-[220px] md:h-[350px] overflow-hidden"
      >
        <CarouselContent className="h-full ml-0">
          {displayBanners.map((banner, index) => (
            <CarouselItem key={banner.id} className="relative h-full pl-0">
              <div className="relative w-full h-[220px] md:h-[350px]">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover brightness-[0.85]"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent flex items-center">
                  <div className="max-w-[1400px] mx-auto px-5 md:px-10 w-full">
                    <div className="max-w-2xl text-left">
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black tracking-[2px] uppercase mb-3 md:mb-5">
                        Authentic Bilona Method · Gujarat Farm Direct
                      </div>
                      <h1 className="font-headline text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 md:mb-6">
                        {banner.title}
                      </h1>
                      <div className="flex gap-2.5 md:gap-4">
                        <Button className="h-9 md:h-11 px-5 md:px-8 rounded-full bg-primary text-white font-black uppercase tracking-widest hover:bg-secondary transition-all group border-none shadow-xl text-[9px] md:text-xs">
                          Shop Now <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" className="h-9 md:h-11 px-5 md:px-8 rounded-full bg-white/5 border-white/30 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm text-[9px] md:text-xs">
                          Our Story
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 right-4 hidden md:flex gap-2 z-20">
          <CarouselPrevious className="relative translate-y-0 left-0 bg-white/10 border-white/20 text-white hover:bg-white/30 w-8 h-8 rounded-full backdrop-blur-md" />
          <CarouselNext className="relative translate-y-0 right-0 bg-white/10 border-white/20 text-white hover:bg-white/30 w-8 h-8 rounded-full backdrop-blur-md" />
        </div>
      </Carousel>
    </section>
  );
};
