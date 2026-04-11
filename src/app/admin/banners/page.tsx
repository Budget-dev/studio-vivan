
"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Camera, X, Trash2, CloudUpload, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminBannersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannersRef = useMemoFirebase(() => collection(db, 'banners'), [db]);
  const { data: banners, isLoading } = useCollection(bannersRef);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [placement, setPlacement] = useState('Hero');
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBanner = async () => {
    if (!imageUrl) {
      toast({
        title: "Image Required",
        description: "Please select an image for your banner.",
        variant: "destructive"
      });
      return;
    }

    const newBanner = {
      title,
      description,
      imageUrl,
      placement,
      isActive,
      position: (banners?.length || 0) + 1,
      linkUrl: '/',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDocumentNonBlocking(collection(db, 'banners'), newBanner);
      setIsAddOpen(false);
      // Reset form
      setTitle(''); setDescription(''); setPlacement('Hero'); setIsActive(true); setImageUrl('');
      toast({
        title: "Banner Uploaded",
        description: "Your new promotional banner is now live.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to upload banner. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      deleteDocumentNonBlocking(doc(db, 'banners', id));
      toast({
        title: "Banner Removed",
        description: "The banner has been deleted from your storefront.",
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-[400px] flex items-center justify-center font-headline text-2xl font-extrabold text-primary animate-pulse">Loading Banners...</div>;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#100C06]">Promotional Banners</h1>
          <p className="text-[#7A6848] text-sm mt-2 font-medium">Manage your storefront visuals and campaign content.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="h-12 px-8 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-secondary transition-all flex items-center gap-2">
              <CloudUpload className="w-4 h-4" /> Upload New Banner
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-[40px] p-10 border-none shadow-2xl font-body">
            <DialogHeader className="mb-8">
              <DialogTitle className="font-headline text-3xl font-extrabold text-primary">Create Banner</DialogTitle>
              <p className="text-xs text-[#7A6848] font-medium">Add high-impact visuals to your farm's homepage.</p>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Banner Title</Label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Summer Ghee Special" 
                  className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Visual Content</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-[21/9] rounded-2xl border-2 border-dashed border-[#DDD0B5] bg-[#F9F6EF] flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden"
                >
                  {imageUrl ? (
                    <>
                      <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <Camera className="w-10 h-10 text-[#7A6848]/40 mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Click to Select Image</p>
                      <p className="text-[9px] text-[#7A6848]/60 italic">(Recommended: 1600x600px)</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Placement</Label>
                  <Select value={placement} onValueChange={setPlacement}>
                    <SelectTrigger className="h-12 rounded-xl bg-[#F9F6EF] border-transparent font-bold">
                      <SelectValue placeholder="Select placement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hero">Hero Slider</SelectItem>
                      <SelectItem value="FeaturedSection">Featured Section</SelectItem>
                      <SelectItem value="Ad">Sidebar Ad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Set Active</Label>
                  <div className="flex items-center gap-3">
                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                    <span className="text-[10px] font-bold text-[#7A6848] uppercase tracking-wider">
                      {isActive ? 'Visible on site' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Description (Optional)</Label>
                <Textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Tell a short story about this campaign..." 
                  className="rounded-xl bg-[#F9F6EF] border-transparent font-bold resize-none h-24"
                />
              </div>

              <Button 
                onClick={handleAddBanner}
                className="w-full h-14 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-widest shadow-xl transition-all"
              >
                Upload Content <CloudUpload className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {banners && banners.length > 0 ? banners.map((banner, i) => (
          <Card key={banner.id} className="border-none shadow-2xl rounded-[40px] overflow-hidden group bg-white">
            <div className="relative aspect-[21/9] overflow-hidden">
              <Image 
                src={banner.imageUrl} 
                alt={banner.title || "Banner"} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[3px] text-primary shadow-lg inline-block w-fit">
                  {banner.placement} #{i + 1}
                </div>
                {!banner.isActive && (
                  <div className="px-4 py-1.5 bg-destructive text-white rounded-full text-[10px] font-black uppercase tracking-[3px] shadow-lg inline-block w-fit">
                    Inactive
                  </div>
                )}
              </div>

              <div className="absolute bottom-6 right-6 flex gap-2">
                <button 
                  onClick={() => handleDelete(banner.id)}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-destructive shadow-xl hover:bg-destructive hover:text-white transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#7A6848] mb-1">Banner Title</div>
                  <div className="font-headline text-2xl font-bold text-primary">{banner.title || "Untitled Banner"}</div>
                </div>
                {banner.description && (
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#7A6848] mb-1">Campaign Story</div>
                    <p className="text-sm font-medium text-[#7A6848] line-clamp-2">{banner.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full py-20 bg-white/50 rounded-[40px] border-2 border-dashed border-[#DDD0B5] text-center text-[#7A6848] font-medium">
            No promotional banners found. Click the button above to upload your first visual.
          </div>
        )}
      </div>

      <Card className="border-none shadow-xl rounded-[40px] p-10 bg-[#EBF5EE] text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <Sparkles className="w-10 h-10" />
        </div>
        <h3 className="font-headline text-3xl font-extrabold text-primary mb-4">Content Strategy</h3>
        <p className="text-[#7A6848] text-sm leading-relaxed mb-8 font-medium">
          Use high-resolution 1600x600 images for Hero banners. Keep text centered or left-aligned to ensure it doesn't overlap with the user interface.
        </p>
      </Card>
    </div>
  );
}
