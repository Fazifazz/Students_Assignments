import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight, Bell, CalendarDays, CheckCircle2, CircleAlert,
  ClipboardList, Clock3, MapPin, MessageCircle, Paperclip, Plus, Send, ShieldCheck,
  UserRound, XCircle,
} from 'lucide-react'
import api, { asArray, getErrorMessage, unwrap } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { AttachmentsPanel, ComplaintRows, EmptyState, formatDate, Loading, Notice, PageHeader, PriorityBadge, StatCard, StatusBadge } from '../components/Shared.jsx'
import { isOverdue } from '../utils/complaintUtils.js'

const categories = ['Infrastructure', 'Maintenance', 'Electricity', 'Water Supply', 'Internet/Network', 'Cleanliness', 'Security', 'Facilities', 'Other']
const priorities = ['Low', 'Medium', 'High', 'Urgent']

function useComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    api.get('/complaints').then((response) => setComplaints(asArray(unwrap(response), ['complaints', 'items'])))
      .catch((requestError) => setError(getErrorMessage(requestError, 'Could not load complaints.')))
      .finally(() => setLoading(false))
  }, [])
  return { complaints, setComplaints, loading, error }
}

export function UserDashboard() {
  const { complaints, loading, error } = useComplaints()
  const { user } = useAuth()
  const counts = useMemo(() => complaints.reduce((result, item) => {
    const status = String(item.status || 'pending').toLowerCase().replace(/[\s_-]+/g, '')
    result.total += 1
    if (status.includes('pending')) result.pending += 1
    else if (status.includes('progress') || status.includes('review')) result.progress += 1
    else if (status.includes('resolv')) result.resolved += 1
    return result
  }, { total: 0, pending: 0, progress: 0, resolved: 0 }), [complaints])
  const chartItems = [
    { label: 'Pending', value: counts.pending, className: 'chart-pending' },
    { label: 'In progress', value: counts.progress, className: 'chart-progress' },
    { label: 'Resolved', value: counts.resolved, className: 'chart-resolved' },
  ]
  return <>
    <PageHeader eyebrow="YOUR OVERVIEW" title={`Good day, ${(user?.name || '').trim().split(/\s+/)[0] || 'there'}`} description="Here’s what’s happening with your reports." action={<Link className="button button-primary" to="/user/submit-complaint"><Plus size={17} /> Submit a complaint</Link>} />
    <Notice>{error}</Notice>
    <div className="stats-grid">
      <StatCard label="Total complaints" value={loading ? '…' : counts.total} note="All your reports" icon={ClipboardList} tone="blue" />
      <StatCard label="Pending" value={loading ? '…' : counts.pending} note="Awaiting review" icon={CircleAlert} tone="amber" />
      <StatCard label="In progress" value={loading ? '…' : counts.progress} note="Being worked on" icon={Clock3} tone="violet" />
      <StatCard label="Resolved" value={loading ? '…' : counts.resolved} note="Issues taken care of" icon={CheckCircle2} tone="green" />
    </div>
    <div className="dashboard-grid">
      <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent complaints</h2><p>Your latest submitted issues</p></div><Link to="/user/complaints" className="text-link">View all <ArrowRight size={15} /></Link></div>
        {loading ? <Loading /> : <ComplaintRows complaints={complaints.slice(0, 5)} />}</section>
      <section className="panel chart-panel"><div className="panel-heading"><div><h2>Status summary</h2><p>Where your reports stand</p></div></div>
        {loading ? <Loading /> : counts.total ? <><div className="chart-total"><strong>{counts.total}</strong><span>reports in total</span></div><div className="chart-bars">{chartItems.map((item) => <div className="chart-row" key={item.label}><div className="chart-label"><span>{item.label}</span><b>{item.value}</b></div><div className="chart-track"><span className={item.className} style={{ width: `${counts.total ? Math.max(item.value / counts.total * 100, item.value ? 8 : 0) : 0}%` }} /></div></div>)}</div><div className="chart-legend"><span><i className="legend-blue" />Active</span><span><i className="legend-green" />Resolved</span></div></> : <EmptyState title="No reports yet">Submit your first complaint to see a status summary.</EmptyState>}</section>
    </div>
  </>
}

