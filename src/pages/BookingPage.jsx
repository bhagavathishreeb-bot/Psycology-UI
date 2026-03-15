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
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const testimonials = CONFIG.reviews?.slice(0, 4) ?? []

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
          <p>Our team will get in touch with you soon.</p>
          <button type="button" className="btn-back-home" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page-layout">
      <div className="booking-two-panel">
        {/* Left panel - Session details */}
        <aside className="booking-session-details">
          <button type="button" className="back-link" onClick={() => navigate(-1)} aria-label="Go back">
            ← {CONFIG.name}
          </button>
          <div className="session-rating">
            <span className="star">★</span> {session.rating}
          </div>
          <div className="session-header-row">
            <h1 className="session-title">{session.title} ({session.duration})</h1>
            <div className="session-profile-img-wrap">
              <img src="/final_me.jpeg" alt={CONFIG.name} className="session-profile-img" />
            </div>
          </div>
          <div className="session-price-row">
            <span className="price-current">₹{session.price}</span>
            {session.originalPrice && (
              <span className="price-original">₹{session.originalPrice}</span>
            )}
            <span className="session-duration">
              <span className="duration-icon">🕐</span> {session.duration}
            </span>
          </div>
          {session.description && (
            <p className="session-description">{session.description}</p>
          )}
          {session.whatToExpect && session.whatToExpect.length > 0 && (
            <div className="session-what-to-expect">
              <h3>What to Expect</h3>
              <ul>
                {session.whatToExpect.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {testimonials.length > 0 && (
            <div className="session-testimonials">
              <h3>Testimonials</h3>
              <div className="testimonial-card">
                <p className="testimonial-text">"{testimonials[testimonialIndex]?.text}"</p>
                <span className="testimonial-name">— {testimonials[testimonialIndex]?.name}</span>
              </div>
              <div className="testimonial-nav">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => setTestimonialIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1))}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => setTestimonialIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1))}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Right panel - Form */}
        <main className="booking-form-panel">
          <BookingForm
            session={session}
            fullPage
            onSubmit={handleSubmit}
            onClose={() => navigate('/')}
          />
        </main>
      </div>
    </div>
  )
}
