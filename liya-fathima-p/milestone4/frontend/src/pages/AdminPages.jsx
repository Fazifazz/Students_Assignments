import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowDownRight, ArrowRight, BarChart3, Building2, CheckCircle2, CircleAlert,
  ClipboardList, Clock3, Plus, Search, Trash2, X,
} from 'lucide-react'
import api, { asArray, getErrorMessage, unwrap } from '../services/api.js'
import { AttachmentsPanel, ComplaintRows, EmptyState, formatDate, Loading, Notice, PageHeader, StatCard, StatusBadge } from '../components/Shared.jsx'
import { isOverdue } from '../utils/complaintUtils.js'

const complaintStatuses = ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Rejected']
const complaintPriorities = ['Low', 'Medium', 'High', 'Urgent']

function firstValue(data, keys, fallback = 0) {
  for (const key of keys) {
    if (data?.[key] !== undefined && data?.[key] !== null) return data[key]
  }
  return fallback
}

function breakdownItems(value, key) {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') {
    return Object.entries(value).map(([label, count]) => ({ [key]: label, count }))
  }
  return []
}

function toLocalDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function AdminDashboard() {
  const [data, setData] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [overdueComplaints, setOverdueComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.all([api.get('/admin/dashboard'), api.get('/complaints')])
      .then(([dashboardResponse, complaintsResponse]) => {
        const dashboard = unwrap(dashboardResponse)
        const items = asArray(unwrap(complaintsResponse), ['complaints', 'items'])
        setData(dashboard)
        setOverdueComplaints(asArray(dashboard?.overdueComplaints))
        setComplaints(asArray(dashboard?.recentComplaints ?? dashboard?.recent ?? items, ['complaints', 'items']))
      })
      .catch((requestError) => setError(getErrorMessage(requestError, 'Could not load the admin dashboard.')))
      .finally(() => setLoading(false))
  }, [])
  const stats = data?.stats ?? data?.statistics ?? data ?? {}
  const counts = {
    total: firstValue(stats, ['totalComplaints', 'total', 'complaintsCount']),
    pending: firstValue(stats, ['pendingComplaints', 'pending']),
    progress: firstValue(stats, ['inProgressComplaints', 'inProgress', 'processing']) + firstValue(stats, ['underReview']),
    resolved: firstValue(stats, ['resolvedComplaints', 'resolved']),
    overdue: firstValue(stats, ['overdue', 'overdueComplaints']),
  }
  const max = Math.max(counts.pending, counts.progress, counts.resolved, 1)
  return <>
    <PageHeader eyebrow="ADMIN WORKSPACE" title="Dashboard" description="A clear view of what needs attention across your community." action={<Link className="button button-outline" to="/admin/reports"><BarChart3 size={16} /> View reports</Link>} />
    <Notice>{error}</Notice><div className="stats-grid">
      <StatCard label="Total complaints" value={loading ? '…' : counts.total} note="Reports received" icon={ClipboardList} tone="blue" />
      <StatCard label="Pending" value={loading ? '…' : counts.pending} note="Need a first response" icon={CircleAlert} tone="amber" />
      <StatCard label="In progress" value={loading ? '…' : counts.progress} note="Under review or being resolved" icon={Clock3} tone="violet" />
      <StatCard label="Resolved" value={loading ? '…' : counts.resolved} note="Successfully closed" icon={CheckCircle2} tone="green" />
    </div>
    <div className="dashboard-grid admin-dash-grid">
      <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent complaints</h2><p>Latest reports from your community</p></div><Link to="/admin/complaints" className="text-link">Manage complaints <ArrowRight size={15} /></Link></div>{loading ? <Loading /> : <ComplaintRows complaints={complaints.slice(0, 6)} admin />}</section>
      <section className="panel chart-panel"><div className="panel-heading"><div><h2>Workload</h2><p>Complaints by current status</p></div></div>{loading ? <Loading /> : <div className="workload-chart">{[
        ['Pending', counts.pending, 'chart-pending'], ['In progress', counts.progress, 'chart-progress'], ['Resolved', counts.resolved, 'chart-resolved'],
      ].map(([label, value, color]) => <div className="workload-row" key={label}><span>{label}</span><div className="workload-track"><i className={color} style={{ width: `${value ? Math.max(value / max * 100, 8) : 0}%` }} /></div><b>{value}</b></div>)}
      <Link to="/admin/complaints" className="workload-link">Review the queue <ArrowRight size={15} /></Link></div>}</section>
    </div>
    <section className={`panel overdue-panel ${counts.overdue ? 'has-overdue' : ''}`}><div className="panel-heading"><div><h2><CircleAlert size={17} /> Overdue complaints <span className="count-pill">{loading ? '…' : counts.overdue}</span></h2><p>Open complaints that have passed their due date</p></div><Link to="/admin/complaints?filter=overdue" className="text-link">View overdue queue <ArrowRight size={15} /></Link></div>
      {loading ? <Loading /> : overdueComplaints.length ? <ComplaintRows complaints={overdueComplaints} admin /> : <p className="overdue-clear">You’re all caught up. No complaint deadlines have been missed.</p>}
    </section>
  </>
}