export function SubmitComplaint() {
  const navigate = useNavigate()
  const [values, setValues] = useState({ title: '', category: '', description: '', location: '', priority: 'Medium', contactNumber: '' })
  const [attachments, setAttachments] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  function selectAttachments(event) {
    const selected = Array.from(event.target.files || [])
    event.target.value = ''
    const next = [...attachments, ...selected]
    if (next.length > 5) return setError('You can attach up to 5 files.')
    if (selected.some((file) => file.size > 8 * 1024 * 1024)) return setError('Each attachment must be 8 MB or smaller.')
    if (selected.some((file) => !['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type))) {
      return setError('Choose JPG, PNG, WEBP or PDF files.')
    }
    setError('')
    setAttachments(next)
  }

  async function submit(event) {
    event.preventDefault()
    setError(''); setSuccess('')
    if (values.title.trim().length < 4) return setError('Enter a title with at least 4 characters.')
    if (!values.category) return setError('Choose a complaint category.')
    if (values.description.trim().length < 10) return setError('Please describe the issue in at least 10 characters.')
    if (!values.location.trim()) return setError('Add the location of the issue.')
    setBusy(true)
    try {
      const formData = new FormData()
      Object.entries({ ...values, title: values.title.trim(), description: values.description.trim(), location: values.location.trim(), contactNumber: values.contactNumber.trim() })
        .forEach(([key, value]) => formData.append(key, value))
      attachments.forEach((file) => formData.append('attachments', file))
      await api.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSuccess('Your complaint has been submitted successfully.')
      window.setTimeout(() => navigate('/user/complaints', { replace: true }), 1200)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Your complaint could not be submitted.'))
    } finally { setBusy(false) }
  }
  return <>
    <PageHeader eyebrow="NEW REPORT" title="Submit a complaint" description="Give us the details. We’ll make sure it reaches the right team." />
    <Notice type="success">{success}</Notice><Notice>{error}</Notice>
    <form className="panel complaint-form" onSubmit={submit} noValidate>
      <div className="form-section-title"><span>01</span><div><h2>What’s going on?</h2><p>A clear title helps everyone understand the issue at a glance.</p></div></div>
      <div className="field-grid"><label className="field field-span"><span>Complaint title <b>*</b></span><input maxLength="120" placeholder="e.g. Streetlight out near the west entrance" value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} required /><small>{values.title.length}/120 characters</small></label>
        <label className="field"><span>Category <b>*</b></span><select value={values.category} onChange={(e) => setValues({ ...values, category: e.target.value })} required><option value="">Select a category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="field"><span>Priority</span><select value={values.priority} onChange={(e) => setValues({ ...values, priority: e.target.value })}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
        <label className="field field-span"><span>Description <b>*</b></span><textarea rows="5" maxLength="2000" placeholder="Share what happened, when you noticed it, and any other details that could help." value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} required /><small>{values.description.length}/2000 characters</small></label>
      </div>
      <div className="form-section-title form-section-spaced"><span>02</span><div><h2>Where can we find it?</h2><p>Help the response team locate the issue.</p></div></div>
      <div className="field-grid"><label className="field"><span>Location <b>*</b></span><span className="input-icon"><MapPin size={16} /><input placeholder="Building, street, or area" value={values.location} onChange={(e) => setValues({ ...values, location: e.target.value })} required /></span></label>
        <label className="field"><span>Contact number <small>(optional)</small></span><input type="tel" autoComplete="tel" placeholder="Your phone number" value={values.contactNumber} onChange={(e) => setValues({ ...values, contactNumber: e.target.value })} /></label>
        <label className="field field-span"><span>Photos or documents <small>(optional · up to 5 files, 8 MB each)</small></span><input className="attachment-input" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={selectAttachments} /><small>Accepted formats: JPG, PNG, WEBP and PDF.</small></label></div>
      {attachments.length > 0 && <div className="selected-attachments">{attachments.map((file, index) => <div className="selected-attachment" key={`${file.name}-${index}`}><Paperclip size={15} /><span>{file.name}</span><button type="button" className="icon-button" aria-label={`Remove ${file.name}`} onClick={() => setAttachments((items) => items.filter((_, itemIndex) => itemIndex !== index))}><XCircle size={16} /></button></div>)}</div>}
      <div className="form-actions"><span><ShieldCheck size={15} /> Your contact details are only shared with the response team.</span><button className="button button-primary" disabled={busy}>{busy ? <span className="spinner spinner-small" /> : <>Submit complaint <ArrowRight size={16} /></>}</button></div>
    </form>
  </>
}

export function MyComplaints() {
  const { complaints, loading, error } = useComplaints()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const filtered = complaints.filter((item) => {
    const id = String(item._id ?? item.id ?? item.complaintId ?? '')
    return `${item.title || ''} ${id}`.toLowerCase().includes(query.toLowerCase())
      && (!status || String(item.status).toLowerCase().replace(/[\s_-]+/g, '') === status.toLowerCase().replace(/[\s_-]+/g, ''))
      && (!category || item.category === category)
  })
  return <>
    <PageHeader eyebrow="YOUR REPORTS" title="My complaints" description="Keep an eye on every issue you’ve raised." action={<Link className="button button-primary" to="/user/submit-complaint"><Plus size={17} /> New complaint</Link>} />
    <Notice>{error}</Notice>
    <section className="panel list-panel"><div className="filter-toolbar">
      <label className="search-field"><span className="sr-only">Search complaints</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or complaint ID" /><ClipboardList size={17} /></label>
      <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option>Pending</option><option>Under Review</option><option>In Progress</option><option>Resolved</option><option>Rejected</option></select>
      <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
    </div>
      {loading ? <Loading /> : filtered.length ? <ComplaintRows complaints={filtered} /> : <EmptyState title="No matching complaints">Try a different search or filter, or submit a new complaint.</EmptyState>}
    </section>
  </>
}

