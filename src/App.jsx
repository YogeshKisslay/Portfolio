import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import {
  GithubIcon as Github, Linkedin, Mail, ExternalLink, ChevronDown,
  Code2, Database, Cloud, Cpu, Layers,
  GraduationCap, Award, Menu, X, ArrowRight,
  Zap, Globe, Check, Copy
} from 'lucide-react'
import { ParticleField } from './components/ParticleField'

// ─── Neon border-trace (conic-gradient sweep) for cards ───────────────────────
const glowColors = {
  cyan: '#06b6d4', emerald: '#10b981', indigo: '#6366f1',
  violet: '#8b5cf6', rose: '#f43f5e',
}

const EMAIL = 'yogeshkisslay004@gmail.com'

// ─── Copy-email button — copies address & fires toast event ───────────────────
const CopyEmailBtn = ({ children, className = '' }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    window.dispatchEvent(new CustomEvent('email-copied'))
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`overflow-hidden ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <Check size={15} /> Copied!
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// ─── Global toast — listens for the copy event ────────────────────────────────
const EmailToast = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = () => {
      setVisible(true)
      setTimeout(() => setVisible(false), 2600)
    }
    window.addEventListener('email-copied', show)
    return () => window.removeEventListener('email-copied', show)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 glass rounded-xl border border-emerald-500/40 shadow-xl shadow-black/30 whitespace-nowrap"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
            <Check size={14} />
          </span>
          <span className="text-slate-300 text-sm">
            <span className="font-mono text-emerald-300">{EMAIL}</span>
            <span className="text-slate-400"> copied to clipboard</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Reactive mouse-glow background ───────────────────────────────────────────
const ReactiveGlow = () => {
  const mx = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 500
  )
  const my = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 400
  )
  const springX = useSpring(mx, { stiffness: 35, damping: 18 })
  const springY = useSpring(my, { stiffness: 35, damping: 18 })
  const bg = useTransform(
    [springX, springY],
    ([x, y]) =>
      `radial-gradient(600px at ${x}px ${y}px, rgba(6,182,212,0.07) 0%, rgba(99,102,241,0.04) 40%, transparent 70%)`
  )

  useEffect(() => {
    const onMove = (e) => { mx.set(e.clientX); my.set(e.clientY) }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: bg }}
    />
  )
}

// ─── Utility: fade-in on scroll ───────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Utility: Stagger container ───────────────────────────────────────────────
const StaggerChildren = ({ children, className = '', staggerDelay = 0.1 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// ─── Section Label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <span className="inline-block font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase mb-3 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">
    {children}
  </span>
)

// ─── Tech Tag ──────────────────────────────────────────────────────────────────
const TechTag = ({ label }) => (
  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-slate-800/80 text-cyan-300 border border-slate-700/60 whitespace-nowrap">
    {label}
  </span>
)

// ─── NAVBAR ────────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = ['About', 'Skills', 'Experience', 'Projects', 'Education', 'Contact']

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id) => {
  setMobileOpen(false)
  setTimeout(() => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
  }, 320) // matches the AnimatePresence exit duration
}

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-slate-700/50 shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="font-mono text-sm font-semibold text-gradient-cyan cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          YK<span className="text-cyan-400 cursor-blink">_</span>
        </motion.span>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <motion.button
              key={link}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo(link)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors rounded-lg hover:bg-slate-800/40 font-medium"
            >
              {link}
            </motion.button>
          ))}
          <motion.button
            type="button"
            onClick={() => { navigator.clipboard.writeText(EMAIL); window.dispatchEvent(new CustomEvent('email-copied')) }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}
            whileTap={{ scale: 0.97 }}
            className="ml-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 rounded-lg transition-all"
          >
            Hire Me
          </motion.button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-cyan-300 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-700/40"
          >
            <div className="flex flex-col p-4 gap-1">
              {links.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className="text-left px-4 py-3 text-sm text-slate-300 hover:text-cyan-300 hover:bg-slate-800/40 rounded-lg transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── TYPING ANIMATION ──────────────────────────────────────────────────────────
const TypingAnimation = () => {
  const lines = [
    '> Initializing Yogesh Kisslay...',
    '> 600+ logic problems solved.',
    '> Microservices architecture: ONLINE.',
    '> Generative AI orchestration: ACTIVE.',
    '> Deploying secure infrastructure...',
    '> System ready. Welcome. ✓',
  ]

  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    if (currentLine >= lines.length) { setDone(true); return }

    const line = lines[currentLine]
    if (currentChar < line.length) {
      const t = setTimeout(() => setCurrentChar(c => c + 1), 28)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setDisplayedLines(prev => [...prev, line])
        setCurrentLine(l => l + 1)
        setCurrentChar(0)
      }, 200)
      return () => clearTimeout(t)
    }
  }, [currentLine, currentChar, done])

  const activeLine = !done && currentLine < lines.length
    ? lines[currentLine].slice(0, currentChar)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="glass rounded-xl p-5 font-mono text-xs sm:text-sm leading-7 max-w-2xl mx-auto mt-10 shadow-xl shadow-black/30"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/40">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="text-slate-500 ml-2">terminal — zsh</span>
      </div>
      {displayedLines.map((line, i) => (
        <div key={i} className={line.includes('✓') ? 'text-emerald-400' : 'text-cyan-300/80'}>
          {line}
        </div>
      ))}
      {activeLine !== null && (
        <div className="text-cyan-300/80">
          {activeLine}
          <span className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 cursor-blink align-middle" />
        </div>
      )}
    </motion.div>
  )
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
const Hero = () => {
  return (
    <section id="about" className="relative min-h-screen flex flex-col justify-center px-4 sm:px-8 pt-20 pb-12 overflow-hidden grid-bg">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Two-column split ─────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">

        {/* LEFT — text content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badges: stacked container so CGPA and availability are separated */}
          <div className="flex flex-col items-center lg:items-start gap-3 mb-7">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              aria-label="CGPA: 9.02 out of 10"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-emerald-300 border border-emerald-400/20 shadow-xl"
            >
              <span className="text-xs tracking-widest">CGPA</span>
              <span className="text-sm font-bold text-white">9.02</span>
              <span className="text-xs">/10</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-cyan-400 border border-cyan-400/20"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for full-time roles · Jun 2026
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4"
          >
            <span className="text-white">Yogesh</span>{' '}
            <span className="text-gradient-cyan">Kisslay</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl sm:text-2xl font-semibold text-slate-200 mb-4 leading-tight"
          >
            Architecting High-Concurrency Systems &amp;{' '}
            <span className="text-gradient-cyan">Adaptive AI.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base text-slate-400 max-w-xl leading-relaxed mb-8 mx-auto lg:mx-0"
          >
            Software Engineering Intern at{' '}
            <span className="text-cyan-300 font-medium">Locus Logistics</span>. Specialized in distributed
            microservices, Generative AI orchestration, and complex route optimization.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10"
          >
            <motion.a
              href="#projects"
              onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
              whileHover={{ y: -2, boxShadow: '0 0 28px rgba(6,182,212,0.45)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              View Projects <ArrowRight size={16} />
            </motion.a>

            <CopyEmailBtn className="flex items-center gap-2 px-6 py-3 glass text-cyan-300 font-semibold rounded-xl text-sm border border-cyan-500/30 hover:border-cyan-400/60 transition-all">
              <Mail size={16} /> Contact Me
            </CopyEmailBtn>

            <motion.a
              href="https://github.com/YogeshKisslay"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-3 glass text-slate-300 hover:text-white font-semibold rounded-xl text-sm border border-slate-600/40 hover:border-slate-400/50 transition-all"
            >
              <Github size={16} /> GitHub
            </motion.a>

            <motion.a
              href="https://linkedin.com/in/yogesh-kisslay"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, boxShadow: '0 0 16px rgba(99,102,241,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-3 glass text-indigo-300 hover:text-indigo-200 font-semibold rounded-xl text-sm border border-indigo-500/30 hover:border-indigo-400/60 transition-all"
            >
              <Linkedin size={16} /> LinkedIn
            </motion.a>
          </motion.div>

          <TypingAnimation />
        </div>

        {/* RIGHT — photo */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, type: 'spring', stiffness: 120 }}
          className="flex-shrink-0 w-72 sm:w-80 lg:w-96"
        >
          {/* Outer glow */}
          <div className="absolute -inset-4 rounded-2xl bg-cyan-500/10 blur-3xl pointer-events-none" />
          {/* Gradient border frame */}
          <div
            className="relative rounded-2xl p-[2px]"
            style={{ background: 'linear-gradient(145deg, #06b6d4, #10b981 50%, #6366f1)' }}
          >
            {/* Inner card */}
            <div className="rounded-[14px] overflow-hidden bg-slate-900">
              <img
                src="/profileImg.jpg"
                alt="Yogesh Kisslay"
                className="w-full h-full object-cover object-top"
                style={{ aspectRatio: '3/4' }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600"
      >
        <span className="text-xs font-mono tracking-widest">SCROLL</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── SKILLS ────────────────────────────────────────────────────────────────────
const skillCategories = [
  {
    label: 'Languages',
    icon: <Code2 size={20} />,
    color: 'cyan',
    skills: ['Core Java', 'JavaScript', 'Python', 'C++', 'C'],
  },
  {
    label: 'Frameworks & Libraries',
    icon: <Layers size={20} />,
    color: 'emerald',
    skills: ['Spring Boot', 'React', 'Node.js', 'Express.js', 'FastAPI', 'Databricks', 'OSRM'],
  },
  {
    label: 'Databases',
    icon: <Database size={20} />,
    color: 'indigo',
    skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQL', 'NoSQL'],
  },
  {
    label: 'Cloud, DevOps & Tools',
    icon: <Cloud size={20} />,
    color: 'violet',
    skills: ['Docker', 'Kubernetes', 'AWS (S3, EC2)', 'CI/CD', 'GitHub Actions', 'Git', 'GitHub', 'CodeRabbit', 'Linux', 'Postman', 'Jira'],
  },
  {
    label: 'Core Architecture',
    icon: <Cpu size={20} />,
    color: 'rose',
    skills: ['Microservices', 'Kafka', 'RabbitMQ', 'OIDC / RBAC', 'REST APIs', 'VRP', 'Machine Learning (BKT)', 'Event-Driven Architecture'],
  },
]

const colorMap = {
  cyan: {
    icon: 'text-cyan-400',
    border: 'border-cyan-500/30 hover:border-cyan-400/60',
    glow: 'hover:shadow-cyan-500/10',
    tag: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    dot: 'bg-cyan-400',
  },
  emerald: {
    icon: 'text-emerald-400',
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    glow: 'hover:shadow-emerald-500/10',
    tag: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  indigo: {
    icon: 'text-indigo-400',
    border: 'border-indigo-500/30 hover:border-indigo-400/60',
    glow: 'hover:shadow-indigo-500/10',
    tag: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    dot: 'bg-indigo-400',
  },
  violet: {
    icon: 'text-violet-400',
    border: 'border-violet-500/30 hover:border-violet-400/60',
    glow: 'hover:shadow-violet-500/10',
    tag: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    dot: 'bg-violet-400',
  },
  rose: {
    icon: 'text-rose-400',
    border: 'border-rose-500/30 hover:border-rose-400/60',
    glow: 'hover:shadow-rose-500/10',
    tag: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    dot: 'bg-rose-400',
  },
}

const Skills = () => (
  <section id="skills" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto">
    <FadeIn className="text-center mb-16">
      <SectionLabel>Capabilities</SectionLabel>
      <h2 className="text-4xl sm:text-5xl font-black text-white mt-2">
        Tech <span className="text-gradient-cyan">Arsenal</span>
      </h2>
      <p className="text-slate-400 mt-4 max-w-xl mx-auto">A curated stack built for building production-grade systems, AI pipelines, and optimized logistics engines.</p>
    </FadeIn>

    <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5" staggerDelay={0.08}>
      {skillCategories.map((cat, idx) => {
        const c = colorMap[cat.color]
        return (
          <StaggerItem key={cat.label} className={idx < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`glass-card rounded-2xl p-6 h-full border ${c.border} hover:shadow-xl ${c.glow} transition-all duration-300`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`p-2.5 rounded-xl bg-slate-800/60 ${c.icon}`}>{cat.icon}</div>
                <h3 className="font-bold text-white text-sm">{cat.label}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${c.tag} transition-all`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </StaggerItem>
        )
      })}
    </StaggerChildren>
  </section>
)

