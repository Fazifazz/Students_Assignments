import { AlertCircle, ArrowRight, CheckCircle2, Clock3, Download, FileText, Image, LoaderCircle, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { downloadAttachment, getErrorMessage } from '../services/api.js'
import { isOverdue } from '../utils/complaintUtils.js'

export function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-header-action">{action}</div>}</div>
}

export function Notice({ children, type = 'error' }) {
  if (!children) return null
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle
  return <div className={`notice notice-${type}`} role="status"><Icon size={17} />{children}</div>
}

export function Loading({ label = 'Loading…' }) {
  return <div className="loading-state"><LoaderCircle className="spin" size={23} />{label}</div>
}

export function EmptyState({ title, children, action }) {
  return <div className="empty-state"><span className="empty-icon"><Search size={22} /></span><h3>{title}</h3><p>{children}</p>{action}</div>
}

export function StatusBadge({ status }) {
  const normalized = String(status || 'Pending').toLowerCase().replace(/[\s_-]+/g, '')
  const label = normalized === 'inprogress' ? 'In progress' : normalized.charAt(0).toUpperCase() + normalized.slice(1)
  return <span className={`status-badge status-${normalized}`}><i />{label}</span>
}

export function PriorityBadge({ priority }) {
  const label = String(priority || 'Medium')
  return <span className={`priority-badge priority-${label.toLowerCase()}`}>{label}</span>
}

export function StatCard({ label, value, note, icon: Icon, tone = 'blue' }) {
  return <div className="stat-card"><span className={`stat-icon tone-${tone}`}><Icon size={19} /></span><div className="stat-value">{value ?? '—'}</div><div className="stat-label">{label}</div>{note && <div className="stat-note">{note}</div>}</div>
}

export function AttachmentsPanel({ complaintId, attachments = [] }) {
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  if (!attachments.length) return null

  async function download(item) {
    setBusyId(item.id)
    setError('')
    try {
      await downloadAttachment(complaintId, item)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not download this attachment.'))
    } finally {
      setBusyId('')
    }
  }

  return <section className="panel detail-panel attachments-panel"><div className="panel-heading"><div><h2>Attachments</h2><p>Photos and documents submitted with this complaint</p></div></div>
    {error && <p className="attachment-error" role="alert">{error}</p>}
    <div className="attachment-list">{attachments.map((item) => {
      const Icon = item.mimeType?.startsWith('image/') ? Image : FileText
      return <article className="attachment-item" key={item.id}><span className="attachment-icon"><Icon size={17} /></span><div className="attachment-copy"><strong>{item.name}</strong><small>{formatFileSize(item.size)}</small></div><button className="attachment-download" onClick={() => download(item)} disabled={busyId === item.id} aria-label={`Download ${item.name}`}>{busyId === item.id ? <span className="spinner spinner-small" /> : <Download size={16} />}</button></article>
    })}</div>
  </section>
}

export function ComplaintRows({ complaints, admin = false, onStatusChange }) {
  if (!complaints.length) return <EmptyState title="Nothing to show yet">Complaints will appear here as soon as they’re submitted.</EmptyState>
  return (
    <div className="table-scroll"><table className="data-table"><thead><tr><th>Complaint</th>{admin && <th>Submitted by</th>}<th>Category</th><th>Priority</th><th>Status</th><th>Date submitted</th><th>Due date</th><th /></tr></thead>
      <tbody>{complaints.map((item, index) => {
        const id = item._id ?? item.id ?? item.complaintId ?? index
        const href = admin ? `/admin/complaints/${id}` : `/user/complaints/${id}`
        return <tr key={id}><td><Link className="table-title" to={href}>{item.title || 'Untitled complaint'}</Link><span className="table-id">#{String(id).slice(-8)}</span></td>
          {admin && <td>{item.user?.name || item.name || item.userName || 'Resident'}</td>}
          <td>{item.category || '—'}</td><td><PriorityBadge priority={item.priority} /></td>
          <td>{admin && onStatusChange ? <select aria-label={`Update status for ${item.title}`} value={item.status || 'Pending'} onChange={(event) => onStatusChange(id, event.target.value)} className="table-status-select"><option>Pending</option><option>Under Review</option><option>In Progress</option><option>Resolved</option><option>Rejected</option></select> : <StatusBadge status={item.status} />}</td>
          <td>{formatDate(item.createdAt || item.submittedAt || item.date)}</td><td>{item.dueAt ? <span className={`due-date ${isOverdue(item) ? 'due-date-overdue' : ''}`}>{formatDate(item.dueAt)}{isOverdue(item) && <small>Overdue</small>}</span> : '—'}</td><td><Link className="row-action" to={href} aria-label={`View ${item.title}`}><ArrowRight size={17} /></Link></td></tr>
      })}</tbody></table></div>
  )
}

function formatFileSize(size = 0) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function statusIcon(status) {
  const key = String(status || '').toLowerCase()
  if (key.includes('resolv')) return CheckCircle2
  if (key.includes('progress')) return Clock3
  return AlertCircle
}
