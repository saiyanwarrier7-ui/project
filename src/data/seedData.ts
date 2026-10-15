import { User, Project, ProjectCategory } from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'user_alex_rivera',
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    course: 'B.Tech in Computer Science',
    year: 'Year 4 (Senior)',
    rollNumber: 'CS-2022-0419',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Senior undergraduate researcher specializing in computer vision, deep learning edge deployments, and scalable web architectures.',
    githubProfile: 'https://github.com/alexrivera-eng',
    linkedinProfile: 'https://linkedin.com/in/alexrivera-student',
    website: 'https://alexrivera.dev',
    joinedDate: 'Aug 2022',
  },
  {
    id: 'user_sarah_chen',
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu',
    role: 'student',
    department: 'Information Technology',
    course: 'B.S. Software Engineering',
    year: 'Year 3 (Junior)',
    rollNumber: 'IT-2023-0112',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    bio: 'Passionate about distributed microservices, fintech platforms, and real-time interactive web applications.',
    githubProfile: 'https://github.com/sarahchen-dev',
    linkedinProfile: 'https://linkedin.com/in/sarahchen-tech',
    joinedDate: 'Sep 2023',
  },
  {
    id: 'user_priya_patel',
    name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    role: 'student',
    department: 'Electronics & Communication',
    course: 'B.Tech Embedded Systems',
    year: 'Year 4 (Senior)',
    rollNumber: 'EC-2022-0943',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    bio: 'Hardware hacker and IoT researcher developing low-power mesh networks and telemetry systems for smart environmental sensing.',
    githubProfile: 'https://github.com/priyapatel-iot',
    joinedDate: 'Aug 2022',
  },
  {
    id: 'user_prof_vance',
    name: 'Prof. Robert Vance',
    email: 'r.vance@university.edu',
    role: 'admin',
    department: 'Faculty of Computing & Information Systems',
    course: 'Department Chair & Academic Reviewer',
    year: 'Faculty Dean',
    rollNumber: 'FAC-CHAIR-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Senior Professor and Academic Projects Coordinator. Oversees capstone evaluations, ethical AI guidelines, and university research repositories.',
    joinedDate: 'Jan 2018',
  },
];

