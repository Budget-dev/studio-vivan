"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  ArrowRight,
} from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer";

export const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: "Our Pure Goods",
      links: [
        { label: "A2 Gir Cow Ghee", href: "/" },
        { label: "Handmade Pickles", href: "/" },
        { label: "Artisanal Sweets", href: "/" },
        { label: "Natural Honey", href: "/" },
        { label: "Superfood Combos", href: "/" },
      ],
    },
    {
      title: "The Farm Journey",
      links: [
        { label: "Our Legacy", href: "/about" },
        { label: "Farm Visit", href: "/about" },
        { label: "Bilona Method", href: "/about" },
        { label: "Wellness Blog", href: "/blog" },
        {
          label: "Track Order",
          href: "#",
          pulse: true,
        },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-secondary" />,
      text: "purity@vivaanfarms.com",
      href: "mailto:purity@vivaanfarms.com",
    },
    {
      icon: <Phone size={18} className="text-secondary" />,
      text: "+91 98765 43210",
      href: "tel:+919876543210",
    },
    {
      icon: <MapPin size={18} className="text-secondary" />,
      text: "Gir Somnath, Gujarat, India",
    },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, label: "Facebook", href: "#" },
    { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
    { icon: <Youtube size={20} />, label: "Youtube", href: "#" },
    { icon: <Globe size={20} />, label: "Globe", href: "#" },
  ];

  return (
    <footer className="bg-primary text-white relative h-fit rounded-[40px] overflow-hidden m-4 md:m-8 border border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-14 py-16 md:py-24 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 relative flex items-center justify-center bg-white rounded-2xl p-2 shadow-xl border border-white/20">
                <Image 
                  src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                  alt="Vivaan Farms Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="text-white text-3xl font-headline font-black tracking-tight">Vivaan</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed font-medium">
              Bringing the pure essence of Gujarat to your home. Traditional Bilona method A2 Ghee, handcrafted for health and heritage.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary hover:border-secondary transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[3px] mb-8">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label} className="relative flex items-center">
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors flex items-center group"
                    >
                      {link.label}
                      <ArrowRight className="w-3 h-3 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                    {link.pulse && (
                      <span className="ml-2 w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-[11px] font-black uppercase tracking-[3px] mb-8">
              Visit Our Farm
            </h4>
            <ul className="space-y-6">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-start space-x-4">
                  <div className="mt-1">{item.icon}</div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm text-white/50">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-white/10 my-12" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[11px] font-bold uppercase tracking-widest text-white/30 space-y-4 md:space-y-0">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Vivaan Farm Technologies. Made in Gujarat with &hearts;
          </p>
          <div className="flex gap-8">
             <Link href="/" className="hover:text-white transition-colors">Privacy</Link>
             <Link href="/" className="hover:text-white transition-colors">Terms</Link>
             <Link href="/" className="hover:text-white transition-colors">FSSAI License</Link>
          </div>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="hidden lg:flex h-[28rem] -mt-44 -mb-32 relative z-20 pointer-events-none">
        <TextHoverEffect text="Vivaan" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
};
