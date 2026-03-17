import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'A2 Gir Cow Ghee',
    vol: '2.5L Dolchi',
    price: 5684,
    mrp: 5800,
    off: '2%',
    rat: 4.9,
    revs: '1.2k',
    coins: 284,
    sold: '2,341',
    cat: 'ghee',
    stock: 7,
    badges: ['2% OFF', '⭐ TOP RATED'],
    pi: 0,
    vars: [{s:'500ml',p:1250},{s:'1L',p:2400},{s:'2.5L',p:5684,on:true},{s:'5L',p:10913}],
    description: 'Made in the farms of Gujarat using the ancient Bilona method — churned from curd, not cream. Rich in A2 beta-casein protein, CLA, Omega-3 fatty acids and fat-soluble vitamins.'
  },
  {
    id: 2,
    name: 'Desi & Gir Combo',
    vol: '500ml × 2 Jars',
    price: 1850,
    mrp: 2295,
    off: '19%',
    rat: 5.0,
    revs: '892',
    coins: 92,
    sold: '1,108',
    cat: 'combo',
    stock: 13,
    badges: ['19% OFF', '🎁 COMBO'],
    pi: 1,
    vars: [{s:'500ml×2',p:1850,on:true},{s:'1L×2',p:3600}],
    description: 'The ultimate purity package. Includes our signature A2 Gir Cow Ghee and traditional Desi Cow Ghee. Perfect for diverse culinary needs.'
  },
  {
    id: 3,
    name: 'A2 Gir Cow Ghee',
    vol: '500ml Glass Jar',
    price: 1250,
    mrp: 1400,
    off: '10%',
    rat: 4.8,
    revs: '1.8k',
    coins: 62,
    sold: '3,900',
    cat: 'ghee',
    stock: 22,
    badges: ['🔥 BESTSELLER'],
    pi: 2,
    vars: [{s:'250ml',p:680},{s:'500ml',p:1250,on:true},{s:'1L',p:2400}],
    description: 'Our most popular size. Hand-churned using the Bilona method. A2 certified purity directly from our farms to your kitchen.'
  },
  {
    id: 4,
    name: 'Desi Buffalo Ghee',
    vol: '5L Dolchi',
    price: 6548,
    mrp: 6750,
    off: '20%',
    rat: 4.7,
    revs: '567',
    coins: 327,
    sold: '780',
    cat: 'ghee',
    stock: 5,
    badges: ['20% OFF'],
    pi: 3,
    vars: [{s:'1L',p:1500},{s:'2.5L',p:3500},{s:'5L',p:6548,on:true}],
    description: 'Traditional white Buffalo ghee, known for its high smoke point and rich nutty flavor. Churned for perfection.'
  },
  {
    id: 5,
    name: 'Coconut Oil',
    vol: '1L Glass Bottle',
    price: 699,
    mrp: 850,
    off: '18%',
    rat: 4.6,
    revs: '340',
    coins: 34,
    sold: '560',
    cat: 'oil',
    stock: 18,
    badges: ['18% OFF', '🆕 NEW'],
    pi: 4,
    vars: [{s:'500ml',p:399},{s:'1L',p:699,on:true}],
    description: 'Cold pressed from the finest coastal coconuts. Unrefined and nutrient-rich, ideal for both cooking and personal care.'
  },
  {
    id: 6,
    name: 'Desi Cow Ghee',
    vol: '1 Litre Jar',
    price: 2400,
    mrp: 2800,
    off: '14%',
    rat: 4.7,
    revs: '910',
    coins: 120,
    sold: '1,450',
    cat: 'ghee',
    stock: 9,
    badges: ['14% OFF'],
    pi: 5,
    vars: [{s:'500ml',p:1250},{s:'1L',p:2400,on:true},{s:'2.5L',p:5684}],
    description: 'Classic Desi cow ghee made using traditional farm practices. Rich granular texture with a deep, earthy aroma.'
  },
];

export const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    loc: 'Mumbai · Verified Buyer',
    time: '3 months ago',
    body: '"The aroma fills the entire kitchen the moment you open the jar. My kids refused all other ghee after trying Vivaan. Bilona truly makes a world of difference!"',
    prod: 'A2 Gir Cow Ghee – 500ml Glass Jar',
    avatar: '👩'
  },
  {
    name: 'Rajan Kulkarni',
    loc: 'Hyderabad · Verified Buyer',
    time: '1 month ago',
    body: '"Ordered the 2.5L dolchi for our family of 5. Pure golden ghee that makes every dal-chawal feel like a celebration. The texture and fragrance is unmatched!"',
    prod: 'A2 Gir Cow Ghee – 2.5L Dolchi',
    avatar: '🧔'
  },
  {
    name: 'Meena Joshi',
    loc: 'Pune · Verified Buyer',
    time: '2 weeks ago',
    body: '"My digestive issues have visibly improved since switching to Vivaan\'s A2 ghee. Even my doctor noticed the improvement in my gut health!"',
    prod: 'A2 Gir Cow Ghee – 1L Jar',
    avatar: '🧕'
  }
];

export const CERTS = [
  { abbr: 'ISO 9001', color: '#1A5C38' },
  { abbr: 'ISO 22000', color: '#1A5C38' },
  { abbr: 'FSSAI', color: '#2A6A48' },
  { abbr: 'FDA', color: '#0A3A1A' },
  { abbr: 'GMP CERTIFIED', color: '#1A5C38' },
  { abbr: 'NABL', color: '#2A5A3A' },
  { abbr: 'HACCP', color: '#1A5C38' },
];
