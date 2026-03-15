import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CONFIG } from '../config'
import JobApplicationForm from '../components/JobApplicationForm'
import './CareersApplyPage.css'

export default function CareersApplyPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const job = location.state?.job ?? null
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (data) => {
    console.log('Application submitted:', data)
    setSubmitted(true)
  }

  if (!job) {
    return (
      <div className="careers-apply-layout">
        <p>No job selected. <a href="/careers">Return to Careers</a></p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="careers-apply-layout">
        <div className="careers-success-card">
          <span className="careers-success-icon">✓</span>
          <h2>Thank you for applying!</h2>
          <p>Our team will get in touch with you soon.</p>
          <button type="button" className="careers-btn-back" onClick={() => navigate('/careers')}>
            Back to Careers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="careers-apply-layout">
      <div className="careers-apply-header">
        <button type="button" className="careers-back-link" onClick={() => navigate(-1)} aria-label="Go back">
          ← Back
        </button>
      </div>
      <JobApplicationForm
        job={job}
        fullPage
        onSubmit={handleSubmit}
        onClose={() => navigate('/careers')}
      />
    </div>
  )
}
