import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Navigate } from 'react-router-dom';

const AccountPage = () => {
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
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <button
                                className="nav-link active text-light bg-dark"
                                data-bs-toggle="tab"
                                data-bs-target="#my-patterns"
                            >
                                My Patterns
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className="nav-link text-light bg-dark"
                                data-bs-toggle="tab"
                                data-bs-target="#liked-patterns"
                            >
                                Liked Patterns
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body">
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="my-patterns">
                            <h3>My Patterns</h3>
                            {/* Pattern grid will go here */}
                        </div>
                        <div className="tab-pane fade" id="liked-patterns">
                            <h3>Liked Patterns</h3>
                            {/* Liked patterns grid will go here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;

