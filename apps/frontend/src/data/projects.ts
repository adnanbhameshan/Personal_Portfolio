import type { Project } from "../types/project";

const projectData = [
  {
    slug: "trackr",
    name: "Trackr",
    eyebrow: "Full-stack job application analyzer",
    summary:
      "A data-driven job tracking platform with JWT authentication, CRUD workflows, pipeline analytics, and a separate NLP resume-matching service.",
    status: "featured",
    accent: "blue",
    tech: [
      "React 19",
      "Vite",
      "Tailwind CSS",
      "React Router DOM v7",
      "Recharts",
      "Axios",
      "Lucide React",
      "Node.js",
      "Express.js",
      "Mongoose",
      "JWT",
      "bcryptjs",
      "MongoDB Atlas",
      "FastAPI",
      "Python",
      "TF-IDF",
      "Cosine Similarity",
    ],
    impact: "Turns manual application tracking into a secure, analytical workflow with a dedicated NLP matching capability.",
    href: "/projects/trackr",
    category: "AI/ML",
    priority: 1,
    todoVerify: ["Confirm GitHub repository URL.", "Confirm live demo URL."],
    details: {
      shortDescription:
        "A MERN job application analyzer that combines secure tracking, lifecycle management, dashboard analytics, and resume-to-job compatibility scoring.",
      problem: [
        "Manual job tracking makes it difficult to manage application status, understand pipeline progress, and measure interview or offer outcomes.",
        "Job seekers also need a structured way to evaluate how closely their resume aligns with a target job description.",
      ],
      solution: [
        "Trackr centralizes job applications and supports create, read, update, and delete operations across the application lifecycle.",
        "Its dashboard visualizes total applications, interviews, offers, rejections, conversion rates, and recent activity with Recharts.",
        "The Resume Analyzer processes uploaded resume content and a target job description with TF-IDF and Cosine Similarity to produce a compatibility score.",
      ],
      architecture: [
        {
          title: "React Frontend",
          subtitle: "React 19 + Vite",
          description: "Presentation layer for UI rendering, routes, state, dashboard analytics, job management, and API communication.",
        },
        {
          title: "Node.js + Express.js",
          subtitle: "Application Layer",
          description: "Handles business logic, JWT authentication, API endpoints, validation, and protected job-management operations.",
        },
        {
          title: "MongoDB Atlas",
          subtitle: "Mongoose Data Layer",
          description: "Stores Users and Jobs collections using Mongoose schemas for structured, flexible document storage.",
        },
      ],
      secondaryArchitecture: {
        title: "Resume Analyzer & Job Matching Pipeline",
        nodes: [
          {
            title: "React Analyzer UI",
            subtitle: "Resume + Job Description",
            description: "The user uploads a resume and provides the target job description for comparison.",
          },
          {
            title: "Node.js + Express.js",
            subtitle: "Main Application Backend",
            description: "Keeps product workflows independent from the specialized Python NLP processing layer.",
          },
          {
            title: "FastAPI NLP Service",
            subtitle: "Python Processing",
            description: "Extracts, cleans, and transforms resume and job-description content for analysis.",
          },
          {
            title: "TF-IDF + Cosine Similarity",
            subtitle: "Matching Engine",
            description: "Creates machine-readable vectors, measures similarity, and returns a compatibility score.",
          },
        ],
      },
      systemDetails: [
        {
          title: "Authentication & Security",
          items: [
            "POST /register creates users with bcryptjs-hashed passwords.",
            "POST /login validates credentials and issues a JWT.",
            "POST /logout clears the token, and GET /profile returns protected profile data.",
            "JWT verification protects user-specific API calls; tokens are stored in a cookie or localStorage.",
          ],
        },
        {
          title: "Job Management APIs",
          items: [
            "GET /jobs retrieves the user's applications.",
            "POST /jobs creates a job application.",
            "PUT /jobs/:id updates application status.",
            "DELETE /jobs/:id removes a job record.",
            "GET /jobs/dashboard returns analytics data.",
          ],
        },
        {
          title: "MongoDB Data Model",
          items: [
            "Users: _id, name, unique email, hashed password, and timestamps.",
            "Jobs: _id, user reference, company, position, status, and timestamps.",
            "Documented statuses: Applied, Offer, Interview, and Rejected.",
          ],
        },
        {
          title: "Deployment",
          items: [
            "React frontend deployed to Vercel.",
            "Node.js backend deployed to Render.",
            "MongoDB hosted with MongoDB Atlas.",
          ],
        },
      ],
      technicalDecisions: [
        "The application uses a three-tier client-server architecture to separate presentation, application, and data responsibilities.",
        "JWT provides stateless authentication, while bcryptjs hashes passwords and protected API calls verify the token.",
        "MongoDB with Mongoose supports the Users and Jobs collections while preserving a flexible document structure.",
        "The FastAPI NLP layer is separated from the main Express backend so AI operations remain maintainable and can scale independently.",
        "TF-IDF transforms resume and job-description text into machine-readable vectors, and Cosine Similarity measures their compatibility.",
      ],
      challenges: [
        {
          challenge: "Protecting user-specific job data across authentication and CRUD routes.",
          solution: "Hash passwords with bcryptjs, issue JWTs after login, and verify the token for each protected API call.",
        },
        {
          challenge: "Keeping application status and analytics consistent as records change.",
          solution: "Model job status in the Jobs collection and expose a dedicated dashboard analytics endpoint alongside the CRUD APIs.",
        },
        {
          challenge: "Adding NLP processing without coupling Python workloads to the MERN backend.",
          solution: "Place resume analysis in a dedicated FastAPI service that can evolve and scale independently.",
        },
      ],
      gallery: [
        {
          title: "Analytics Dashboard",
          note: "Application totals, pipeline distribution, conversion rates, and recent activity.",
          image: "/images/trackr/dashboard-analytics.jpg",
          alt: "Trackr analytics dashboard showing application status metrics and pipeline chart",
        },
        {
          title: "Dashboard Empty State",
          note: "Initial dashboard state before the user adds tracked applications.",
          image: "/images/trackr/dashboard-empty.jpg",
          alt: "Trackr dashboard empty state before job applications are added",
        },
        {
          title: "Add Application",
          note: "Job-entry workflow with URL import, company, role, status, and source fields.",
          image: "/images/trackr/add-job.jpg",
          alt: "Trackr add new job application form",
        },
        {
          title: "Job Applications",
          note: "Searchable and filterable job list with status, source, edit, delete, and CSV export controls.",
          image: "/images/trackr/jobs-list.jpg",
          alt: "Trackr job applications table with status filters and CSV export",
        },
        {
          title: "Secure Login",
          note: "JWT-backed sign-in entry point for protected application data.",
          image: "/images/trackr/login.jpg",
          alt: "Trackr secure login screen",
        },
        {
          title: "Account Registration",
          note: "User registration flow with name, email, and password fields.",
          image: "/images/trackr/signup.jpg",
          alt: "Trackr account registration screen",
        },
      ],
      futureImprovements: [
        "Skill gap analysis and resume improvement suggestions.",
        "AI-generated interview preparation tips and a job recommendation engine.",
        "Advanced semantic matching using transformer-based language models.",
        "Automatic job scraping from LinkedIn and Naukri.",
        "Email alerts, application reminders, and OAuth login through Google or LinkedIn.",
      ],
      workflow: [
        "Upload resume",
        "Extract and process resume content",
        "Provide target job description",
        "Clean text and create TF-IDF vectors",
        "Apply Cosine Similarity",
        "Generate compatibility score",
      ],
    },
  },
  {
    slug: "digivote",
    name: "DigiVote",
    eyebrow: "Blockchain-based Decentralized Voting System",
    summary:
      "Ethereum voting platform using Solidity smart contracts, MetaMask wallet authentication, and MongoDB for off-chain metadata.",
    status: "complete",
    accent: "rose",
    tech: ["React", "Solidity", "Ethereum", "Hardhat/Truffle", "Web3.js", "Node.js", "MongoDB", "MetaMask"],
    impact: "Demonstrates trust-minimized voting flows with on-chain vote records and off-chain election metadata.",
    href: "/projects/digivote",
    category: "Blockchain",
    priority: 2,
    todoVerify: ["Confirm whether Hardhat, Truffle, or both were used.", "Confirm GitHub repository URL.", "Confirm live demo URL."],
    details: {
      shortDescription:
        "DigiVote is a blockchain-based decentralized voting application where critical vote actions are represented as Ethereum smart contract interactions.",
      problem: [
        "Traditional voting applications require users to trust a central server and database operator.",
        "Vote records are sensitive and need stronger guarantees around immutability and public verifiability.",
      ],
      solution: [
        "Move critical vote casting and result retrieval to a Solidity smart contract on Ethereum.",
        "Use MetaMask as the wallet authentication layer so voters sign blockchain transactions directly.",
        "Keep candidate profiles, election configuration, and admin metadata off-chain in MongoDB where immutability is not required.",
      ],
      architecture: [
        {
          title: "Voter Browser",
          subtitle: "MetaMask Wallet",
          description: "User authorizes blockchain actions through wallet-based transaction signing.",
        },
        {
          title: "React Frontend",
          subtitle: "Web3.js / ethers.js",
          description: "Presents election UI and sends smart contract calls for voting and result retrieval.",
        },
        {
          title: "Ethereum Network",
          subtitle: "Solidity Smart Contract",
          description: "Owns critical vote operations such as castVote(), getResults(), and verifyVoter().",
        },
        {
          title: "MongoDB Backend",
          subtitle: "Off-chain metadata",
          description: "Stores candidate metadata, election configuration, and admin data that does not need on-chain immutability.",
        },
      ],
      technicalDecisions: [
        "Blockchain was used for the parts of the voting workflow that benefit from immutability and public verification.",
        "MetaMask was used as the authentication interface because wallet ownership and transaction signing are native Web3 primitives.",
        "MongoDB was kept for off-chain metadata to avoid storing non-critical data on-chain and increasing gas costs.",
      ],
      challenges: [
        {
          challenge: "Balancing transparency with practical storage costs.",
          solution: "Keep critical voting actions on-chain and move descriptive metadata off-chain.",
        },
        {
          challenge: "Making authentication understandable to users.",
          solution: "Use wallet connection and transaction signing as the user-facing authentication flow.",
        },
      ],
      gallery: [
        { title: "Election Setup", note: "TODO_VERIFY: Add real election configuration screenshot." },
        { title: "Wallet Voting Flow", note: "TODO_VERIFY: Add real MetaMask voting screenshot." },
        { title: "Results View", note: "TODO_VERIFY: Add real result tally screenshot." },
      ],
      futureImprovements: [
        "Document deployment network and contract addresses.",
        "Add clearer transaction status and failure-state messaging.",
        "Add automated smart contract tests if not already present.",
      ],
      lessons: [
        "Not every piece of data belongs on-chain.",
        "Wallet authentication changes the UX model compared with session-based apps.",
        "Smart contract boundaries must be designed before UI polish begins.",
      ],
      workflow: ["Connect wallet", "Verify voter", "Cast vote transaction", "Read results", "Review off-chain election metadata"],
    },
  },
  {
    slug: "vjit-sports-scheduler",
    name: "VJIT Sports Scheduler",
    eyebrow: "Academic full-stack capstone",
    summary:
      "A role-based web platform that automates sports session scheduling, resource allocation, and participation tracking for a college sports department.",
    status: "complete",
    accent: "green",
    tech: [
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Sequelize",
      "EJS",
      "Tailwind CSS",
      "Passport.js",
      "bcrypt",
      "connect-flash",
      "CSRF Protection",
      "Body-Parser",
      "CORS",
    ],
    impact: "Replaces spreadsheet, physical-record, and notice-board coordination with role-aware scheduling and participation analytics.",
    href: "/projects/vjit-sports-scheduler",
    category: "Full Stack",
    priority: 3,
    liveStatus: "Not deployed - built and tested locally for a B.Tech capstone demonstration.",
    todoVerify: ["Confirm GitHub repository URL."],
    details: {
      shortDescription:
        "A server-rendered college sports platform where admins manage sessions, resources, users, and reports while students join sessions and track participation.",
      problem: [
        "Manual sports scheduling relied on spreadsheets, physical records, and notice-board announcements.",
        "The process made it difficult to prevent double-booking, track resource availability, and keep students informed about changes or cancellations.",
      ],
      solution: [
        "Centralize sports-session scheduling behind role-based access.",
        "Admins create and manage sessions, allocate resources, oversee participants, manage users, and review reports.",
        "Students browse available sports, join sessions, and review upcoming and past participation from a personal dashboard.",
        "The reports module ranks sports and visualizes popularity by date range.",
      ],
      architecture: [
        {
          title: "EJS + Tailwind CSS",
          subtitle: "Server-Rendered Presentation Layer",
          description: "Renders role-aware admin and student dashboards, forms, session views, and reports directly from Express.",
        },
        {
          title: "Node.js + Express.js",
          subtitle: "Application Layer",
          description: "Handles business logic, Passport.js authentication, CSRF protection, route-level role checks, and session/report CRUD operations.",
        },
        {
          title: "PostgreSQL + Sequelize",
          subtitle: "Data Layer",
          description: "Stores Users, Sessions, and Reports as relational tables, with Sequelize managing validation and queries.",
        },
      ],
      systemDetails: [
        {
          title: "Authentication & Security",
          items: [
            "POST /users registers a user with a bcrypt-hashed password and default non-admin role.",
            "GET /login renders the sign-in form with a CSRF token.",
            "POST /signin authenticates through Passport.js local strategy.",
            "GET /signout ends the authenticated session.",
            "Sequelize validation errors are surfaced through connect-flash messages.",
          ],
        },
        {
          title: "Role-Based Access",
          items: [
            "The User model uses an isAdmin boolean role flag.",
            "Admin-only route and view checks protect session creation, user management, and reports.",
            "Students receive a dashboard focused on available sports and their own sessions.",
          ],
        },
        {
          title: "Relational Data Model",
          items: [
            "Users: id, first name, last name, unique email, hashed password, role flag, and timestamps.",
            "Sessions: id, title, date, time, location, and creator reference.",
            "Reports: id, report date, report type, and aggregated session/participation data.",
          ],
        },
        {
          title: "Deployment Status",
          items: [
            "Not deployed to production.",
            "Built and tested locally as a B.Tech capstone project.",
            "Demonstrated in a controlled lab environment.",
          ],
        },
      ],
      technicalDecisions: [
        "Node.js and Express.js provide asynchronous request handling for a scheduling system with frequent reads and writes.",
        "PostgreSQL preserves relational integrity between users, sessions, and reports, while Sequelize standardizes schema validation and queries.",
        "Server-rendered EJS views kept the academic project scoped and deliverable without a separate SPA frontend.",
        "Passport.js, bcrypt hashing, CSRF tokens, and Sequelize validation provide real security patterns rather than placeholder login logic.",
      ],
      challenges: [
        {
          challenge: "Restricting admin-only session, user-management, and report actions while maintaining one codebase for both roles.",
          solution: "Use the User model's isAdmin flag and enforce checks at both route and view levels.",
        },
        {
          challenge: "Keeping authentication secure without overcomplicating an academic-scope project.",
          solution: "Use Passport.js local strategy, bcrypt hashing, CSRF tokens on state-changing forms, and Sequelize validation.",
        },
        {
          challenge: "Providing useful participation analytics without a dedicated BI tool.",
          solution: "Aggregate session data by sport and date range in PostgreSQL and render a ranked table with a popularity bar chart.",
        },
      ],
      gallery: [
        { title: "Home Page", note: "TODO_VERIFY: Attach the documented landing-page screenshot." },
        { title: "Account Registration", note: "TODO_VERIFY: Attach the documented sign-up screenshot." },
        { title: "Secure Login", note: "TODO_VERIFY: Attach the documented sign-in screenshot." },
        { title: "Sport Dashboard", note: "TODO_VERIFY: Attach the documented role-aware dashboard screenshot." },
        { title: "Session Management", note: "TODO_VERIFY: Attach the documented session-list screenshot." },
        { title: "Reports & Analytics", note: "TODO_VERIFY: Attach the documented reports screenshot." },
        { title: "Change Password", note: "TODO_VERIFY: Attach the documented password-change screenshot." },
        { title: "Edit Profile", note: "TODO_VERIFY: Attach the documented profile-edit screenshot." },
      ],
      futureImprovements: [
        "Real-time notifications for new sessions, changes, and cancellations.",
        "A feedback system for session quality and platform usability.",
        "UI/UX refinement for a more intuitive scheduling experience.",
        "Production deployment with a hosted database and live demo.",
        "Migration from server-rendered EJS to a component-based framework such as React.",
      ],
      workflow: [
        "Sign up with first name, last name, email, and password",
        "Sign in through Passport.js local strategy",
        "Open the role-aware admin or student dashboard",
        "Create, manage, cancel, browse, or join sessions",
        "Filter and review participation analytics",
        "Sign out and end the authenticated session",
      ],
    },
  },
] satisfies Project[];

export const projects: Project[] = [...projectData].sort((a, b) => a.priority - b.priority);
