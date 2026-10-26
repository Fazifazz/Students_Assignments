import { useEffect, useMemo, useState } from 'react'
import { CustomersPage } from './components/CustomersPage'
import { DashboardPage } from './components/DashboardPage'
import { InvoiceForm } from './components/InvoiceForm'
import { InvoiceTable } from './components/InvoiceTable'
import { LoginPage } from './components/LoginPage'
import { ProfileEditForm } from './components/ProfileEditForm'
import { ReportsPage } from './components/ReportsPage'
import { SummaryCards } from './components/SummaryCards'
import { ThemeToggle } from './components/ThemeToggle'
import {
  clearProfileStorageError,
  logout,
  updateProfile,
} from './features/auth/authSlice'
import { clearStorageError, deleteInvoice, getEffectiveInvoiceStatus, setInvoiceStatus, updateCustomer } from './features/invoices/invoiceSlice'
import { useInvoicePersistence } from './hooks/useInvoicePersistence'
import { useProfilePersistence } from './hooks/useProfilePersistence'
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks'
import type { InvoiceStatus } from './features/invoices/invoiceSlice'

type Filter = 'All invoices' | InvoiceStatus
type Page = 'dashboard' | 'invoices' | 'customers' | 'reports'
type ThemeState = { mode: 'light' | 'dark'; error: string | null }

const themeStorageKey = 'ledgerly.theme.v1'

function readTheme(): ThemeState {
  try {
    const savedTheme = window.localStorage.getItem(themeStorageKey)
    return { mode: savedTheme === 'dark' ? 'dark' : 'light', error: null }
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Browser storage is unavailable.'
    return { mode: 'light', error: `Could not read your theme preference. ${detail}` }
  }
}

const filters: Filter[] = ['All invoices', 'Draft', 'Sent', 'Paid', 'Overdue']
const pageTitles: Record<Page, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'A quick look at your billing activity.' },
  invoices: { title: 'Invoices', description: 'Manage and track all your customer invoices.' },
  customers: { title: 'Customers', description: 'See customer billing history across your invoices.' },
  reports: { title: 'Reports', description: 'Understand invoice volume and payment progress.' },
}