export function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [overdueOnly, setOverdueOnly] = useState(() => new URLSearchParams(window.location.search).get('filter') === 'overdue')
  const [departments, setDepartments] = useState([])
  useEffect(() => {
    Promise.all([api.get('/complaints'), api.get('/departments')])
      .then(([complaintsResponse, departmentsResponse]) => {
        setComplaints(asArray(unwrap(complaintsResponse), ['complaints', 'items']))
        setDepartments(asArray(unwrap(departmentsResponse), ['departments', 'items']))
      })
      .catch((requestError) => setError(getErrorMessage(requestError, 'Could not load complaints.')))
      .finally(() => setLoading(false))
  }, [])
  async function updateStatus(id, nextStatus) {
    setError('')
    try {
      const response = await api.patch(`/complaints/${encodeURIComponent(id)}/status`, { status: nextStatus })
      const payload = unwrap(response)
      const updated = payload?.complaint ?? payload
      setComplaints((items) => items.map((item) => String(item._id ?? item.id ?? item.complaintId) === String(id) ? { ...item, ...updated, status: updated?.status || nextStatus } : item))
    } catch (requestError) { setError(getErrorMessage(requestError, 'Could not update complaint status.')) }
  }
  const filtered = complaints.filter((item) => {
    const id = String(item._id ?? item.id ?? item.complaintId ?? '')
    return `${item.title || ''} ${id} ${item.user?.name || item.name || ''}`.toLowerCase().includes(query.toLowerCase())
      && (!status || String(item.status || '').toLowerCase().replace(/[\s_-]+/g, '') === status.toLowerCase().replace(/[\s_-]+/g, ''))
      && (!priority || item.priority === priority)
      && (!departmentId || String(item.departmentId ?? item.department?.id ?? '') === departmentId)
      && (!overdueOnly || isOverdue(item))
  })
  return <>
    <PageHeader eyebrow="CASE MANAGEMENT" title="Complaints" description="Review incoming reports and keep their status up to date." />
    <Notice>{error}</Notice><section className="panel list-panel"><div className="filter-toolbar admin-filter-toolbar">
      <label className="search-field"><span className="sr-only">Search complaints</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, ID, or resident" /><Search size={17} /></label>
      <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{complaintStatuses.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="Filter by priority" value={priority} onChange={(e) => setPriority(e.target.value)}><option value="">All priorities</option>{complaintPriorities.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="Filter by department" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}><option value="">All departments</option>{departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select aria-label="Filter overdue complaints" value={overdueOnly ? 'overdue' : 'all'} onChange={(e) => setOverdueOnly(e.target.value === 'overdue')}><option value="all">All deadlines</option><option value="overdue">Overdue only</option></select>
    </div>{loading ? <Loading /> : <ComplaintRows complaints={filtered} admin onStatusChange={updateStatus} />}</section>
  </>
}

export function AdminComplaintDetails() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [departments, setDepartments] = useState([])
  const [values, setValues] = useState({ status: 'Pending', priority: 'Medium', departmentId: '', adminResponse: '', dueDate: '' })
  useEffect(() => {
    api.get(`/complaints/${encodeURIComponent(id)}`).then((response) => {
      const payload = unwrap(response)
      const item = payload?.complaint ?? payload
      setComplaint(item)
      setValues({
        status: item.status || 'Pending',
        priority: item.priority || 'Medium',
        departmentId: item.departmentId || '',
        adminResponse: item.adminResponse || '',
        dueDate: toLocalDateInput(item.dueAt)
      })
    }).catch((requestError) => setError(getErrorMessage(requestError, 'Could not load this complaint.')))
      .finally(() => setLoading(false))
    api.get('/departments').then((response) => setDepartments(asArray(unwrap(response), ['departments', 'items'])))
      .catch((requestError) => setError(getErrorMessage(requestError, 'Could not load departments.')))
  }, [id])
  async function saveUpdates(event) {
    event.preventDefault()
    setBusy(true); setError(''); setNotice('')
    try {
      const { dueDate, ...updates } = values
      const response = await api.patch(`/complaints/${encodeURIComponent(id)}/status`, {
        ...updates,
        dueAt: dueDate ? new Date(`${dueDate}T23:59:59.999`).toISOString() : null
      })
      const payload = unwrap(response)
      const updated = payload?.complaint ?? payload
      setComplaint((item) => ({ ...item, ...updated }))
      setValues((item) => ({ ...item, adminResponse: updated.adminResponse || '', dueDate: toLocalDateInput(updated.dueAt) }))
      setNotice('Complaint updated successfully.')
    } catch (requestError) { setError(getErrorMessage(requestError, 'Could not update complaint.')) }
    finally { setBusy(false) }
  }
  if (loading) return <Loading label="Loading complaint…" />
  if (!complaint) return <><PageHeader eyebrow="COMPLAINT REVIEW" title="Complaint unavailable" /><Notice>{error}</Notice><Link className="text-link" to="/admin/complaints">Back to complaints</Link></>
  return <>
    <PageHeader eyebrow={`COMPLAINT #${String(complaint._id ?? complaint.id ?? id).slice(-8)}`} title={complaint.title || 'Complaint details'} description={`${complaint.category || 'General'} · Submitted ${formatDate(complaint.createdAt || complaint.submittedAt)}`} action={<Link to="/admin/complaints" className="button button-outline">Back to complaints</Link>} />
    <Notice>{error}</Notice><Notice type="success">{notice}</Notice>
    <div className="details-grid"><div className="details-main">
      <section className="panel detail-panel"><div className="detail-top"><h2>Issue details</h2><StatusBadge status={complaint.status} /></div><p className="detail-description">{complaint.description || 'No description provided.'}</p>
        <div className="detail-facts"><span><span className="fact-marker" /><b>Location</b>{complaint.location || '—'}</span><span><span className="fact-marker" /><b>Department</b>{complaint.department?.name || 'Unassigned'}</span><span><span className="fact-marker" /><b>Submitted by</b>{complaint.user?.name || complaint.name || complaint.userName || 'Resident'}{complaint.user?.email ? ` · ${complaint.user.email}` : ''}</span></div>
      </section>
      <AttachmentsPanel complaintId={id} attachments={asArray(complaint.attachments)} />
      <section className="panel detail-panel"><h2>Comments</h2>{asArray(complaint.comments).length ? <div className="comment-list">{asArray(complaint.comments).map((comment, index) => <article className="comment" key={comment._id || index}><div><div className="comment-meta"><strong>{comment.user?.name || comment.name || 'Resident'}</strong><time>{formatDate(comment.createdAt)}</time></div><p>{comment.text || comment.comment || comment.message || ''}</p></div></article>)}</div> : <p className="muted-copy">No comments on this complaint.</p>}</section>
      <section className="panel detail-panel"><h2>Activity history</h2>{asArray(complaint.history).length ? <div className="timeline">{[...asArray(complaint.history)].reverse().map((item, index) => <div className="timeline-item" key={`${item.date || item.createdAt || index}-${index}`}><span className="timeline-dot" /><div><strong>{item.status || 'Complaint updated'}</strong><p>{item.note || ''}</p><small>{formatDate(item.date || item.createdAt)}</small></div></div>)}</div> : <p className="muted-copy">No updates have been recorded.</p>}</section>
    </div><aside className="details-aside"><form className="panel timeline-panel admin-update-form" onSubmit={saveUpdates}><h2>Manage complaint</h2><p className="muted-copy">Updates are recorded in the history and shared with the person who submitted this report.</p>
        <label className="field"><span>Status</span><select value={values.status} onChange={(event) => setValues({ ...values, status: event.target.value })}>{complaintStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="field"><span>Priority</span><select value={values.priority} onChange={(event) => setValues({ ...values, priority: event.target.value })}>{complaintPriorities.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="field"><span>Assign department</span><select value={values.departmentId} onChange={(event) => setValues({ ...values, departmentId: event.target.value })}><option value="">Unassigned</option>{departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="field"><span>Due date</span><input type="date" value={values.dueDate} onChange={(event) => setValues({ ...values, dueDate: event.target.value })} /><small>Open complaints past this date appear in the overdue queue.</small></label>
        <label className="field"><span>Resolution / admin notes</span><textarea rows="4" maxLength="2000" placeholder="Add an update or explain how this was resolved…" value={values.adminResponse} onChange={(event) => setValues({ ...values, adminResponse: event.target.value })} /></label>
        <button className="button button-primary button-full" disabled={busy}>{busy ? 'Saving…' : 'Save updates'}</button>
      </form>
      {(complaint.adminResponse || complaint.response) && <section className="panel response-panel"><div><h2>Team response</h2><p>{complaint.adminResponse || complaint.response}</p></div></section>}
    </aside></div>
  </>
}

export function Departments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [values, setValues] = useState({ name: '', description: '' })
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  useEffect(() => {
    api.get('/departments').then((response) => setDepartments(asArray(unwrap(response), ['departments', 'items'])))
      .catch((requestError) => setError(getErrorMessage(requestError, 'Could not load departments.')))
      .finally(() => setLoading(false))
  }, [])
  async function saveDepartment(event) {
    event.preventDefault()
    setError(''); setNotice('')
    if (!values.name.trim()) return setError('Department name is required.')
    setBusy(true)
    try {
      const response = editing
        ? await api.put(`/departments/${encodeURIComponent(editing._id ?? editing.id)}`, { name: values.name.trim(), description: values.description.trim() })
        : await api.post('/departments', { name: values.name.trim(), description: values.description.trim() })
      const payload = unwrap(response)
      const result = payload?.department ?? payload
      if (editing) setDepartments((items) => items.map((item) => String(item._id ?? item.id) === String(editing._id ?? editing.id) ? { ...item, ...result } : item))
      else setDepartments((items) => [...items, result])
      setValues({ name: '', description: '' }); setEditing(null); setNotice(editing ? 'Department updated.' : 'Department created.')
    } catch (requestError) { setError(getErrorMessage(requestError, 'Could not save department.')) }
    finally { setBusy(false) }
  }
  function startEdit(item) { setEditing(item); setValues({ name: item.name || '', description: item.description || '' }); setNotice('') }
  async function removeDepartment(item) {
    const id = item._id ?? item.id
    if (!window.confirm(`Delete "${item.name}"?`)) return
    setError(''); setNotice('')
    try { await api.delete(`/departments/${encodeURIComponent(id)}`); setDepartments((items) => items.filter((entry) => String(entry._id ?? entry.id) !== String(id))); setNotice('Department deleted.') }
    catch (requestError) { setError(getErrorMessage(requestError, 'Could not delete department.')) }
  }
  const filtered = departments.filter((item) => `${item.name || ''} ${item.description || ''}`.toLowerCase().includes(query.toLowerCase()))
  return <>
    <PageHeader eyebrow="ORGANIZATION" title="Departments" description="Organize the teams responsible for resolving community issues." />
    <Notice>{error}</Notice><Notice type="success">{notice}</Notice>
    <div className="management-grid"><section className="panel department-form-panel"><div className="panel-heading"><div><h2>{editing ? 'Edit department' : 'Add a department'}</h2><p>{editing ? 'Update the department details.' : 'Create a team for handling incoming issues.'}</p></div>{editing && <button className="icon-button" aria-label="Cancel edit" onClick={() => { setEditing(null); setValues({ name: '', description: '' }) }}><X size={17} /></button>}</div>
      <form className="form-stack" onSubmit={saveDepartment}><label className="field"><span>Department name <b>*</b></span><input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} placeholder="e.g. Public Works" /></label><label className="field"><span>Description</span><textarea rows="3" value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} placeholder="What does this team handle?" /></label><button className="button button-primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : <><Plus size={16} /> Create department</>}</button></form>
    </section>
    <section className="panel departments-list"><div className="panel-heading"><div><h2>All departments <span className="count-pill">{departments.length}</span></h2><p>Teams available to your organization</p></div></div><label className="search-field"><span className="sr-only">Search departments</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search departments" /><Search size={16} /></label>
      {loading ? <Loading /> : filtered.length ? <div className="department-items">{filtered.map((item, index) => <article className="department-item" key={item._id || item.id || index}><span className="department-mark"><Building2 size={18} /></span><div><strong>{item.name || 'Department'}</strong><p>{item.description || 'No description provided.'}</p></div><button className="subtle-button" onClick={() => startEdit(item)}>Edit</button><button className="icon-button danger-icon" aria-label={`Delete ${item.name}`} onClick={() => removeDepartment(item)}><Trash2 size={16} /></button></article>)}</div> : <EmptyState title="No departments found">Add a department to begin organizing your teams.</EmptyState>}
    </section></div>
  </>
}

