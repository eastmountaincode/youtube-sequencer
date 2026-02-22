import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import PatternGrid from '../SharePatterns/PatternGrid';


const AccountPage = () => {
    const [activeTab, setActiveTab] = useState('my-patterns');
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container py-4 p-4">
            <h1 className="text-light mb-4">Account</h1>

            {/* User Profile Header */}
            <div className="card bg-dark text-light border-secondary mb-4 p-2">
                <div className="card-body d-flex align-items-center">
                    {user.photoURL && (
                        <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className="rounded-circle me-3 flex-shrink-0"
                            style={{ width: '64px', height: '64px' }}
                        />
                    )}
                    <div className="text-truncate">
                        <h2 className="mb-1 text-break">{user.displayName}</h2>
                        <p className="text-secondary mb-0 text-truncate">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Patterns Tabs */}
            <div className="card bg-dark text-light border-secondary p-2">
                <div className="card-header ps-4 p-3">
                <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item">
            <button
              className={`nav-link text-light bg-dark ${activeTab === 'my-patterns' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-patterns')}
            >
              My Patterns
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-light bg-dark ${activeTab === 'liked-patterns' ? 'active' : ''}`}
              onClick={() => setActiveTab('liked-patterns')}
            >
              Liked Patterns
            </button>
          </li>
        </ul>
                </div>
                <div className="card-body p-4">
                    <div className="tab-content">
                        <PatternGrid
                            title="My Patterns"
                            queryType="user"
                            userId={user.uid}
                            isActive={activeTab === 'my-patterns'}
                        />
                        <PatternGrid
                            title="Liked Patterns"
                            queryType="liked"
                            userId={user.uid}
                            isActive={activeTab === 'liked-patterns'}
                        />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AccountPage;
