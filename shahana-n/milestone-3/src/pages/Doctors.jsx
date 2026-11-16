import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DoctorCard from '../components/DoctorCard.jsx'

export default function Doctors({ doctors }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const specialty = searchParams.get('specialty') || ''
  const sort = searchParams.get('sort') || 'recommended'
  const specializations = [...new Set(doctors.filter((doctor) => doctor.isActive !== false).map((doctor) => doctor.specialization))]

  const visibleDoctors = useMemo(() => {
    return doctors.filter((doctor) => doctor.isActive !== false)
      .filter((doctor) =>
        doctor.name.toLowerCase().includes(query.trim().toLowerCase()) &&
        (!specialty || doctor.specialization === specialty),
      )
      .sort((a, b) => {
        if (sort === 'fee-low') return a.fee - b.fee
        if (sort === 'fee-high') return b.fee - a.fee
        if (sort === 'experience') return b.experience - a.experience
        return 0
      })
  }, [query, specialty, sort])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  function clearFilters() {
    setQuery('')
    setSearchParams({})
  }

  return (
    <main className="page-main">
      <section className="page-intro">
        <div className="container"><p className="eyebrow">YOUR CARE, YOUR CHOICE</p><h1>Find your doctor.</h1><p>Meet experienced professionals who put your wellbeing first.</p></div>
      </section>
      <section className="container doctors-page-content">
        <div className="filter-panel">
          <label className="search-field"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search doctors by name" aria-label="Search doctors by name" /></label>
          <label className="filter-select"><span>Specialty</span><select value={specialty} onChange={(event) => updateParam('specialty', event.target.value)}><option value="">All specialties</option>{specializations.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="filter-select"><span>Sort by</span><select value={sort} onChange={(event) => updateParam('sort', event.target.value)}><option value="recommended">Recommended</option><option value="fee-low">Fee: low to high</option><option value="fee-high">Fee: high to low</option><option value="experience">Most experienced</option></select></label>
          <button className="text-button clear-button" type="button" onClick={clearFilters}>Clear filters</button>
        </div>
        <div className="results-caption"><span><strong>{visibleDoctors.length}</strong> {visibleDoctors.length === 1 ? 'doctor' : 'doctors'} available</span><span>Fictional profiles for this demo</span></div>
        {visibleDoctors.length ? <div className="doctor-grid">{visibleDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}</div> : <div className="empty-state"><span className="empty-icon">⌕</span><h2>No doctors found</h2><p>Try a different name or clear your filters.</p><button className="button button-outline" type="button" onClick={clearFilters}>Clear filters</button></div>}
      </section>
      <div className="container page-back-link"><Link className="text-link" to="/">← Back home</Link></div>
    </main>
  )
}
