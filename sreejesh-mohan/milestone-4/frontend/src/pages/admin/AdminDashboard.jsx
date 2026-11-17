import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

export default function AdminDashboard() {
  const { data: equipment, loading: eqLoading } = useFetch('/equipment', []);
  const { data: rentals, loading: rentLoading } = useFetch('/rentals', []);

  const stats = useMemo(() => {
    if (!equipment || !rentals) return { totalEq: 0, available: 0, rented: 0, totalRevenue: 0 };
    const rentedCount = equipment.filter(e => e.status === 'Rented').length;
    const availableCount = equipment.filter(e => e.status === 'Available').length;
    const revenue = rentals.reduce((sum, r) => sum + (r.totalCost || 0), 0);
    return {
      totalEq: equipment.length,
      available: availableCount,
      rented: rentedCount,
      totalRevenue: revenue
    };
  }, [equipment, rentals]);

  if (eqLoading || rentLoading) {
    return (
      <div className="card shadow-sm border-0 p-5 text-center">
        <div className="spinner-border text-warning" role="status" />
        <p className="mt-2 text-muted">Aggregating fleet metrics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Operations Command Center</h3>
          <p className="text-muted small mb-0">Fleet availability, leased machinery assets, and lease revenue.</p>
        </div>
        <Link to="/admin/add-equipment" className="btn btn-warning fw-semibold btn-sm">
          + Add Inventory Item
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <small className="text-muted text-uppercase fw-semibold">Total Assets</small>
            <h2 className="fw-bold mb-0 text-dark">{stats.totalEq}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <small className="text-muted text-uppercase fw-semibold">Available Stock</small>
            <h2 className="fw-bold mb-0 text-success">{stats.available}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <small className="text-muted text-uppercase fw-semibold">Active On-Hire</small>
            <h2 className="fw-bold mb-0 text-warning">{stats.rented}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <small className="text-muted text-uppercase fw-semibold">Gross Revenue</small>
            <h2 className="fw-bold mb-0 text-primary">₹{stats.totalRevenue.toLocaleString('en-IN')}</h2>
          </div>
        </div>
      </div>

      {/* Quick Fleet Inventory Table */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold mb-0">Equipment Fleet Snapshot</h6>
          <Link to="/admin/rentals" className="small text-decoration-none">
            Manage Active Leases →
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Serial #</th>
                <th>Rate/Day</th>
                <th>Status</th>
                <th>Storage Bay</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td><span className="badge bg-secondary">{item.category}</span></td>
                  <td><code>{item.serialNumber}</code></td>
                  <td>₹{item.dailyRate}</td>
                  <td>
                    <span className={`badge ${item.status === 'Available' ? 'bg-success' : 'bg-danger'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="small text-muted">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
