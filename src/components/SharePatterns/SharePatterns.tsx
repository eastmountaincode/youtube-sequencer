import { useQuery } from '@apollo/client';
import { GET_PATTERNS } from '../../graphql/queries';
import UploadPattern from './UploadPattern';
import PatternCard from './PatternCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Pattern } from '../../types';
import { useState } from 'react';
import PaginationControls from './PaginationControls';
import OrderBySelect from './OrderBySelect';

interface PatternResponse {
  patternResponse: {
    patterns: Pattern[];
    totalCount: number;
  }
}

const SharePatterns = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { orderBy, itemsPerPage } = useSelector((state: RootState) => state.patternsDisplay);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const { loading, error, data } = useQuery<PatternResponse>(GET_PATTERNS, {
    variables: {
      limit: itemsPerPage,
      offset: currentPage * itemsPerPage,
      orderBy: orderBy,
      userId: user?.uid || null
    },
    onError: (error) => {
      console.log('GraphQL Error:', error);
    },
    onCompleted: (data) => {
      console.log('GraphQL Response:', data);
    }
  });

  const totalPages = Math.ceil((data?.patternResponse.totalCount || 0) / itemsPerPage);

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

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Share Patterns</h2>
      <UploadPattern />
      <OrderBySelect />
      <div className="row">
        {data?.patternResponse.patterns.map(pattern => (
          <PatternCard key={pattern.id} pattern={pattern} />
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

