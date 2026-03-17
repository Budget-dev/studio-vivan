
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
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const Hero: React.FC = () => {
  const banners = PlaceHolderImages.filter(img => img.id.startsWith('hero-banner'));

  return (
    <section className="relative w-full">
      <Carousel 
        opts={{ loop: true }} 
        className="w-full h-[460px] md:h-[520px] overflow-hidden"
      >
        <CarouselContent className="h-full ml-0">
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id} className="relative h-full pl-0">
              <div className="relative w-full h-[460px] md:h-[520px]">
                <Image
                  src={banner.imageUrl}
                  alt={banner.description}
                  fill
                  className="object-cover brightness-[0.7]"
                  data-ai-hint={banner.imageHint}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center">
                  <div className="max-w-[1400px] mx-auto px-5 md:px-10 w-full">
                    <div className="max-w-2xl text-left">
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-[#FDE88A] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[2px] uppercase mb-6">
                        Pure Bilona Method · Since 2018
                      </div>
                      <h1 className="font-headline text-5xl lg:text-7xl font-extrabold text-white leading-none mb-6">
                        {index === 0 && <>The Gold Standard of <span className="italic text-[#FDE88A]">A2 Ghee</span></>}
                        {index === 1 && <>Directly From Our <span className="italic text-[#FDE88A]">Gujarat Farm</span></>}
                        {index === 2 && <>Traditional Wisdom, <span className="italic text-[#FDE88A]">Modern Purity</span></>}
                      </h1>
                      <p className="text-base text-white/80 leading-relaxed mb-8 max-w-lg font-medium">
                        Experience the richness of authentic Gir Cow Ghee, hand-churned using the ancient Bilona technique. Lab-tested for your family's safety.
                      </p>
                      <div className="flex gap-4">
                        <Button className="h-12 px-8 rounded-md bg-[#F2C850] text-primary font-black uppercase tracking-wider hover:bg-[#FDE88A] transition-all group border-none">
                          Shop Collection <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" className="h-12 px-8 rounded-md bg-transparent border-white/40 text-white font-bold hover:bg-white/10 transition-all">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-10 right-20 hidden md:flex gap-4 z-20">
          <CarouselPrevious className="relative translate-y-0 left-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          <CarouselNext className="relative translate-y-0 right-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
        </div>
      </Carousel>
    </section>
  );
};
