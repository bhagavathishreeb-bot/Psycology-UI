import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="app-header">
      <NavLink to="/" className="header-logo">
        <div className="header-logo-icon">
          <img src="/ManoTaranga.jpeg" alt="KannadaMentalHealth" />
        </div>
        <span className="header-brand-name">KannadaMentalHealth</span>
      </NavLink>
      <nav className="header-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Home
        </NavLink>
        <span className="nav-link nav-link-coming-soon" aria-disabled="true">
          <span className="coming-soon-badge">Coming Soon</span>
          Courses
        </span>
        <span className="nav-link nav-link-coming-soon" aria-disabled="true">
          <span className="coming-soon-badge">Coming Soon</span>
          Shop
        </span>
        <NavLink to="/careers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Careers
        </NavLink>
      </nav>
    </header>
  )
}
