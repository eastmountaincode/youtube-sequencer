import { useQuery } from '@apollo/client';
import { GET_PATTERNS } from '../../graphql/queries';
import UploadPattern from './UploadPattern';
import DownloadPattern from './DownloadPattern';

interface Pattern {
  id: number;
  name: string;
  description: string;
  s3_url: string;
  creator_id: string;
  created_at: string;
  likes_count: number;
}

// Update the interface
interface PatternsResponse {
  patterns: {
    patterns: Pattern[];
    totalCount: number;
  }
}

const SharePatterns = () => {
  const { loading, error, data } = useQuery<PatternsResponse>(GET_PATTERNS, {
    variables: {
      limit: 10,
      offset: 0,
      orderBy: "created_at DESC"
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
      <UploadPattern/>
      <div className="row">
        {data?.patterns.patterns.map(pattern => (
          <div key={pattern.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{pattern.name}</h5>
                <p className="card-text">{pattern.description}</p>
                <p className="card-text">Likes: {pattern.likes_count}</p>
                <p className="card-text">Created on: {new Date(parseInt(pattern.created_at)).toLocaleDateString()}</p>
                <DownloadPattern s3_url={pattern.s3_url} />

              </div>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
};

export default SharePatterns;