export default function App() {
  useInvoicePersistence()
  useProfilePersistence()
  const dispatch = useAppDispatch()
  const { isAuthenticated, username, displayName, email, profileImage, profileStorageError } = useAppSelector((state) => state.auth)
  const invoices = useAppSelector((state) => state.invoices.items)
  const storageError = useAppSelector((state) => state.invoices.storageError)
  const [filter, setFilter] = useState<Filter>('All invoices')
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null)
  const [themeState, setThemeState] = useState(readTheme)
  const isDark = themeState.mode === 'dark'
  const [page, setPage] = useState<Page>(() => {
    const requestedPage = window.location.hash.slice(1)
    return Object.hasOwn(pageTitles, requestedPage) ? requestedPage as Page : 'dashboard'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const requestedPage = window.location.hash.slice(1)
      setPage(Object.hasOwn(pageTitles, requestedPage) ? requestedPage as Page : 'dashboard')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(themeStorageKey, themeState.mode)
      setThemeState((current) => current.error ? { ...current, error: null } : current)
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Browser storage is unavailable.'
      setThemeState((current) => ({ ...current, error: `Could not save your theme preference. ${detail}` }))
    }
  }, [themeState.mode])

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase()
    return invoices.filter((invoice) => {
      const matchesFilter = filter === 'All invoices' || getEffectiveInvoiceStatus(invoice) === filter
      const matchesSearch =
        query.length === 0 ||
        invoice.customerName.toLowerCase().includes(query) ||
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.customerEmail.toLowerCase().includes(query)
      return matchesFilter && matchesSearch
    })
  }, [filter, invoices, search])
  const editingInvoice = invoices.find((invoice) => invoice.id === editingInvoiceId)
  const accountName = displayName || (username ? username.charAt(0).toUpperCase() + username.slice(1) : 'User')

  if (!isAuthenticated) {
    return (
      <div data-theme={themeState.mode}>
        <LoginPage
          isDark={isDark}
          onToggleTheme={() => setThemeState((current) => ({
            mode: current.mode === 'dark' ? 'light' : 'dark',
            error: current.error,
          }))}
          themeStorageError={themeState.error}
        />
      </div>
    )
  }

  return (
    <div className="app-layout" data-theme={themeState.mode}>
      <aside className="sidebar">
        <a className="brand" href="#dashboard" aria-label="Ledgerly dashboard">
          <span className="brand-symbol">L</span>
          <span>ledgerly<span className="brand-dot">.</span></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-card">
          <span className="workspace-avatar">S</span>
          <span className="workspace-name">Studio North<small>Free plan</small></span>
          <span className="workspace-chevron">⌄</span>
        </div>

        <div className="nav-label">MENU</div>
        <nav className="main-nav" aria-label="Main navigation">
          <a className={`nav-item${page === 'dashboard' ? ' active' : ''}`} href="#dashboard" aria-current={page === 'dashboard' ? 'page' : undefined}><span className="nav-icon">▦</span> Dashboard</a>
          <a className={`nav-item${page === 'invoices' ? ' active' : ''}`} href="#invoices" aria-current={page === 'invoices' ? 'page' : undefined}><span className="nav-icon">▤</span> Invoices <span className="nav-count">{invoices.length}</span></a>
          <a className={`nav-item${page === 'customers' ? ' active' : ''}`} href="#customers" aria-current={page === 'customers' ? 'page' : undefined}><span className="nav-icon">♙</span> Customers</a>
          <a className={`nav-item${page === 'reports' ? ' active' : ''}`} href="#reports" aria-current={page === 'reports' ? 'page' : undefined}><span className="nav-icon">▥</span> Reports</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">?</span>
            <div><strong>Need a hand?</strong><span>Help center & support</span></div>
            <span className="help-arrow">↗</span>
          </div>
          <div className="profile">
            <span className="profile-avatar">
              {profileImage ? <img src={profileImage} alt="" /> : accountName.charAt(0).toUpperCase()}
            </span>
            <span className="profile-name">{accountName}<small>{email || 'Signed in'}</small></span>
            <button className="profile-action" aria-label="Edit profile" title="Edit profile" onClick={() => setIsEditingProfile(true)}>Edit</button>
            <button className="profile-menu" aria-label="Sign out" title="Sign out" onClick={() => dispatch(logout())}>↪</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{pageTitles[page].title}</strong></div>
          <div className="topbar-actions">
            <span className="local-badge"><i /> Local demo</span>
            <ThemeToggle
              isDark={isDark}
              onToggle={() => setThemeState((current) => ({
                mode: current.mode === 'dark' ? 'light' : 'dark',
                error: current.error,
              }))}
            />
            <button className="icon-button" aria-label="Notifications">♧<i /></button>
            <button className="top-avatar profile-avatar-button" aria-label="Edit profile" title="Edit profile" onClick={() => setIsEditingProfile(true)}>
              {profileImage ? <img src={profileImage} alt="" /> : accountName.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        <div className="content-wrap">
          <section className="welcome-row">
            <div>
              <div className="date-label">{new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(new Date())}</div>
              <h1>{page === 'dashboard' ? <>Good morning, {accountName} <span className="wave">✳</span></> : pageTitles[page].title}</h1>
              <p>{page === 'dashboard' ? 'Here’s what’s happening with your business today.' : pageTitles[page].description}</p>
            </div>
            {page !== 'reports' && <button className="primary-button" onClick={() => setIsCreating(true)}><span>＋</span> Create invoice</button>}
          </section>

          {storageError && (
            <div className="storage-warning" role="alert">
              <span>{storageError}</span>
              <button onClick={() => dispatch(clearStorageError())} aria-label="Dismiss storage warning">×</button>
            </div>
          )}
          {profileStorageError && (
            <div className="storage-warning" role="alert">
              <span>{profileStorageError}</span>
              <button onClick={() => dispatch(clearProfileStorageError())} aria-label="Dismiss profile storage warning">×</button>
            </div>
          )}
          {themeState.error && (
            <div className="storage-warning" role="alert">
              <span>{themeState.error}</span>
            </div>
          )}

          {page === 'dashboard' && (
            <>
              <SummaryCards invoices={invoices} />
              <DashboardPage
                invoices={invoices}
                onCreate={() => setIsCreating(true)}
                onOpenInvoices={() => { window.location.hash = 'invoices' }}
                onMarkPaid={(id) => dispatch(setInvoiceStatus({ id, status: 'Paid' }))}
                onMarkSent={(id) => dispatch(setInvoiceStatus({ id, status: 'Sent' }))}
                onEdit={(invoice) => setEditingInvoiceId(invoice.id)}
                onDelete={(id) => dispatch(deleteInvoice(id))}
              />
            </>
          )}

          {page === 'invoices' && (
            <>
              <SummaryCards invoices={invoices} />
              <section className="invoice-section" aria-labelledby="invoice-heading">
                <div className="section-heading">
                  <div><h2 id="invoice-heading">Your invoices</h2><p>Manage and track all your customer invoices.</p></div>
                  <button className="secondary-button export-button" onClick={() => window.print()}><span>⎙</span> Print report</button>
                </div>
                <div className="table-toolbar">
                  <div className="filter-tabs" role="tablist" aria-label="Filter invoices">
                    {filters.map((item) => (
                      <button key={item} className={`filter-tab${filter === item ? ' selected' : ''}`} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>
                        {item}{item === 'All invoices' && <span>{invoices.length}</span>}
                      </button>
                    ))}
                  </div>
                  <label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search invoices..." aria-label="Search invoices" /><kbd>⌘ K</kbd></label>
                </div>
                <InvoiceTable
                  invoices={filteredInvoices}
                  onMarkPaid={(id) => dispatch(setInvoiceStatus({ id, status: 'Paid' }))}
                  onMarkSent={(id) => dispatch(setInvoiceStatus({ id, status: 'Sent' }))}
                  onEdit={(invoice) => setEditingInvoiceId(invoice.id)}
                  onDelete={(id) => dispatch(deleteInvoice(id))}
                  onCreate={() => setIsCreating(true)}
                />
                <div className="table-footer"><span>Showing <strong>{filteredInvoices.length}</strong> of <strong>{invoices.length}</strong> invoices</span><span>Stored in this browser</span></div>
              </section>
            </>
          )}

          {page === 'customers' && (
            <CustomersPage
              invoices={invoices}
              onCreate={() => setIsCreating(true)}
              onUpdateCustomer={(customerKey, name, email) =>
                dispatch(updateCustomer({ customerKey, name, email }))
              }
            />
          )}
          {page === 'reports' && <ReportsPage invoices={invoices} />}

          <footer className="footer"><span>© {new Date().getFullYear()} Ledgerly</span><span>Billing, made a little simpler.</span></footer>
        </div>
      </main>

      {isCreating && <InvoiceForm onClose={() => setIsCreating(false)} />}
      {editingInvoice && (
        <InvoiceForm
          key={editingInvoice.id}
          invoice={editingInvoice}
          onClose={() => setEditingInvoiceId(null)}
        />
      )}
      {isEditingProfile && (
        <ProfileEditForm
          displayName={displayName}
          email={email}
          profileImage={profileImage}
          onClose={() => setIsEditingProfile(false)}
          onSave={(nextName, nextEmail, nextImage) => {
            dispatch(updateProfile({ displayName: nextName, email: nextEmail, profileImage: nextImage }))
            setIsEditingProfile(false)
          }}
        />
      )}
    </div>
  )
}
