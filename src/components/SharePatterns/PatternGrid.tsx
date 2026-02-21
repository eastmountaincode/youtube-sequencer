import { Pattern } from '../../types';
import PatternCard from './PatternCard';
import OrderBySelect from './OrderBySelect';
import PaginationControls from './PaginationControls';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { PatternGridProps } from '../../types';
import { usePatterns } from '../../hooks/usePatterns';

const PatternGrid = ({ title, queryType, userId, isActive }: PatternGridProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const { orderBy, itemsPerPage } = useSelector((state: RootState) => state.patternsDisplay);

    const { loading, error, data, refetch } = usePatterns(
        queryType,
        itemsPerPage,
        currentPage * itemsPerPage,
        orderBy,
        userId
    );

    const totalPages = Math.ceil((data?.totalCount || 0) / itemsPerPage);

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
                    Error loading patterns: {error}
                </div>
            ) : (
                <>
                    <div className="row">
                        {(data?.patterns || []).map((pattern: Pattern) => (
                            <PatternCard key={pattern.id} pattern={pattern} onMutate={refetch} />
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
