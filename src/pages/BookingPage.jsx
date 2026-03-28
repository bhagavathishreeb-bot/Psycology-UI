import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CONFIG } from '../config'
import BookingForm from '../BookingForm'
import { api } from '../api/client'
import { openRazorpayCheckout } from '../api/razorpay'
import './BookingPage.css'

export default function BookingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const session = location.state?.session ?? CONFIG.sessions?.[0] ?? null
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState(null)
  const [error, setError] = useState(null)
  const [pendingPayment, setPendingPayment] = useState(null)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const testimonials = CONFIG.reviews?.slice(0, 4) ?? []

  const runPayment = async (entityId, data) => {
    return openRazorpayCheckout({
      amount: data.sessionPrice,
      receipt: `booking_${entityId}`,
      orderType: 'booking',
      entityId,
      customerName: data.name,
      customerEmail: data.email,
    })
  }

  const handleSubmit = async (data) => {
    if (pendingPayment) {
      setError(
        'You already have a saved booking awaiting payment. Use "Try payment again", or "Start over with a new booking" below.',
      )
      return
    }
    setError(null)
    setLoading(true)
    setLoadingPhase('saving')
    try {
      const bookingRes = await api.postBookings({
        name: data.name,
        email: data.email,
        age: Number(data.age),
        occupation: data.occupation,
        phone: data.phone,
        dob: data.dob,
        gender: data.gender,
        city: data.city,
        preferredLanguage: data.preferredLanguage,
        preferredDate: data.bookingDate,
        slotStart: data.slotStart,
        slotEnd: data.slotEnd,
        bookingDate: data.bookingDate,
        bookingTime:
          data.slotStart && data.slotEnd ? `${data.slotStart}-${data.slotEnd}` : data.bookingTime || null,
        whatBringsToTherapy: data.whatBringsToTherapy,
        howLongConcerns: data.howLongConcerns,
        concerns: data.concerns || {},
        otherConcern: data.otherConcern || null,
        seenPsychologistBefore: data.seenPsychologistBefore || null,
        previousDiagnosis: data.previousDiagnosis || null,
        diagnosisDuration: data.diagnosisDuration || null,
        session: data.session,
        sessionDuration: data.sessionDuration,
        sessionPrice: data.sessionPrice,
      })

      const entityId = bookingRes.id ?? bookingRes.bookingId
      setPendingPayment({
        entityId,
        sessionPrice: data.sessionPrice,
        name: data.name,
        email: data.email,
      })

      setLoadingPhase('paying')
      const paymentResult = await runPayment(entityId, data)

      if (paymentResult.success) {
        setPaymentConfirmed(true)
        setPendingPayment(null)
      } else {
        setError(
          paymentResult.message ||
            'Payment did not complete. Your details are saved — try again when you are ready.',
        )
      }
    } catch (err) {
      setPendingPayment(null)
      setError(err.message || 'Could not save your booking. Please check your connection and try again.')
    } finally {
      setLoading(false)
      setLoadingPhase(null)
    }
  }

  const handleRetryPayment = async () => {
    if (!pendingPayment?.entityId) return
    setError(null)
    setLoading(true)
    setLoadingPhase('paying')
    const data = {
      sessionPrice: pendingPayment.sessionPrice,
      name: pendingPayment.name,
      email: pendingPayment.email,
    }
    try {
      const paymentResult = await runPayment(pendingPayment.entityId, data)
      if (paymentResult.success) {
        setPaymentConfirmed(true)
        setPendingPayment(null)
      } else {
        setError(
          paymentResult.message ||
            'Payment did not complete. Your booking is still pending — you can try again.',
        )
      }
    } catch (err) {
      setError(err.message || 'Could not start payment. Please try again.')
    } finally {
      setLoading(false)
      setLoadingPhase(null)
    }
  }

  if (!session) {
    return (
      <div className="booking-page-layout">
        <p>No session selected. <a href="/">Return home</a></p>
      </div>
    )
  }

  if (paymentConfirmed) {
    return (
      <div className="booking-page-layout">
        <div className="booking-success-card">
          <span className="booking-success-icon">✓</span>
          <h2>Payment successful</h2>
          <p>Your session is confirmed. Check your email for booking details and next steps.</p>
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
          {error && (
            <div className="booking-error-wrap">
              <div className="booking-error" role="alert">
                {error}
                {pendingPayment && (
                  <p className="booking-error-hint">
                    Your request is saved as pending until payment completes.
                  </p>
                )}
              </div>
              {pendingPayment && (
                <div className="booking-pending-actions">
                  <button
                    type="button"
                    className="booking-retry-pay"
                    onClick={handleRetryPayment}
                    disabled={loading}
                  >
                    {loading && loadingPhase === 'paying' ? 'Opening payment…' : 'Try payment again'}
                  </button>
                  <button
                    type="button"
                    className="booking-start-over"
                    onClick={() => {
                      setPendingPayment(null)
                      setError(null)
                    }}
                    disabled={loading}
                  >
                    Start over with a new booking
                  </button>
                </div>
              )}
            </div>
          )}
          <BookingForm
            session={session}
            fullPage
            onSubmit={handleSubmit}
            onClose={() => navigate('/')}
            loading={loading}
            loadingPhase={loadingPhase}
          />
        </main>
      </div>
    </div>
  )
}
