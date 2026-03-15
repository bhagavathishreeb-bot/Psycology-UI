import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CONFIG } from '../config'
import BookingForm from '../BookingForm'
import './BookingPage.css'

export default function BookingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const session = location.state?.session ?? CONFIG.sessions?.[0] ?? null
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (data) => {
    console.log('Booking submitted:', data)
    setSubmitted(true)
  }

  if (!session) {
    return (
      <div className="booking-page-layout">
        <p>No session selected. <a href="/">Return home</a></p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="booking-page-layout">
        <div className="booking-success-card">
          <span className="booking-success-icon">✓</span>
          <h2>Thank you for your booking!</h2>
          <p>Our team will get in touch with you shortly.</p>
          <button type="button" className="btn-back-home" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page-layout">
      <div className="booking-page-header">
        <button type="button" className="back-link" onClick={() => navigate(-1)} aria-label="Go back">
          ← Back
        </button>
      </div>
      <BookingForm
        session={session}
        fullPage
        onSubmit={handleSubmit}
        onClose={() => navigate('/')}
      />
    </div>
  )
}
