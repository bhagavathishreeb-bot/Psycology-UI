import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="app-header">
      <NavLink to="/" className="header-logo">
        <div className="header-logo-icon">
          <img src="/ManoTaranga.jpeg" alt="ManoTaranga" />
        </div>
        <span className="header-brand-name">ManoTaranga</span>
      </NavLink>
      <nav className="header-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Home
        </NavLink>
        <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Courses
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Shop
        </NavLink>
        <NavLink to="/careers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Careers
        </NavLink>
      </nav>
    </header>
  )
}
