import { useEffect, useRef, useState } from 'react'
import './App.css'

// ─── Decorative lines config ────────────────────────────────
// Each entry is one line. Positions are relative to the hero section.
// right/top accept any CSS value ('5%', '200px', etc.)
// Set GLOW to false to remove the soft white glow on all lines.

const PARALLAX = 0.4   // scroll speed ratio: 0 = fixed, 1 = normal scroll
const GLOW     = true  // toggle glow effect on all lines

type LineConfig = {
  width:     number   // px
  thickness: number   // px
  radius:    number   // px — rounded ends
  opacity:   number   // 0–1
  right:     string   // from right edge of hero
  top:       string   // from top of hero
}

// Layout mirrors the logo:  ─────────
//                           ──── ────
//                           ─────────
const LINES: LineConfig[] = [
  // top — full-width bar
  { width: 460, thickness: 13, radius: 7, opacity: 0.8, right: '10%',   top: '23%' },
  // middle left
  { width: 150, thickness: 13, radius: 7, opacity: 0.8, right: '23%',  top: '40%' },
  // middle right
  { width: 250, thickness: 13, radius: 7, opacity: 0.8, right: '5%',   top: '40%' },
  // bottom — full-width bar
  { width: 460, thickness: 13, radius: 7, opacity: 0.8, right: '10%',   top: '57%' },
]

function DecorativeLines() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() {
      if (ref.current) {
        ref.current.style.transform = `translateY(${window.scrollY * PARALLAX}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={ref} className="deco-lines" aria-hidden="true">
      {LINES.map((line, i) => (
        <div
          key={i}
          className={`deco-line${GLOW ? ' deco-line--glow' : ''}`}
          style={{
            width:        line.width,
            height:       line.thickness,
            borderRadius: line.radius,
            opacity:      line.opacity,
            right:        line.right,
            top:          line.top,
          }}
        />
      ))}
    </div>
  )
}

function AppleIcon() {
  return (
    <svg className="badge-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.28.07 2.18.74 2.93.8 1.12-.21 2.19-.9 3.39-.84 1.44.07 2.53.61 3.24 1.57-2.96 1.73-2.26 5.57.48 6.64-.57 1.48-1.32 2.96-2.04 4.71zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
        fill="currentColor"
      />
    </svg>
  )
}

function GooglePlayIcon() {
  return (
    <svg className="badge-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.18 23.76c.37.2.8.19 1.19-.02l11.02-6.37-2.5-2.51-9.71 8.9z" fill="#EA4335" />
      <path d="M21.36 10.27l-2.95-1.7-2.8 2.53 2.8 2.8 2.96-1.71c.84-.49.84-1.43-.01-1.92z" fill="#FBBC04" />
      <path d="M3.18.24C2.79.45 2.5.88 2.5 1.49v21.02c0 .6.29 1.04.68 1.25l10.2-11.66L3.18.24z" fill="#4285F4" />
      <path d="M4.37.22l11.02 6.37-2.5 2.51-9.71-8.9C3.57.01 4 .02 4.37.22z" fill="#34A853" />
    </svg>
  )
}

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="16" height="12" rx="2" stroke="#888" strokeWidth="1.5" />
        <path d="M7 10h6M10 7v6" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Split anything',
    description:
      'Add expenses on the fly and split them however makes sense — equally, by percentage, or custom amounts.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="3" stroke="#888" strokeWidth="1.5" />
        <circle cx="13" cy="7" r="3" stroke="#888" strokeWidth="1.5" />
        <path d="M2 16c0-2.21 2.24-4 5-4s5 1.79 5 4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 12c1.66.44 3 1.76 3 4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Everyone stays in sync',
    description:
      'Balances update in real time. No spreadsheets, no confusion — everyone on the tab sees exactly where things stand.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 10l4 4 8-8" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Settle balances quick',
    description:
      "Close a Tab to generate links to your friends' Venmo or CashApp accounts with exact balances prefilled. View their phone number's last 4 digits so theres no confusion.",
  },
]

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="waitlist-success">You're on the list!</p>
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <input
        className="waitlist-input"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
      />
      <button className="waitlist-btn" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Notify me'}
      </button>
      {status === 'error' && <p className="waitlist-error">Something went wrong — try again.</p>}
    </form>
  )
}

export default function App() {
  return (
    <div className="page">
      {/* Nav */}
      <header className="nav">
        <span className="wordmark wordmark--nav">Tabs</span>
      </header>

      {/* Hero */}
      <section className="hero">
        <DecorativeLines />
        <span className="wordmark wordmark--hero">Tabs</span>
        <h1 className="tagline">
          Track spending.<br />
          Stay accountable.<br />
          Keep Tabs.
        </h1>
        <p className="sub">Shared expenses handled honestly.</p>

        <div className="store-badges">
          <a href="#" className="badge badge-apple" aria-label="Coming soon to App Store">
            <AppleIcon />
            <div className="badge-text">
              <span className="badge-sub">Coming soon to</span>
              <span className="badge-main">App Store</span>
            </div>
          </a>
          <a href="#" className="badge badge-google" aria-label="Coming soon to Google Play">
            <GooglePlayIcon />
            <div className="badge-text">
              <span className="badge-sub">Coming soon to</span>
              <span className="badge-main">Google Play</span>
            </div>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        {features.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h2>{f.title}</h2>
            <p>{f.description}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Coming soon to iOS &amp; Android.</h2>
        <p>Drop your email and we'll let you know when Tabs is ready.</p>
        <WaitlistForm />
      </section>

      {/* Footer */}
      <footer className="footer">
        <span className="wordmark wordmark--footer">Tabs</span>
        <span>© {new Date().getFullYear()} Tabs. All rights reserved.</span>
      </footer>
    </div>
  )
}
