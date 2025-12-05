import { useState, useRef, useEffect } from 'react'
import { stripePromise } from '../stripe-config'
import { openRazorpay } from './Razorpay'
import { toast } from 'sonner'
import { saveRegistration } from '../Firebase'
import QRCode from 'qrcode'

export function RulesAndFormModal({ open, onClose, onSubmit, onOpenPolicy }) {
  const [accepted, setAccepted] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!open) {
      setAccepted(false)
      setShowForm(false)
    }
  }, [open])

  function handleContinue() {
    if (accepted) setShowForm(true)
  }

  const [checkboxError, setCheckboxError] = useState('')

  return (
    <div className={`modal ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
      <div className="modal-sheet">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {!showForm ? (
          <div className="rules">
            <h3>Rules & Regulations</h3>
            <div className="rules-body">
              <p>Please read the rules carefully before registering:</p>
              <ul>
                <li>Be respectful to other attendees.</li>
                <li>Arrive on time and follow event instructions.</li>
                <li>Participants must be at least 17 to 25 years old.</li>
                <li>Payment must be completed to confirm registration.</li>
                <li>All information provided must be accurate and truthful.</li>
              <li>Check whatsapp for other details</li>
                <li>passes can be provide in E-Mail</li>
              </ul>
              <p style={{ fontSize: '13px', marginTop: '12px', color: '#666' }}>
                By registering, you agree to our{' '}
                <a 
                  href="/policies/terms" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit' }}
                >
                  Terms & Conditions
                </a>,{' '}
                <a 
                  href="/policies/privacy" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit' }}
                >
                  Privacy Policy
                </a>, and{' '}
                <a 
                  href="/policies/refund" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit' }}
                >
                  Refund Policy
                </a>.
              </p>
            </div>
            <label className="rules-accept">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => {
                  setAccepted(e.target.checked)
                  if (e.target.checked) setCheckboxError('')
                }}
              /> I accept the rules and regulations
            </label>

            {checkboxError && <div className="error" style={{ marginTop: 8 }}>{checkboxError}</div>}

            <div style={{ marginTop: 16 }}>
              <button
                className="register"
                onClick={(e) => {
                  e.preventDefault()
                  if (!accepted) {
                    setCheckboxError('Please select the checkbox')
                    return
                  }
                  setCheckboxError('')
                  handleContinue()
                }}
              >
                Continue to form
              </button>
            </div>
          </div>
        ) : (
          <RegistrationForm onCancel={onClose} onSubmit={onSubmit} />
        )}
      </div>
    </div>
  )
}

export function RegistrationForm({ onCancel, onSubmit }) {
  const [values, setValues] = useState({ firstName:'', middleName:'', lastName:'', email:'', mobile:'', dob:'', address:'' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('idle') // idle, processing, succeeded, error
  const [errorMessage, setErrorMessage] = useState('')
  const stripe = useRef(null)

  useEffect(() => {
    async function initializeStripe() {
      stripe.current = await stripePromise;
    }
    initializeStripe();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target
    setValues(v=> ({...v, [name]: value}))
  }

  function validate() {
    const errs = {}
    if (!values.firstName.trim()) errs.firstName = 'First name is required'
    if (!values.lastName.trim()) errs.lastName = 'Last name is required'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) errs.email = 'Valid email required'
    if (!/^[0-9]{10}$/.test(values.mobile)) errs.mobile = 'Valid 10 digit mobile number required'
    if (!values.dob) errs.dob = 'Date of birth required'
    else {
      const dob = new Date(values.dob)
      const age = Math.floor((Date.now() - dob.getTime()) / (365.25*24*60*60*1000))
      if (age < 17 || age > 25) errs.dob = 'You must be at least 17 to 25 years old'
    }
    if (!values.address.trim()) errs.address = 'Address required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }



  async function generateAndDownloadQRCode(text) {
    try {
      const url = await QRCode.toDataURL(text)
      const link = document.createElement('a')
      link.href = url
      link.download = 'registration-qr.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Failed to generate QR code', err)
      toast.error('Failed to generate QR code')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setPaymentStatus('processing')
    setErrorMessage('')

    try {
      // Open Razorpay checkout for INR 50 (5000 paise)
      const paymentResponse = await openRazorpay({
        amount: 50 * 100,
        currency: 'INR',
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        contact: values.mobile,
        description: 'Registration fee 50 INR'
      })

      // Successful payment — update UI immediately
      setPaymentStatus('succeeded')
      setSubmitting(false)

      // Save registration to Firestore (best-effort). Await it and handle errors quietly
      try {
        const docId = await saveRegistration({
          ...values,
          paymentConfirmed: true,
          paymentMethod: 'razorpay',
          paymentResponse,
        })
        
        // Generate and download QR code with the document ID
        if (docId) {
          await generateAndDownloadQRCode(docId)
        }
      } catch (saveErr) {
        console.error('Failed to save registration', saveErr)
      }


      onSubmit && onSubmit({
        ...values,
        paymentConfirmed: true,
        paymentMethod: 'razorpay'
      })
      toast.success('Payment successful! Registration saved.')
      // Show success briefly then redirect to home
      // setTimeout(() => { window.location.href = '/' }, 2000)
    } catch (err) {
      setPaymentStatus('error')
      const msg = err?.message || 'Payment failed. Please try again.'
      setErrorMessage(msg)
      toast.error(msg)
      // Show error briefly then redirect to home
      setTimeout(() => { window.location.href = '/' }, 2500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="reg-form" onSubmit={handleSubmit}>
      <h3>Registration Form</h3>
      <div className="form-row">
        <label>First name<div className="field"><input name="firstName" value={values.firstName} onChange={handleChange} /></div>{errors.firstName && <div className="error">{errors.firstName}</div>}</label>
        <label>Middle name<div className="field"><input name="middleName" value={values.middleName} onChange={handleChange} /></div></label>
        <label>Last name<div className="field"><input name="lastName" value={values.lastName} onChange={handleChange} /></div>{errors.lastName && <div className="error">{errors.lastName}</div>}</label>
      </div>
      <label>Email<div className="field"><input name="email" value={values.email} onChange={handleChange} /></div>{errors.email && <div className="error">{errors.email}</div>}</label>
      <label>Mobile<div className="field"><input name="mobile" value={values.mobile} onChange={handleChange} /></div>{errors.mobile && <div className="error">{errors.mobile}</div>}</label>
      <label>Date of birth<div className="field"><input type="date" name="dob" value={values.dob} onChange={handleChange} /></div>{errors.dob && <div className="error">{errors.dob}</div>}</label>
      <label>Address<div className="field"><textarea name="address" value={values.address} onChange={handleChange} /></div>{errors.address && <div className="error">{errors.address}</div>}</label>
      
      <div className="payment-section">
        <h4>Payment: 50 Rupees</h4>
        {paymentStatus === 'succeeded' ? (
          <div className="payment-success">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            Payment successful!
          </div>
        ) : null}
        {paymentStatus === 'error' && errorMessage ? (
          <div className="error" style={{ marginTop: 8 }}>{errorMessage}</div>
        ) : null}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-muted" onClick={onCancel}>Cancel</button>
        <button type="submit" className="register" disabled={submitting || paymentStatus === 'succeeded'}>
          {submitting ? 'Processing payment...' : 
           paymentStatus === 'succeeded' ? 'Payment Complete' : 'Pay 50 Rupees'}
        </button>
      </div>

      <div className="form-footer" style={{ marginTop: '32px', borderTop: '1px solid #eee', paddingTop: '24px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#444', marginBottom: '12px' }}>Follow us for updates</p>
          <a 
            href="https://www.instagram.com/gurukul_youth_?igsh=MTVvNWU0bXRpM2JvMQ==" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-btn"
            style={{ color: '#c23b3b' }}
            aria-label="Instagram"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2A4.8 4.8 0 1 0 16.8 13 4.8 4.8 0 0 0 12 8.2zm6.5-.8a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2z" fill="currentColor"/>
            </svg>
          </a>
        </div>

        <div className="footer-links" style={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <a href="/policies/terms" target="_blank" rel="noopener noreferrer" className="footer-link">Terms & Conditions</a>
          <a href="/policies/privacy" target="_blank" rel="noopener noreferrer" className="footer-link">Privacy Policy</a>
          <a href="/policies/refund" target="_blank" rel="noopener noreferrer" className="footer-link">Refund Policy</a>
          <a href="/policies/shipping" target="_blank" rel="noopener noreferrer" className="footer-link">Shipping Policy</a>
          <a href="/policies/contact" target="_blank" rel="noopener noreferrer" className="footer-link">Contact Us</a>
        </div>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '20px', marginBottom: 0 }}>
          © {new Date().getFullYear()} Youth Seminar. All rights reserved.
        </p>
      </div>
    </form>
  )
}