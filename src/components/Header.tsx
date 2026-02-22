import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '../store/store';
import { auth } from '../firebase/firebase';
import './Header.css'

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav className="header">
      <NavLink className="header-brand" to="/">
        <span className="brand-yt">YouTube</span>
        <span className="brand-seq">Sequencer</span>
      </NavLink>

      <button
        className="header-toggle"
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="toggle-bar"></span>
        <span className="toggle-bar"></span>
        <span className="toggle-bar"></span>
      </button>

      <div className={`header-nav ${isExpanded ? 'expanded' : ''}`}>
        <NavLink
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          to="/"
          onClick={() => setIsExpanded(false)}
        >
          Sequencer
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          to="/share"
          onClick={() => setIsExpanded(false)}
        >
          Share
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          to="/about"
          onClick={() => setIsExpanded(false)}
        >
          About
        </NavLink>

        <div className="header-auth">
          {user ? (
            <>
              <NavLink
                to="/account"
                className="auth-user"
                onClick={() => setIsExpanded(false)}
              >
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="user-avatar"
                  />
                )}
                <span className="user-name">{user.displayName}</span>
              </NavLink>
              <button
                className="auth-btn"
                onClick={() => {
                  auth.signOut();
                  setIsExpanded(false);
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="auth-btn"
              onClick={() => setIsExpanded(false)}
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
