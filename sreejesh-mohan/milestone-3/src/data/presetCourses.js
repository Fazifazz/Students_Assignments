// src/data/presetCourses.js

export const PRESET_COURSES = [
  {
    id: 'preset-nextjs-15',
    title: 'Next.js 15 & React Server Components Masterclass',
    instructor: 'Traversy Media & Vercel',
    category: 'Web Development',
    level: 'Intermediate',
    status: 'In Progress',
    deadline: '2026-11-20',
    totalEstimatedHours: 20,
    coverColor: 'from-slate-900 to-indigo-900',
    accentColor: '#3b82f6',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLillGF-RfqbYeckUaD1z6nE4DoOz574G0',
    description: 'Build enterprise web applications with Next.js 15, App Router, Server Actions, Turbopack, and Tailwind CSS.',
    lessons: [
      { id: 'p-nxt-1', title: 'Next.js 15 Crash Course & App Router Setup', duration: 55, completed: false, youtubeId: 'wm5gMKuwSYk', notes: 'Turbopack bundler and layout hierarchy.' },
      { id: 'p-nxt-2', title: 'React Server Components (RSC) vs Client Components', duration: 45, completed: false, youtubeId: '843nec-IvW0', notes: '"use client" boundary optimization.' },
      { id: 'p-nxt-3', title: 'Server Actions, Form Mutations & revalidatePath', duration: 50, completed: false, youtubeId: 'd5x0JCb277k', notes: 'Native form state handling without extra APIs.' },
      { id: 'p-nxt-4', title: 'Dynamic Route Handlers & REST Endpoints', duration: 40, completed: false, youtubeId: 'fT5xG_l6PJE', notes: 'Query params and cookie parsing in Next.js.' },
      { id: 'p-nxt-5', title: 'Authentication, Middleware & Session Protection', duration: 60, completed: false, youtubeId: 'DJ7v1_zGk-8', notes: 'Edge middleware request interceptors.' }
    ]
  },
  {
    id: 'preset-typescript',
    title: 'TypeScript: The Complete Developer Guide',
    instructor: 'Stephen Grider & Net Ninja',
    category: 'Web Development',
    level: 'Beginner',
    status: 'Not Started',
    deadline: '2026-12-05',
    totalEstimatedHours: 18,
    coverColor: 'from-blue-700 to-cyan-600',
    accentColor: '#0284c7',
    thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc0656a8275?w=800&auto=format&fit=crop&q=80',
    playlistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUxtBLX646Mr45NEGugk0o',
    description: 'Learn strict static typing, interfaces, advanced generics, union types, and TypeScript configuration with React.',
    lessons: [
      { id: 'p-ts-1', title: 'TypeScript Fundamentals & Compiler Setup', duration: 50, completed: false, youtubeId: 'd56mG7DezGs', notes: 'tsconfig.json strict mode settings.' },
      { id: 'p-ts-2', title: 'Interfaces, Type Aliases & Union Types', duration: 45, completed: false, youtubeId: 'VGu_Z_vF27Q', notes: 'Discriminated unions pattern.' },
      { id: 'p-ts-3', title: 'Advanced Generics & Keyof Type Operators', duration: 60, completed: false, youtubeId: '2pZmKW9-I_k', notes: 'Generic functions and utility types (Partial, Record).' },
      { id: 'p-ts-4', title: 'Object-Oriented TypeScript, Classes & Modifiers', duration: 55, completed: false, youtubeId: 'AhN_z8L6p9Y', notes: 'Private, protected, and readonly fields.' },
      { id: 'p-ts-5', title: 'TypeScript with React Props, State & Hooks', duration: 65, completed: false, youtubeId: 'BCg4U1Fz3Sk', notes: 'Typing React.FC and event handlers.' }
    ]
  },
  {
    id: 'preset-system-design',
    title: 'System Design & High-Scale Architecture',
    instructor: 'Alex Xu (ByteByteGo) & Gaurav Sen',
    category: 'Web Development',
    level: 'Advanced',
    status: 'In Progress',
    deadline: '2026-11-30',
    totalEstimatedHours: 24,
    coverColor: 'from-purple-800 to-indigo-950',
    accentColor: '#7c3aed',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLCRMIe5FDPsd0gVs500xeOewfySTsmEjf',
    description: 'Master distributed systems, caching strategies, horizontal scaling, microservices, and message queues.',
    lessons: [
      { id: 'p-sd-1', title: 'System Design Basics: Scale from Zero to Millions of Users', duration: 45, completed: false, youtubeId: 'i53Gi_K3o7I', notes: 'Stateless web tier and load balancers.' },
      { id: 'p-sd-2', title: 'Horizontal vs Vertical Scaling & Reverse Proxies', duration: 40, completed: false, youtubeId: 'Sqe5bK5Q1s8', notes: 'Consistent hashing for web clusters.' },
      { id: 'p-sd-3', title: 'Distributed Caching Strategies: Redis vs Memcached', duration: 50, completed: false, youtubeId: 'tSnp6z-x7nQ', notes: 'Write-through, write-back, and cache eviction.' },
      { id: 'p-sd-4', title: 'Database Sharding, Replication & CAP Theorem', duration: 60, completed: false, youtubeId: 'kG_IPkK8e_s', notes: 'Master-slave read replicas and partitioned tables.' },
      { id: 'p-sd-5', title: 'Event-Driven Architectures with Apache Kafka & RabbitMQ', duration: 55, completed: false, youtubeId: 'm8Icp_Cid5o', notes: 'Pub/sub topics and consumer lag management.' }
    ]
  },
  {
    id: 'preset-aws-cloud',
    title: 'AWS Certified Cloud Practitioner (CLF-C02)',
    instructor: 'Andrew Brown (ExamPro / freeCodeCamp)',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    status: 'Not Started',
    deadline: '2026-12-15',
    totalEstimatedHours: 25,
    coverColor: 'from-amber-600 to-orange-700',
    accentColor: '#d97706',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLy7NrLhttCJq65U6b1H7zV5z-p7mXj2w_',
    description: 'Comprehensive AWS certification training covering EC2, S3, IAM, VPC, CloudWatch, serverless Lambda, and cost management.',
    lessons: [
      { id: 'p-aws-1', title: 'AWS Cloud Fundamentals & Global Infrastructure', duration: 60, completed: false, youtubeId: 'SOTamWNgDKc', notes: 'Regions, Availability Zones, and Edge Locations.' },
      { id: 'p-aws-2', title: 'AWS Compute: EC2, Auto-Scaling & Lambda Functions', duration: 55, completed: false, youtubeId: 'ulprqHHWlng', notes: 'Instance families and serverless triggers.' },
      { id: 'p-aws-3', title: 'AWS Storage: S3 Buckets, EBS & EFS Storage', duration: 50, completed: false, youtubeId: 'j0b4X7b-7xI', notes: 'S3 storage tiers and lifecycle policies.' },
      { id: 'p-aws-4', title: 'VPC Networking, Security Groups & Route Tables', duration: 65, completed: false, youtubeId: 'mZ8_mN9kP4Q', notes: 'Public vs private subnets and NAT gateways.' }
    ]
  },
  {
    id: 'preset-sql-db',
    title: 'SQL & Relational Database Mastery',
    instructor: 'Luke Barousse & freeCodeCamp',
    category: 'Data Science & AI',
    level: 'Beginner',
    status: 'Not Started',
    deadline: '2026-11-25',
    totalEstimatedHours: 15,
    coverColor: 'from-emerald-700 to-teal-900',
    accentColor: '#059669',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLillGF-RfqbYeckUaD1z6nE4DoOz574G0',
    description: 'Learn SQL database queries, complex joins, subqueries, group by aggregations, window functions, and indexing.',
    lessons: [
      { id: 'p-sql-1', title: 'SQL Tutorial - Full Database Course for Beginners', duration: 60, completed: false, youtubeId: 'HXV3zeQKqGY', notes: 'SELECT, WHERE, ORDER BY, and INSERT statements.' },
      { id: 'p-sql-2', title: 'Relational Database Schema Design & 3NF Normalization', duration: 45, completed: false, youtubeId: '7S_tz1z_5bA', notes: 'Primary keys, foreign keys, and referential integrity.' },
      { id: 'p-sql-3', title: 'SQL Joins Explained: Inner, Left, Right & Full Outer', duration: 40, completed: false, youtubeId: 'x4B8x_E1m7A', notes: 'Joining multiple tables with aliases.' },
      { id: 'p-sql-4', title: 'Advanced Window Functions: ROW_NUMBER, RANK & OVER', duration: 55, completed: false, youtubeId: 'e_7X2vjK_jA', notes: 'Partition by and cumulative running totals.' }
    ]
  }
];
