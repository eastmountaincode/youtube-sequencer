import UploadPattern from './UploadPattern';
import PatternCard from './PatternCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Pattern } from '../../types';
import { useState } from 'react';
import PaginationControls from './PaginationControls';
import OrderBySelect from './OrderBySelect';
import { usePatterns } from '../../hooks/usePatterns';

const SharePatterns = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { orderBy, itemsPerPage } = useSelector((state: RootState) => state.patternsDisplay);
  const user = useSelector((state: RootState) => state.auth.user);

  const { loading, error, data, refetch } = usePatterns(
    'all',
    itemsPerPage,
    currentPage * itemsPerPage,
    orderBy,
    user?.uid || null
  );

  const totalPages = Math.ceil((data?.totalCount || 0) / itemsPerPage);

  if (loading) return (
    <div className="container mt-4 text-center">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-4 alert alert-danger">
      Error loading patterns: {error}
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Share Patterns</h2>
      <UploadPattern onUploadComplete={refetch} />
      <OrderBySelect />
      <div className="row">
        {data?.patterns.map((pattern: Pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} onMutate={refetch} />
        ))}
      </div>
      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default SharePatterns;
