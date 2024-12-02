import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '../store/store';
import { auth } from '../firebase/firebase';
import './Header.css'

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark border-bottom border-secondary border-3">
      <div className="container-fluid">
        {/* Logo/Brand Section */}
        <NavLink className="navbar-brand d-flex flex-column me-4 p-1 mt-3 mt-md-2 ms-2" to="/">
          <span className="fs-3 fw-bold lh-1">Youtube</span>
          <span className="fs-3 fw-bold">Sequencer</span>
        </NavLink>

        {/* Mobile Hamburger Button */}
        <button className="navbar-toggler me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Main Navigation */}
          <ul className="navbar-nav ps-3">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/"
              >
                Sequencer
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/about"
              >
                How To Use / About
              </NavLink>
            </li>
          </ul>

          {/* Auth Section - Right-aligned on desktop, in menu on mobile */}
          <div className="d-md-flex ms-md-auto ms-3 me-2 mb-3 mb-md-0 ps-md-4 mt-3 mt-md-0 auth-section">



            {user ? (
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 mt-2 mt-md-0">
                <div className="d-flex align-items-center">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="rounded-circle me-2"
                      style={{ width: '32px', height: '32px' }}
                    />
                  )}
                  <span className="text-light me-2">{user.displayName}</span>
                </div>
                <button
                  className="btn btn-outline-light"
                  onClick={() => auth.signOut()}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="btn btn-outline-light mt-2 mt-md-0">
                Sign In
              </NavLink>
            )}
          </div>
        </div>


      </div>
    </nav>
  );
}
