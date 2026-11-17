import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80';

// Dynamic Route component using useParams (Session 33)
export default function EquipmentDetail({ onAddToCart, isAdded }) {
  const { id } = useParams();
  const { data: item, loading, error } = useFetch(`/equipment/${id}`);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status" />
        <p className="mt-2 text-muted">Loading equipment specifications...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning d-inline-block px-5">
          <h4>Item Not Found</h4>
          <p>The equipment you requested with ID #{id} doesn't exist.</p>
          <Link to="/" className="btn btn-warning btn-sm">
            ← Back to Equipment Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = item.status === 'Available';

  return (
    <div className="container py-5">
      <Link to="/" className="btn btn-outline-secondary btn-sm mb-4">
        ← Back to Catalog
      </Link>

      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-6 bg-light d-flex align-items-center justify-content-center p-3">
            <img
              src={item.image || DEFAULT_IMAGE}
              alt={item.name}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: '420px', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
            />
          </div>

          <div className="col-md-6">
            <div className="card-body p-4 p-lg-5 d-flex flex-column h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge bg-secondary text-uppercase">{item.category}</span>
                <span className={`badge ${isAvailable ? 'bg-success' : 'bg-danger'} fs-6`}>
                  {item.status}
                </span>
              </div>

              <h2 className="card-title fw-bold">{item.name}</h2>
              <p className="text-warning mb-3">Rating: ★ {item.rating} / 5.0</p>

              <p className="text-muted leading-relaxed mb-4">{item.description}</p>

              <div className="row g-3 mb-4 p-3 bg-light rounded">
                <div className="col-6">
                  <small className="text-muted d-block">Serial Number</small>
                  <strong>{item.serialNumber || 'N/A'}</strong>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Storage Hub</small>
                  <strong>{item.location || 'Central Depot'}</strong>
                </div>
              </div>

              <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted d-block">Rental Price</small>
                  <h3 className="text-primary fw-bold mb-0">
                    ₹{item.dailyRate.toLocaleString('en-IN')}{' '}
                    <span className="fs-6 fw-normal text-muted">/ day</span>
                  </h3>
                </div>

                <div>
                  {isAvailable ? (
                    <button
                      onClick={() => onAddToCart(item)}
                      disabled={isAdded}
                      className={`btn px-4 ${isAdded ? 'btn-success' : 'btn-warning fw-bold'}`}
                    >
                      {isAdded ? '✓ Added to Bag' : '+ Add to Rental Bag'}
                    </button>
                  ) : (
                    <button disabled className="btn btn-secondary px-4">
                      Currently Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
