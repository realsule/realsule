import type { CmsContent } from './types'

/**
 * This is the seed used the very first time someone opens the site (or
 * after "Reset to defaults" in admin settings) — it's a straight copy of
 * what was previously hard-coded across src/data/*.ts and the JSX in
 * Hero.tsx / Intro.tsx / Contact.tsx. Nothing changes on the public site
 * until you actually edit something in /admin.
 */
export const defaultContent: CmsContent = {
  hero: {
    eyebrow: 'Suleiman — Software Engineer & Creative Director',
    name: 'Suleiman',
    heroRole: 'I build full-stack products and direct the films, brands, and visuals around them.',
    introTag: 'The short version',
    introText:
      "Most people hire a developer, or they hire a director. I'm both — which means the product gets built and the story around it gets told well, without three different vendors losing the thread between them.",
    stats: [
      { id: 'stat-1', value: '01', label: "Rapper's trap music video, shot & directed" },
      { id: 'stat-2', value: '05+', label: 'Full products shipped, front to back' },
      { id: 'stat-3', value: 'KE', label: 'Based in Nairobi, working with clients anywhere' },
      { id: 'stat-4', value: '2', label: 'Disciplines, one person: code & creative direction' },
    ],
    contactHeadingLine: 'Got an idea?',
    contactMark: "Let's build it.",
    contactBody: "Pick a package above or drop a note about what you're working on — I'll reply with next steps and a quote.",
    sayHiLead: 'Or just say hi —',
  },

  services: [
    {
      id: 'svc-01',
      number: '01',
      title: 'Discovery & creative direction',
      description:
        "Every project starts with a story worth telling, not a template. I sit with the brief, the brand, the audience, and figure out what this thing actually needs to say before a single line of code or a single frame is shot.",
      tagLabel: 'Where it starts',
      tagQuote: 'Because a great product with no story just sits on a shelf.',
      colorClass: 'svc1',
      illustration: 'compass',
    },
    {
      id: 'svc-02',
      number: '02',
      title: 'Brand & visual design',
      description:
        'Logos, color systems, and identities built to survive contact with a real business — not just a mood board. Urban Crew, my ongoing daily practice, is this discipline sharpened one Kenyan brand at a time.',
      tagLabel: 'Identity',
      tagQuote: 'Because your brand is the first thing people judge before they read a word.',
      colorClass: 'svc2',
      illustration: 'palette',
    },
    {
      id: 'svc-03',
      number: '03',
      title: 'Film & video production',
      description:
        "Directed and shot end to end — music videos, brand films, product launches. I've directed a trap music video for a Nairobi-based rapper and bring that same eye to commercial and product work.",
      tagLabel: 'On location',
      tagQuote: 'Because a scroll-stopping product deserves footage that stops the scroll too.',
      colorClass: 'svc3',
      illustration: 'camera',
    },
    {
      id: 'svc-04',
      number: '04',
      title: 'Front-end & back-end development',
      description:
        'React, TypeScript, Python, and whatever the stack calls for — from a single landing page to a multi-tenant SaaS platform with bookings, payments, and role-based access built in.',
      tagLabel: 'Build',
      tagQuote: 'Because the idea only counts once someone can actually click it.',
      colorClass: 'svc4',
      illustration: 'code',
    },
    {
      id: 'svc-05',
      number: '05',
      title: 'Launch, invoicing & ongoing support',
      description:
        "Deployed, handed over, and followed through — including the boring-but-critical parts: booking flows, automatic invoices, and a maintenance plan so the site doesn't rot the month after launch.",
      tagLabel: 'Follow-through',
      tagQuote: 'Because the best-looking site in the world is worthless if no one can book you through it.',
      colorClass: 'svc5',
      illustration: 'rocket',
    },
  ],

  projects: [
    {
      id: 'bookmystudio',
      title: 'BookMyStudio',
      category: 'product',
      categoryLabel: 'SaaS',
      description: 'Multi-tenant SaaS for recording studios — bookings, subscriptions, invoicing, and studio analytics.',
      colorClass: 'p1',
      featured: true,
      published: true,
    },
    {
      id: 'trap-video',
      title: 'Trap Video Direction',
      category: 'creative',
      categoryLabel: 'Music Video',
      description: 'Directed and shot a trap music video for a Nairobi-based rapper, start to finish.',
      colorClass: 'p2',
      featured: false,
      published: true,
    },
    {
      id: 'vaultcrypt',
      title: 'VaultCrypt',
      category: 'tools',
      categoryLabel: 'CLI Tool',
      description: 'A Python command-line encrypted vault for securely storing sensitive files.',
      colorClass: 'p3',
      link: 'https://github.com/realsule',
      featured: false,
      published: true,
    },
    {
      id: 'schoolhub',
      title: 'SchoolHub',
      category: 'product',
      categoryLabel: 'School Management',
      description:
        'Offline-first school management system in React & TypeScript with role-based access for Principals, Admins, and Teachers.',
      colorClass: 'p4',
      featured: false,
      published: true,
    },
    {
      id: 'vetty',
      title: 'Vetty',
      category: 'product',
      categoryLabel: 'E-commerce',
      description: 'A pet-care e-commerce platform, deployed and live.',
      colorClass: 'p5',
      featured: false,
      published: true,
    },
    {
      id: 'urban-crew',
      title: 'Urban Crew',
      category: 'creative',
      categoryLabel: 'Brand Practice',
      description: 'An ongoing daily practice — a new logo redesign and website build for a different Kenyan company, every day.',
      colorClass: 'p6',
      featured: false,
      published: true,
    },
  ],

  gallery: [
    { id: 'g1', title: 'Urban Crew — logo redesign 01', type: 'design', note: "Drop today's logo redesign here", published: true },
    { id: 'g2', title: 'Trap video — behind the scenes', type: 'video', note: 'Drop a clip or trailer from the shoot', published: true },
    { id: 'g3', title: 'BookMyStudio — UI walkthrough', type: 'video', note: 'Drop a short product demo', published: true },
    { id: 'g4', title: 'Urban Crew — website build 01', type: 'photo', note: 'Drop a screenshot of the finished site', published: true },
    { id: 'g5', title: 'SchoolHub — dashboard screens', type: 'photo', note: 'Drop a screenshot of the product', published: true },
    { id: 'g6', title: 'Music video — color grade stills', type: 'photo', note: 'Drop a still frame from the edit', published: true },
  ],

  blog: [
    {
      id: 'why-both',
      title: 'Why I never picked just one lane',
      date: 'Draft — edit me',
      excerpt: 'On being a developer and a director at the same time, and why that combination is the point, not a distraction.',
      body: 'Replace this with the real post. Talk about why code and creative direction feed each other for you — what shooting a music video taught you about shipping software, or the other way around.',
      featured: false,
      published: true,
    },
    {
      id: 'urban-crew-log',
      title: 'Day one of Urban Crew',
      date: 'Draft — edit me',
      excerpt: 'Starting a year-long practice of redesigning a logo and building a website for a different Kenyan company, every single day.',
      body: 'Replace this with your own log entry — what you built today, what was hard about it, what you learned.',
      featured: false,
      published: true,
    },
    {
      id: 'keep-going',
      title: 'A note for the slow weeks',
      date: 'Draft — edit me',
      excerpt: 'Something to read on the days the client pipeline is quiet and the motivation is lower than usual.',
      body: 'Replace this with whatever actually keeps you going — a reminder, a quote, a memory of a project that worked.',
      featured: false,
      published: true,
    },
  ],

  tiers: [
    {
      id: 'tier-starter',
      name: 'Starter',
      price: 'From KES 2,000',
      items: ['Birthday / event website', 'Digital invitation', 'One-page landing page'],
    },
    {
      id: 'tier-personal',
      name: 'Personal',
      price: 'From KES 12,000',
      items: ['Graduation memory book', 'Couple / anniversary timeline', 'Digital scrapbook'],
    },
    {
      id: 'tier-professional',
      name: 'Professional',
      price: 'From KES 20,000',
      items: ['Interactive portfolio', 'Resume website', 'Freelancer landing page'],
    },
    {
      id: 'tier-business',
      name: 'Business',
      price: 'From KES 40,000',
      items: ['Restaurant / QR menu site', 'Booking system', 'Full company website'],
    },
    {
      id: 'tier-premium',
      name: 'Premium',
      price: 'Custom quote',
      items: ['Custom SaaS MVP', 'AI integration', 'Automation tooling'],
    },
  ],

  contactLinks: {
    whatsappNumber: '254700000000',
    linkedinUrl: 'https://www.linkedin.com/in/realsule',
    email: 'hello@suleiman.dev',
  },

  settings: {
    siteTitle: 'Suleiman — Software Engineer & Creative Director',
    footerTagline: 'Nairobi, Kenya · GitHub: realsule',
    location: 'Nairobi, Kenya — GMT+3',
  },
}