// ─── EXPERIENCE ────────────────────────────────────────────────────────────────
const experiences = [
  {
    company: 'Locus Logistics',
    role: 'Software Engineering Intern',
    period: 'Jan 2026 – Present',
    location: 'Bengaluru, India',
    color: 'cyan',
    highlights: [
      {
        title: 'Adaptive AI Architecture',
        body: 'Architected "Openship," an EdTech engine supporting multi-LLMs. Integrated Machine Learning (Bayesian Knowledge Tracing, Thompson Sampling, Forgetting Curves) for dynamic, personalized syllabus generation with automated CI/CD achieving 99% test coverage.',
        tags: ['Multi-LLM', 'BKT', 'CI/CD', 'EdTech'],
      },
      {
        title: 'Logistics Optimization',
        body: 'Developed a standalone multi-solver VRP framework (OR-Tools, PyVRP, Timefold, VROOM) utilizing OSRM geospatial data to maximize fleet fuel efficiency and delivery compliance.',
        tags: ['OR-Tools', 'PyVRP', 'OSRM', 'VRP'],
      },
      {
        title: 'Enterprise Microservices',
        body: 'Engineered a Spring Boot & React platform for Databricks dashboards; implemented a two-tier OIDC token cache (Caffeine) to enforce RBAC and optimize API latency for high-concurrency systems.',
        tags: ['Spring Boot', 'OIDC', 'RBAC', 'Caffeine'],
      },
    ],
  },
  {
    company: 'J.P. Morgan (Forage)',
    role: 'Software Engineering Virtual Experience',
    period: 'Oct 2025 – Nov 2025',
    location: 'Remote',
    color: 'indigo',
    certificateLink: 'https://drive.google.com/file/d/1JWVJe_nMxMDAvqRoK6PVC8oT3CxFjwLq/view?usp=sharing',
    highlights: [
      {
        title: 'Event-Driven Architecture',
        body: 'Engineered a secure, real-time financial data processing component utilizing Core Java, Spring Boot, and Apache Kafka for high-throughput message streaming.',
        tags: ['Kafka', 'Spring Boot', 'Java'],
      },
      {
        title: 'API & Database Integration',
        body: 'Consumed external APIs via RestTemplate to fetch incentive data, exposed new RESTful endpoints, and managed reliable data persistence using Spring Data JPA and H2 database.',
        tags: ['RestTemplate', 'Spring JPA', 'REST API'],
      },
    ],
  },
]

