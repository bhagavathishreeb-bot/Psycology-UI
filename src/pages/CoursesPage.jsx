import { CONFIG } from '../config'
import { getCourseIcon } from '../components/CourseCardIcons'
import './CoursesPage.css'

const CARD_BG_COLORS = [
  'linear-gradient(135deg, #98D8AA 0%, #7BA87B 100%)',
  'linear-gradient(135deg, #E8A0B8 0%, #F8B4C4 100%)',
  'linear-gradient(135deg, #B8E0D2 0%, #98D8AA 100%)',
  'linear-gradient(135deg, #FADADD 0%, #E8A0B8 100%)',
  'linear-gradient(135deg, #7BA87B 0%, #B8E0D2 50%, #E8A0B8 100%)',
]

export default function CoursesPage() {
  return (
    <div className="courses-page">
      <div className="courses-container">
        <h1 className="page-title">Courses</h1>
        <p className="page-subtitle">Master your mental wellness with expert-led courses</p>

        <div className="courses-grid">
          {CONFIG.courses?.map((course, index) => (
            <article key={course.id} className="course-card">
              <span className="coming-soon-ribbon">Coming Soon</span>
              <div
                className="course-card-image"
                style={{ background: CARD_BG_COLORS[index % CARD_BG_COLORS.length] }}
              >
                <span className="course-card-icon">{getCourseIcon(course.id)}</span>
                <img src={course.image || 'https://picsum.photos/seed/course/400/300'} alt={course.title} className="course-card-img" />
              </div>
              <div className="course-card-info">
                <h3 className="course-card-title">{course.title}</h3>
                <div className="course-card-meta">
                  <span className="course-rating">★ {course.rating ?? 4.8}</span>
                  <span>{course.ratingsCount ?? '0'} ratings</span>
                  <span>{course.hours ?? '0'} total hours</span>
                </div>
                <div className="course-card-pricing">
                  <span className="course-price">₹{course.price}</span>
                  {course.originalPrice && (
                    <span className="course-original">₹{course.originalPrice}</span>
                  )}
                </div>
                <button className="course-btn course-btn-disabled" disabled>Enroll Now</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
