import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import api from '../api/axiosInstance';

// Form validation function following strict rules (Session 32)
function validateEquipment(data) {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = 'Equipment name is required.';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Must be at least 3 characters.';
  }

  if (!data.category) {
    errors.category = 'Please select an equipment category.';
  }

  if (!data.dailyRate) {
    errors.dailyRate = 'Daily rental rate is required.';
  } else if (Number(data.dailyRate) <= 0) {
    errors.dailyRate = 'Rate must be a positive number.';
  }

  if (!data.serialNumber.trim()) {
    errors.serialNumber = 'Serial number is required.';
  }

  if (!data.location.trim()) {
    errors.location = 'Warehouse storage location is required.';
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required.';
  } else if (data.description.trim().length < 15) {
    errors.description = 'Please provide at least 15 characters of details.';
  }

  return errors;
}

export default function AddEquipment() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  // useForm hook managing multiple inputs with single handler and touched state (Session 32, 34)
  const {
    formData,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getFieldError
  } = useForm(
    {
      name: '',
      category: '',
      dailyRate: '',
      serialNumber: '',
      location: '',
      image: '',
      description: '',
    },
    validateEquipment
  );

  async function onSave(data) {
    setServerError('');
    try {
      await api.post('/equipment', {
        ...data,
        dailyRate: Number(data.dailyRate),
        image: data.image || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to add equipment to inventory.');
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: '720px' }}>
      <div className="card shadow-sm border-0 p-4 p-md-5">
        <h3 className="fw-bold mb-1">Add Equipment to Fleet</h3>
        <p className="text-muted small mb-4">
          Register newly acquired construction tools or machinery into the active tracking inventory.
        </p>

        {success && (
          <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
            <span>✓ Equipment registered successfully! Redirecting to fleet catalog...</span>
          </div>
        )}

        {serverError && (
          <div className="alert alert-danger mb-4" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSave); }} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Equipment Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Caterpillar 1.5-Ton Mini Excavator"
              className={`form-control ${touched.name && getFieldError('name') ? 'is-invalid' : ''}`}
            />
            {touched.name && getFieldError('name') && (
              <div className="invalid-feedback">{getFieldError('name')}</div>
            )}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-select ${touched.category && getFieldError('category') ? 'is-invalid' : ''}`}
              >
                <option value="">Select Category...</option>
                <option value="Power Tools">Power Tools</option>
                <option value="Heavy Machinery">Heavy Machinery</option>
                <option value="Construction">Construction</option>
                <option value="Painting & Finishing">Painting & Finishing</option>
                <option value="Access Equipment">Access Equipment</option>
              </select>
              {touched.category && getFieldError('category') && (
                <div className="invalid-feedback">{getFieldError('category')}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Daily Rate (₹ INR) *</label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="500"
                className={`form-control ${touched.dailyRate && getFieldError('dailyRate') ? 'is-invalid' : ''}`}
              />
              {touched.dailyRate && getFieldError('dailyRate') && (
                <div className="invalid-feedback">{getFieldError('dailyRate')}</div>
              )}
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Serial / Tag Number *</label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="CAT-EX-998"
                className={`form-control ${touched.serialNumber && getFieldError('serialNumber') ? 'is-invalid' : ''}`}
              />
              {touched.serialNumber && getFieldError('serialNumber') && (
                <div className="invalid-feedback">{getFieldError('serialNumber')}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Storage Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Warehouse B, Bay 4"
                className={`form-control ${touched.location && getFieldError('location') ? 'is-invalid' : ''}`}
              />
              {touched.location && getFieldError('location') && (
                <div className="invalid-feedback">{getFieldError('location')}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Image URL (Optional)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="form-control"
            />
            <small className="text-muted">Leave empty to use standard high-res equipment placeholder.</small>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Description & Specs *</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Detail operational power, battery voltage, weight capacity, and accessories included..."
              className={`form-control ${touched.description && getFieldError('description') ? 'is-invalid' : ''}`}
            />
            {touched.description && getFieldError('description') && (
              <div className="invalid-feedback">{getFieldError('description')}</div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-warning fw-semibold px-4"
            >
              {isSubmitting ? 'Registering...' : 'Save to Inventory'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="btn btn-outline-secondary"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
