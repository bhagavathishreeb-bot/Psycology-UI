import { useState } from 'react'
import { api } from '../api/client'
import { openRazorpayCheckout } from '../api/razorpay'
import './CourseCheckoutModal.css'

export default function CourseCheckoutModal({ course, onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const purchaseRes = await api.postCoursePurchases({
        courseId: course.id,
        courseTitle: course.title,
        price: course.price,
        originalPrice: course.originalPrice || null,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        paymentStatus: 'pending',
      })
      const purchaseId = purchaseRes.id

      const paymentResult = await openRazorpayCheckout({
        amount: course.price,
        receipt: `course_${purchaseId}`,
        orderType: 'course',
        entityId: purchaseId,
        customerName: name,
        customerEmail: email,
      })

      if (paymentResult.success) {
        onSuccess?.()
        onClose?.()
      } else {
        setError(paymentResult.message || 'Payment failed. Your enrollment is saved; we will contact you.')
      }
    } catch (err) {
      setError(err.message || 'Failed to enroll. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="course-checkout-overlay" onClick={onClose}>
      <div className="course-checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="course-checkout-header">
          <h2>Enroll — {course?.title}</h2>
          <button type="button" className="course-checkout-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form className="course-checkout-form" onSubmit={handleSubmit}>
          <div className="course-checkout-summary">
            <span className="course-checkout-price">₹{course?.price}</span>
            {course?.originalPrice && (
              <span className="course-checkout-original">₹{course.originalPrice}</span>
            )}
          </div>
          {error && <div className="course-checkout-error" role="alert">{error}</div>}
          <label>
            Full Name <span className="required">*</span>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </label>
          <label>
            Email <span className="required">*</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label>
            Phone <span className="required">*</span>
            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" />
          </label>
          <div className="course-checkout-actions">
            <button type="button" className="course-checkout-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="course-checkout-submit" disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${course?.price}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
