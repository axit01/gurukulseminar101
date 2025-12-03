import React, { useEffect, useState, useRef } from 'react'
import './App.css'
import { Toaster } from 'sonner'
import brandLogo from './assets/splash_image.png'
import heroImage from './assets/image.png'
import speakerImage from './assets/Speaker.JPG'
import { RulesAndFormModal } from './components/RegistrationForm'
import { subscribeRegistrationCount, fetchRegistrationCount } from './Firebase'
import { PoliciesModal } from './components/Policies'

function Header() {
  const [open, setOpen] = useState(false)

  function handleRegisterClick(e) {
    e.preventDefault()
    // only scroll to register section; do not auto-increment
    const el = document.getElementById('register')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  function handleNav(e, id) {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <header className={`site-header ${open ? 'open' : ''}`}>
      <div className="brand">
        <img src={brandLogo} alt="brand" className="brand-logo" />
      </div>

      <nav className="nav">
        <a href="#home" className="nav-link" onClick={(e)=>handleNav(e,'home')}>Home</a>
        <a href="#about" className="nav-link" onClick={(e)=>handleNav(e,'about')}>About us</a>
        <a href="#register" className="nav-link register-link" onClick={handleRegisterClick}>Register</a>
      </nav>

      <button className="menu-btn" aria-label="menu" onClick={() => setOpen((v) => !v)}>
        <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="26" height="3" rx="1.5" fill="#C23B3B"/>
          <rect y="7.5" width="26" height="3" rx="1.5" fill="#C23B3B"/>
          <rect y="15" width="26" height="3" rx="1.5" fill="#C23B3B"/>
        </svg>
        <span className="menu-label">menu</span>
      </button>
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-media">
        <img src={heroImage} alt="hero" />
      </div>
     
        <span />
        <span />
        <span />
     
    </section>
  )
}

function Quote() {
  return (
    <section className="quote">
      <p className="quote-text">Good habits formed at youth make all the difference.</p>
      <p className="quote-author">Aristotle</p>
    </section>
  )
}

function About({ onOpenForm }) {
  return (
    <section id="about" className="about">
      <h3>About youth seminar</h3>
      <p className="about-desc">Join us for an engaging set of talks, workshops and networking for youth leaders.</p>
      <div id="register" className="register-wrap">
        <button className="register" onClick={onOpenForm}>Register</button>
      </div>
    </section>
  )
}

function StatsCard({ value, targetDate }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef(null)

  // registration count animation (left side)
  useEffect(() => {
    const start = performance.now()
    const from = display
    const to = value
    const duration = 900

    function tick(now) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) * (1 - t)
      const current = Math.round(from + (to - from) * eased)
      setDisplay(current)
      if (t < 1) startRef.current = requestAnimationFrame(tick)
    }

    if (startRef.current) cancelAnimationFrame(startRef.current)
    startRef.current = requestAnimationFrame(tick)

    return () => {
      if (startRef.current) cancelAnimationFrame(startRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // countdown to targetDate (right side)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    if (!targetDate) return
    const target = new Date(targetDate).getTime()
    function update() {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      const secsTotal = Math.floor(diff / 1000)
      const days = Math.floor(secsTotal / 86400)
      const hours = Math.floor((secsTotal % 86400) / 3600)
      const mins = Math.floor((secsTotal % 3600) / 60)
      const secs = secsTotal % 60
      setTimeLeft({ days, hours, mins, secs })
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  function two(n) { return String(n).padStart(2, '0') }

  return (
    <section className="stats-card" aria-live="polite">
      <div className="stats-left">
        <div className="stats-title">Total registered</div>
        <div className="stats-number">{display}<span className="plus">+</span></div>
      </div>
      <div className="divider" />
      <div className="stats-right">
        <div className="stats-title">Time Left</div>
        <div className="stats-sub" aria-hidden={false}>
          {timeLeft.days > 0 ? (
            <div className="time-large">{timeLeft.days}d</div>
          ) : null}
          <div className="time-row">{two(timeLeft.hours)}:{two(timeLeft.mins)}:{two(timeLeft.secs)}</div>
        </div>
      </div>
    </section>
  )
}

function Speakers() {
    const people = [

      { id: 2, name: 'Pu. Achaljivan swami', img: speakerImage },
    ]

  return (
    <section className="speakers">
      <h4>Our Speakers</h4>
      <div className="speaker-list">
        {people.map((p) => (
          <div key={p.id} className="speaker-card" align="center">
            <img src={p.img} alt={p.name} className="speaker-thumb" />
            <div className="speaker-name">{p.name}</div>
          </div>
        ))}
      </div>
    </section>
  )
}



function Footer({ onOpenPolicy }) {
  const socials = [
   
    { id: 'instagram', href: 'https://www.instagram.com/gurukul_youth_?igsh=MTVvNWU0bXRpM2JvMQ==', label: 'Instagram', svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2A4.8 4.8 0 1 0 16.8 13 4.8 4.8 0 0 0 12 8.2zm6.5-.8a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2z" fill="#111"/></svg>
    ) },
   
  ]

  return (
    <footer className="site-footer">
      <p>For more detail follow our social media</p>
      <div className="social-list" role="navigation" aria-label="social links">
        {socials.map(s => (
          <a key={s.id} className="social-btn" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
            <span className="sr-only">{s.label}</span>
            {s.svg}
          </a>
        ))}
      </div>
      <div className="footer-links">
        <button className="footer-link" style={{background:'none', border:'none', padding:0}} onClick={() => onOpenPolicy('terms')}>Terms & Conditions</button>
        <button className="footer-link" style={{background:'none', border:'none', padding:0}} onClick={() => onOpenPolicy('privacy')}>Privacy Policy</button>
        <button className="footer-link" style={{background:'none', border:'none', padding:0}} onClick={() => onOpenPolicy('refund')}>Refund Policy</button>
        <button className="footer-link" style={{background:'none', border:'none', padding:0}} onClick={() => onOpenPolicy('contact')}>Contact Us</button>
      </div>
    </footer>
  )
}

export default function App() {
  const [registered, setRegistered] = useState(0)
  const [showReg, setShowReg] = useState(false)
  const [policyType, setPolicyType] = useState(null)

  function handleRegister() {
    // local increment removed: registration count is sourced from Firestore
    // Keep function for compatibility with components that might call it.
  }

  function handleOpenForm() { setShowReg(true) }
  function handleCloseForm() { setShowReg(false) }
  function handleFormSubmit() {
    // Close modal; actual registration counting happens via Firestore subscription.
    setShowReg(false)
    // optionally: store submission in localStorage or show toast
  }

  // Subscribe to Firestore registration count on mount
  useEffect(() => {
    let unsub = null
    try {
      unsub = subscribeRegistrationCount((count) => {
        setRegistered(count)
      })
    } catch (err) {
      // fallback: fetch once
      fetchRegistrationCount().then((c) => setRegistered(c)).catch(() => {})
    }

    // initial fetch if needed (subscribeRegistrationCount will call callback on initial snapshot)
    return () => { if (unsub) unsub() }
  }, [])

  return (
    <div className="app-root white-theme">
      <Header onRegister={handleRegister} />
      <main>
        <Hero />
        <Quote />
        <About onOpenForm={handleOpenForm} />
        <StatsCard value={registered} targetDate={'2026-01-11T00:00:00'} />
        <Speakers />
      </main>
      <Footer onOpenPolicy={setPolicyType} />
      <RulesAndFormModal open={showReg} onClose={handleCloseForm} onSubmit={handleFormSubmit} onOpenPolicy={setPolicyType} />
      <PoliciesModal type={policyType} onClose={() => setPolicyType(null)} />
      <Toaster position="bottom-right" />
    </div>
  )
}
