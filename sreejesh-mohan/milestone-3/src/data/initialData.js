// src/data/initialData.js

export const INITIAL_CATEGORIES = [
  'All',
  'Web Development',
  'Data Science & AI',
  'UI/UX Design',
  'Cloud & DevOps',
  'Mobile Apps',
  'Cybersecurity'
];

export const INITIAL_COURSES = [
  {
    id: 'course-1',
    title: 'Full-Stack Modern React & Node.js Architecture',
    instructor: 'Dr. Angela Yu & Dan Abramov',
    category: 'Web Development',
    level: 'Intermediate',
    status: 'In Progress',
    deadline: '2026-11-15',
    totalEstimatedHours: 28,
    coverColor: 'from-blue-600 to-indigo-600',
    accentColor: '#4f46e5',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    playlistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
    description: 'Master production-grade full stack development: React 19, Server Components, Node.js microservices, PostgreSQL, and state management.',
    courseType: 'Web Development',
    keywords: ['React', 'Node.js', 'PostgreSQL', 'Fullstack', 'JavaScript'],
    createdAt: '2026-10-01',
    notes: 'Focusing on state synchronization and React 19 hooks. Need to review context caching before the final project milestone.',
    lessons: [
      {
        id: 'les-101',
        title: 'Modern React Architecture & Component Life Cycle',
        duration: 45,
        completed: true,
        completedAt: '2026-10-18',
        youtubeId: 'bMknfKXIFA8',
        notes: 'Great overview of concurrent features and virtual DOM reconciliation.'
      },
      {
        id: 'les-102',
        title: 'Advanced Hooks: useMemo, useCallback & Custom Hooks',
        duration: 55,
        completed: true,
        completedAt: '2026-10-20',
        youtubeId: 'w7ejDZ8SWv8',
        notes: 'Memorized dependency array rules and memoization patterns.'
      },
      {
        id: 'les-103',
        title: 'Global State Management with Context API & Redux Toolkit',
        duration: 60,
        completed: true,
        completedAt: '2026-10-22',
        youtubeId: 'SqcY0GlETPk',
        notes: 'Implemented clean selector patterns and slice architecture.'
      },
      {
        id: 'les-104',
        title: 'Building RESTful APIs with Node.js & Express',
        duration: 50,
        completed: true,
        completedAt: '2026-10-24',
        youtubeId: 'Oe421EPjeBE',
        notes: 'Middleware chaining, routing patterns, and global error handling.'
      },
      {
        id: 'les-105',
        title: 'PostgreSQL Relational Database Schema Design & Prisma ORM',
        duration: 65,
        completed: false,
        completedAt: null,
        youtubeId: '7S_tz1z_5bA',
        notes: 'Read through schema migrations documentation and connection pooling.'
      },
      {
        id: 'les-106',
        title: 'Authentication & Security with JWT & OAuth 2.0',
        duration: 55,
        completed: false,
        completedAt: null,
        youtubeId: 'mbsmsi7l3r4',
        notes: 'HttpOnly cookie storage pattern for JWT tokens.'
      },
      {
        id: 'les-107',
        title: 'Automated Testing with Vitest & React Testing Library',
        duration: 40,
        completed: false,
        completedAt: null,
        youtubeId: '8Xwq35cPwYg',
        notes: 'Unit tests for custom hooks and integration tests for forms.'
      },
      {
        id: 'les-108',
        title: 'Production Deployment, CI/CD Pipeline & Monitoring',
        duration: 50,
        completed: false,
        completedAt: null,
        youtubeId: 'gL1x1s7hWfI',
        notes: 'GitHub Actions deployment workflow to cloud platform.'
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Deep Learning & Neural Networks with Python',
    instructor: 'Prof. Andrew Ng',
    category: 'Data Science & AI',
    level: 'Advanced',
    status: 'In Progress',
    deadline: '2026-11-28',
    totalEstimatedHours: 35,
    coverColor: 'from-purple-600 to-pink-600',
    accentColor: '#9333ea',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLkDaE6sCZn6Ec-XTbcX1uRg2_u4xOEky0',
    description: 'Dive deep into Convolutional Neural Networks (CNNs), Transformers, PyTorch implementations, and Large Language Model fine-tuning.',
    courseType: 'Data Science & AI',
    keywords: ['Python', 'Deep Learning', 'PyTorch', 'Neural Networks', 'AI'],
    createdAt: '2026-10-05',
    notes: 'Gradient descent optimizations: Adam vs RMSProp. Finish backprop calculus notebook.',
    lessons: [
      {
        id: 'les-201',
        title: 'Linear Algebra & Neural Networks Fundamentals',
        duration: 50,
        completed: true,
        completedAt: '2026-10-12',
        youtubeId: 'aircAruvnKk',
        notes: 'Eigenvalues and matrix dot product representations in PyTorch.'
      },
      {
        id: 'les-202',
        title: 'Gradient Descent & Backpropagation Calculus',
        duration: 60,
        completed: true,
        completedAt: '2026-10-15',
        youtubeId: 'IHZwWFHWa-w',
        notes: 'Chain rule derivatives for forward and backward passes.'
      },
      {
        id: 'les-203',
        title: 'Building Multi-layer Perceptrons from Scratch',
        duration: 75,
        completed: true,
        completedAt: '2026-10-21',
        youtubeId: 'Ilg3gGewQ5U',
        notes: 'Activation functions: ReLU, Leaky ReLU, and GeLU comparison.'
      },
      {
        id: 'les-204',
        title: 'Convolutional Neural Networks for Image Recognition',
        duration: 80,
        completed: false,
        completedAt: null,
        youtubeId: 'LHXXI4-IEns',
        notes: 'Kernel filters, pooling layers, and ResNet skip connections.'
      },
      {
        id: 'les-205',
        title: 'Deep Learning Crash Course in Python',
        duration: 70,
        completed: false,
        completedAt: null,
        youtubeId: 'tPYj3N244gk',
        notes: 'PyTorch DataLoader and training loops setup.'
      },
      {
        id: 'les-206',
        title: 'Attention Mechanisms and Transformer Architectures',
        duration: 90,
        completed: false,
        completedAt: null,
        youtubeId: 'wjZofJX0v4U',
        notes: 'Self-attention query, key, value matrix calculations.'
      },
      {
        id: 'les-207',
        title: 'Introduction to Large Language Models (LLMs)',
        duration: 85,
        completed: false,
        completedAt: null,
        youtubeId: 'zjkBMFhNj_g',
        notes: 'Pre-training, instruction fine-tuning, and tokenization.'
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Design Systems & High-Fidelity UI/UX in Figma',
    instructor: 'Gary Simon & Rachel Andrew',
    category: 'UI/UX Design',
    level: 'Beginner',
    status: 'Completed',
    deadline: '2026-10-20',
    totalEstimatedHours: 16,
    coverColor: 'from-amber-500 to-orange-600',
    accentColor: '#ea580c',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLXDU_eVOJTx7QHLShNqIXL1Cgbxj7HlN4',
    description: 'Master auto-layout, atomic design tokens, interactive prototyping, variable modes, and design handoff workflows in Figma.',
    courseType: 'UI/UX Design',
    keywords: ['Figma', 'UI/UX', 'Design System', 'Prototyping'],
    createdAt: '2026-09-15',
    notes: 'Completed all 6 modules and created a full component library with dark/light theme tokens!',
    lessons: [
      {
        id: 'les-301',
        title: 'Figma UI/UX Design Fundamentals Masterclass',
        duration: 45,
        completed: true,
        completedAt: '2026-09-20',
        youtubeId: 'jwTb_7O_9lA',
        notes: 'Frames, artboards, and vector networks.'
      },
      {
        id: 'les-302',
        title: 'Auto Layout 5.0 and Responsive Design Constraints',
        duration: 40,
        completed: true,
        completedAt: '2026-09-25',
        youtubeId: 'FTFaQWZBqQ8',
        notes: 'Min/max dimensions and nested auto layouts.'
      },
      {
        id: 'les-303',
        title: 'Design Tokens, Color Modes and Figma Variables',
        duration: 60,
        completed: true,
        completedAt: '2026-10-02',
        youtubeId: 'c9Fg_n2XGz8',
        notes: 'Alias variables and semantic theme token systems.'
      },
      {
        id: 'les-304',
        title: 'Building Token-driven Atomic Components & Variants',
        duration: 70,
        completed: true,
        completedAt: '2026-10-08',
        youtubeId: 'x95S_B_p70Q',
        notes: 'Component properties, slot architecture, and booleans.'
      },
      {
        id: 'les-305',
        title: 'Interactive Micro-animations & Smart Animate',
        duration: 55,
        completed: true,
        completedAt: '2026-10-14',
        youtubeId: 'H25_F37sDQE',
        notes: 'Spring curves, delay triggers, and component transitions.'
      },
      {
        id: 'les-306',
        title: 'Developer Handoff, Documentation & Design Specs',
        duration: 50,
        completed: true,
        completedAt: '2026-10-19',
        youtubeId: 'j6Ule7GXaRs',
        notes: 'Published library to team workspace with Dev Mode tags.'
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Cloud DevOps: Docker, Kubernetes & Terraform',
    instructor: 'Nana Janashia & Kelsey Hightower',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    status: 'In Progress',
    deadline: '2026-11-05',
    totalEstimatedHours: 22,
    coverColor: 'from-cyan-600 to-teal-600',
    accentColor: '#0891b2',
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLy7NrLhttCJq65U6b1H7zV5z-p7mXj2w_',
    description: 'Containerize microservices, orchestrate multi-node Kubernetes clusters, and deploy immutable infrastructure on AWS with Terraform.',
    courseType: 'Cloud & DevOps',
    keywords: ['Docker', 'Kubernetes', 'Terraform', 'DevOps', 'AWS'],
    createdAt: '2026-10-10',
    notes: 'Exam coming up soon. Need to accelerate Kubernetes networking and ingress practice.',
    lessons: [
      {
        id: 'les-401',
        title: 'Docker Tutorial for Beginners - Full Course',
        duration: 55,
        completed: true,
        completedAt: '2026-10-16',
        youtubeId: '3c-iBn73dDE',
        notes: 'Alpine base images and multi-stage build caching.'
      },
      {
        id: 'les-402',
        title: 'Docker in 100 Seconds: Concepts & Architecture',
        duration: 45,
        completed: true,
        completedAt: '2026-10-23',
        youtubeId: 'fqMOX6JJhGo',
        notes: 'Daemon, client, registries, and container isolation.'
      },
      {
        id: 'les-403',
        title: 'Kubernetes Tutorial for Beginners: Pods & Deployments',
        duration: 60,
        completed: false,
        completedAt: null,
        youtubeId: 'X48VuDVv0do',
        notes: 'YAML deployment manifests and replica controllers.'
      },
      {
        id: 'les-404',
        title: 'Kubernetes Services, ClusterIP, NodePort and Ingress',
        duration: 65,
        completed: false,
        completedAt: null,
        youtubeId: 'VnvRFRk_51k',
        notes: 'Ingress routing controllers and DNS resolution.'
      },
      {
        id: 'les-405',
        title: 'Terraform Tutorial for Cloud Infrastructure',
        duration: 50,
        completed: false,
        completedAt: null,
        youtubeId: 'SLB_c_daJ5o',
        notes: 'HCL state files and provider configurations.'
      },
      {
        id: 'les-406',
        title: 'CI/CD Pipelines with GitHub Actions Automation',
        duration: 70,
        completed: false,
        completedAt: null,
        youtubeId: '9zUHg7xjIqQ',
        notes: 'Automated test runners, Docker builds, and deployment triggers.'
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Cross-Platform Mobile Apps with Flutter & Dart',
    instructor: 'Maximilian Schwarzmüller',
    category: 'Mobile Apps',
    level: 'Intermediate',
    status: 'Not Started',
    deadline: '2026-12-10',
    totalEstimatedHours: 20,
    coverColor: 'from-emerald-500 to-teal-700',
    accentColor: '#059669',
    thumbnail: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80',
    playlistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jLYyp2Aoh6hcWuxFDX6PBJ',
    description: 'Build native iOS and Android apps using Flutter widgets, Bloc state management, Firebase realtime database, and native hardware APIs.',
    courseType: 'Mobile Apps',
    keywords: ['Flutter', 'Dart', 'Mobile', 'iOS', 'Android', 'Firebase'],
    createdAt: '2026-10-20',
    notes: 'Saved for after wrapping up React Full-Stack course.',
    lessons: [
      {
        id: 'les-501',
        title: 'Flutter Crash Course: Setup & First Mobile App',
        duration: 50,
        completed: false,
        completedAt: null,
        youtubeId: 'x0uinJvhNxI',
        notes: 'Setting up Flutter SDK and Android emulator.'
      },
      {
        id: 'les-502',
        title: 'Dart Programming Language Essentials & OOP',
        duration: 60,
        completed: false,
        completedAt: null,
        youtubeId: 'VPvVD8t02U8',
        notes: 'Null safety, classes, async/await futures, and streams.'
      },
      {
        id: 'les-503',
        title: 'Flutter Layouts, Column, Row & Scaffold Widgets',
        duration: 45,
        completed: false,
        completedAt: null,
        youtubeId: '1ukSR1GRtMU',
        notes: 'StatefulWidget life cycle and widget trees.'
      },
      {
        id: 'les-504',
        title: 'State Management with Provider and Bloc Pattern',
        duration: 75,
        completed: false,
        completedAt: null,
        youtubeId: '3a73c0A_wP8',
        notes: 'Decoupling business logic from UI widgets.'
      },
      {
        id: 'les-505',
        title: 'Connecting Flutter with Cloud APIs & Firebase',
        duration: 65,
        completed: false,
        completedAt: null,
        youtubeId: 'D4nhaszNW4o',
        notes: 'REST client with Dio, JSON serialization, and offline caching.'
      }
    ]
  }
];

const getPastDateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_STUDY_SESSIONS = [
  { id: 'sess-1', date: getPastDateStr(6), minutes: 90, courseId: 'course-1', courseTitle: 'Full-Stack Modern React & Node.js Architecture', notes: 'Component Life Cycle and hooks review' },
  { id: 'sess-2', date: getPastDateStr(5), minutes: 120, courseId: 'course-2', courseTitle: 'Deep Learning & Neural Networks with Python', notes: 'Vectorized Logistic regression equations' },
  { id: 'sess-3', date: getPastDateStr(4), minutes: 60, courseId: 'course-3', courseTitle: 'Design Systems & High-Fidelity UI/UX in Figma', notes: 'Figma token architecture' },
  { id: 'sess-4', date: getPastDateStr(3), minutes: 105, courseId: 'course-1', courseTitle: 'Full-Stack Modern React & Node.js Architecture', notes: 'Redux Toolkit async thunks' },
  { id: 'sess-5', date: getPastDateStr(2), minutes: 75, courseId: 'course-4', courseTitle: 'Cloud DevOps: Docker, Kubernetes & Terraform', notes: 'Docker multi-stage builds' },
  { id: 'sess-6', date: getPastDateStr(1), minutes: 135, courseId: 'course-2', courseTitle: 'Deep Learning & Neural Networks with Python', notes: 'Deep neural network backward propagation' },
  { id: 'sess-7', date: getPastDateStr(0), minutes: 60, courseId: 'course-1', courseTitle: 'Full-Stack Modern React & Node.js Architecture', notes: 'Express middleware setup' }
];

export const INITIAL_DAILY_HABITS = [
  { id: 'habit-1', title: 'Complete at least 1 course lesson video', targetMinutes: 45, completed: true, category: 'Learning' },
  { id: 'habit-2', title: 'Practice coding exercises or hands-on lab', targetMinutes: 45, completed: true, category: 'Coding' },
  { id: 'habit-3', title: 'Write summary notes and key takeaways', targetMinutes: 15, completed: false, category: 'Review' },
  { id: 'habit-4', title: 'Review flashcards / tech documentation', targetMinutes: 15, completed: false, category: 'Review' }
];

export const INITIAL_USER_PROFILE = {
  name: 'Sreejesh Mohan',
  title: 'Aspiring Full Stack & Cloud Developer',
  avatar: '/avatars/avatar-1.jpg',
  email: 'sreejesh.mohan@example.com',
  dailyGoalMinutes: 90,
  weeklyGoalHours: 12,
  currentStreak: 7,
  bestStreak: 18,
  notificationsEnabled: true,
  dailyReminderTime: '20:00',
  theme: 'light'
};
