import React, { useEffect, useMemo, useState, useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'

const ReviewsSection = ({ productId, onCountChange, onSummaryChange }) => {
  const { url, token, userData } = useContext(StoreContext)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const canSubmit = !!token && rating >= 1 && rating <= 5

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${url}/api/reviews/${productId}`)
      const data = await res.json()
      if (data.success) {
        const list = data.data || []
        setReviews(list)
        const avg = list.length ? Math.round((list.reduce((s, r) => s + (r.rating || 0), 0) / list.length) * 10) / 10 : 0
        if (onCountChange) onCountChange(list.length)
        if (onSummaryChange) onSummaryChange({ count: list.length, average: avg })
      }
    } catch {}
  }

  useEffect(() => { fetchReviews() }, [productId])

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0
    const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }, [reviews])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const res = await fetch(`${url}/api/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ productId, rating, comment })
      })
      const data = await res.json()
      if (data.success) {
        await fetchReviews()
        setComment('')
      } else {
        alert(data.message || 'Unable to submit review')
      }
    } catch {
      alert('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="reviews-section">
      <div className="reviews-summary">
        <span className="rating">Average: {avgRating} ★</span>
        <span className="count">{reviews.length} reviews</span>
      </div>

      {token ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <label>Rating</label>
          <div className="star-input" aria-label="Rating">
            {[1,2,3,4,5].map(r => (
              <span key={r} className={`star ${r <= rating ? 'filled' : ''}`} onClick={() => setRating(r)}>★</span>
            ))}
          </div>
          <label>Comment</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Write your experience..." />
          <button type="submit" disabled={!canSubmit || submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
        </form>
      ) : (
        <p>Please sign in to leave a review.</p>
      )}

      <div className="review-list">
        {reviews.map((r) => (
          <div key={r._id} className="review-item">
            <div className="review-header">
              <span className="reviewer">{r.userName || 'User'}</span>
              <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <span className="date">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            {r.comment && <p className="comment">{r.comment}</p>}
          </div>
        ))}
        {!reviews.length && <p>No reviews yet.</p>}
      </div>
    </div>
  )
}

export default ReviewsSection


