export default {
  // Navbar
  nav: {
    services: 'Skills',
    projects: 'Projects',
    process: 'Process',
    about: 'About',
    cta: "Let's talk",
  },

  // Hero
  hero: {
    tagline: ['Full-Stack', 'Developer'],
    sub: ['I build web apps, automate business processes,', 'and design scalable backend systems.'],
    cta1: "Let's work together",
    cta2: 'See my projects',
  },

  // Services
  services: {
    label: 'What I do',
    title: ['From idea', 'to production.'],
    items: [
      { num: '01', title: 'Business Automation', desc: 'I take a manual, repetitive process, break it down step by step, and turn it into software — data collection, processing, and automatic reporting.', tags: ['Process Automation', 'Reporting', 'APIs', 'Integrations'] },
      { num: '02', title: 'SaaS & High-Load Architecture', desc: 'I design backend systems built to scale — from database schema to caching and load distribution — so the product holds up as usage grows.', tags: ['System Design', 'Scalability', 'SQL', 'Caching'] },
      { num: '03', title: 'Web Applications', desc: 'Fast, responsive interfaces and full-stack products built with React, Next.js and TypeScript — from dashboards to customer-facing apps.', tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
      { num: '04', title: 'Backend & APIs', desc: 'REST APIs, authentication, and database design with Node.js/Express — secure, well-structured backends your frontend can rely on.', tags: ['Node.js', 'Express', 'JWT', 'SQL'] },
    ],
  },

  // Projects (formerly Industries)
  projects: {
    label: 'Featured Work',
    title: ['Projects worth', 'a closer look.'],
    ndaNote: 'Anonymized per NDA — no client names, logos, or confidential data.',
    viewCase: 'View case study',
    items: [
      {
        slug: 'digital-inspection',
        title: 'Digital Inspection Constructor',
        desc: 'A no-code platform for building and deploying digital inspection apps — forms, offline mobile, and reports generated from one config.',
        stats: '10+ clients onboarded',
        tags: ['React', 'Node.js', 'PostgreSQL'],
        detail: {
          subtitle: 'A platform that turns a paper inspection process into a deployable web + mobile app',
          cover: '/projects/digital-inspection-1.png',
          gallery: [
            { key: 'builder', caption: 'Visual builder — screens, fields and branching logic assembled on a canvas' },
            { key: 'schema', caption: 'Dynamic schema — every field becomes a live database column automatically' },
            { key: 'export', caption: 'One config, three outputs — web app, mobile app, and versioned reports' },
          ],
          context: 'Onboarding a new inspection process (cargo loading, discharge supervision, bale tally, weighbridge checks) meant hand-building a new form and, often, a new mobile app for every client — slow, and every change meant a redeploy.',
          solution: 'I built a visual constructor where an admin assembles screens, fields, conditional branching and multi-step scenarios on a canvas. The platform stores the form definition as JSON and creates a matching database table on the fly, so adding a field never needs a migration. Each finished mini-app can be handed over three ways: a standalone web app, an offline-first mobile app compiled to an installable APK, or a self-contained package with its own backend, frontend and database wiring — plus versioned report templates that render straight to XLSX, DOCX or PDF.',
          results: [
            'Onboarded 10+ clients across cargo, agri-commodity and logistics inspections — each one modeled as its own mini-app, without touching the codebase',
            'Generated hundreds of inspection reports automatically, straight to XLSX, DOCX and PDF',
            'Now running gigabytes of submission and photo evidence data across every deployed mini-app, with live multi-inspector draft collaboration built in',
          ],
          stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          role: 'Full-stack development, system architecture, deployment tooling',
          timeline: 'In support',
        },
      },
      {
        slug: 'sentry',
        title: 'Sentry',
        desc: 'A fleet-management catalog for every mini-app the Constructor exports — locations, versioned git history, uptime monitoring, a credentials vault, and an AI ops assistant.',
        stats: '5 regions monitored',
        tags: ['React', 'Node.js', 'PostgreSQL'],
        detail: {
          subtitle: 'The operations layer behind the Constructor — every export becomes a location it watches',
          cover: '/projects/sentry-1.png',
          gallery: [
            { key: 'exportToLocation', caption: 'Every export becomes a monitored location — name, version and ports parsed straight from the config' },
            { key: 'monitoring', caption: 'Every location, watched continuously — health and config endpoints pinged on a timer' },
            { key: 'beyondMonitoring', caption: 'Beyond monitoring — an encrypted vault, uptime history, full audit logging, and an AI ops assistant' },
          ],
          context: "The Constructor (see previous case) can export a working mini-app for any inspection process, but once those exports were handed off and deployed, there was no single place to see what was actually running — which locations existed, whether they were online, what version they were on, or whether access credentials were sitting in a spreadsheet somewhere.",
          solution: "I built a fleet-management catalog that sits next to the Constructor. The moment an export zip is uploaded, it becomes a Location record — named automatically from region/country/city/project — and its file tree is committed into a per-location git repository, so every version is diffable and every change is history. Sentry pings each location's health and config endpoints on a timer, rolls that into uptime and latency history with a live regional map, and moves access credentials out of spreadsheets into an encrypted vault behind role-based access with full audit logging. A built-in AI assistant answers operational questions — what's currently down, average uptime over 30 days — directly in chat instead of digging through dashboards.",
          results: [
            'Every exported mini-app becomes a monitored location the moment its export zip lands, with version and ports parsed automatically — no manual entry',
            'Health and uptime history tracked per location across 5 regions, with a live map and a worst-uptime-first view instead of hearing about downtime from a client',
            'Access credentials moved out of spreadsheets into an encrypted vault behind role-based access and a full audit log',
          ],
          stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Docker'],
          role: 'Full-stack development, architecture, DevOps',
          timeline: 'In support',
        },
      },
      {
        slug: 'project-portal',
        title: 'Project Portal',
        desc: 'An internal portal that syncs tasks from two Azure DevOps organizations and layers role-based views, workload tracking and reporting on top.',
        stats: '40+ projects tracked',
        tags: ['React', 'Node.js', 'PostgreSQL'],
        detail: {
          subtitle: "A role-aware layer over the team's ticket tracker — the same task data, scoped to what each role actually needs",
          cover: '/projects/project-portal-1.png',
          gallery: [
            { key: 'roles', caption: 'Role-based access — the same task data, scoped differently for engineers, leads, PMs and directors' },
            { key: 'sync', caption: 'Two-way sync — status changes go to Azure DevOps first, and only land in the database once Azure confirms them' },
            { key: 'features', caption: "Beyond the ticket queue — estimate accuracy, portfolio view, workload & timesheets, reporting exports" },
          ],
          context: "The team's real work already lived in an external ticket tracker, but it's a flat, role-agnostic queue — it can't tell you if someone is overloaded, whether a project is on track, or whether estimates are holding, and a lead, a PM and a director all need a different slice of the same data.",
          solution: "I built a portal that syncs tasks and projects from two Azure DevOps organizations into PostgreSQL on a schedule, then layers a role-based access model on top so the same task list looks and behaves differently for an individual contributor, a lead, a project manager or an administrator. On top of the synced data it adds what the source tracker doesn't have at all: estimate-accuracy tracking, a visual portfolio dashboard, a team workload and attendance/timesheet system with an approval flow, and reporting exports — plus a drag-and-drop kanban board where status changes write back to Azure DevOps first, and only land in the local database once Azure confirms the change.",
          results: [
            'One dashboard now tracks 40+ projects and a 15+ person team, replacing scattered per-project views in the source tracker',
            'The board surfaces 500+ tasks across every synced project, with live drag-and-drop status changes written straight back to Azure DevOps',
            "Added analytics the source tracker never had — completion rate and estimate accuracy per engineer, and time saved per month",
          ],
          stack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
          role: 'Full-stack development, architecture, Azure DevOps integration',
          timeline: 'In support',
        },
      },
      {
        slug: 'supplier-risk-platform',
        title: 'Supplier Risk Management Platform',
        desc: 'A multi-tenant SaaS platform where client organizations onboard their suppliers, build custom risk checklists, and get back a verified risk score — automated scoring, review workflow and reporting for many independent programs on one codebase.',
        stats: '10+ platform modules',
        tags: ['React', 'Node.js', 'PostgreSQL'],
        detail: {
          subtitle: 'A platform where clients onboard suppliers, hand them a custom risk checklist, and get back a verified score',
          cover: '/projects/supplier-risk-1.png',
          gallery: [
            { key: 'isolation', caption: 'One request, three enforced boundaries — every query, file and cache key scoped to its tenant' },
            { key: 'redFlag', caption: "A score nobody can quietly override — a single flagged answer forces the highest-risk tier, no manual edit possible" },
            { key: 'beyondAssessment', caption: 'Beyond the assessment itself — workflow audit trail, dashboards, notifications, e-signature' },
          ],
          context: "Companies need a consistent way to gauge the risk of the suppliers they work with — compliance, financial stability, safety — but every client runs its own program with its own checklist, and one supplier's answers must never be visible to another client. That had to work for many independent client organizations on a single platform, not a bespoke build per client.",
          solution: "I built a multi-tenant platform where a client organization invites its suppliers onto the platform, builds a custom risk checklist for whatever it needs to assess, and each supplier fills it in, attaches supporting documents, and gets a calculated risk score and tier back once an internal reviewer verifies it. Access is scoped by role — a reviewer, a supplier and a client each see and can do only what's meant for them — with tenant isolation enforced at the JWT, database-query, file-storage and cache layers so no client program can ever see another's data. On top of that sits an automated scoring engine where a single disqualifying answer overrides the calculated tier and can only be cleared by resubmitting the assessment, a full workflow with an audit trail on every status change, exportable dashboards, configurable notifications, and e-signature.",
          results: [
            'Client organizations onboard their own suppliers and build custom risk checklists without touching code — each program running independently on one platform',
            "Tenant isolation enforced at every layer, so many client programs run side by side without ever seeing each other's supplier data",
            "A scoring engine whose red-flag override can't be bypassed by editing a number by hand — only by having the supplier resubmit the assessment, keeping the audit trail honest",
          ],
          stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          role: 'Full-stack development, implementation architecture',
          timeline: 'In support',
        },
      },
    ],
    more: 'More on GitHub',
  },

  // Case study page (project detail)
  caseStudy: {
    back: 'All projects',
    contextLabel: 'The problem',
    solutionLabel: 'What I built',
    resultLabel: 'Result',
    stackLabel: 'Stack',
    roleLabel: 'Role',
    timelineLabel: 'Timeline',
    notFoundTitle: "This case study isn't published yet",
    notFoundDesc: 'Full write-up coming soon — in the meantime, take a look at the other projects or get in touch directly.',
    ctaTitle: 'Have a similar project?',
    ctaDesc: "Let's talk about automating your business or building your next product.",
    ctaBtn: 'Get in touch',
  },

  // Process
  process: {
    label: 'How I work',
    title: ['From brief', 'to launch.'],
    steps: [
      { num: '01', title: 'Discovery', desc: 'I dig into the process or product — goals, constraints, and what "done" actually looks like — before writing a line of code.', details: ['Requirements & goals', 'Process mapping', 'Tech feasibility check', 'Scope & timeline'], duration: '2–5 days' },
      { num: '02', title: 'Architecture & Design', desc: 'I plan the system before building it — data model, API shape, and UI flow — so the foundation holds up as the project grows.', details: ['System design', 'Database schema', 'UI/UX flow', 'Tech stack selection'], duration: '3–7 days' },
      { num: '03', title: 'Development', desc: 'Clean, tested code shipped in iterations, with regular check-ins so you always know where the project stands.', details: ['Frontend & backend', 'API integration', 'Testing', 'Progress updates'], duration: '2–6 weeks' },
      { num: '04', title: 'Launch & Support', desc: 'I deploy, monitor, and stay on to fix issues and extend the system as your needs change.', details: ['Deployment', 'Bug fixes', 'Performance tuning', 'Ongoing support'], duration: 'Ongoing' },
    ],
  },

  // CTA Banner
  cta: {
    title: 'Have a project in mind?',
    desc: "Let's talk about automating your business or building your next product.",
    btn: 'Get in touch',
  },

  // About
  about: {
    label: 'About',
    title: ['I turn messy', 'processes into', 'reliable systems.'],
    desc1: "I'm a full-stack developer with 2 years of experience building business automation tools — I take a manual process, break it into steps, and turn it into software that collects data and generates reports automatically.",
    desc2: 'Beyond automation, I design and build scalable systems: SaaS backends, high-load architecture, and APIs that hold up as products grow. My core stack is React, TypeScript, Next.js and Node.js/Express, with SQL databases underneath.',
    stats: [
      { value: '2+', num: 2, suffix: '+', label: 'Years of experience' },
      { value: '15+', num: 15, suffix: '+', label: 'Technologies in the stack' },
      { value: '100%', num: 100, suffix: '%', label: 'Ownership, start to finish' },
      { value: '24/7', num: 24, suffix: '/7', label: 'Open to new projects' },
    ],
  },

  // Contact
  contact: {
    label: 'Get in touch',
    title: ['Have a project?', "Let's build it."],
    desc: "Tell me about your idea, the process you want automated, or the product you want to build — I'll get back to you within 24 hours.",
    form: {
      name: 'Your name',
      email: 'Email',
      message: 'Tell me about your project...',
      send: 'Send message',
      sending: 'Sending...',
      sent: "Thanks! I'll get back to you soon.",
    },
    socials: [
      { model: '/tg.glb', label: 'Message me on Telegram', url: 'https://t.me/Bugzers' },
      { model: '/linked.glb', label: 'Connect on LinkedIn', url: 'https://www.linkedin.com/in/ivan-vysocinas-20716b38a' },
      { model: '/gh.glb', label: 'Check out my GitHub', url: 'https://github.com/ivanvysocinas' },
    ],
  },

  // Footer
  footer: {
    copy: '© 2026 Ivan Vysocinas. All rights reserved.',
  },

  // Marquee techs
  marquee: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'React Router', 'Zustand', 'Redux', 'Express', 'Node.js', 'PostgreSQL', 'MySQL', 'MongoDB', 'JWT', 'REST API', 'Docker', 'Git'],

  // Scroll indicator
  scrollSections: [
    { id: 'hero', label: 'Home' },
    { id: 'services', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'process', label: 'Process' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ],
} as const;