export const SEED_CATEGORIES: ProjectCategory[] = [
  {
    id: 'cat_ai_ml',
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    description: 'Neural networks, computer vision, natural language processing, and automated classification systems.',
    iconName: 'Cpu',
    color: '#3B82F6',
  },
  {
    id: 'cat_web_dev',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Full-stack client-server web applications, reactive dashboards, real-time collaboration, and APIs.',
    iconName: 'Globe',
    color: '#10B981',
  },
  {
    id: 'cat_iot_hardware',
    name: 'IoT & Embedded Systems',
    slug: 'iot-embedded',
    description: 'Microcontroller sensor networks, smart agriculture, telemetry hardware, and home automation.',
    iconName: 'Radio',
    color: '#F59E0B',
  },
  {
    id: 'cat_mobile_apps',
    name: 'Mobile Applications',
    slug: 'mobile-apps',
    description: 'Native and cross-platform Android & iOS applications, campus navigators, and utility tools.',
    iconName: 'Smartphone',
    color: '#8B5CF6',
  },
  {
    id: 'cat_cybersecurity',
    name: 'Cybersecurity & Cryptography',
    slug: 'cybersecurity',
    description: 'Network intrusion detection, zero-knowledge verification, cryptanalysis, and authentication frameworks.',
    iconName: 'ShieldCheck',
    color: '#EC4899',
  },
  {
    id: 'cat_cloud_devops',
    name: 'Cloud & Distributed Systems',
    slug: 'cloud-distributed',
    description: 'Container orchestration, microservice architectures, serverless computing, and CI/CD pipelines.',
    iconName: 'Server',
    color: '#06B6D4',
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj_ai_attendance',
    title: 'AI-based Attendance System with Facial Recognition',
    shortDescription: 'Contactless automated attendance tracking system using ResNet-101 deep embeddings and real-time CCTV stream processing.',
    abstract: `### Background & Motivation
Traditional classroom attendance mechanisms involving roll calls or physical biometric fingerprint scanners are time-consuming and prone to proxy attendance or physical hygiene concerns. This project presents a non-intrusive, automated attendance logging system capable of identifying registered students simultaneously in classroom video streams.

### Technical Architecture & Methodology
The pipeline consists of three core phases:
1. **Face Detection & Alignment**: Using MTCNN (Multi-task Cascaded Convolutional Networks) for robust facial bounding box extraction and landmark normalization under varying classroom illumination.
2. **Deep Metric Feature Extraction**: Utilizes a fine-tuned ResNet-101 architecture producing 512-dimensional normalized Euclidean embeddings.
3. **Classification & Verification**: Fast approximate nearest-neighbor query using Faiss index with cosine distance thresholding ($\tau = 0.68$) and liveness anti-spoofing detection.

### Key Results
- **98.6% Recognition Accuracy** achieved across a benchmark of 450 registered university students across varying lighting conditions.
- **Latency**: Real-time throughput of 28.4 FPS on a single NVIDIA RTX 4060 GPU.
- Automated generation of attendance spreadsheets and instant missing student notification to the course instructor.`,
    category: 'AI & Machine Learning',
    technologies: ['Python', 'PyTorch', 'OpenCV', 'FastAPI', 'React', 'Tailwind CSS', 'PostgreSQL'],
    authorId: 'user_alex_rivera',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorDepartment: 'Computer Science & Engineering',
    authorEmail: 'alex.rivera@university.edu',
    teamMembers: [
      { name: 'Alex Rivera', role: 'Lead Vision Engineer & Architect' },
      { name: 'Sarah Chen', role: 'Backend API & Database Engineer' },
      { name: 'David Kim', role: 'Frontend Dashboard Developer' }
    ],
    department: 'Computer Science & Engineering',
    academicYear: '2025-2026',
    thumbnail: '/src/assets/images/project_ai_vision_1792043367799.jpg',
    files: [
      {
        id: 'file_ai_report',
        name: 'AI_Attendance_Capstone_Thesis_Report.pdf',
        type: 'pdf',
        sizeFormatted: '4.8 MB',
        sizeBytes: 5033164,
        url: '#',
        uploadedAt: '2026-03-12',
        description: 'Comprehensive 42-page capstone report with architectural diagrams and ablation benchmarks.'
      },
      {
        id: 'file_ai_presentation',
        name: 'Project_Evaluation_Defence_Slides.ppt',
        type: 'ppt',
        sizeFormatted: '12.2 MB',
        sizeBytes: 12792627,
        url: '#',
        uploadedAt: '2026-03-14',
        description: 'Final semester committee presentation deck with benchmark video recordings.'
      },
      {
        id: 'file_ai_source',
        name: 'face_recognition_core_v1.zip',
        type: 'zip',
        sizeFormatted: '18.4 MB',
        sizeBytes: 19293798,
        url: '#',
        uploadedAt: '2026-03-15',
        description: 'Full source repository with pre-trained PyTorch weights and Dockerfile configuration.'
      }
    ],
    githubUrl: 'https://github.com/alexrivera-eng/ai-attendance-system',
    liveDemoUrl: 'https://demo-ai-attendance.vercel.app',
    status: 'approved',
    viewsCount: 1420,
    likesCount: 184,
    bookmarksCount: 96,
    submissionDate: '2026-03-15',
    featured: true,
  },
  {
    id: 'proj_ecommerce_platform',
    title: 'Modern E-commerce Website with Real-time Inventory',
    shortDescription: 'Full-stack reactive marketplace platform featuring atomic transaction checkout, Stripe payments, and live warehouse inventory synchronization.',
    abstract: `### Overview
A modern web-based enterprise grade e-commerce shopping platform built to evaluate microservices patterns and optimistic UI updates for concurrent inventory transactions.

### Architectural Highlights
- **Server-Driven Catalog**: Next.js App Router with incremental static regeneration and edge caching for sub-50ms product catalog rendering.
- **Transactional Consistency**: Implemented PostgreSQL optimistic locking and Redis pub/sub queue preventing race conditions during flash sale inventory decrements.
- **Payment & Compliance**: Full Stripe Checkout webhook verification flow with automated invoice generation and email notifications.
- **Admin Management Console**: Dedicated dashboard for warehouse managers with sales analytics, inventory restock alerts, and order status tracking.`,
    category: 'Web Development',
    technologies: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Stripe API', 'Redis'],
    authorId: 'user_sarah_chen',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    authorDepartment: 'Information Technology',
    authorEmail: 'sarah.chen@university.edu',
    teamMembers: [
      { name: 'Sarah Chen', role: 'Full-Stack Developer' },
      { name: 'Marcus Johnson', role: 'UI/UX Designer & Frontend' }
    ],
    department: 'Information Technology',
    academicYear: '2025-2026',
    thumbnail: '/src/assets/images/project_web_platform_1792043367920.jpg',
    files: [
      {
        id: 'file_ecom_spec',
        name: 'System_Architecture_and_API_Documentation.pdf',
        type: 'pdf',
        sizeFormatted: '3.1 MB',
        sizeBytes: 3250585,
        url: '#',
        uploadedAt: '2026-02-20',
        description: 'Complete OpenAPI 3.0 specification and database ERD schemas.'
      },
      {
        id: 'file_ecom_bundle',
        name: 'ecommerce_storefront_source.zip',
        type: 'zip',
        sizeFormatted: '8.7 MB',
        sizeBytes: 9122611,
        url: '#',
        uploadedAt: '2026-02-22',
        description: 'Production-ready codebase including seed scripts and Docker Compose orchestration.'
      }
    ],
    githubUrl: 'https://github.com/sarahchen-dev/nova-ecommerce-platform',
    liveDemoUrl: 'https://nova-storefront-demo.netlify.app',
    status: 'approved',
    viewsCount: 980,
    likesCount: 132,
    bookmarksCount: 67,
    submissionDate: '2026-02-22',
    featured: true,
  },
  {
    id: 'proj_smart_irrigation',
    title: 'Solar-Powered Smart Irrigation System with LoRa Telemetry',
    shortDescription: 'Autonomous agricultural sensor mesh measuring soil moisture, solar irradiance, and evapotranspiration with predictive water valve scheduling.',
    abstract: `### Problem Formulation
Freshwater consumption in global agriculture accounts for approximately 70% of freshwater withdrawals. Traditional timer-based irrigation systems lead to over-watering and nutrient runoff due to lack of real-time soil moisture and micro-climate feedback.

### Proposed System
This project engineered an autonomous solar-powered IoT unit featuring:
- **Low-Power Sensing Node**: Powered by an ESP32 microcontroller with deep-sleep cycling, capacitive moisture probes, and Sensirion SHT31 humidity sensors.
- **LoRaWAN Gateway**: Long-range 868MHz radio telemetry communicating with a central campus gateway up to 4.2 km away.
- **Evapotranspiration Algorithm**: Incorporates the FAO-56 Penman-Monteith equation combining temperature, wind speed, and humidity to estimate optimal water volume.
- **Cloud Dashboard**: React-based telemetry cockpit showing live soil profiles, battery state-of-charge, and automated valve override toggles.`,
    category: 'IoT & Embedded Systems',
    technologies: ['C++', 'ESP32', 'LoRaWAN', 'MQTT', 'Node.js', 'React', 'TimescaleDB', 'Hardware Design'],
    authorId: 'user_priya_patel',
    authorName: 'Priya Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    authorDepartment: 'Electronics & Communication',
    authorEmail: 'priya.patel@university.edu',
    teamMembers: [
      { name: 'Priya Patel', role: 'Embedded Firmware & Circuit Design' },
      { name: 'Arun Verma', role: 'Mechanical Enclosure & Solar MPPT' },
      { name: 'Alex Rivera', role: 'Cloud Dashboard Integration' }
    ],
    department: 'Electronics & Communication',
    academicYear: '2025-2026',
    thumbnail: '/src/assets/images/project_iot_smart_1792043368164.jpg',
    files: [
      {
        id: 'file_iot_schematic',
        name: 'PCB_Schematics_and_Gerber_Files.zip',
        type: 'zip',
        sizeFormatted: '5.2 MB',
        sizeBytes: 5452595,
        url: '#',
        uploadedAt: '2026-03-01',
        description: 'KiCad schematic files, Bill of Materials (BOM), and 2-layer PCB Gerber manufacturing archives.'
      },
      {
        id: 'file_iot_paper',
        name: 'Irrigation_Research_Paper_Draft.pdf',
        type: 'pdf',
        sizeFormatted: '2.9 MB',
        sizeBytes: 3040870,
        url: '#',
        uploadedAt: '2026-03-03',
        description: 'Draft manuscript submitted to IEEE Internet of Things Student Conference.'
      }
    ],
    githubUrl: 'https://github.com/priyapatel-iot/smart-irrigation-lora',
    liveDemoUrl: 'https://smart-agri-telemetry.vercel.app',
    status: 'approved',
    viewsCount: 1150,
    likesCount: 165,
    bookmarksCount: 88,
    submissionDate: '2026-03-05',
    featured: true,
  },
  {
    id: 'proj_student_management',
    title: 'University Student Management & Academic Grading System',
    shortDescription: 'Role-based educational records system with grading rubrics, course registration, attendance analytics, and verifiable transcript generation.',
    abstract: `### Abstract
A secure, scalable enterprise student information system (SIS) developed to streamline academic management across university departments. 

### Key Capabilities
- **Strict Role-Based Access Control (RBAC)**: Distinct permission boundaries for Students, Teaching Assistants, Faculty Instructors, and Academic Registrars.
- **GPA & Credit Computation**: Automatic semester SGPA/CGPA calculation with configurable university grading curves and honors eligibility.
- **Attendance & Leave Workflow**: Student medical leave requests with digital doctor certificate uploads and faculty approval workflows.
- **Cryptographic Transcript Generation**: Generates digitally signed PDF transcripts with embedded verifiable verification hashes.`,
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
    authorId: 'user_alex_rivera',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorDepartment: 'Computer Science & Engineering',
    authorEmail: 'alex.rivera@university.edu',
    teamMembers: [
      { name: 'Alex Rivera', role: 'Full Stack Developer' },
      { name: 'Rohan Sharma', role: 'Database Administrator' }
    ],
    department: 'Computer Science & Engineering',
    academicYear: '2024-2025',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    files: [
      {
        id: 'file_sis_manual',
        name: 'User_Manual_and_Deployment_Guide.pdf',
        type: 'pdf',
        sizeFormatted: '3.4 MB',
        sizeBytes: 3565158,
        url: '#',
        uploadedAt: '2025-11-10',
        description: 'Comprehensive installation instructions and role permission matrices.'
      }
    ],
    githubUrl: 'https://github.com/alexrivera-eng/university-sis-platform',
    liveDemoUrl: 'https://campus-sis-demo.web.app',
    status: 'approved',
    viewsCount: 760,
    likesCount: 89,
    bookmarksCount: 41,
    submissionDate: '2025-11-15',
    featured: false,
  },
  {
    id: 'proj_online_learning',
    title: 'Collaborative Online Learning Platform with WebRTC Classroom',
    shortDescription: 'EdTech interactive lecture suite featuring low-latency whiteboard sharing, group breakout rooms, and AI automated lecture summaries.',
    abstract: `### Motivation
Distance and hybrid education frequently suffer from passive student disengagement. This platform introduces a low-bandwidth, collaborative virtual classroom designed specifically for interactive code and math tutoring.

### Core Architecture
- **WebRTC Mesh & SFU**: Direct peer-to-peer data channels for audio/video conferencing and synchronized collaborative code editors.
- **Shared Interactive Whiteboard**: Vector-based infinite canvas with sub-15ms sync using operational transforms (OT).
- **Lecture Indexing & Q&A**: Live speech-to-text transcript generation with automatic keyword tagging and timestamped student question queues.`,
    category: 'Web Development',
    technologies: ['React', 'Next.js', 'WebRTC', 'Socket.io', 'Node.js', 'Tailwind CSS', 'IndexedDB'],
    authorId: 'user_sarah_chen',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    authorDepartment: 'Information Technology',
    authorEmail: 'sarah.chen@university.edu',
    teamMembers: [
      { name: 'Sarah Chen', role: 'Real-time WebRTC Architect' },
      { name: 'Maya Lin', role: 'Interactive Canvas Engineer' }
    ],
    department: 'Information Technology',
    academicYear: '2025-2026',
    thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80',
    files: [
      {
        id: 'file_lms_doc',
        name: 'WebRTC_Mesh_Performance_Study.pdf',
        type: 'pdf',
        sizeFormatted: '4.1 MB',
        sizeBytes: 4300000,
        url: '#',
        uploadedAt: '2026-01-18',
        description: 'Network packet loss comparison benchmarks under 3G and 4G conditions.'
      }
    ],
    githubUrl: 'https://github.com/sarahchen-dev/edupulse-learning-suite',
    liveDemoUrl: 'https://edupulse-classroom.vercel.app',
    status: 'approved',
    viewsCount: 890,
    likesCount: 114,
    bookmarksCount: 53,
    submissionDate: '2026-01-20',
    featured: false,
  },
  {
    id: 'proj_face_security',
    title: 'Multi-Camera Face Recognition & Intrusion Security System',
    shortDescription: 'Industrial cybersecurity surveillance platform combining RTSP camera stream analysis, blacklist alerts, and encrypted audit logging.',
    abstract: `### Project Objectives
Campus and institutional perimeter security requires fast identification of unauthorized personnel while ensuring strict privacy logging and evidentiary integrity.

### Implementation
- **Hardware Integration**: Multi-threaded RTSP video ingestion supporting up to 8 concurrent 1080p surveillance streams.
- **YOLOv8 + ArcFace**: Fast human bounding box detection paired with ArcFace loss model achieving high intra-class compactness and inter-class discrepancy.
- **Encrypted Tamper-Proof Audit Trail**: Every facial recognition detection event produces an SHA-256 hash stored in an append-only cryptographic ledger.`,
    category: 'Cybersecurity & Cryptography',
    technologies: ['Python', 'PyTorch', 'YOLOv8', 'FastAPI', 'React', 'Docker', 'OpenCV'],
    authorId: 'user_alex_rivera',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorDepartment: 'Computer Science & Engineering',
    authorEmail: 'alex.rivera@university.edu',
    teamMembers: [
      { name: 'Alex Rivera', role: 'Security Architect' },
      { name: 'Vikram Joshi', role: 'Video Pipeline Specialist' }
    ],
    department: 'Computer Science & Engineering',
    academicYear: '2025-2026',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    files: [
      {
        id: 'file_sec_whitepaper',
        name: 'Intrusion_Detection_Whitepaper.pdf',
        type: 'pdf',
        sizeFormatted: '5.8 MB',
        sizeBytes: 6081740,
        url: '#',
        uploadedAt: '2026-02-05',
        description: 'Formal security model verification and threat analysis.'
      }
    ],
    githubUrl: 'https://github.com/alexrivera-eng/surveillance-arcface-security',
    liveDemoUrl: 'https://sentinel-security.vercel.app',
    status: 'approved',
    viewsCount: 1240,
    likesCount: 151,
    bookmarksCount: 79,
    submissionDate: '2026-02-10',
    featured: true,
  },
  {
    id: 'proj_drone_mapping',
    title: 'Autonomous Terrain Mapping Rover with 3D LiDAR SLAM',
    shortDescription: 'Unmanned ground vehicle mapping GPS-denied indoor environments and complex uneven terrain using ROS2 and Cartographer 3D.',
    abstract: `### Abstract
Designed and built a 4-wheel skid-steer autonomous rover equipped with a 16-channel 3D LiDAR and stereo depth camera for continuous point-cloud generation in unstructured environments. Utilizes Cartographer 3D SLAM with Kalman Filter sensor fusion for real-time localization.`,
    category: 'IoT & Embedded Systems',
    technologies: ['ROS2', 'C++', 'Python', 'Cartographer SLAM', 'LiDAR', 'Gazebo'],
    authorId: 'user_priya_patel',
    authorName: 'Priya Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    authorDepartment: 'Electronics & Communication',
    authorEmail: 'priya.patel@university.edu',
    teamMembers: [
      { name: 'Priya Patel', role: 'Hardware & Sensor Integration' },
      { name: 'Kavita Reddy', role: 'Navigation & Path Planning' }
    ],
    department: 'Electronics & Communication',
    academicYear: '2025-2026',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    files: [
      {
        id: 'file_rover_cad',
        name: 'Chassis_3D_CAD_Models.zip',
        type: 'zip',
        sizeFormatted: '14.5 MB',
        sizeBytes: 15204352,
        url: '#',
        uploadedAt: '2026-01-05',
        description: 'SolidWorks 3D CAD files and laser-cutting DXF profiles.'
      }
    ],
    githubUrl: 'https://github.com/priyapatel-iot/lidar-rover-ros2',
    liveDemoUrl: 'https://rover-telemetry-demo.web.app',
    status: 'pending',
    viewsCount: 420,
    likesCount: 48,
    bookmarksCount: 22,
    submissionDate: '2026-04-02',
    featured: false,
  }
];
