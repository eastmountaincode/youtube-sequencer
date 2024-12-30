import { useQuery } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { Pattern } from '../../types';
import PatternCard from './PatternCard';
import OrderBySelect from './OrderBySelect';
import PaginationControls from './PaginationControls';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { PatternGridProps } from '../../types';

const PatternGrid = ({ title, query, userId, isActive }: PatternGridProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const { orderBy, itemsPerPage } = useSelector((state: RootState) => state.patternsDisplay);

    const { loading, error, data } = useQuery(query, {
        variables: {
            userId,
            limit: itemsPerPage,
            offset: currentPage * itemsPerPage,
            orderBy
        }
    });

    const patterns = data?.userPatterns?.patterns || data?.likedPatterns?.patterns || [];
    const totalCount = data?.userPatterns?.totalCount || data?.likedPatterns?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className={`tab-pane fade ${isActive ? 'show active' : ''}`}>
            <div className="d-flex justify-content-between mb-4">
                <h3>{title}</h3>
                <OrderBySelect />
            </div>
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger">
                    Error loading patterns: {error.message}
                </div>
            ) : (
                <>
                    <div className="row">
                        {patterns.map((pattern: Pattern) => (
                            <PatternCard key={pattern.id} pattern={pattern} />
                        ))}
                    </div>
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default PatternGrid;
