import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_PATTERNS } from '../../graphql/queries';
import OrderBySelect from '../SharePatterns/OrderBySelect';
import PatternCard from '../SharePatterns/PatternCard';
import { Pattern } from '../../types';
import { useState } from 'react';
import PaginationControls from '../SharePatterns/PaginationControls';

interface PatternResponse {
    userPatterns: {
        patterns: Pattern[];
        totalCount: number;
    }
}

const AccountPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const user = useSelector((state: RootState) => state.auth.user);
    const { orderBy, itemsPerPage } = useSelector((state: RootState) => state.patternsDisplay);

    const { loading, error, data } = useQuery(GET_USER_PATTERNS, {
        variables: {
            userId: user?.uid || '',
            limit: itemsPerPage,
            offset: currentPage * itemsPerPage,
            orderBy: orderBy
        },
        skip: !user
    });

    const totalPages = Math.ceil((data?.userPatterns.totalCount || 0) / itemsPerPage);

    if (loading) return (
        <div className="container mt-4 text-center">
            <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="container mt-4 alert alert-danger">
            Error loading patterns: {error.message}
        </div>
    );

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
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3>My Patterns</h3>
                                <OrderBySelect />
                            </div>
                            <div className="row">
                                {data?.userPatterns.patterns.map((pattern: Pattern) => (
                                    <PatternCard key={pattern.id} pattern={pattern} />
                                ))}
                            </div>
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
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