const ExpCard = ({ exp, c, i }) => {
  return (
    <div className="relative flex gap-6 sm:gap-10">
      {/* Glowing timeline node */}
      <div className="relative flex-shrink-0 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, delay: i * 0.1 }}
          className={`w-4 h-4 rounded-full ${c.dot} ring-4 ring-slate-950 z-10 mt-1`}
          style={{ boxShadow: `0 0 12px ${glowColors[exp.color] || '#06b6d4'}` }}
        />
      </div>

      {/* Card with neon border */}
      <motion.div
        whileHover={{ y: -3 }}
        className={`relative flex-1 glass-card rounded-2xl p-6 border ${c.border} hover:shadow-xl overflow-hidden transition-all duration-300`}
      >
        <div className="relative" style={{ zIndex: 10 }}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <h3 className="text-lg font-bold text-white">{exp.company}</h3>
              <p className={`text-sm font-medium ${c.icon}`}>{exp.role}</p>
            </div>
            <div className="text-right flex flex-col items-end gap-1.5">
              <span className="block text-xs font-mono text-slate-400">{exp.period}</span>
              <span className="block text-xs text-slate-500">{exp.location}</span>
              {exp.certificateLink && (
                <motion.a
                  href={exp.certificateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(99,102,241,0.45)' }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/35 hover:border-indigo-400/70 hover:bg-indigo-500/25 transition-all"
                >
                  <Award size={12} /> View Certificate
                </motion.a>
              )}
            </div>
          </div>

          <div className="space-y-5">
            {exp.highlights.map((h) => (
              <div key={h.title} className="pl-4 border-l-2 border-slate-700/50">
                <p className="font-semibold text-slate-100 text-sm mb-1.5">{h.title}</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">{h.body}</p>
                <div className="flex flex-wrap gap-1.5">
                  {h.tags.map((tag) => (
                    <TechTag key={tag} label={tag} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const Experience = () => (
  <section id="experience" className="py-24 px-4 sm:px-6 max-w-5xl mx-auto">
    <FadeIn className="text-center mb-16">
      <SectionLabel>Career</SectionLabel>
      <h2 className="text-4xl sm:text-5xl font-black text-white mt-2">
        Work <span className="text-gradient-cyan">Experience</span>
      </h2>
    </FadeIn>

    <div className="relative">
      {/* Timeline spine */}
      <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/60 via-indigo-500/40 to-transparent" />

      <div className="space-y-14">
        {experiences.map((exp, i) => {
          const c = colorMap[exp.color]
          return (
            <FadeIn key={exp.company} delay={i * 0.15}>
              <ExpCard exp={exp} c={c} i={i} />
            </FadeIn>
          )
        })}
      </div>
    </div>
  </section>
)

// ─── PROJECTS ──────────────────────────────────────────────────────────────────
const projects = [
  {
    title: 'Language Exchange Platform',
    subtitle: 'Full-Stack · MERN · Real-Time P2P',
    description:
      'A peer-to-peer communication engine enabling instant live video/audio matching. Architected with WebRTC and Socket.IO for real-time infrastructure, a secure dual-token micro-economy, and full MERN gamification with Auth0 security.',
    tags: ['MongoDB', 'Express.js', 'React', 'Node.js', 'WebRTC', 'Socket.IO', 'Auth0', 'Razorpay'],
    color: 'cyan',
    icon: <Globe size={22} />,
    liveLink: 'https://language-exchange-frontend.onrender.com',
    githubLink: 'https://github.com/YogeshKisslay/Language_Exchange',
    highlights: ['WebRTC P2P video/audio', 'Dual-token economy', 'Razorpay integration', 'Auth0 security'],
  },
  {
    title: 'Constraint-Solver VRP',
    subtitle: 'Research & Implementation · Logistics AI',
    description:
      'Constraint-SolverVRP: Engineered an advanced constraint-solving algorithmic framework and source code focusing on complex Vehicle Routing Problems. Benchmarks multiple solvers (OR-Tools, PyVRP, VROOM, Timefold) using OSRM geospatial data.',
    tags: ['OR-Tools', 'PyVRP', 'VROOM', 'Timefold', 'OSRM', 'Python', 'VRP'],
    color: 'emerald',
    icon: <Cpu size={22} />,
    githubLink: 'https://github.com/YogeshKisslay/Constraint-Solver_VRP',
    highlights: ['Multi-solver benchmarking', 'OSRM geospatial data', 'Fleet fuel optimization', 'Constraint-solving algorithms'],
  },
  {
    title: 'Openship EdTech Engine',
    subtitle: 'AI · Multi-LLM · Adaptive Learning',
    description:
      'An adaptive AI architecture supporting multi-LLMs for dynamic, personalized syllabus generation. Integrated Bayesian Knowledge Tracing, Thompson Sampling, and Forgetting Curves for intelligent content scheduling.',
    tags: ['Multi-LLM', 'Python', 'FastAPI', 'BKT', 'Thompson Sampling', 'CI/CD'],
    color: 'indigo',
    icon: <Zap size={22} />,
    githubLink: 'https://github.com/locus-taxy/openship',
    highlights: ['Bayesian Knowledge Tracing', 'Multi-LLM support', '99% test coverage', 'Forgetting curves'],
  },
]

const ProjectCard = ({ project, index }) => {
  const c = colorMap[project.color]
  const [hovered, setHovered] = useState(false)

  return (
    <FadeIn delay={index * 0.12}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -8, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 250 }}
        className={`relative glass-card rounded-2xl p-7 h-full border ${c.border} transition-all duration-300 overflow-hidden group ${
          hovered ? `shadow-2xl ${c.glow}` : ''
        }`}
      >
        {/* Gradient overlay on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-${project.color}-500/5 pointer-events-none rounded-2xl`}
          style={{ zIndex: 2 }}
        />

        <div className="relative" style={{ zIndex: 10 }}>
          <div className="flex items-start justify-between mb-5">
            <div className={`p-3 rounded-xl bg-slate-800/60 ${c.icon}`}>{project.icon}</div>
            <div className="flex gap-2">
              {project.liveLink && project.liveLink !== '#' && (
                <motion.a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15 }}
                  className="p-2 glass rounded-lg text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink size={15} />
                </motion.a>
              )}
              <motion.a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15 }}
                className="p-2 glass rounded-lg text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <Github size={15} />
              </motion.a>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
          <p className={`text-xs font-mono mb-4 ${c.icon}`}>{project.subtitle}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-5">{project.description}</p>

          {/* Highlight bullets */}
          <ul className="space-y-1.5 mb-5">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-xs text-slate-300">
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0`} />
                {h}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 text-[11px] font-mono rounded-md border ${c.tag}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </FadeIn>
  )
}

const Projects = () => (
  <section id="projects" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto">
    <FadeIn className="text-center mb-16">
      <SectionLabel>Portfolio</SectionLabel>
      <h2 className="text-4xl sm:text-5xl font-black text-white mt-2">
        Featured <span className="text-gradient-cyan">Projects</span>
      </h2>
      <p className="text-slate-400 mt-4 max-w-xl mx-auto">
        Production-grade systems, AI research, and full-stack applications built to solve real problems.
      </p>
    </FadeIn>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, i) => (
        <ProjectCard key={project.title} project={project} index={i} />
      ))}
    </div>
  </section>
)

// ─── EDUCATION ─────────────────────────────────────────────────────────────────
const Education = () => (
  <section id="education" className="py-24 px-4 sm:px-6 max-w-5xl mx-auto">
    <FadeIn className="text-center mb-16">
      <SectionLabel>Background</SectionLabel>
      <h2 className="text-4xl sm:text-5xl font-black text-white mt-2">
        Education &amp; <span className="text-gradient-cyan">Leadership</span>
      </h2>
    </FadeIn>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Education card 1 */}
      <FadeIn delay={0}>
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-2xl p-7 border border-cyan-500/25 hover:border-cyan-400/50 transition-all h-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-slate-800/60 text-cyan-400">
              <GraduationCap size={20} />
            </div>
            <span className="text-xs font-mono text-cyan-400">2022 – 2026</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">B.E. in Computer Science</h3>
          <p className="text-slate-400 text-sm mb-3">Chitkara University, Rajpura Punjab</p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/20">
              CGPA: 9.02 / 10
            </span>
          </div>
        </motion.div>
      </FadeIn>

      {/* Education card 2 */}
      <FadeIn delay={0.1}>
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-2xl p-7 border border-indigo-500/25 hover:border-indigo-400/50 transition-all h-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-slate-800/60 text-indigo-400">
              <GraduationCap size={20} />
            </div>
            <span className="text-xs font-mono text-indigo-400">2019 – 2022</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Higher Secondary (Class XII)</h3>
          <p className="text-slate-400 text-sm mb-3">Blue Bells Public School, Gurgaon Haryana</p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-500/20">
              83%
            </span>
          </div>
        </motion.div>
      </FadeIn>

      {/* Leadership & Stats */}
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5 mt-2">
        {[
          {
            icon: <Award size={20} />,
            color: 'emerald',
            title: 'CODECRAFTERS 2K23',
            desc: 'Organizer, ACM Student Club',
          },
          {
            icon: <Code2 size={20} />,
            color: 'cyan',
            title: '600+ Problems Solved',
            desc: 'LeetCode & GeeksForGeeks',
          },
          {
            icon: <Zap size={20} />,
            color: 'violet',
            title: 'Full-Time Ready',
            desc: 'Graduating June 2026',
          },
        ].map((item) => {
          const c = colorMap[item.color] || colorMap.cyan
          return (
            <FadeIn key={item.title}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className={`glass-card rounded-2xl p-6 border ${c.border} text-center transition-all`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-slate-800/60 ${c.icon} mb-4`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                <p className="text-slate-400 text-xs">{item.desc}</p>
              </motion.div>
            </FadeIn>
          )
        })}
      </div>
    </div>
  </section>
)

// ─── CONTACT / FOOTER ──────────────────────────────────────────────────────────
const Footer = () => (
  <footer id="contact" className="relative py-20 px-4 sm:px-6 overflow-hidden">
    {/* Ambient glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-60 bg-cyan-500/6 rounded-full blur-3xl" />
    </div>

    <div className="relative max-w-4xl mx-auto">
      {/* CTA block */}
      <FadeIn className="glass rounded-3xl p-10 sm:p-14 text-center mb-12 border border-slate-700/40">
        <SectionLabel>Let's Connect</SectionLabel>
        <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-4">
          Got an exciting <span className="text-gradient-cyan">problem to solve?</span>
        </h2>
        <p className="text-slate-400 text-base max-w-xl mx-auto mb-8">
          I'm always open to discussing new opportunities, interesting engineering challenges, or potential collaborations.
        </p>
        <CopyEmailBtn className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-xl text-sm transition-all">
          <Copy size={17} /> Copy Email Address
        </CopyEmailBtn>
        <p className="mt-4 font-mono text-sm text-slate-500">{EMAIL}</p>
      </FadeIn>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-800/60">
        <span className="font-mono text-sm text-gradient-cyan font-semibold">
          Yogesh Kisslay
        </span>

        <div className="flex items-center gap-3">
          {[
            {
              icon: <Github size={18} />,
              href: 'https://github.com/YogeshKisslay',
              label: 'GitHub',
            },
            {
              icon: <Linkedin size={18} />,
              href: 'https://linkedin.com/in/yogesh-kisslay',
              label: 'LinkedIn',
            },
          ].map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label={link.label}
              className="p-2.5 glass-card rounded-xl text-slate-400 hover:text-cyan-300 border border-slate-700/40 hover:border-cyan-500/40 transition-all"
            >
              {link.icon}
            </motion.a>
          ))}
          <CopyEmailBtn className="p-2.5 glass-card rounded-xl text-slate-400 hover:text-cyan-300 border border-slate-700/40 hover:border-cyan-500/40 transition-all">
            <Mail size={18} />
          </CopyEmailBtn>
        </div>

        <p className="text-xs text-slate-600 font-mono">
          &copy; {new Date().getFullYear()} · Built with React + Framer Motion
        </p>
      </div>
    </div>
  </footer>
)

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Global visual layer */}
      <ParticleField />
      <ReactiveGlow />
      <EmailToast />

      {/* Subtle top accent line */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent z-50 pointer-events-none" />

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Education />
      </main>
      <Footer />
    </div>
  )
}
