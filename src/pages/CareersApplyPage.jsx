import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CONFIG } from '../config'
import JobApplicationForm from '../components/JobApplicationForm'
import { postCareerApplication } from '../api/client'
import './CareersApplyPage.css'

export default function CareersApplyPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const job = location.state?.job ?? null
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (data) => {
    if (!data.resume) {
      setError('Please upload your resume.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('linkedin', data.linkedin || '')
      formData.append('experience', data.experience)
      formData.append('message', data.message || '')
      formData.append('resume', data.resume)
      formData.append('jobTitle', data.jobTitle)
      formData.append('jobType', data.jobType)
      formData.append('jobLocation', data.jobLocation)
      await postCareerApplication(formData)
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.')
    } finally {
      setLoading(false)
    }
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
      {error && (
        <div className="careers-error" role="alert">
          {error}
        </div>
      )}
      <JobApplicationForm
        job={job}
        fullPage
        onSubmit={handleSubmit}
        onClose={() => navigate('/careers')}
        loading={loading}
      />
    </div>
  )
}
