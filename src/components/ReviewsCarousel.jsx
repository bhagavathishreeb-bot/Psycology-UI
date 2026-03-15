import { useState, useEffect } from 'react'

export default function ReviewsCarousel({ reviews = [], visibleCount = 3, intervalMs = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const maxIndex = Math.max(0, reviews.length - visibleCount)
  const clampedIndex = Math.min(currentIndex, maxIndex)
  const visibleReviews = reviews.slice(clampedIndex, clampedIndex + visibleCount)
  const hasMultipleSets = reviews.length > visibleCount

  useEffect(() => {
    if (!hasMultipleSets) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1))
    }, intervalMs)

    return () => clearInterval(timer)
  }, [hasMultipleSets, maxIndex, intervalMs])

  if (!reviews.length) return null

  const cardWidth = 100 / visibleCount

  return (
    <div className="reviews-carousel">
      <div className="reviews-carousel-viewport">
        <div
          className="reviews-carousel-track"
          style={{
            transform: `translateX(-${clampedIndex * cardWidth}%)`,
          }}
        >
          {reviews.map((review, i) => (
            <article key={i} className="review-card review-card-carousel">
              <div className="review-header">
                <span className="review-stars">
                  {'★'.repeat(Math.floor(review.rating))}
                  {review.rating % 1 >= 0.5 ? '½' : ''}
                </span>
                <span className="review-rating-num">{review.rating}/5</span>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-text">{review.text}</p>
              <span className="review-author">— {review.name}</span>
            </article>
          ))}
        </div>
      </div>
      {hasMultipleSets && (
        <div className="reviews-carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === clampedIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to review set ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