export function ComplaintDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [cancelBusy, setCancelBusy] = useState(false)
  const [comments, setComments] = useState([])
  useEffect(() => {
    api.get(`/complaints/${encodeURIComponent(id)}`).then((response) => {
      const payload = unwrap(response)
      const item = payload?.complaint ?? payload
      setComplaint(item)
      setComments(asArray(item?.comments ?? payload?.comments))
    }).catch((requestError) => setError(getErrorMessage(requestError, 'Could not load this complaint.')))
      .finally(() => setLoading(false))
  }, [id])
  async function addComment(event) {
    event.preventDefault()
    if (!comment.trim()) return
    setError(''); setBusy(true)
    try {
      const response = await api.post(`/complaints/${encodeURIComponent(id)}/comments`, { comment: comment.trim(), text: comment.trim() })
      const payload = unwrap(response)
      if (payload?.comment) setComments((previous) => [...previous, payload.comment])
      else if (payload?.comments) setComments(asArray(payload.comments))
      else setComments((previous) => [...previous, { text: comment.trim(), createdAt: new Date().toISOString() }])
      setComment('')
    } catch (requestError) { setError(getErrorMessage(requestError, 'Could not add your comment.')) }
    finally { setBusy(false) }
  }
  async function cancelComplaint() {
    if (!window.confirm('Cancel this pending complaint? This action cannot be undone.')) return
    setError(''); setCancelBusy(true)
    try { await api.delete(`/complaints/${encodeURIComponent(id)}`); navigate('/user/complaints', { replace: true }) }
    catch (requestError) { setError(getErrorMessage(requestError, 'Could not cancel this complaint.')) }
    finally { setCancelBusy(false) }
  }
  if (loading) return <Loading label="Loading complaint…" />
  if (error && !complaint) return <><PageHeader eyebrow="COMPLAINT DETAILS" title="Complaint unavailable" /><Notice>{error}</Notice><Link to="/user/complaints" className="text-link">Back to complaints</Link></>
  if (!complaint) return null
  const currentStatus = complaint.status || 'Pending'
  const history = asArray(complaint.statusHistory ?? complaint.history ?? complaint.updates)
  return <>
    <PageHeader eyebrow={`COMPLAINT #${String(complaint._id ?? complaint.id ?? id).slice(-8)}`} title={complaint.title || 'Complaint details'} description={`${complaint.category || 'General'} · Submitted ${formatDate(complaint.createdAt || complaint.submittedAt)}`} action={<Link className="button button-outline" to="/user/complaints">Back to complaints</Link>} />
    <Notice>{error}</Notice>
    <div className="details-grid"><div className="details-main">
      <section className="panel detail-panel"><div className="detail-top"><h2>Issue details</h2><StatusBadge status={currentStatus} /></div><p className="detail-description">{complaint.description || 'No description provided.'}</p>
        <div className="detail-facts"><span><MapPin size={16} /><b>Location</b>{complaint.location || '—'}</span><span><CalendarDays size={16} /><b>Submitted</b>{formatDate(complaint.createdAt || complaint.submittedAt)}</span><span><CircleAlert size={16} /><b>Priority</b><PriorityBadge priority={complaint.priority} /></span>{complaint.dueAt && <span><CalendarDays size={16} /><b>Due date</b>{formatDate(complaint.dueAt)}{isOverdue(complaint) && <strong className="overdue-label">Overdue</strong>}</span>}</div>
      </section>
      <AttachmentsPanel complaintId={id} attachments={asArray(complaint.attachments)} />
      <section className="panel detail-panel"><div className="panel-heading"><div><h2>Conversation</h2><p>Questions or extra information? Add a comment.</p></div><span className="count-pill">{comments.length}</span></div>
        {comments.length > 0 ? <div className="comment-list">{comments.map((item, index) => <article className="comment" key={item._id || item.id || index}><span className="avatar avatar-small">{String(item.user?.name || item.name || 'A').slice(0, 1).toUpperCase()}</span><div><div className="comment-meta"><strong>{item.user?.name || item.name || 'ResolveIt team'}</strong><time>{formatDate(item.createdAt || item.date)}</time></div><p>{item.text || item.comment || item.message || ''}</p></div></article>)}</div> : <p className="muted-copy">No comments yet. Start the conversation below.</p>}
        <form className="comment-form" onSubmit={addComment}><textarea rows="3" placeholder="Write a comment…" value={comment} onChange={(e) => setComment(e.target.value)} /><button className="button button-primary" disabled={busy || !comment.trim()}>{busy ? <span className="spinner spinner-small" /> : <>Add comment <Send size={15} /></>}</button></form>
      </section>
    </div><aside className="details-aside"><section className="panel timeline-panel"><h2>Status history</h2>{history.length ? <div className="timeline">{history.map((item, index) => <div className="timeline-item" key={item._id || index}><span className="timeline-dot" /><div><strong>{item.status || item.title || 'Update'}</strong><p>{item.note || item.message || item.description || ''}</p><small>{formatDate(item.createdAt || item.date)}</small></div></div>)}</div> : <div className="timeline"><div className="timeline-item"><span className="timeline-dot" /><div><strong>{currentStatus}</strong><p>Your complaint’s current status.</p><small>{formatDate(complaint.updatedAt || complaint.createdAt)}</small></div></div></div>}</section>
      {(complaint.adminResponse || complaint.response) && <section className="panel response-panel"><span className="response-icon"><MessageCircle size={17} /></span><div><h2>Team response</h2><p>{complaint.adminResponse || complaint.response}</p></div></section>}
      {String(currentStatus).toLowerCase() === 'pending' && <button className="button button-danger button-full cancel-button" onClick={cancelComplaint} disabled={cancelBusy}>{cancelBusy ? <span className="spinner spinner-small" /> : <><XCircle size={16} /> Cancel complaint</>}</button>}
    </aside></div>
  </>
}