export function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  useEffect(() => {
    api.get('/admin/users').then((response) => setUsers(asArray(unwrap(response), ['users', 'items'])))
      .catch((requestError) => setError(getErrorMessage(requestError, 'Could not load users.')))
      .finally(() => setLoading(false))
  }, [])
  async function toggleUser(item) {
    const id = item._id ?? item.id
    const isActive = item.isActive ?? item.active ?? String(item.status || 'active').toLowerCase() === 'active'
    const next = !isActive
    setError('')
    try {
      const response = await api.patch(`/admin/users/${encodeURIComponent(id)}/status`, { status: next ? 'active' : 'inactive', isActive: next, active: next })
      const payload = unwrap(response)
      const updated = payload?.user ?? payload
      setUsers((items) => items.map((user) => String(user._id ?? user.id) === String(id) ? { ...user, ...updated, isActive: updated?.isActive ?? updated?.active ?? next, status: updated?.status ?? (next ? 'active' : 'inactive') } : user))
    } catch (requestError) { setError(getErrorMessage(requestError, 'Could not update user status.')) }
  }
  const filtered = users.filter((item) => `${item.name || ''} ${item.email || ''} ${item.role || ''}`.toLowerCase().includes(query.toLowerCase()))
  return <>
    <PageHeader eyebrow="ACCOUNT MANAGEMENT" title="Users" description="View accounts and manage access to ResolveIt." />
    <Notice>{error}</Notice><section className="panel list-panel"><div className="filter-toolbar"><label className="search-field"><span className="sr-only">Search users</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email, or role" /><Search size={17} /></label><span className="count-caption">{users.length} accounts</span></div>
      {loading ? <Loading /> : filtered.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Status</th><th>Account access</th></tr></thead><tbody>{filtered.map((item, index) => {
        const active = item.isActive ?? item.active ?? String(item.status || 'active').toLowerCase() === 'active'
        return <tr key={item._id || item.id || index}><td><div className="user-cell"><span className="avatar avatar-small">{(item.name || item.email || 'U').slice(0, 1).toUpperCase()}</span><div><strong>{item.name || 'Unnamed user'}</strong><small>{item.email || '—'}</small></div></div></td><td><span className="role-pill">{String(item.role || 'User')}</span></td><td>{formatDate(item.createdAt || item.joinedAt)}</td><td><span className={`account-state ${active ? 'account-active' : 'account-inactive'}`}><i />{active ? 'Active' : 'Inactive'}</span></td><td><button className={`subtle-button ${active ? 'subtle-danger' : ''}`} onClick={() => toggleUser(item)}>{active ? 'Deactivate' : 'Activate'}</button></td></tr>
      })}</tbody></table></div> : <EmptyState title="No users found">Try a different search.</EmptyState>}
    </section>
  </>
}

