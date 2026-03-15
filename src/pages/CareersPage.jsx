import { useNavigate } from 'react-router-dom'
import { CONFIG } from '../config'
import './CareersPage.css'

export default function CareersPage() {
  const navigate = useNavigate()
  const jobs = CONFIG.careers ?? []

  const handleApply = (job) => {
    navigate('/careers/apply', { state: { job } })
  }

  return (
    <div className="careers-page">
      <div className="careers-container">
        <h1 className="page-title">Careers</h1>
        <p className="page-subtitle">Join our team and make a difference in mental wellness</p>

        <div className="careers-grid">
          {jobs.map((job) => (
            <article key={job.id} className="career-card">
              <div className="career-card-header">
                <span className="career-type">{job.type}</span>
                <span className="career-location">{job.location}</span>
              </div>
              <h3 className="career-title">{job.title}</h3>
              <p className="career-description">{job.description}</p>
              <button
                type="button"
                className="career-apply-btn"
                onClick={() => handleApply(job)}
              >
                Apply Now
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
