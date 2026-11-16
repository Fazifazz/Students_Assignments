import { Link } from 'react-router-dom'

export default function NotFound() {
  return <main className="not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>This page took a wrong turn.</h1><p>Let’s get you back to the care you’re looking for.</p><Link className="button" to="/">Back to MediBook <span aria-hidden="true">→</span></Link></main>
}
