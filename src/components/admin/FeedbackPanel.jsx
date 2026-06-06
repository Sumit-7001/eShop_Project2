import React, { useState } from 'react';
import { Star, Check, Trash2 } from 'lucide-react';

export const StarRating = ({ rating }) => (
  <div className="star-row" style={{ display: 'flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map(star => (
      <Star
        key={star}
        size={14}
        fill={star <= rating ? "#f59e0b" : "none"}
        color={star <= rating ? "#f59e0b" : "#cbd5e1"}
      />
    ))}
  </div>
);

export const FeedbackPanel = ({ feedbacks = [], setFeedbacks }) => {
  const approveFeedback = (id) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: 'Approved' } : f));
  };

  const removeFeedback = (id) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="panel-feedback">
      {/* Summary */}
      <div className="feedback-summary">
        <div className="fb-summary-card">
          <div className="fb-big-rating">4.8</div>
          <div>
            <StarRating rating={5} />
            <p className="fb-count">{feedbacks.length} total reviews</p>
          </div>
        </div>
        {[5, 4, 3, 2, 1].map(r => {
          const count = feedbacks.filter(f => f.rating === r).length;
          return (
            <div key={r} className="fb-rating-bar">
              <span>{r}★</span>
              <div className="prog-track">
                <div className="prog-fill" style={{
                  width: `${feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0}%`,
                  background: '#f59e0b'
                }} />
              </div>
              <span>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {feedbacks.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-card-header">
              <div className="review-author">
                <div className="review-avatar">{review.avatar}</div>
                <div>
                  <strong>{review.author}</strong>
                  <span className="text-muted">on <em>{review.product}</em></span>
                </div>
              </div>
              <div className="review-meta">
                <StarRating rating={review.rating} />
                <span className="text-muted">{review.date}</span>
              </div>
            </div>
            <p className="review-text">"{review.comment}"</p>
            <div className="review-footer">
              <span className={`admin-badge ${review.status === 'Approved' ? 'badge-delivered' : 'badge-pending'}`}>
                {review.status}
              </span>
              <div className="review-actions">
                {review.status !== 'Approved' && (
                  <button className="btn-primary-sm" onClick={() => approveFeedback(review.id)}>
                    <Check size={13} /> Approve
                  </button>
                )}
                <button className="btn-ghost-sm" onClick={() => removeFeedback(review.id)}>
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
