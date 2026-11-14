import { ArrowDown, ArrowRight, Check, ChevronRight, ClipboardCheck, Clock3, Eye, ShieldCheck, Sparkles, Waves, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()

const steps = [
  { number: '01', title: 'Tell us what’s wrong', text: 'Share the details, add a location, and choose the right category.' },
  { number: '02', title: 'We get it to the right team', text: 'Your complaint is routed for review and given a unique tracking ID.' },
  { number: '03', title: 'Follow every update', text: 'Check progress, talk with the team, and know when it’s resolved.' },
]
const features = [
  { icon: Eye, title: 'Always in the loop', text: 'See status changes and responses in one clear timeline.' },
  { icon: ShieldCheck, title: 'A record you can trust', text: 'Every issue has a traceable ID and a complete activity history.' },
  { icon: Clock3, title: 'Less waiting, more action', text: 'The right people get the information they need to make progress.' },
]
const categories = [
  { icon: Zap, label: 'Electricity', color: 'sun' },
  { icon: Waves, label: 'Water supply', color: 'water' },
  { icon: Sparkles, label: 'Cleanliness', color: 'mint' },
  { icon: ClipboardCheck, label: 'Facilities', color: 'violet' },
]

export default function Home() {
  return (
    <div className="landing">
      <header className="landing-nav wrap">
        <Link to="/" className="brand landing-brand"><span className="brand-mark"><ShieldCheck size={20} /></span><span>resolve<span className="brand-accent">it</span><small>ISSUE TRACKING</small></span></Link>
        <nav><a href="#how-it-works">How it works</a><a href="#features">Why ResolveIt</a><Link to="/login" className="nav-login">Log in</Link><Link to="/register" className="button button-primary button-small">Get started <ArrowRight size={15} /></Link></nav>
      </header>
      <main>
        <section className="hero-section wrap">
          <div className="hero-copy"><span className="hero-kicker"><span className="live-dot" /> A better way to be heard</span>
            <h1>Your Issues Deserve Attention. <em>We Make Sure They Get Resolved.</em></h1>
            <p>One place to report, track, and resolve the issues that affect your community. No more wondering what happened next.</p>
            <div className="hero-actions"><Link to="/register" className="button button-primary">Get started <ArrowRight size={17} /></Link><Link to="/login" className="button button-quiet">Log in <ChevronRight size={16} /></Link></div>
            <div className="hero-assurance"><span><Check size={14} /> Easy to report</span><span><Check size={14} /> Track every update</span></div>
          </div>
          <div className="hero-visual" aria-label="Illustration of a complaint being resolved">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="visual-sun">R</div>
            <div className="floating-card issue-card"><span className="mini-icon mini-blue"><ClipboardCheck size={17} /></span><div><strong>Streetlight not working</strong><small>Infrastructure · #RI-2048</small></div><span className="mini-pulse" /></div>
            <div className="visual-path"><span /><span /><span /><span /></div>
            <div className="floating-card resolved-card"><span className="resolved-check"><Check size={17} /></span><div><strong>Issue resolved</strong><small>Just now · Team updated</small></div></div>
            <div className="hero-caption">From reported <ArrowDown size={13} /> to resolved</div>
          </div>
          <a className="scroll-cue" href="#how-it-works"><span>Scroll to explore</span><ArrowDown size={14} /></a>
        </section>
        <section id="how-it-works" className="section section-soft"><div className="wrap">
          <div className="section-heading"><span className="eyebrow">HOW IT WORKS</span><h2>Small steps. Real progress.</h2><p>Getting help shouldn’t be hard. We make sure your voice gets from report to resolution.</p></div>
          <div className="steps-grid">{steps.map((step) => <article className="step-card" key={step.number}><span className="step-number">{step.number}</span><div className="step-line" /><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
        </div></section>
        <section id="features" className="section"><div className="wrap feature-layout">
          <div className="section-heading feature-heading"><span className="eyebrow">BUILT AROUND YOU</span><h2>Clarity at every step.</h2><p>ResolveIt keeps your report organized and your next step clear, from the first note to the final update.</p><Link to="/register" className="text-link">Make your first report <ArrowRight size={16} /></Link></div>
          <div className="feature-list">{features.map(({ icon: Icon, title, text }) => <article key={title} className="feature-item"><span className="feature-icon"><Icon size={20} /></span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </div></section>
        <section className="section category-section"><div className="wrap">
          <div className="section-heading"><span className="eyebrow">ISSUES THAT MATTER</span><h2>Everyday issues, taken seriously.</h2><p>From shared spaces to essential services, let us know what needs attention.</p></div>
          <div className="category-grid">{categories.map(({ icon: Icon, label, color }) => <div className="category-card" key={label}><span className={`category-icon ${color}`}><Icon size={20} /></span><strong>{label}</strong><ArrowRight size={15} /></div>)}</div>
          <p className="category-note">Plus maintenance, internet, security, and more.</p>
        </div></section>
        <section className="cta-section"><div className="wrap cta-inner"><div><span className="eyebrow eyebrow-light">YOUR COMMUNITY, BETTER</span><h2>Let’s get things moving.</h2><p>Start with one report. We’ll take it from there.</p></div><Link to="/register" className="button button-white">Create your account <ArrowRight size={16} /></Link></div></section>
      </main>
      <footer className="landing-footer wrap"><Link to="/" className="brand landing-brand"><span className="brand-mark"><ShieldCheck size={18} /></span><span>resolve<span className="brand-accent">it</span></span></Link><span>© {currentYear} ResolveIt. Making every concern count.</span><div><Link to="/login">Log in</Link><Link to="/register">Get started</Link></div></footer>
    </div>
  )
}
