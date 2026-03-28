import { useState, useEffect } from 'react'
import { api } from './api/client'
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

function getTodayISODateString() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function PreferredScheduleSection({
  bookingDate,
  slotStart,
  slotEnd,
  minDate,
  slotsLoading,
  slotsFetchError,
  slotMeta,
  slots,
  onDateChange,
  onSelectSlot,
  validationError,
}) {
  return (
    <div className="form-section">
      <h3>Preferred session date & time</h3>
      <label>
        <span className="booking-label-inline">Preferred date <span className="required">*</span></span>
        <input type="date" required min={minDate} value={bookingDate} onChange={onDateChange} />
      </label>
      {validationError && (
        <p className="booking-schedule-validation" role="alert">
          {validationError}
        </p>
      )}
      {bookingDate && slotsFetchError && (
        <p className="booking-slots-error" role="alert">
          {slotsFetchError}
        </p>
      )}
      {bookingDate && slotsLoading && (
        <p className="booking-slots-loading" aria-live="polite">
          Loading available times…
        </p>
      )}
      {bookingDate && !slotsLoading && slotMeta && slotMeta.available === false && (
        <p className="booking-slots-unavailable" role="status">
          {slotMeta.unavailableReason ||
            'This date is not available. Please choose another day.'}
        </p>
      )}
      {bookingDate &&
        !slotsLoading &&
        slotMeta &&
        slotMeta.available === true &&
        slots.length === 0 && (
          <p className="booking-slots-empty" role="status">
            No open slots for this date. Try another day.
          </p>
        )}
      {bookingDate && !slotsLoading && slotMeta && slotMeta.available === true && slots.length > 0 && (
        <div className="booking-slots-wrap">
          <p className="booking-slots-field-label">
            <span className="booking-label-inline">Available times <span className="required">*</span></span>
          </p>
          <div className="booking-slots-grid" role="group" aria-label="Available session times">
            {slots.map((slot) => {
              const selected = slotStart === slot.start && slotEnd === slot.end
              return (
                <button
                  key={`${slot.start}-${slot.end}`}
                  type="button"
                  className={`booking-slot-btn${selected ? ' booking-slot-btn-selected' : ''}`}
                  onClick={() => onSelectSlot(slot.start, slot.end)}
                >
                  {slot.start} – {slot.end}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function submitButtonLabel(loading, loadingPhase, fullPage) {
  if (!loading) return fullPage ? 'Confirm and Pay' : 'Submit Booking'
  if (loadingPhase === 'saving') return 'Saving your booking…'
  if (loadingPhase === 'paying') return 'Opening secure payment…'
  return 'Please wait…'
}

export default function BookingForm({
  session,
  onClose,
  onSubmit,
  fullPage,
  loading = false,
  loadingPhase = null,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
  const [slots, setSlots] = useState([])
  const [slotMeta, setSlotMeta] = useState(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsFetchError, setSlotsFetchError] = useState(null)
  const [scheduleValidationError, setScheduleValidationError] = useState(null)

  useEffect(() => {
    if (!formData.bookingDate) {
      setSlots([])
      setSlotMeta(null)
      setSlotsFetchError(null)
      setSlotsLoading(false)
      return
    }

    let cancelled = false
    setSlotsLoading(true)
    setSlotsFetchError(null)

    api
      .getBookingAvailableSlots(formData.bookingDate)
      .then((res) => {
        if (cancelled) return
        setSlotMeta({
          date: res.date,
          available: res.available !== false,
          unavailableReason: res.unavailableReason ?? null,
        })
        setSlots(Array.isArray(res.slots) ? res.slots : [])
      })
      .catch((err) => {
        if (cancelled) return
        setSlotsFetchError(err.message || 'Could not load available times.')
        setSlots([])
        setSlotMeta(null)
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [formData.bookingDate])

  const handlePreferredDateChange = (e) => {
    const v = e.target.value
    setFormData((prev) => ({
      ...prev,
      bookingDate: v,
      slotStart: '',
      slotEnd: '',
      bookingTime: '',
    }))
    setScheduleValidationError(null)
  }

  const handleSelectSlot = (start, end) => {
    setFormData((prev) => ({
      ...prev,
      slotStart: start,
      slotEnd: end,
      bookingTime: `${start}-${end}`,
    }))
    setScheduleValidationError(null)
  }

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
    if (
      !formData.bookingDate?.trim() ||
      !formData.slotStart?.trim() ||
      !formData.slotEnd?.trim()
    ) {
      setScheduleValidationError(
        'Please select a preferred date and a time slot for your counseling session.',
      )
      return
    }
    setScheduleValidationError(null)
    const payload = {
      ...formData,
      session: session?.title,
      sessionDuration: session?.duration,
      sessionPrice: session?.price,
    }
    onSubmit?.(payload)
    if (!fullPage) onClose?.()
  }

  const scheduleSectionProps = {
    bookingDate: formData.bookingDate,
    slotStart: formData.slotStart,
    slotEnd: formData.slotEnd,
    minDate: getTodayISODateString(),
    slotsLoading,
    slotsFetchError,
    slotMeta,
    slots,
    onDateChange: handlePreferredDateChange,
    onSelectSlot: handleSelectSlot,
    validationError: scheduleValidationError,
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
                <span className="booking-label-inline">Full Name <span className="required">*</span></span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label>
                <span className="booking-label-inline">Email <span className="required">*</span></span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                <span className="booking-label-inline">Age <span className="required">*</span></span>
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
                <span className="booking-label-inline">Occupation <span className="required">*</span></span>
                <input
                  type="text"
                  required
                  value={formData.occupation}
                  onChange={(e) => update('occupation', e.target.value)}
                  placeholder="e.g. Software Engineer, Student"
                />
              </label>
              <label>
                <span className="booking-label-inline">Phone Number <span className="required">*</span></span>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </label>
              <label>
                <span className="booking-label-inline">Date of Birth <span className="required">*</span></span>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => update('dob', e.target.value)}
                />
              </label>
              <label>
                <span className="booking-label-inline">Gender <span className="required">*</span></span>
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
            <div className="form-grid form-grid-2-cols">
              <label>
                <span className="booking-label-inline">City / Location <span className="required">*</span></span>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="Your city"
                />
              </label>
              <label>
                <span className="booking-label-inline">Preferred Language <span className="required">*</span></span>
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

          <PreferredScheduleSection {...scheduleSectionProps} />

          <div className="form-section">
            <h3>What brings you to therapy?</h3>
            <label>
              <span className="booking-label-inline">Please describe what brings you to therapy <span className="required">*</span></span>
              <textarea
                required
                rows={2}
                value={formData.whatBringsToTherapy}
                onChange={(e) => update('whatBringsToTherapy', e.target.value)}
                placeholder="Share what you'd like to work on..."
              />
            </label>
            <label>
              <span className="booking-label-inline">How long have these concerns been present? <span className="required">*</span></span>
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
            <div className="checkbox-group checkbox-group-concerns">
              {CONCERN_OPTIONS.map((concern) => (
                <label key={concern} className="checkbox-label checkbox-label-concern">
                  <input
                    type="checkbox"
                    checked={formData.concerns[concern] || false}
                    onChange={() => toggleConcern(concern)}
                  />
                  <span className="checkbox-label-concern-text">{concern}</span>
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

          <div className="form-section form-section-mental-health">
            <h3>Previous Mental Health History</h3>
            <label className="booking-question-label">
              <span className="booking-question-text">
                Have you seen a psychologist or psychiatrist before?
                <span className="required" aria-hidden="true">
                  {' '}
                  *
                </span>
              </span>
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

            <p className="booking-pay-flow-hint">
              We&apos;ll save your details first, then open a secure payment window to confirm your session.
            </p>

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
              <button type="submit" className="btn-confirm-pay" disabled={loading}>
                {submitButtonLabel(loading, loadingPhase, true)}
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
                <span className="booking-label-inline">Full Name <span className="required">*</span></span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label>
                <span className="booking-label-inline">Email <span className="required">*</span></span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                <span className="booking-label-inline">Age <span className="required">*</span></span>
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
                <span className="booking-label-inline">Occupation <span className="required">*</span></span>
                <input
                  type="text"
                  required
                  value={formData.occupation}
                  onChange={(e) => update('occupation', e.target.value)}
                  placeholder="e.g. Software Engineer, Student"
                />
              </label>
              <label>
                <span className="booking-label-inline">Phone Number <span className="required">*</span></span>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </label>
              <label>
                <span className="booking-label-inline">Date of Birth <span className="required">*</span></span>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => update('dob', e.target.value)}
                />
              </label>
              <label>
                <span className="booking-label-inline">Gender <span className="required">*</span></span>
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
            <div className="form-grid form-grid-2-cols">
              <label>
                <span className="booking-label-inline">City / Location <span className="required">*</span></span>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="Your city"
                />
              </label>
              <label>
                <span className="booking-label-inline">Preferred Language <span className="required">*</span></span>
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

          <PreferredScheduleSection {...scheduleSectionProps} />

          <div className="form-section">
            <h3>What brings you to therapy?</h3>
            <label>
              <span className="booking-label-inline">Please describe what brings you to therapy <span className="required">*</span></span>
              <textarea
                required
                rows={2}
                value={formData.whatBringsToTherapy}
                onChange={(e) => update('whatBringsToTherapy', e.target.value)}
                placeholder="Share what you'd like to work on..."
              />
            </label>
            <label>
              <span className="booking-label-inline">How long have these concerns been present? <span className="required">*</span></span>
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
            <div className="checkbox-group checkbox-group-concerns">
              {CONCERN_OPTIONS.map((concern) => (
                <label key={concern} className="checkbox-label checkbox-label-concern">
                  <input
                    type="checkbox"
                    checked={formData.concerns[concern] || false}
                    onChange={() => toggleConcern(concern)}
                  />
                  <span className="checkbox-label-concern-text">{concern}</span>
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

          <div className="form-section form-section-mental-health">
            <h3>Previous Mental Health History</h3>
            <label className="booking-question-label">
              <span className="booking-question-text">
                Have you seen a psychologist or psychiatrist before?
                <span className="required" aria-hidden="true">
                  {' '}
                  *
                </span>
              </span>
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
            <button type="submit" className="btn-submit" disabled={loading}>
              {submitButtonLabel(loading, loadingPhase, false)}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
