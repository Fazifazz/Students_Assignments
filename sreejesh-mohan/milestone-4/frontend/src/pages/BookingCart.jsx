import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CART_ACTIONS } from '../reducers/rentalCartReducer';
import { useForm } from '../hooks/useForm';
import api from '../api/axiosInstance';

function validateBookingForm(data) {
  const errors = {};
  if (!data.customerName.trim()) {
    errors.customerName = 'Full Name is required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.customerEmail.trim()) {
    errors.customerEmail = 'Email address is required.';
  } else if (!emailRegex.test(data.customerEmail)) {
    errors.customerEmail = 'Please enter a valid email.';
  }

  if (!data.customerPhone.trim()) {
    errors.customerPhone = 'Phone number is required.';
  } else if (data.customerPhone.trim().length < 10) {
    errors.customerPhone = 'Must be a 10-digit number.';
  }

  if (!data.startDate) {
    errors.startDate = 'Rental start date is required.';
  }

  return errors;
}

export default function BookingCart({ cart, dispatch }) {
  const navigate = useNavigate();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    formData,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = useForm(
    {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      startDate: new Date().toISOString().split('T')[0],
    },
    validateBookingForm
  );

  const grandTotal = cart.items.reduce(
    (sum, item) => sum + item.dailyRate * item.days,
    0
  );

  async function handleConfirmBooking(values) {
    setServerError('');
    try {
      // Loop or submit items to backend
      for (const item of cart.items) {
        await api.post('/rentals', {
          equipmentId: item.id,
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          customerPhone: values.customerPhone,
          startDate: values.startDate,
          rentalDays: item.days,
        });
      }

      setBookingSuccess(true);
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      setTimeout(() => {
        navigate('/active-rentals');
      }, 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Booking submission failed. Please try again.');
    }
  }

  if (cart.items.length === 0 && !bookingSuccess) {
    return (
      <div className="container py-5 text-center">
        <div className="p-5 bg-white rounded shadow-sm d-inline-block">
          <h3>Your Rental Bag is Empty</h3>
          <p className="text-muted">Select commercial machinery or tools from the catalog to book.</p>
          <Link to="/" className="btn btn-warning fw-semibold">
            Explore Available Equipment →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Complete Equipment Reservation</h2>

      {bookingSuccess && (
        <div className="alert alert-success p-4 mb-4">
          <h4 className="alert-heading">✓ Reservation Confirmed!</h4>
          <p>
            Your equipment rental booking has been processed and saved into the active tracker.
          </p>
          <p className="mb-0 small text-muted">Redirecting you to the active rental tracker...</p>
        </div>
      )}

      {serverError && (
        <div className="alert alert-danger mb-4">
          {serverError}
        </div>
      )}

      <div className="row g-5">
        {/* Left Col: Cart Items managed by useReducer (Session 35) */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
              <span className="fw-semibold">Reserved Equipment ({cart.items.length})</span>
              <button
                onClick={() => dispatch({ type: CART_ACTIONS.CLEAR_CART })}
                className="btn btn-sm btn-outline-light"
              >
                Clear All
              </button>
            </div>

            <ul className="list-group list-group-flush">
              {cart.items.map(item => (
                <li key={item.id} className="list-group-item p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-bold">{item.name}</h6>
                      <small className="text-muted">
                        ₹{item.dailyRate} / day • Category: {item.category}
                      </small>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="input-group input-group-sm" style={{ width: '120px' }}>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            dispatch({
                              type: CART_ACTIONS.UPDATE_DAYS,
                              payload: { id: item.id, days: item.days - 1 },
                            })
                          }
                        >
                          -
                        </button>
                        <span className="form-control text-center bg-white">{item.days}d</span>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            dispatch({
                              type: CART_ACTIONS.UPDATE_DAYS,
                              payload: { id: item.id, days: item.days + 1 },
                            })
                          }
                        >
                          +
                        </button>
                      </div>

                      <div className="text-end" style={{ minWidth: '90px' }}>
                        <span className="fw-bold text-primary">
                          ₹{(item.dailyRate * item.days).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          dispatch({
                            type: CART_ACTIONS.REMOVE_ITEM,
                            payload: item.id,
                          })
                        }
                        className="btn btn-sm btn-outline-danger"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="card-footer bg-light p-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold">Total Rental Estimate:</span>
              <h4 className="fw-bold text-success mb-0">₹{grandTotal.toLocaleString('en-IN')}</h4>
            </div>
          </div>
        </div>

        {/* Right Col: Controlled Customer Form (Session 32) */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Customer Verification & Booking</h5>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(handleConfirmBooking); }} noValidate>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Customer Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${touched.customerName && getFieldError('customerName') ? 'is-invalid' : ''}`}
                  placeholder="e.g. Arun Kumar"
                />
                {touched.customerName && getFieldError('customerName') && (
                  <div className="invalid-feedback">{getFieldError('customerName')}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address *</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${touched.customerEmail && getFieldError('customerEmail') ? 'is-invalid' : ''}`}
                  placeholder="arun@example.com"
                />
                {touched.customerEmail && getFieldError('customerEmail') && (
                  <div className="invalid-feedback">{getFieldError('customerEmail')}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Contact Phone Number *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${touched.customerPhone && getFieldError('customerPhone') ? 'is-invalid' : ''}`}
                  placeholder="9876543210"
                />
                {touched.customerPhone && getFieldError('customerPhone') && (
                  <div className="invalid-feedback">{getFieldError('customerPhone')}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Dispatch / Pickup Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${touched.startDate && getFieldError('startDate') ? 'is-invalid' : ''}`}
                />
                {touched.startDate && getFieldError('startDate') && (
                  <div className="invalid-feedback">{getFieldError('startDate')}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-warning w-100 py-2 fw-bold"
              >
                {isSubmitting ? 'Confirming Dispatch...' : `Confirm Booking • ₹${grandTotal.toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
