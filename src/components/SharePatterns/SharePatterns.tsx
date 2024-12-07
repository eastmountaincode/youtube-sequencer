import { useQuery } from '@apollo/client';
import { GET_PATTERNS } from '../../graphql/queries';
import UploadPattern from './UploadPattern';
import DownloadPattern from './DownloadPattern';
import PatternCard from './PatternCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface Pattern {
  id: number;
  name: string;
  description: string;
  s3_url: string;
  creator_id: string;
  created_at: string;
  likes_count: number;
  liked_by_user: boolean;
}

// Update the interface
interface PatternResponse {
  patternResponse: {
    patterns: Pattern[];
    totalCount: number;
  }
}

const SharePatterns = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const { loading, error, data } = useQuery<PatternResponse>(GET_PATTERNS, {
    variables: {
      limit: 10,
      offset: 0,
      orderBy: "created_at DESC",
      userId: user?.uid || null
    },
    onError: (error) => {
      console.log('GraphQL Error:', error);
    },
    onCompleted: (data) => {
      console.log('GraphQL Response:', data);
    }
  });

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
      <div className="row">
        {data?.patternResponse.patterns.map(pattern => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>
    </div>
  );
};

export default SharePatterns;

