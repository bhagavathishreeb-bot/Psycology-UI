import { useState } from 'react'
import './JobApplicationForm.css'

export default function JobApplicationForm({ job, onClose, onSubmit, fullPage, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    experience: '',
    message: '',
    resume: null,
  })

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    update('resume', file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      jobTitle: job?.title,
      jobType: job?.type,
      jobLocation: job?.location,
    }
    onSubmit?.(payload)
    if (!fullPage) onClose?.()
  }

  if (fullPage) {
    return (
      <div className="job-fullpage">
        <div className="job-fullpage-header">
          <h2>Apply — {job?.title}</h2>
        </div>
        <form className="job-form job-form-fullpage" onSubmit={handleSubmit}>
          <div className="job-form-section">
            <h3>Basic Information</h3>
            <div className="job-form-grid job-form-grid-3">
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
                Email <span className="required">*</span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Phone <span className="required">*</span>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </label>
            </div>
            <label className="job-linkedin-row">
              LinkedIn (optional)
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => update('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </label>
          </div>

          <div className="job-form-section">
            <h3>Experience</h3>
            <label>
              Brief experience / background <span className="required">*</span>
              <textarea
                required
                rows={2}
                value={formData.experience}
                onChange={(e) => update('experience', e.target.value)}
                placeholder="Share your relevant experience..."
              />
            </label>
          </div>

          <div className="job-form-section">
            <h3>Cover Message (optional)</h3>
            <label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="Why are you interested in this role?"
              />
            </label>
          </div>

          <div className="job-form-section">
            <h3>Resume <span className="required">*</span></h3>
            <label className="job-file-label">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                required
                onChange={handleFileChange}
                className="job-file-input"
              />
              <span className="job-file-placeholder">
                {formData.resume ? formData.resume.name : 'Choose PDF or DOC (max 5MB)'}
              </span>
            </label>
          </div>

          <div className="job-form-actions">
            <button type="button" className="job-btn-cancel" onClick={onClose}>
              Back to Careers
            </button>
            <button type="submit" className="job-btn-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal" onClick={(e) => e.stopPropagation()}>
        <div className="job-modal-header">
          <h2>Apply — {job?.title}</h2>
          <button type="button" className="job-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="job-form" onSubmit={handleSubmit}>
          <div className="job-form-section">
            <h3>Basic Information</h3>
            <div className="job-form-grid job-form-grid-3">
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
                Email <span className="required">*</span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Phone <span className="required">*</span>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </label>
            </div>
            <label className="job-linkedin-row">
              LinkedIn (optional)
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => update('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </label>
          </div>

          <div className="job-form-section">
            <h3>Experience</h3>
            <label>
              Brief experience / background <span className="required">*</span>
              <textarea
                required
                rows={2}
                value={formData.experience}
                onChange={(e) => update('experience', e.target.value)}
                placeholder="Share your relevant experience..."
              />
            </label>
          </div>

          <div className="job-form-section">
            <h3>Cover Message (optional)</h3>
            <label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="Why are you interested in this role?"
              />
            </label>
          </div>

          <div className="job-form-section">
            <h3>Resume <span className="required">*</span></h3>
            <label className="job-file-label">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                required
                onChange={handleFileChange}
                className="job-file-input"
              />
              <span className="job-file-placeholder">
                {formData.resume ? formData.resume.name : 'Choose PDF or DOC (max 5MB)'}
              </span>
            </label>
          </div>

          <div className="job-form-actions">
            <button type="button" className="job-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="job-btn-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
