import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { POLICY_CONTENT } from './Policies'
import brandLogo from '../assets/splash_image.png'

export default function PolicyPage() {
  const { type } = useParams()
  const policy = POLICY_CONTENT[type]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [type])

  if (!policy) {
    return (
      <div className="policy-page-container">
        <div className="policy-page-header">
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
        <div className="policy-page-content" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Policy Not Found</h2>
          <p>The requested policy page does not exist.</p>
          <Link to="/" className="register">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="policy-page-container">
      <header className="site-header" style={{ padding: '14px 24px', borderBottom: '1px solid #eee' }}>
        <div className="brand">
          <Link to="/">
            <img src={brandLogo} alt="brand" className="brand-logo" />
          </Link>
        </div>
        <nav className="nav" style={{ display: 'flex' }}>
          <Link to="/" className="nav-link">Home</Link>
        </nav>
      </header>

      <main className="policy-page-main">
        <div className="policy-document">
          <h1>{policy.title}</h1>
          <div className="policy-body">
            {policy.content}
          </div>
        </div>
      </main>

      <footer className="site-footer" style={{ marginTop: 'auto' }}>
        <div className="footer-links">
          <Link to="/policies/terms" className="footer-link">Terms & Conditions</Link>
          <Link to="/policies/privacy" className="footer-link">Privacy Policy</Link>
          <Link to="/policies/refund" className="footer-link">Refund Policy</Link>
          <Link to="/policies/contact" className="footer-link">Contact Us</Link>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '12px' }}>
          © {new Date().getFullYear()} Youth Seminar. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
