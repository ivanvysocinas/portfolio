# ⚡ Ivan Vysocinas — Portfolio

<div align="center">

![Portfolio Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,4,5,6&height=250&section=header&text=Ivan%20Vysocinas&fontSize=80&fontAlignY=35&animation=fadeIn&fontColor=eaeaea&desc=Full-Stack%20Developer%20%7C%20Business%20Automation%20%7C%20SaaS&descAlignY=55&descSize=18)

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=26&duration=3000&pause=1000&color=E8860C&center=true&vCenter=true&random=false&width=650&lines=I+build+web+apps%2C+automate+business+processes...;...and+design+scalable+backend+systems.;React+%2B+TypeScript+%2B+Node.js+%2B+Three.js;From+idea+to+production.)](https://git.io/typing-svg)

**[ivanvysocinas.dev →](https://ivanvysocinas.dev)**

</div>

## 🚀 About This Project

Source of my personal portfolio — a dark, motion-heavy single-page site with a 3D contact model, horizontal-scroll case studies and a GSAP-driven scroll narrative. Built to actually demonstrate the kind of product work described in it, not just describe it.

<div align="center">

![React](https://img.shields.io/badge/React_18-0c0c0e?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-0c0c0e?style=for-the-badge&logo=typescript&logoColor=007ACC)
![Vite](https://img.shields.io/badge/Vite-0c0c0e?style=for-the-badge&logo=vite&logoColor=E8860C)
![Three.js](https://img.shields.io/badge/Three.js-0c0c0e?style=for-the-badge&logo=three.js&logoColor=eaeaea)
![GSAP](https://img.shields.io/badge/GSAP-0c0c0e?style=for-the-badge&logo=greensock&logoColor=88CE02)
![React Router](https://img.shields.io/badge/React_Router-0c0c0e?style=for-the-badge&logo=reactrouter&logoColor=CA4245)

</div>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 Design
- Dark theme, near-black surface with a single amber accent
- Diagonal section wipes + skew-on-scroll-velocity text
- Word-by-word reveal animations, triggered on scroll
- Bilingual — English / Russian, instant switch, no reload
- Fully responsive, mobile-first layout

</td>
<td width="50%">

### ⚡ Engineering
- Smooth-scroll via Lenis, synced to GSAP ScrollTrigger
- Interactive Three.js model in the contact section
- Route-based case study pages with shared page transitions
- Lazy-loaded 3D/heavy sections below the fold
- SEO: OG/Twitter meta, JSON-LD, sitemap, canonical URL

</td>
</tr>
</table>

## 📱 Sections

```mermaid
graph LR
    A[🏠 Hero] --> B[🛠️ Services]
    B --> C[📂 Projects]
    C --> D[🔄 Process]
    D --> E[👤 About]
    E --> F[📧 Contact]

    style A fill:#e8860c,stroke:#f5a623,stroke-width:2px,color:#0c0c0e
    style B fill:#e8860c,stroke:#f5a623,stroke-width:2px,color:#0c0c0e
    style C fill:#e8860c,stroke:#f5a623,stroke-width:2px,color:#0c0c0e
    style D fill:#e8860c,stroke:#f5a623,stroke-width:2px,color:#0c0c0e
    style E fill:#e8860c,stroke:#f5a623,stroke-width:2px,color:#0c0c0e
    style F fill:#e8860c,stroke:#f5a623,stroke-width:2px,color:#0c0c0e
```

### 🏠 Hero
Animated tagline reveal with parallax fade-out on scroll

### 🛠️ Services
Four cards — Business Automation, SaaS & High-Load Architecture, Web Applications, Backend & APIs — sliding in with a 3D tilt

### 📂 Projects
Horizontal-scroll, pinned case study gallery, each with its own detail route — problem, solution, results, stack

### 🔄 Process
Vertical timeline with a scroll-filled progress line, cards alternating left/right

### 👤 About
Stats with animated counters and a network-graph visual

### 📧 Contact
Working contact form (Formspree) next to a switchable 3D social model — LinkedIn, GitHub, Telegram, Email

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript, React Router |
| **Animation** | GSAP + ScrollTrigger, Lenis (smooth scroll) |
| **3D** | Three.js |
| **Build Tool** | Vite |
| **Forms** | Formspree |
| **Icons** | react-icons |

</div>

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ivanvysocinas/portfolio2

# Navigate to project directory
cd portfolio2

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration

### Contact form (Formspree)

The contact form posts to a Formspree endpoint in [`src/components/Contact.tsx`](src/components/Contact.tsx):

```typescript
await fetch('https://formspree.io/f/your_form_id', {
  method: 'POST',
  body: new FormData(form),
  headers: { Accept: 'application/json' },
});
```

1. Create a form at [Formspree](https://formspree.io/)
2. Swap in your own form ID
3. In the Formspree dashboard, restrict **Allowed Domains** to your production domain to stop direct API spam

## 🎯 Project Structure

```
portfolio2/
├── src/
│   ├── components/
│   │   ├── case-diagrams/       # Custom SVG diagrams per case study
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Industries.tsx       # Projects / case studies
│   │   ├── Process.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── ContactModel.tsx     # Three.js social model
│   │   ├── Navbar.tsx / Footer.tsx
│   │   └── ...
│   ├── i18n/
│   │   ├── en.ts / ru.ts        # All copy, per language
│   │   └── context.tsx
│   ├── pages/
│   │   ├── HomePage.tsx         # Scroll animation orchestration
│   │   └── ProjectPage.tsx      # Case study detail route
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
└── public/
    ├── *.glb                    # 3D models
    └── projects/                # Case study screenshots
```

## 🤝 Contributing

This is a personal portfolio, but issues and suggestions are welcome.

## 📧 Contact

<div align="center">

[![Email](https://img.shields.io/badge/Email-ivanvysocinas%40gmail.com-0c0c0e?style=for-the-badge&logo=gmail&logoColor=E8860C)](mailto:ivanvysocinas@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-ivanvysocinas-0c0c0e?style=for-the-badge&logo=github&logoColor=eaeaea)](https://github.com/ivanvysocinas)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ivan_Vysocinas-0c0c0e?style=for-the-badge&logo=linkedin&logoColor=0A66C2)](https://www.linkedin.com/in/ivan-vysocinas-20716b38a)
[![Telegram](https://img.shields.io/badge/Telegram-Bugzers-0c0c0e?style=for-the-badge&logo=telegram&logoColor=26A5E4)](https://t.me/Bugzers)

</div>

---

<div align="center">

### ⭐ Star this repo if you like it!

![Profile Views](https://komarev.com/ghpvc/?username=ivanvysocinas&color=e8860c&style=for-the-badge)

Made by [Ivan Vysocinas](https://github.com/ivanvysocinas)

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,4,5,6&height=100&section=footer)

</div>
