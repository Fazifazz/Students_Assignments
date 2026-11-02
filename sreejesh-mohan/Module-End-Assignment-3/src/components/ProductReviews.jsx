import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, MessageSquarePlus, Sparkles, X } from 'lucide-react';

const INITIAL_REVIEWS = [
  {
    id: 1,
    author: 'Rohit Sharma',
    avatarBg: '#3b82f6',
    verified: true,
    rating: 5,
    date: '2 days ago',
    title: 'Outstanding build quality & lightning delivery!',
    comment:
      'Completely blown away by the craftsmanship. Arrived in pristine packaging within 24 hours of ordering. Matches the specifications exactly. Highly recommend ShopNest for genuine electronics & gear!',
    helpful: 34,
  },
  {
    id: 2,
    author: 'Priya Patel',
    avatarBg: '#ec4899',
    verified: true,
    rating: 5,
    date: '1 week ago',
    title: 'Authentic product with official warranty',
    comment:
      'Verified the serial number with the manufacturer and warranty was successfully registered. Premium feel, comfortable to use, and excellent value for money.',
    helpful: 19,
  },
  {
    id: 3,
    author: 'Arjun Menon',
    avatarBg: '#10b981',
    verified: true,
    rating: 4,
    date: '2 weeks ago',
    title: 'Great overall experience, well worth the price',
    comment:
      'Very happy with this purchase. Customer service was super responsive when I inquired about delivery timelines. 4.5/5 from me!',
    helpful: 12,
  },
];

export default function ProductReviews({ product }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState({});

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleHelpfulClick = (id) => {
    if (helpfulClicked[id]) return;
    setHelpfulClicked((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r))
    );
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) return;

    const newReview = {
      id: Date.now(),
      author: authorName.trim(),
      avatarBg: '#059669',
      verified: true,
      rating: newRating,
      date: 'Just now',
      title: reviewTitle.trim() || 'Verified Customer Review',
      comment: reviewComment.trim(),
      helpful: 1,
    };

    setReviews([newReview, ...reviews]);
    setAuthorName('');
    setReviewTitle('');
    setReviewComment('');
    setNewRating(5);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowReviewForm(false);
    }, 2000);
  };

  const totalReviewsCount = (product?.reviewsCount || 120) + (reviews.length - INITIAL_REVIEWS.length);
  const averageRating = product?.rating || 4.8;

  const RATING_BREAKDOWN = [
    { stars: 5, pct: 78 },
    { stars: 4, pct: 15 },
    { stars: 3, pct: 4 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ];

  return (
    <section className="product-reviews-section">
      <div className="reviews-section-header">
        <div>
          <h2 className="reviews-main-title">Customer Reviews & Ratings</h2>
          <p className="reviews-sub-title">
            Real feedback from verified buyers across India
          </p>
        </div>

        <button
          type="button"
          className="btn-toggle-write-review"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          <MessageSquarePlus size={16} />
          <span>{showReviewForm ? 'Close Review Form' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Ratings Overview Bar */}
      <div className="ratings-overview-card">
        {/* Left: Score Box */}
        <div className="overview-score-box">
          <div className="big-rating-number">{averageRating}</div>
          <div className="stars-row-lg">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={20}
                className={s <= Math.round(averageRating) ? 'star-solid-gold' : 'star-muted'}
              />
            ))}
          </div>
          <span className="total-ratings-text">
            Based on <strong>{totalReviewsCount.toLocaleString('en-IN')}</strong> verified reviews
          </span>
          <span className="recommend-badge">
            <Sparkles size={14} /> 96% of buyers recommend this product
          </span>
        </div>

        {/* Center: Rating Distribution Bars */}
        <div className="rating-bars-column">
          {RATING_BREAKDOWN.map((item) => (
            <div key={item.stars} className="rating-bar-row">
              <span className="bar-star-label">{item.stars} ★</span>
              <div className="rating-progress-track">
                <div
                  className="rating-progress-fill"
                  style={{ width: `${item.pct}%` }}
                ></div>
              </div>
              <span className="bar-star-percent">{item.pct}%</span>
            </div>
          ))}
        </div>

        {/* Right: Feature Ratings */}
        <div className="feature-ratings-column">
          <h4>Customer Sentiment</h4>
          <div className="sentiment-metric">
            <span>Authenticity & Quality</span>
            <strong>4.9 ★</strong>
          </div>
          <div className="sentiment-metric">
            <span>Value for Money</span>
            <strong>4.8 ★</strong>
          </div>
          <div className="sentiment-metric">
            <span>Packaging & Shipping</span>
            <strong>5.0 ★</strong>
          </div>
        </div>
      </div>

      {/* Write Review Form Collapsible */}
      {showReviewForm && (
        <form className="write-review-form-card" onSubmit={handleReviewSubmit}>
          <div className="form-card-header">
            <h3>Share Your Experience</h3>
            <button
              type="button"
              className="btn-close-form"
              onClick={() => setShowReviewForm(false)}
            >
              <X size={18} />
            </button>
          </div>

          {submitSuccess ? (
            <div className="review-success-banner">
              <CheckCircle2 size={24} className="text-emerald" />
              <span>Thank you! Your verified review has been submitted.</span>
            </div>
          ) : (
            <>
              {/* Star Picker */}
              <div className="form-row-rating-picker">
                <label>Your Overall Rating:</label>
                <div className="star-picker-interactive">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className="star-pick-btn"
                      onMouseEnter={() => setHoverRating(val)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(val)}
                    >
                      <Star
                        size={24}
                        className={
                          val <= (hoverRating || newRating)
                            ? 'star-solid-gold'
                            : 'star-muted'
                        }
                      />
                    </button>
                  ))}
                  <span className="rating-pick-text">
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="form-two-cols">
                <div className="form-group">
                  <label htmlFor="authorName">Your Name *</label>
                  <input
                    type="text"
                    id="authorName"
                    required
                    placeholder="e.g. Suresh Kumar"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reviewTitle">Review Headline</label>
                  <input
                    type="text"
                    id="reviewTitle"
                    placeholder="e.g. Exceeded my expectations!"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reviewComment">Review Comments *</label>
                <textarea
                  id="reviewComment"
                  required
                  rows={4}
                  placeholder="Tell us what you liked about the product, delivery speed, and build quality..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn-submit-review">
                Submit Verified Review
              </button>
            </>
          )}
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-cards-list">
        {reviews.map((rev) => (
          <div key={rev.id} className="review-card-item">
            <div className="review-card-top">
              <div className="reviewer-info">
                <div
                  className="reviewer-avatar-circle"
                  style={{ backgroundColor: rev.avatarBg }}
                >
                  {rev.author.charAt(0)}
                </div>
                <div>
                  <h4 className="reviewer-name">{rev.author}</h4>
                  <div className="reviewer-badges-row">
                    {rev.verified && (
                      <span className="verified-buyer-badge">
                        <CheckCircle2 size={13} /> Verified Buyer
                      </span>
                    )}
                    <span className="review-post-date">{rev.date}</span>
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="review-stars-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={s <= rev.rating ? 'star-solid-gold' : 'star-muted'}
                  />
                ))}
              </div>
            </div>

            <h4 className="review-item-headline">{rev.title}</h4>
            <p className="review-item-comment">{rev.comment}</p>

            <div className="review-card-footer">
              <button
                type="button"
                className={`btn-helpful ${helpfulClicked[rev.id] ? 'helpful-active' : ''}`}
                onClick={() => handleHelpfulClick(rev.id)}
              >
                <ThumbsUp size={14} />
                <span>Helpful ({rev.helpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
