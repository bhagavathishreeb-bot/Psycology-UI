import { useState } from 'react'
import './BookingForm.css'

const CONCERN_OPTIONS = [
  'Anxiety',
  'Depression',
  'Relationship issues',
  'Stress or burnout',
  'Trauma',
  'Self esteem issues',
  'Academic or career stress',
  'Family conflicts',
]

const LANGUAGES = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Malayalam', 'Other']

export default function BookingForm({ session, onClose, onSubmit, fullPage }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    occupation: '',
    phone: '',
    dob: '',
    gender: '',
    bookingDate: '',
    bookingTime: '',
    city: '',
    preferredLanguage: '',
    whatBringsToTherapy: '',
    howLongConcerns: '',
    concerns: {},
    otherConcern: '',
    seenPsychologistBefore: '',
    previousDiagnosis: '',
    diagnosisDuration: '',
  })
  const [receiveOnPhone, setReceiveOnPhone] = useState(true)
  const [showDiscountInput, setShowDiscountInput] = useState(false)
  const [discountCode, setDiscountCode] = useState('')

  const sessionPrice = session?.price ?? 0
  const platformFee = 10
  const total = sessionPrice

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleConcern = (concern) => {
    setFormData((prev) => ({
      ...prev,
      concerns: { ...prev.concerns, [concern]: !prev.concerns[concern] },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      session: session?.title,
      sessionDuration: session?.duration,
      sessionPrice: session?.price,
    }
    onSubmit?.(payload)
    if (!fullPage) onClose?.()
  }

  if (fullPage) {
    return (
      <div className="booking-fullpage">
        <div className="booking-fullpage-header">
          <h2>Complete your booking</h2>
        </div>
        <form className="booking-form booking-form-fullpage" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <label>
                Full Name <span className="required">*</span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label>
                Age <span className="required">*</span>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => update('age', e.target.value)}
                  placeholder="Age"
                />
              </label>
              <label>
                Occupation <span className="required">*</span>
                <input
                  type="text"
                  required
                  value={formData.occupation}
                  onChange={(e) => update('occupation', e.target.value)}
                  placeholder="e.g. Software Engineer, Student"
                />
              </label>
              <label>
                Phone Number <span className="required">*</span>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </label>
              <label>
                Date of Birth <span className="required">*</span>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => update('dob', e.target.value)}
                />
              </label>
              <label>
                Gender <span className="required">*</span>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => update('gender', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Location & Language</h3>
            <div className="form-grid">
              <label>
                City / Location <span className="required">*</span>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="Your city"
                />
              </label>
              <label>
                Preferred Language <span className="required">*</span>
                <select
                  required
                  value={formData.preferredLanguage}
                  onChange={(e) => update('preferredLanguage', e.target.value)}
                >
                  <option value="">Select</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>What brings you to therapy?</h3>
            <label>
              Please describe what brings you to therapy <span className="required">*</span>
              <textarea
                required
                rows={2}
                value={formData.whatBringsToTherapy}
                onChange={(e) => update('whatBringsToTherapy', e.target.value)}
                placeholder="Share what you'd like to work on..."
              />
            </label>
            <label>
              How long have these concerns been present? <span className="required">*</span>
              <input
                type="text"
                required
                value={formData.howLongConcerns}
                onChange={(e) => update('howLongConcerns', e.target.value)}
                placeholder="e.g. 6 months, 1 year, since childhood"
              />
            </label>
          </div>

          <div className="form-section">
            <h3>Concerns (select all that apply)</h3>
            <div className="checkbox-group">
              {CONCERN_OPTIONS.map((concern) => (
                <label key={concern} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.concerns[concern] || false}
                    onChange={() => toggleConcern(concern)}
                  />
                  <span>{concern}</span>
                </label>
              ))}
            </div>
            <label className="other-concern">
              Other (please specify)
              <input
                type="text"
                value={formData.otherConcern}
                onChange={(e) => update('otherConcern', e.target.value)}
                placeholder="Type here..."
              />
            </label>
          </div>

          <div className="form-section">
            <h3>Previous Mental Health History</h3>
            <label>
              Have you seen a psychologist or psychiatrist before? <span className="required">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="seenBefore"
                  value="Yes"
                  required
                  checked={formData.seenPsychologistBefore === 'Yes'}
                  onChange={(e) => update('seenPsychologistBefore', e.target.value)}
                />
                <span>Yes</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="seenBefore"
                  value="No"
                  checked={formData.seenPsychologistBefore === 'No'}
                  onChange={(e) => update('seenPsychologistBefore', e.target.value)}
                />
                <span>No</span>
              </label>
            </div>

            {formData.seenPsychologistBefore === 'Yes' && (
              <div className="conditional-fields">
                <label>
                  Any previous mental health diagnosis?
                  <input
                    type="text"
                    value={formData.previousDiagnosis}
                    onChange={(e) => update('previousDiagnosis', e.target.value)}
                    placeholder="e.g. Anxiety disorder, Depression"
                  />
                </label>
                <label>
                  How long has it been?
                  <input
                    type="text"
                    value={formData.diagnosisDuration}
                    onChange={(e) => update('diagnosisDuration', e.target.value)}
                    placeholder="e.g. 2 years, 6 months"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="payment-section">
            <label className="payment-checkbox-label">
              <input
                type="checkbox"
                checked={receiveOnPhone}
                onChange={(e) => setReceiveOnPhone(e.target.checked)}
              />
              <span>Receive booking details on phone</span>
            </label>
            <button
              type="button"
              className="btn-discount-code"
              onClick={() => setShowDiscountInput(!showDiscountInput)}
            >
              Add Discount Code
            </button>
            {showDiscountInput && (
              <div className="discount-input-wrap">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter code"
                  className="discount-input"
                />
              </div>
            )}

            <div className="order-summary-card">
              <div className="order-summary-header">
                <h3>Order Summary</h3>
                <span className="order-summary-amount">₹{sessionPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="order-summary-rows">
                <div className="order-row">
                  <span>1 × {session?.title} ({session?.duration})</span>
                  <span>₹{sessionPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="order-row">
                  <span>
                    Platform fee
                    <span className="info-icon" title="Platform fee waived">ⓘ</span>
                  </span>
                  <span className="platform-fee-free">
                    <s>₹{platformFee}</s> FREE
                  </span>
                </div>
                <div className="order-row order-total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="payment-security">
              <span className="security-icon">🔒</span>
              <span>Payments are 100% secure & encrypted</span>
              <span className="legal-links">
                <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a>
              </span>
            </div>
          </div>

          <div className="form-actions form-actions-payment">
            <button type="button" className="btn-cancel" onClick={fullPage ? () => onClose?.() : onClose}>
              {fullPage ? 'Back to Home' : 'Cancel'}
            </button>
            <div className="payment-sticky-summary">
              <span className="payment-price">
                ₹{total.toLocaleString('en-IN')}
                {session?.originalPrice && (
                  <span className="payment-original">₹{session.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </span>
              <button type="submit" className="btn-confirm-pay">
                Confirm and Pay
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <h2>Book Session — {session?.title} (₹{session?.price})</h2>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <label>
                Full Name <span className="required">*</span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label>
                Age <span className="required">*</span>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => update('age', e.target.value)}
                  placeholder="Age"
                />
              </label>
              <label>
                Occupation <span className="required">*</span>
                <input
                  type="text"
                  required
                  value={formData.occupation}
                  onChange={(e) => update('occupation', e.target.value)}
                  placeholder="e.g. Software Engineer, Student"
                />
              </label>
              <label>
                Phone Number <span className="required">*</span>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </label>
              <label>
                Date of Birth <span className="required">*</span>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => update('dob', e.target.value)}
                />
              </label>
              <label>
                Gender <span className="required">*</span>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => update('gender', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Location & Language</h3>
            <div className="form-grid">
              <label>
                City / Location <span className="required">*</span>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="Your city"
                />
              </label>
              <label>
                Preferred Language <span className="required">*</span>
                <select
                  required
                  value={formData.preferredLanguage}
                  onChange={(e) => update('preferredLanguage', e.target.value)}
                >
                  <option value="">Select</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>What brings you to therapy?</h3>
            <label>
              Please describe what brings you to therapy <span className="required">*</span>
              <textarea
                required
                rows={2}
                value={formData.whatBringsToTherapy}
                onChange={(e) => update('whatBringsToTherapy', e.target.value)}
                placeholder="Share what you'd like to work on..."
              />
            </label>
            <label>
              How long have these concerns been present? <span className="required">*</span>
              <input
                type="text"
                required
                value={formData.howLongConcerns}
                onChange={(e) => update('howLongConcerns', e.target.value)}
                placeholder="e.g. 6 months, 1 year, since childhood"
              />
            </label>
          </div>

          <div className="form-section">
            <h3>Concerns (select all that apply)</h3>
            <div className="checkbox-group">
              {CONCERN_OPTIONS.map((concern) => (
                <label key={concern} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.concerns[concern] || false}
                    onChange={() => toggleConcern(concern)}
                  />
                  <span>{concern}</span>
                </label>
              ))}
            </div>
            <label className="other-concern">
              Other (please specify)
              <input
                type="text"
                value={formData.otherConcern}
                onChange={(e) => update('otherConcern', e.target.value)}
                placeholder="Type here..."
              />
            </label>
          </div>

          <div className="form-section">
            <h3>Previous Mental Health History</h3>
            <label>
              Have you seen a psychologist or psychiatrist before? <span className="required">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="seenBefore"
                  value="Yes"
                  required
                  checked={formData.seenPsychologistBefore === 'Yes'}
                  onChange={(e) => update('seenPsychologistBefore', e.target.value)}
                />
                <span>Yes</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="seenBefore"
                  value="No"
                  checked={formData.seenPsychologistBefore === 'No'}
                  onChange={(e) => update('seenPsychologistBefore', e.target.value)}
                />
                <span>No</span>
              </label>
            </div>

            {formData.seenPsychologistBefore === 'Yes' && (
              <div className="conditional-fields">
                <label>
                  Any previous mental health diagnosis?
                  <input
                    type="text"
                    value={formData.previousDiagnosis}
                    onChange={(e) => update('previousDiagnosis', e.target.value)}
                    placeholder="e.g. Anxiety disorder, Depression"
                  />
                </label>
                <label>
                  How long has it been?
                  <input
                    type="text"
                    value={formData.diagnosisDuration}
                    onChange={(e) => update('diagnosisDuration', e.target.value)}
                    placeholder="e.g. 2 years, 6 months"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Submit Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