export function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    api.get('/notifications').then((response) => setNotifications(asArray(unwrap(response), ['notifications', 'items'])))
      .catch((requestError) => setError(getErrorMessage(requestError, 'Could not load notifications.')))
      .finally(() => setLoading(false))
  }, [])
  async function markRead(id) {
    try {
      await api.patch(`/notifications/${encodeURIComponent(id)}/read`)
      setNotifications((items) => items.map((item) => String(item._id ?? item.id) === String(id) ? { ...item, read: true, isRead: true } : item))
    } catch (requestError) { setError(getErrorMessage(requestError, 'Could not update notification.')) }
  }
  async function markAllRead() {
    setBusy(true); setError('')
    try { await api.patch('/notifications/read-all'); setNotifications((items) => items.map((item) => ({ ...item, read: true, isRead: true }))) }
    catch (requestError) { setError(getErrorMessage(requestError, 'Could not update notifications.')) }
    finally { setBusy(false) }
  }
  const unread = notifications.filter((item) => !item.read && !item.isRead)
  return <>
    <PageHeader eyebrow="STAY INFORMED" title="Notifications" description="Updates about your complaints, all in one place." action={unread.length > 0 && <button className="button button-outline" onClick={markAllRead} disabled={busy}>{busy ? 'Updating…' : 'Mark all as read'}</button>} />
    <Notice>{error}</Notice><section className="panel notification-panel">
      {loading ? <Loading /> : notifications.length ? notifications.map((item, index) => {
        const id = item._id ?? item.id ?? index
        const read = item.read || item.isRead
        return <article className={`notification-item ${read ? '' : 'notification-unread'}`} key={id}><span className="notification-icon"><Bell size={17} /></span><div className="notification-copy"><strong>{item.title || item.type || 'Complaint update'}</strong><p>{item.message || item.body || item.description || 'There’s an update to one of your complaints.'}</p><time>{formatDate(item.createdAt || item.date)}</time></div>{!read && <button className="notification-read" onClick={() => markRead(id)}>Mark read</button>}</article>
      }) : <EmptyState title="You’re all caught up">New updates will appear here.</EmptyState>}
    </section>
  </>
}

export function Profile() {
  const { user } = useAuth()
  const initials = (user?.name || user?.email || 'R').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  return <>
    <PageHeader eyebrow="YOUR ACCOUNT" title="Profile" description="Your personal account information." />
    <section className="panel profile-panel"><div className="profile-hero"><span className="profile-avatar">{initials}</span><div><h2>{user?.name || 'ResolveIt member'}</h2><p>{user?.email || '—'}</p></div><span className="role-pill"><UserRound size={14} /> {String(user?.role || 'User')}</span></div>
      <div className="profile-details"><div><span>Full name</span><strong>{user?.name || '—'}</strong></div><div><span>Email address</span><strong>{user?.email || '—'}</strong></div><div><span>Account role</span><strong>{String(user?.role || 'User')}</strong></div></div>
      <div className="profile-note"><ShieldCheck size={17} /><p>Your profile is managed by ResolveIt. Passwords and security credentials are never displayed here.</p></div>
    </section>
  </>
}
