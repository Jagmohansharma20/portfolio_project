import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

// ─── SVG ICON COMPONENTS ─────────────────────────────────────────
const Icons = {
  LinkedIn: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  GitHub: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  Email: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  ExternalLink: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Arrow: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  ),
}

// ─── LIVE PARTICLE BACKGROUND ────────────────────────────────────
function LiveBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    const mouse = { x: null, y: null }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouse = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouse)

    class Particle {
      constructor() {
        this.reset()
      }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.1
        const colors = ['124, 58, 237', '6, 182, 212', '236, 72, 153', '167, 139, 250']
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (mouse.x !== null) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            this.x -= dx * 0.01
            this.y -= dy * 0.01
            this.opacity = Math.min(0.8, this.opacity + 0.02)
          }
        }
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`
        ctx.fill()
      }
    }

    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000))
    for (let i = 0; i < count; i++) {
      particles.push(new Particle())
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.06 * (1 - dist / 150)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      connectParticles()
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <div className="live-background">
      <canvas ref={canvasRef} />
    </div>
  )
}

// ─── TYPING ANIMATION HOOK ──────────────────────────────────────
function useTypewriter(words, typingSpeed = 100, deletingSpeed = 60, pauseTime = 1800) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    let timeout

    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime)
    } else if (isDeleting && text === '') {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % words.length)
    } else {
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, text.length + (isDeleting ? -1 : 1)))
      }, isDeleting ? deletingSpeed : typingSpeed)
    }

    return () => clearTimeout(timeout)
  }, [text, wordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseTime])

  return text
}

// ─── SCROLL ANIMATION HOOK ──────────────────────────────────────
function useFadeIn() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return ref
}

// ─── DATA ────────────────────────────────────────────────────────
const ROLES = [
  'Aspiring Cloud Engineer ☁️',
  'Aspiring Full Stack Developer 🚀',
  'Tech Enthusiast 🔥',
]

const PROGRAMMING_LANGUAGES = [
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
  { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'Sql', icon: 'https://cdn-icons-png.flaticon.com/512/3161/3161158.png' },
]

const WEB_DEV_SKILLS = [
  { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Express.js', icon: 'https://www.peanutsquare.com/wp-content/uploads/2024/04/Express.png' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Tailwind CSS', icon: 'https://icons.veryicon.com/png/o/business/vscode-program-item-icon/tailwindcss.png' },
  { name: 'Canvas API', icon: 'https://raw.githubusercontent.com/gist/fromaline/f6a7b114028d7f358c035ac2a15b203c/raw/91fa3a16ee603df91507e0b6c3d1b84bc9d6ff24/html5_canvas_logo_dark.svg' },
  { name: 'Socket.io', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyHzBsoRkOcXuYBYEz7AT6E0J_84Qe3u3hFA&s' },
  { name: 'WebRTC', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webflow/webflow-original.svg' },
]

const TOOLS_PLATFORMS = [
  { name: 'AWS', icon: 'https://img.icons8.com/androidL/512/FFFFFF/amazon-web-services.png' },
  { name: 'Azure', icon: 'https://brandlogos.net/wp-content/uploads/2022/07/microsoft_azure-logo_brandlogos.net_mlyt6-512x512.png' },
  { name: 'VMware', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/34/VMware_Workstation_11.0_icon.png' },
  { name: 'VirtualBox', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/VirtualBox_2024_Logo.svg/1280px-VirtualBox_2024_Logo.svg.png' },
  { name: 'Ubuntu Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-original.svg' },
  { name: 'GitHub', icon: 'https://static.vecteezy.com/system/resources/thumbnails/046/437/248/small_2x/github-logo-transparent-background-free-png.png' },
  { name: 'Git', icon: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg' },
  { name: 'Render', icon: 'https://cdn.simpleicons.org/render/46E3B7' },
  { name: 'Vercel', icon: 'https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Vercel-Dark.svg' },
  { name: 'Postman', icon: 'https://cdn.iconscout.com/icon/free/png-256/free-postman-logo-icon-svg-download-png-2945092.png' },
]

const CORE_CS_SKILLS = [
  { name: 'Data Structures &Algorithms ', icon: 'https://hackr.io/tutorials/learn-data-structures-algorithms/logo/logo-data-structures-algorithms?ver=1773168885' },

  { name: 'OOP', icon: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/object-oriented-programming-icon-svg-download-png-7444459.png' },
  { name: 'DBMS', icon: 'https://cdn-icons-png.flaticon.com/512/9672/9672242.png' },
  { name: 'Operating Systems', icon: 'https://cdn-icons-png.flaticon.com/512/6303/6303588.png' },
  { name: 'Computer Networks', icon: 'https://cdn-icons-png.freepik.com/256/1554/1554417.png?semt=ais_white_label' },
  { name: 'Software Engineering', icon: 'https://cdn-icons-png.freepik.com/256/14641/14641366.png?semt=ais_white_label' },
]

const SOFT_SKILLS = [
  { name: 'Problem Solving', icon: '🧠' },
  { name: 'Adaptability', icon: '🔄' },
  { name: 'Team Collaboration', icon: '🤝' },
  { name: 'Time Management', icon: '⏰' },
  { name: 'Project Management', icon: '📊' },
]

const PROJECTS = [
  {
    title: 'Real-Time Whiteboard & Chat Application',
    desc: 'A collaborative whiteboard application that allows multiple users to draw and interact on the same canvas in real time. The system synchronizes drawing events instantly between users, enabling seamless collaboration during online discussions or brainstorming sessions.',
    tags: ['React', 'Express.js', 'MongoDB', 'WebSockets', 'Canvas Api'],
    image: '/whiteboard.png',
    github: 'https://github.com/Jagmohansharma20/colab.dev',
    live: 'https://colab-dev-q3ag.vercel.app/',
  },
  {
    title: 'University Student Database Management System',
    desc: 'A cloud-based system designed to manage student records, academic information, and administrative data efficiently. The platform uses scalable AWS infrastructure to ensure reliable data storage, secure access, and high availability.',
    tags: ['EC2', 'S3', 'RDS', 'CloudWatch', 'CloudFront'],
    image: '/database.png',
    github: 'https://drive.google.com/file/d/1RehcEhKeQcG9V0DJNWFSe2gn6Jk7Vh_i/view?usp=drive_link',
  },
  {
    title: 'AI Medication Interaction Checker Chatbot',
    desc: 'An AI-powered chatbot that helps users check potential interactions between different medications. The system analyzes user input and provides warnings about harmful drug combinations using external medical APIs.',
    tags: ['HTML', 'CSS', 'JS', 'API Integration'],
    image: '/chatbot.png',
    github: 'https://github.com/Jagmohansharma20/HTML-project',
    live: 'https://jagmohansharma20.github.io/my-chatbot/',
  },
  {
    title: 'Student Confession Sharing Platform',
    desc: 'A web platform that allows students to anonymously share confessions, opinions, and experiences within their community. The system provides secure posting, moderation capabilities, and dynamic content display.',
    tags: ['HTML', 'CSS', 'JS', 'Express', 'MongoDB'],
    image: '/confession.png',
    github: 'https://github.com/Jagmohansharma20/Campus_confession_applcation',
    // live: 'https://example.com',
  },
]

const CERTIFICATES = [
  {
    name: 'Object Oriented Programming',
    issuer: 'Lovely Professional University',
    image: '/oops.png',
    link: 'https://drive.google.com/file/d/1QJaAKmFgPXGHoeN6WaXeDdryXtAZ2HjE/view?usp=drive_open',
  },
  {
    name: 'Data Structures and Algorithm',
    issuer: 'Lovely Professional University',
    image: '/dsa.png',
    link: 'https://drive.google.com/file/d/1EKZR4Ol8fIUKvMudLznGBY68yMO9SO2p/view?usp=drive_open',
  },
  {
    name: 'Java Programming',
    issuer: 'Lovely Professional University',
    image: '/java.png',
    link: 'https://drive.google.com/file/d/1ioZ2GAYAdnnvoVjXOUaBRxR3HA6ds2Yn/view?usp=drive_link',
  },
  {
    name: 'Fundamentals of Network Communication',
    issuer: 'Coursera',
    image: '/networks.png',
    link: 'https://drive.google.com/file/d/1ORzsvBrimu59qAZsldS50-l-7muyznDx/view',
  },
  {
    name: 'Introduction to Hardware and Operating Systems',
    issuer: 'IBM',
    image: '/os.png',
    link: 'https://drive.google.com/file/d/1-e-xaZ--rNrJ3MHyU-6k98O5V1KI7GC8/view?usp=drive_link',
  },
  {
    name: 'AWS Academy Graduate - Cloud Architecting',
    issuer: 'AWS ',
    image: '/aws.png',
    link: 'https://drive.google.com/file/d/1XnhQcHVywRLK7AkZAUjZsLv9fGu32w4d/view?usp=drive_link',
  },
  {
    name: 'Privacy and Security in Online Social Media',
    issuer: 'NPTEL',
    image: '/nptel.png',
    link: 'https://drive.google.com/file/d/1cTqRj8Dsr-btjD2GwQSmEOsr-FgvBw8h/view?usp=drive_link',
  },
  {
    name: 'Build Generative AI Apps and Solutions with No-Code Tools',
    issuer: 'Infosys',
    image: '/genai.png',
    link: 'https://drive.google.com/file/d/1PHeEhHXDb7Is5CKt3RmOHUiEMzqfgWyW/view?usp=drive_link',
  },
  {
    name: 'ChatGPT-4 Prompt Engineering: ChatGPT, Generative AI & LLM',
    issuer: 'Infosys',
    image: '/chatgpt4.png',
    link: 'https://drive.google.com/file/d/1TnRACLkEgu_aAyMHPdy5P8QTbVwCXgyv/view?usp=drive_link',
  },
]

const ACHIEVEMENTS = [

]

const EDUCATION = [
  {
    degree: 'B.Tech in Computer Science',
    school: 'Lovely Professional University, Punjab',
    year: '2023 - Present',
    grade: 'CGPA: 7.56',
  },
  {
    degree: '12th (Senior Secondary)',
    school: 'Jyoti Sr. Sec. School',
    year: '2022',
    grade: 'Percentage: 88.40%',
  },
  {
    degree: '10th (Secondary)',
    school: 'Hans Sr. Sec. School',
    year: '2020',
    grade: 'Percentage: 91.00%',
  },
]

// ─── NAVBAR COMPONENT ────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = ['home', 'about', 'skills', 'projects', 'certificates', 'achievements', 'education', 'contact']
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#home" className="nav-logo">{'<JS />'}</a>
        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <Icons.Close /> : <Icons.Menu />}
        </button>
      </div>
    </nav>
  )
}

// ─── HERO SECTION ────────────────────────────────────────────────
function HeroSection() {
  const typedText = useTypewriter(ROLES)

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-greeting">
            <span className="wave">👋</span> Hello, I'm
          </p>
          <h1 className="hero-name">
            Jagmohan <span className="highlight">Sharma</span>
          </h1>
          <p className="hero-role">
            <span className="typed-text">{typedText}</span>
            <span className="typed-cursor">|</span>
          </p>
          <p className="hero-desc">
            Passionate about building scalable cloud solutions and creating
            beautiful, functional web applications. Turning ideas into reality
            through clean code and innovative thinking.
          </p>
          <div className="hero-buttons">
            <a href="/jagmohancv.pdf" download className="btn btn-primary">
              <Icons.Download /> Download Resume
            </a>
            <a href="#contact" className="btn btn-outline">
              Let's Connect <Icons.Arrow />
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">4+</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat">
              <div className="stat-number">10+</div>
              <div className="stat-label">Certificates</div>
            </div>
            <div className="stat">
              <div className="stat-number">2.5+</div>
              <div className="stat-label">Years Coding</div>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="profile-pic-wrapper">
            <div className="profile-pic-ring"></div>
            <img src="./profile1.png" alt="profile pic" className="profile-pic" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT SECTION ───────────────────────────────────────────────
function AboutSection() {
  const ref = useFadeIn()

  return (
    <section className="section" id="about">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">Get To Know Me</span>
          <h2 className="section-title">About Me</h2>
        </div>
        <div className="about-grid fade-in" ref={ref}>
          <div className="about-image-area">
            <div className="about-image-card">
              <div className="about-code-block">
                <span className="keyword">const</span> <span className="property">developer</span> = {'{'}<br />
                &nbsp;&nbsp;<span className="property">name</span>: <span className="string">"Jagmohan Sharma"</span>,<br />
                &nbsp;&nbsp;<span className="property">role</span>: <span className="string">"Cloud Engineer"</span>,<br />
                &nbsp;&nbsp;<span className="property">location</span>: <span className="string">"Punjab, India"</span>,<br />
                &nbsp;&nbsp;<span className="property">education</span>: <span className="string">"B.Tech CSE"</span>,<br />
                &nbsp;&nbsp;<span className="property">interests</span>: [<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="string">"Cloud Computing"</span>,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="string">"Web Development"</span>,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="string">"Problem Solving"</span><br />
                &nbsp;&nbsp;],<br />
                &nbsp;&nbsp;<span className="property">passion</span>: <span className="value">Infinity</span>,<br />
                &nbsp;&nbsp;<span className="comment">// Always learning...</span><br />
                {'}'};
              </div>
            </div>
          </div>
          <div className="about-content">
            <h3>A passionate developer building the future</h3>
            <p className="about-text">
              I'm a 3rd year B.Tech Computer Science student at Lovely Professional University, driven by a strong passion for cloud computing and full-stack development. I enjoy building scalable, real-time applications and turning complex problems into simple, efficient, and intuitive solutions that people actually love to use.
            </p>
            <p className="about-text">
              With hands-on experience in modern web technologies and cloud platforms like AWS,Azure . I focus on creating applications that are not just functional but also fast, reliable, and engaging. I love exploring new technologies, experimenting with ideas, and continuously improving my skills through real-world projects. As a curious learner and problem solver, my goal is to grow into a software engineer who builds impactful products that can reach and help large number of users.
            </p>
            {/* <div className="about-info-grid">
              <div className="about-info-item">
                <span className="label">Name</span>
                <span className="value">Jagmohan Sharma</span>
              </div>
              <div className="about-info-item">
                <span className="label">Location</span>
                <span className="value">Punjab, India</span>
              </div>
              <div className="about-info-item">
                <span className="label">Education</span>
                <span className="value">B.Tech CSE (LPU)</span>
              </div>
              <div className="about-info-item">
                <span className="label">Available</span>
                <span className="value">For Internships/Job</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SKILLS SECTION ──────────────────────────────────────────────
function SkillsSection() {
  const ref1 = useFadeIn()
  const ref2 = useFadeIn()
  const ref3 = useFadeIn()
  const ref4 = useFadeIn()
  const ref5 = useFadeIn()

  return (
    <section className="section" id="skills">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">What I Know</span>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">
            A collection of tools and technologies I use to bring ideas to life
          </p>
        </div>
        <div className="skills-wrapper">
          <div className="skills-category fade-in" ref={ref1}>
            <h3 className="skills-category-title">
              <span className="icon purple">💻</span>
              Programming Languages
            </h3>
            <div className="skills-grid">
              {PROGRAMMING_LANGUAGES.map((skill, i) => (
                <div className="skill-item" key={i}>
                  <img src={skill.icon} alt={skill.name} className="skill-icon" />
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="skills-category fade-in" ref={ref2}>
            <h3 className="skills-category-title">
              <span className="icon blue">🌐</span>
              Web Development
            </h3>
            <div className="skills-grid">
              {WEB_DEV_SKILLS.map((skill, i) => (
                <div className="skill-item" key={i}>
                  <img src={skill.icon} alt={skill.name} className="skill-icon" />
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="skills-category fade-in" ref={ref3}>
            <h3 className="skills-category-title">
              <span className="icon green">🛠️</span>
              Tools & Platforms
            </h3>
            <div className="skills-grid">
              {TOOLS_PLATFORMS.map((skill, i) => (
                <div className="skill-item" key={i}>
                  <img src={skill.icon} alt={skill.name} className="skill-icon" />
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="skills-category fade-in" ref={ref4}>
            <h3 className="skills-category-title">
              <span className="icon pink">📚</span>
              Core CS Fundamentals
            </h3>
            <div className="skills-grid">
              {CORE_CS_SKILLS.map((skill, i) => (
                <div className="skill-item" key={i}>
                  <img src={skill.icon} className="skill-icon"></img>
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="skills-category fade-in" ref={ref5}>
            <h3 className="skills-category-title">
              <span className="icon cyan">🌟</span>
              Soft Skills
            </h3>
            <div className="skills-grid">
              {SOFT_SKILLS.map((skill, i) => (
                <div className="skill-item" key={i}>
                  <span className="skill-emoji-icon">{skill.icon}</span>
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PROJECTS SECTION ────────────────────────────────────────────
function ProjectsSection() {
  const ref = useFadeIn()

  return (
    <section className="section" id="projects">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">My Work</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            A showcase of projects that demonstrate my skills and problem-solving abilities
          </p>
        </div>
        <div className="projects-grid fade-in" ref={ref}>
          {PROJECTS.map((project, i) => (
            <div className="project-card" key={i}>
              <img src={project.image} alt={project.title} className="project-image" loading="lazy" />
              <div className="project-content">
                <div className="project-tags">
                  {project.tags.map((tag, j) => (
                    <span className="project-tag" key={j}>{tag}</span>
                  ))}
                </div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                    <Icons.GitHub /> Code
                  </a>
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link">
                      <Icons.ExternalLink /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CERTIFICATES SECTION ────────────────────────────────────────
function CertificatesSection() {
  const ref = useFadeIn()

  return (
    <section className="section" id="certificates">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">Credentials</span>
          <h2 className="section-title">Certificates</h2>
          <p className="section-subtitle">Professional certifications that validate my expertise</p>
        </div>
        <div className="certificates-grid fade-in" ref={ref}>
          {CERTIFICATES.map((cert, i) => (
            <div className="cert-card" key={i}>
              <img src={cert.image} alt={cert.name} className="cert-image" loading="lazy" />
              <div className="cert-content">
                <h4 className="cert-name">{cert.name}</h4>
                <p className="cert-issuer">{cert.issuer}</p>
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link">
                  View Credential <Icons.ExternalLink />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── TRAINING SECTION ────────────────────────────────────────────
const TRAINING = [
  {
    title: 'Data Structures and Algorithms in C++',
    institution: 'Lovely Professional University',
    duration: 'Jun 2025 - Jul 2025',
    desc: 'Comprehensive training covering arrays, linked lists, stacks, queues, trees, graphs, sorting & searching algorithms, greedy algorithms, recursion, dynamic programming, and backtracking — enhancing problem-solving efficiency and competitive programming skills.',
    tags: ['C++', 'DSA', 'Dynamic Programming', 'Graph Theory', 'Recursion'],
    certLink: 'https://drive.google.com/file/d/1JiEpZBkqu4qgnmUbuNazsMU-2-9arot_/view?usp=drive_link',
  },
]

function TrainingSection() {
  const ref = useFadeIn()

  return (
    <section className="section" id="training">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">Professional Development</span>
          <h2 className="section-title">Training</h2>
          <p className="section-subtitle">Hands-on training programs that sharpened my technical expertise</p>
        </div>
        <div className="training-list fade-in" ref={ref}>
          {TRAINING.map((item, i) => (
            <div className="training-card" key={i}>
              <div className="training-card-header">
                <div className="training-icon">🎓</div>
                <div className="training-meta">
                  <h3 className="training-title">{item.title}</h3>
                  <p className="training-institution">{item.institution}</p>
                  <span className="training-duration">{item.duration}</span>
                </div>
              </div>
              <p className="training-desc">{item.desc}</p>
              <div className="training-tags">
                {item.tags.map((tag, j) => (
                  <span className="project-tag" key={j}>{tag}</span>
                ))}
              </div>
              {item.certLink && (
                <a href={item.certLink} target="_blank" rel="noopener noreferrer" className="cert-link">
                  View Certificate <Icons.ExternalLink />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ACHIEVEMENTS SECTION ────────────────────────────────────────
function AchievementsSection() {
  const ref = useFadeIn()

  return (
    <section className="section1" id="achievements">
      {/* <div className="section-container">
        <div className="section-header">
          <span className="section-label">Milestones</span>
          <h2 className="section-title">Achievements</h2>
          <p className="section-subtitle">Key accomplishments throughout my journey</p>
        </div>
        <div className="achievements-grid fade-in" ref={ref}>
          {ACHIEVEMENTS.map((item, i) => (
            <div className="achievement-card" key={i}>
              <div className="achievement-icon">{item.icon}</div>
              <div className="achievement-info">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </section>
  )
}

// ─── LEETCODE DASHBOARD ──────────────────────────────────────────
function LeetCodeDashboard() {
  const ref = useFadeIn()
  const [data, setData] = useState(null)
  const [calendarData, setCalendarData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const LEETCODE_USERNAME = 'jagmohansharma20' // Change to your LeetCode username

  const fetchWithTimeout = async (url, options = {}, timeout = 15000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(id)
      return res
    } catch (err) {
      clearTimeout(id)
      throw err
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Strategy 1: Use LeetCode GraphQL directly
    try {
      const graphqlQuery = {
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              profile {
                ranking
              }
            }
            allQuestionsCount {
              difficulty
              count
            }
          }
        `,
        variables: { username: LEETCODE_USERNAME },
      }

      const res = await fetchWithTimeout('https://leetcode.com/graphql/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graphqlQuery),
      })

      if (res.ok) {
        const json = await res.json()
        const user = json.data?.matchedUser
        const allQ = json.data?.allQuestionsCount

        if (user) {
          const stats = user.submitStatsGlobal?.acSubmissionNum || []
          const getCount = (diff) => stats.find(s => s.difficulty === diff)?.count || 0
          const getTotal = (diff) => allQ?.find(q => q.difficulty === diff)?.count || '?'

          setData({
            solvedProblem: getCount('All'),
            easySolved: getCount('Easy'),
            mediumSolved: getCount('Medium'),
            hardSolved: getCount('Hard'),
            totalEasy: getTotal('Easy'),
            totalMedium: getTotal('Medium'),
            totalHard: getTotal('Hard'),
            acceptanceRate: null,
            ranking: user.profile?.ranking || null,
            totalSubmissions: null,
          })

          // Try to get calendar data
          try {
            const calQuery = {
              query: `query getUserCalendar($username: String!) { matchedUser(username: $username) { userCalendar { submissionCalendar } } }`,
              variables: { username: LEETCODE_USERNAME },
            }
            const calRes = await fetchWithTimeout('https://leetcode.com/graphql/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(calQuery),
            })
            if (calRes.ok) {
              const calJson = await calRes.json()
              const cal = calJson.data?.matchedUser?.userCalendar
              if (cal) setCalendarData(cal)
            }
          } catch { /* calendar optional */ }

          setLoading(false)
          return
        }
      }
    } catch { /* GraphQL failed, try fallback */ }

    // Strategy 2: Use alfa-leetcode-api as fallback
    try {
      const res = await fetchWithTimeout(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`)
      if (res.ok) {
        const json = await res.json()
        if (json.solvedProblem !== undefined) {
          setData({
            solvedProblem: json.solvedProblem ?? 0,
            easySolved: json.easySolved ?? 0,
            mediumSolved: json.mediumSolved ?? 0,
            hardSolved: json.hardSolved ?? 0,
            totalEasy: json.totalEasy ?? '?',
            totalMedium: json.totalMedium ?? '?',
            totalHard: json.totalHard ?? '?',
            acceptanceRate: json.acceptanceRate ?? null,
            ranking: json.ranking ?? null,
            totalSubmissions: json.totalSubmissions ?? null,
          })
          try {
            const calRes = await fetchWithTimeout(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/calendar`)
            if (calRes.ok) setCalendarData(await calRes.json())
          } catch { /* optional */ }
          setLoading(false)
          return
        }
      }
    } catch { /* try next */ }

    setError('Could not reach LeetCode API. The free API servers may be waking up — click Retry.')
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Donut chart SVG
  const DonutChart = ({ easy, medium, hard, total }) => {
    const size = 180
    const strokeWidth = 18
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const totalProblems = easy + medium + hard

    const easyPct = totalProblems > 0 ? easy / totalProblems : 0
    const mediumPct = totalProblems > 0 ? medium / totalProblems : 0
    const hardPct = totalProblems > 0 ? hard / totalProblems : 0

    const easyLen = circumference * easyPct
    const mediumLen = circumference * mediumPct
    const hardLen = circumference * hardPct

    const easyOffset = 0
    const mediumOffset = -(easyLen)
    const hardOffset = -(easyLen + mediumLen)

    return (
      <div className="donut-chart-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-chart">
          {/* Background ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth}
          />
          {/* Hard (red) */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#ef4444" strokeWidth={strokeWidth}
            strokeDasharray={`${hardLen} ${circumference - hardLen}`}
            strokeDashoffset={hardOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="donut-segment"
          />
          {/* Medium (amber) */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#f59e0b" strokeWidth={strokeWidth}
            strokeDasharray={`${mediumLen} ${circumference - mediumLen}`}
            strokeDashoffset={mediumOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="donut-segment"
          />
          {/* Easy (green) */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#22c55e" strokeWidth={strokeWidth}
            strokeDasharray={`${easyLen} ${circumference - easyLen}`}
            strokeDashoffset={easyOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="donut-segment"
          />
          {/* Center text */}
          <text x="50%" y="46%" textAnchor="middle" className="donut-center-number">
            {totalProblems}
          </text>
          <text x="50%" y="62%" textAnchor="middle" className="donut-center-label">
            Solved
          </text>
        </svg>
      </div>
    )
  }

  // Submission Calendar Heatmap
  const SubmissionCalendar = ({ calendar }) => {
    if (!calendar || !calendar.submissionCalendar) return null

    let submissionMap = {}
    try {
      submissionMap = typeof calendar.submissionCalendar === 'string'
        ? JSON.parse(calendar.submissionCalendar)
        : calendar.submissionCalendar
    } catch { return null }

    const today = new Date()
    const oneYearAgo = new Date(today)
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    oneYearAgo.setDate(oneYearAgo.getDate() - oneYearAgo.getDay()) // align to Sunday

    // Build weeks array (52-53 weeks)
    const weeks = []
    let current = new Date(oneYearAgo)
    while (current <= today) {
      const week = []
      for (let d = 0; d < 7; d++) {
        if (current <= today) {
          // LeetCode uses UTC midnight timestamps as keys
          const utcMidnight = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()) / 1000
          const localMidnight = Math.floor(new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime() / 1000)
          const count = submissionMap[utcMidnight] || submissionMap[String(utcMidnight)] || submissionMap[localMidnight] || submissionMap[String(localMidnight)] || 0
          week.push({
            date: new Date(current),
            count,
          })
        }
        current.setDate(current.getDate() + 1)
      }
      weeks.push(week)
    }

    const getColor = (count) => {
      if (count === 0) return 'rgba(255,255,255,0.04)'
      if (count <= 1) return '#0e4429'
      if (count <= 3) return '#006d32'
      if (count <= 5) return '#26a641'
      return '#39d353'
    }

    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Determine month labels positions
    const monthLabels = []
    let lastMonth = -1
    weeks.forEach((week, wi) => {
      const firstDay = week[0]
      if (firstDay && firstDay.date.getMonth() !== lastMonth) {
        lastMonth = firstDay.date.getMonth()
        monthLabels.push({ index: wi, label: MONTHS[lastMonth] })
      }
    })

    const totalSubmissions = Object.values(submissionMap).reduce((s, v) => s + v, 0)
    const activeDays = Object.values(submissionMap).filter(v => v > 0).length
    const maxStreak = (() => {
      let streak = 0, maxS = 0
      weeks.flat().forEach(d => {
        if (d && d.count > 0) { streak++; maxS = Math.max(maxS, streak) }
        else streak = 0
      })
      return maxS
    })()

    const cellSize = 13
    const cellGap = 3

    return (
      <div className="lc-calendar">
        <div className="lc-calendar-header">
          <h4 className="lc-calendar-title">📅 Submission Calendar</h4>
          <div className="lc-calendar-mini-stats">
            <span><strong>{totalSubmissions}</strong> submissions</span>
            <span><strong>{activeDays}</strong> active days</span>
            <span><strong>{maxStreak}</strong> max streak</span>
          </div>
        </div>
        <div className="lc-heatmap-wrapper">
          <div className="lc-heatmap-days">
            {DAYS.filter((_, i) => i % 2 === 1).map(d => (
              <span key={d} className="lc-heatmap-day-label">{d}</span>
            ))}
          </div>
          <div className="lc-heatmap-scroll">
            <div className="lc-heatmap-months">
              {monthLabels.map(m => (
                <span
                  key={m.index}
                  className="lc-heatmap-month-label"
                  style={{ gridColumnStart: m.index + 1 }}
                >
                  {m.label}
                </span>
              ))}
            </div>
            <div className="lc-heatmap-grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)` }}>
              {weeks.map((week, wi) =>
                week.map((day, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className="lc-heatmap-cell"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      background: getColor(day.count),
                      gridRow: di + 1,
                      gridColumn: wi + 1,
                    }}
                    title={`${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: ${day.count} submission${day.count !== 1 ? 's' : ''}`}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <div className="lc-heatmap-legend">
          <span className="lc-heatmap-legend-label">Less</span>
          {[0, 1, 3, 5, 7].map(v => (
            <div key={v} className="lc-heatmap-cell" style={{ width: cellSize, height: cellSize, background: getColor(v) }} />
          ))}
          <span className="lc-heatmap-legend-label">More</span>
        </div>
      </div>
    )
  }

  return (
    <section className="section" id="leetcode">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Achievements</h2>
          <span className="section-label">Coding Practice</span>
          <h2 className="section-title">LeetCode Dashboard</h2>
          <p className="section-subtitle">My problem-solving journey on LeetCode</p>
        </div>
        <div className="dashboard-content fade-in" ref={ref}>
          {loading && (
            <div className="dashboard-loading">
              <div className="loading-spinner"></div>
              <p>Fetching LeetCode stats...</p>
            </div>
          )}
          {error && (
            <div className="dashboard-error">
              <div className="lc-card-fallback">
                <img
                  src={`https://leetcard.jacoblin.cool/${LEETCODE_USERNAME}?theme=dark&font=Outfit&ext=heatmap`}
                  alt={`${LEETCODE_USERNAME}'s LeetCode Stats`}
                  className="lc-card-image"
                />
              </div>
              <button className="btn btn-outline retry-btn" onClick={fetchData}>
                🔄 Load Interactive Dashboard
              </button>
            </div>
          )}
          {data && !loading && !error && (
            <div className="dashboard-card-wrapper lc-wrapper">
              <div className="leetcode-dashboard">
                <div className="lc-chart-area">
                  <DonutChart
                    easy={data.easySolved || 0}
                    medium={data.mediumSolved || 0}
                    hard={data.hardSolved || 0}
                    total={data.solvedProblem || 0}
                  />
                  <div className="lc-legend">
                    <div className="lc-legend-item">
                      <span className="lc-dot easy"></span>
                      <span className="lc-legend-label">Easy</span>
                      <span className="lc-legend-value">{data.easySolved || 0}<span className="lc-legend-total">/{data.totalEasy || '?'}</span></span>
                    </div>
                    <div className="lc-legend-item">
                      <span className="lc-dot medium"></span>
                      <span className="lc-legend-label">Medium</span>
                      <span className="lc-legend-value">{data.mediumSolved || 0}<span className="lc-legend-total">/{data.totalMedium || '?'}</span></span>
                    </div>
                    <div className="lc-legend-item">
                      <span className="lc-dot hard"></span>
                      <span className="lc-legend-label">Hard</span>
                      <span className="lc-legend-value">{data.hardSolved || 0}<span className="lc-legend-total">/{data.totalHard || '?'}</span></span>
                    </div>
                  </div>
                </div>
                {calendarData && <SubmissionCalendar calendar={calendarData} />}
                <a
                  href={`https://leetcode.com/u/${LEETCODE_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dashboard-profile-link"
                >
                  View Full Profile <Icons.ExternalLink />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── GITHUB DASHBOARD ────────────────────────────────────────────
const GITHUB_USERNAME = 'Jagmohansharma20'

const GITHUB_STATS = {
  totalRepos: 12,
  followers: 5,
}

const GITHUB_REPOS = [
  {
    name: 'colab.dev',
    desc: 'A collaborative whiteboard application that allows multiple users to draw and interact on the same canvas in real time.',
    language: 'JavaScript',
    url: 'https://github.com/Jagmohansharma20/colab.dev',
  },
  {
    name: 'HTML-project',
    desc: 'AI Medication Interaction Checker Chatbot built with HTML, CSS, JS and API integration.',
    language: 'HTML',
    url: 'https://github.com/Jagmohansharma20/HTML-project',
  },
  {
    name: 'Campus_confession_applcation',
    desc: 'A web platform for students to anonymously share confessions and opinions within their community.',
    language: 'JavaScript',
    url: 'https://github.com/Jagmohansharma20/Campus_confession_applcation',
  },
]

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', HTML: '#e34c26',
  CSS: '#563d7c', Shell: '#89e051', Go: '#00ADD8',
}

function GitHubDashboard() {
  const ref = useFadeIn();

  return (
    <section className="section" id="github">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">Open Source</span>
          <h2 className="section-title">GitHub Dashboard</h2>
          <p className="section-subtitle">My open-source contributions and repositories</p>
        </div>
        <div className="dashboard-card-wrapper gh-wrapper fade-in" ref={ref}>
          <div className="github-dashboard">
            {/* Stats Row */}
            <div className="gh-stats-row">
              <div className="gh-stat-card">
                <span className="gh-stat-number">{GITHUB_STATS.totalRepos}</span>
                <span className="gh-stat-label">Repositories</span>
              </div>
              <div className="gh-stat-card">
                <span className="gh-stat-number">{GITHUB_STATS.followers}</span>
                <span className="gh-stat-label">Followers</span>
              </div>
            </div>

            {/* Top Repos */}
            <h4 className="gh-sub-title">Featured Repositories</h4>
            <div className="gh-repos-grid">
              {GITHUB_REPOS.map((repo, i) => (
                <a
                  key={i}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-repo-card"
                >
                  <div className="gh-repo-header">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="gh-repo-icon">
                      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8.5V1.5zm-8.75 9.75a.75.75 0 000 1.5h8.75a.75.75 0 000-1.5h-8.75z" />
                    </svg>
                    <span className="gh-repo-name">{repo.name}</span>
                  </div>
                  <p className="gh-repo-desc">{repo.desc}</p>
                  <div className="gh-repo-meta">
                    {repo.language && (
                      <span className="gh-repo-lang">
                        <span className="gh-lang-dot" style={{ background: LANG_COLORS[repo.language] || '#8b8b8b' }} />
                        {repo.language}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>

            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="dashboard-profile-link"
            >
              View Full Profile <Icons.ExternalLink />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── EDUCATION SECTION ───────────────────────────────────────────
function EducationSection() {
  const ref = useFadeIn()

  return (
    <section className="section" id="education">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">Academic Journey</span>
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">My academic background and qualifications</p>
        </div>
        <div className="timeline fade-in" ref={ref}>
          {EDUCATION.map((edu, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <span className="timeline-year">{edu.year}</span>
                <h4 className="timeline-degree">{edu.degree}</h4>
                <p className="timeline-school">{edu.school}</p>
                <p className="timeline-grade">{edu.grade}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CONTACT SECTION ─────────────────────────────────────────────
function ContactSection() {
  const ref = useFadeIn()

  return (
    <section className="section" id="contact">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">Contact Me</h2>
          <p className="section-subtitle">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>
        <div className="contact-centered fade-in" ref={ref}>
          <h3>Let's work together</h3>
          <p className="contact-desc">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision. Let's connect!
          </p>
          <div className="contact-links-centered">
            <a href="https://www.linkedin.com/in/jagmohansharma20" target="_blank" rel="noopener noreferrer" className="contact-link-item">
              <div className="contact-link-icon linkedin">
                <Icons.LinkedIn />
              </div>
              <div className="contact-link-text">
                <span className="link-label">LinkedIn</span>
                <span className="link-value">linkedin.com/in/jagmohansharma20</span>
              </div>
            </a>
            <a href="https://github.com/jagmohansharma20" target="_blank" rel="noopener noreferrer" className="contact-link-item">
              <div className="contact-link-icon github">
                <Icons.GitHub />
              </div>
              <div className="contact-link-text">
                <span className="link-label">GitHub</span>
                <span className="link-value">github.com/jagmohansharma20</span>
              </div>
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=jagmohansharma202@gmail.com&su=Portfolio%20Contact&body=Hello%20Jagmohan%2C%20I%20visited%20your%20portfolio."
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link-item"
            >
              <div className="contact-link-icon email">
                <Icons.Email />
              </div>
              <div className="contact-link-text">
                <span className="link-label">Email</span>
                <span className="link-value">jagmohansharma202@gmail.com</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          © {new Date().getFullYear()} Jagmohan Sharma Built with using React.
        </p>
        {/* <div className="footer-socials">
          <a href="https://www.linkedin.com/in/jagmohansharma20/" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn">
            <Icons.LinkedIn />
          </a>
          <a href="https://github.com/jagmohansharma20" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub">
            <Icons.GitHub />
          </a>
          <a href="mailto:jagmohansharma202@gmail.com" className="footer-social-link" title="Email">
            <Icons.Email />
          </a>
        </div> */}
      </div>
    </footer>
  )
}

// ─── MAIN APP ────────────────────────────────────────────────────
function App() {
  return (
    <>
      <LiveBackground />
      <div className="bg-gradient-overlay" />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <CertificatesSection />
      <TrainingSection />
      <AchievementsSection />
      <LeetCodeDashboard />
      <GitHubDashboard />
      <EducationSection />
      <ContactSection />
      <Footer />
    </>
  )
}

export default App
