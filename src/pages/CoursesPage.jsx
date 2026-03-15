import { CONFIG } from '../config'
import TiltCard from '../components/TiltCard'
import './CoursesPage.css'

export default function CoursesPage() {
  return (
    <div className="courses-page">
      <div className="sale-banner sale-banner-3d">
        <span className="sale-pulse">🔥</span>
        <span className="sale-text">Flash Sale is Live! Limited time offers on all courses.</span>
      </div>

      <div className="courses-container">
        <h1 className="page-title">Courses</h1>
        <p className="page-subtitle">Master your mental wellness with expert-led courses</p>

        <div className="courses-grid">
          {CONFIG.courses?.map((course) => (
            <TiltCard key={course.id} className="course-card-wrapper">
              <article className="course-card">
                {course.flashSale && <span className="flash-badge">Flash Sale</span>}
                <div className="course-placeholder">
                  <span className="course-icon">📚</span>
                </div>
                <div className="course-info">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-subtitle">{course.subtitle}</p>
                  <div className="course-pricing">
                    <span className="course-price">₹{course.price}</span>
                    <span className="course-original">₹{course.originalPrice}</span>
                  </div>
                  <button className="course-btn">Enroll Now</button>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  )
}
