
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { cn } from '@/lib/utils';

const SALES_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 6390 },
  { name: 'Sun', sales: 7490 },
];

const CATEGORY_DATA = [
  { name: 'A2 Ghee', value: 45, color: '#1B5E3B' },
  { name: 'Pickles', value: 25, color: '#2A7A50' },
  { name: 'Sweets', value: 20, color: '#3AAA60' },
  { name: 'Honey', value: 10, color: '#D4EDE0' },
];

const TOP_PRODUCTS = [
  { name: 'A2 Gir Cow Ghee 1L', sales: 124, trend: '+12%' },
  { name: 'Mango Pickle 500g', sales: 89, trend: '+5%' },
  { name: 'Artisanal Kaju Katli', sales: 76, trend: '+18%' },
  { name: 'Forest Honey 500g', sales: 45, trend: '-2%' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#100C06]">Analytics Overview</h1>
          <p className="text-[#7A6848] text-sm mt-2 font-medium">Welcome back, Admin. Here's what's happening at Vivaan Farms today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 bg-white border border-[#DDD0B5] rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-[#F9F6EF] transition-all flex items-center gap-2">
            <i className="fa-solid fa-download"></i> Export Data
          </button>
          <button className="h-12 px-6 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-secondary transition-all flex items-center gap-2">
            <i className="fa-solid fa-plus"></i> New Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '₹4,28,500', trend: '+14.2%', icon: 'fa-indian-rupee-sign', bg: 'bg-[#EBF5EE]' },
          { label: 'Total Orders', value: '1,248', trend: '+8.1%', icon: 'fa-shopping-cart', bg: 'bg-[#FFFBEF]' },
          { label: 'Conversion Rate', value: '3.2%', trend: '-1.4%', icon: 'fa-chart-line', bg: 'bg-[#F0F7FF]' },
          { label: 'Purity Coins Issued', value: '45,200', trend: '+22.5%', icon: 'fa-coins', bg: 'bg-[#FFF0F0]' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[32px] overflow-hidden group hover:scale-[1.02] transition-all">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6", stat.bg)}>
                  <i className={cn("fa-solid text-xl", stat.icon, stat.label.includes('Revenue') ? 'text-primary' : 'text-foreground/60')}></i>
                </div>
                <div className={cn("px-3 py-1 rounded-full text-[10px] font-black", stat.trend.startsWith('+') ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive')}>
                  {stat.trend}
                </div>
              </div>
              <div className="text-[11px] font-black text-[#7A6848] uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="font-headline text-3xl font-extrabold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[40px] p-8">
          <CardHeader className="p-0 mb-10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-2xl font-extrabold">Revenue Trend</CardTitle>
              <p className="text-xs text-[#7A6848] font-medium mt-1">Weekly sales performance comparison</p>
            </div>
            <div className="flex bg-[#F9F6EF] rounded-xl p-1 border border-[#DDD0B5]/50">
              <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-white shadow-sm text-primary">Week</button>
              <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg text-[#7A6848]">Month</button>
            </div>
          </CardHeader>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B5E3B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1B5E3B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#7A6848', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#7A6848', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 800, color: '#1B5E3B' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#1B5E3B" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none shadow-xl rounded-[40px] p-8">
          <CardHeader className="p-0 mb-10">
            <CardTitle className="font-headline text-2xl font-extrabold">Sales by Category</CardTitle>
            <p className="text-xs text-[#7A6848] font-medium mt-1">Product distribution metrics</p>
          </CardHeader>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-[10px] font-black text-[#7A6848] uppercase tracking-wider leading-tight">Best<br/>Category</div>
              <div className="text-xl font-headline font-extrabold text-primary mt-1">Ghee</div>
            </div>
          </div>
          <div className="space-y-4 mt-8">
            {CATEGORY_DATA.map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-sm font-bold">{cat.name}</span>
                </div>
                <span className="text-sm font-black text-[#7A6848]">{cat.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-xl rounded-[40px] p-8">
          <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-2xl font-extrabold">Top Selling Products</CardTitle>
              <p className="text-xs text-[#7A6848] font-medium mt-1">Performance by individual SKU</p>
            </div>
            <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
          </CardHeader>
          <div className="space-y-6">
            {TOP_PRODUCTS.map((prod, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F9F6EF] rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {prod.name.includes('Ghee') ? '🧈' : prod.name.includes('Pickle') ? '🌶️' : prod.name.includes('Katli') ? '🎁' : '🍯'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#100C06]">{prod.name}</div>
                    <div className="text-[10px] text-[#7A6848] font-black uppercase tracking-wider mt-0.5">{prod.sales} Orders</div>
                  </div>
                </div>
                <div className={cn("text-xs font-black", prod.trend.startsWith('+') ? 'text-primary' : 'text-destructive')}>
                  {prod.trend} <i className={cn("fa-solid ml-1", prod.trend.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down')}></i>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-none shadow-xl rounded-[40px] p-8 bg-primary text-white relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
          <CardHeader className="p-0 mb-10 relative z-10">
            <div className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-4">Store Health</div>
            <CardTitle className="font-headline text-4xl font-extrabold leading-tight">Your Vivaan Farms store is performing <span className="italic text-accent underline decoration-white/20 underline-offset-8">Excellent</span></CardTitle>
          </CardHeader>
          <div className="space-y-8 relative z-10">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-black text-white/40 uppercase tracking-widest">Inventory Health</div>
                <div className="text-xs font-bold text-accent">94% Stable</div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[94%] rounded-full shadow-[0_0_10px_rgba(212,237,224,0.5)]"></div>
              </div>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-black text-white/40 uppercase tracking-widest">Customer Loyalty</div>
                <div className="text-xs font-bold text-accent">88% Repeat</div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[88%] rounded-full shadow-[0_0_10px_rgba(212,237,224,0.5)]"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