export function AdminReports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    api.get('/admin/reports').then((response) => setData(unwrap(response)))
      .catch((requestError) => setError(getErrorMessage(requestError, 'Could not load reports.')))
      .finally(() => setLoading(false))
  }, [])
  const stats = data?.stats ?? data?.statistics ?? data ?? {}
  const byCategory = breakdownItems(data?.byCategory ?? data?.categories ?? stats?.byCategory, 'category')
  const byStatus = breakdownItems(data?.byStatus ?? data?.statuses ?? stats?.byStatus, 'status')
  const total = firstValue(stats, ['totalComplaints', 'total', 'complaintsCount'])
  const maxCategory = Math.max(1, ...byCategory.map((item) => Number(item.count ?? item.total ?? item.value ?? 0)))
  const maxStatus = Math.max(1, ...byStatus.map((item) => Number(item.count ?? item.total ?? item.value ?? 0)))
  return <>
    <PageHeader eyebrow="INSIGHTS & TRENDS" title="Reports" description="A summary of complaint activity across your organization." />
    <Notice>{error}</Notice>
    {loading ? <Loading label="Loading report statistics…" /> : <>
      <div className="stats-grid report-stats"><StatCard label="Total complaints" value={total} icon={ClipboardList} tone="blue" /><StatCard label="Pending" value={firstValue(stats, ['pendingComplaints', 'pending'])} icon={CircleAlert} tone="amber" /><StatCard label="In progress" value={firstValue(stats, ['inProgressComplaints', 'inProgress']) + firstValue(stats, ['underReview'])} icon={Clock3} tone="violet" /><StatCard label="Resolved" value={firstValue(stats, ['resolvedComplaints', 'resolved'])} icon={CheckCircle2} tone="green" /></div>
      <div className="reports-grid">
        <section className="panel report-panel"><div className="panel-heading"><div><h2>Complaints by category</h2><p>Distribution of incoming issues</p></div><span className="report-icon"><BarChart3 size={18} /></span></div>
          {byCategory.length ? <div className="report-bars">{byCategory.map((item, index) => { const count = Number(item.count ?? item.total ?? item.value ?? 0); return <div className="report-bar-row" key={item.category || item.name || index}><div><span>{item.category || item.name || 'Other'}</span><b>{count}</b></div><div className="chart-track"><i style={{ width: `${Math.max(count / maxCategory * 100, count ? 5 : 0)}%` }} /></div></div> })}</div> : <ReportSummary data={data} type="category" />}
        </section>
        <section className="panel report-panel"><div className="panel-heading"><div><h2>Status breakdown</h2><p>Current stage of each complaint</p></div><span className="report-icon report-icon-green"><ArrowDownRight size={18} /></span></div>
          {byStatus.length ? <div className="report-bars">{byStatus.map((item, index) => { const count = Number(item.count ?? item.total ?? item.value ?? 0); return <div className="report-bar-row" key={item.status || item.name || index}><div><span>{item.status || item.name || 'Unknown'}</span><b>{count}</b></div><div className="chart-track"><i className="chart-resolved" style={{ width: `${Math.max(count / maxStatus * 100, count ? 5 : 0)}%` }} /></div></div> })}</div> : <ReportSummary data={data} type="status" />}
        </section>
      </div>
      {data?.generatedAt && <p className="report-footnote">Report generated {formatDate(data.generatedAt)}</p>}
    </>}
  </>
}

function ReportSummary({ data, type }) {
  const entries = Object.entries(type === 'category' ? (data?.categoryStats ?? data?.categories ?? {}) : (data?.statusStats ?? data?.statuses ?? {}))
    .filter(([, value]) => Number.isFinite(Number(value)))
  return entries.length ? <div className="report-bars">{entries.map(([label, value]) => <div className="report-bar-row" key={label}><div><span>{label}</span><b>{value}</b></div><div className="chart-track"><i style={{ width: `${Math.max(Number(value) ? 5 : 0, 0)}%` }} /></div></div>)}</div> : <EmptyState title="No breakdown available">The report endpoint hasn’t returned {type} breakdown data yet.</EmptyState>
}
