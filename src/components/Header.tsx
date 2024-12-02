import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark border-bottom border-secondary">
      <div className="container-fluid">
        {/* Logo/Brand Section */}
        <NavLink className="navbar-brand d-flex flex-column me-4 p-1 mt-2 ms-2" to="/">
          <span className="fs-3 fw-bold lh-1">Youtube</span>
          <span className="fs-3 fw-bold">Sequencer</span>
        </NavLink>

        {/* Mobile Hamburger Button */}
        <button className="navbar-toggler me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ps-3">
            {/* Sequencer Link */}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/"
              >
                Sequencer
              </NavLink>
            </li>
            
            {/* About Link */}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/about"
              >
                How To Use / About
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
