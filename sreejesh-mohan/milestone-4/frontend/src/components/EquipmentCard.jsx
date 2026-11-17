import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80';

const EquipmentCard = memo(function EquipmentCard({ item, onRent, isAdded }) {
  const isAvailable = item.status === 'Available';

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className="card equipment-card h-100 shadow-sm border">
        {/* Product Image Frame */}
        <div className="card-img-container position-relative bg-light">
          <img
            src={item.image || DEFAULT_IMAGE}
            alt={item.name}
            className="card-img-top equipment-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
          {/* Status Badge */}
          <span
            className={`position-absolute top-0 end-0 m-2 badge ${
              isAvailable ? 'bg-success' : 'bg-secondary'
            } fs-7 px-2 py-1 shadow-sm`}
          >
            {isAvailable ? '● Available' : '● Out on Rent'}
          </span>
          {/* Category Tag */}
          <span className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75 text-white px-2 py-1">
            {item.category}
          </span>
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column p-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="badge bg-light text-muted border">ID: #{item.id}</span>
            <span className="text-warning fw-bold small">★ {item.rating}</span>
          </div>

          <h5 className="card-title fw-bold text-dark mb-1" title={item.name}>
            {item.name}
          </h5>

          <p className="card-text text-muted small flex-grow-1 mb-3">
            {item.description}
          </p>

          <hr className="my-2 text-muted opacity-25" />

          {/* Pricing & Actions */}
          <div className="d-flex justify-content-between align-items-center pt-1">
            <div>
              <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                DAILY RENT
              </small>
              <h5 className="text-primary fw-bold mb-0">
                ₹{item.dailyRate.toLocaleString('en-IN')}{' '}
                <span className="text-muted fw-normal fs-6">/ day</span>
              </h5>
            </div>

            <div className="d-flex gap-2">
              <Link
                to={`/equipment/${item.id}`}
                className="btn btn-outline-secondary btn-sm px-2 py-1"
                title="View full specs"
              >
                Details
              </Link>

              {isAvailable ? (
                <button
                  type="button"
                  onClick={() => onRent(item)}
                  disabled={isAdded}
                  className={`btn btn-sm px-3 fw-semibold ${
                    isAdded ? 'btn-success' : 'btn-warning text-dark'
                  }`}
                >
                  {isAdded ? '✓ Added' : '+ Rent'}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="btn btn-secondary btn-sm px-2 py-1 opacity-75"
                >
                  Rented
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EquipmentCard;
