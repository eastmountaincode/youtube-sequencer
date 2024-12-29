import React, { useState } from 'react';
import DownloadPattern from './DownloadPattern';
import LikeFunction from './LikeFunction';
import { Pattern } from '../../types';

interface PatternCardProps {
  pattern: Pattern;
}

const PatternCard: React.FC<PatternCardProps> = ({ pattern }) => {
  const [likesCount, setLikesCount] = useState(pattern.likes_count);

  return (
    <div className="col-md-4 mb-4">
      <div className="card bg-dark text-light border-primary h-100"> 
        <div className="card-body p-0 d-flex flex-column"> 
          <div className='p-4 flex-grow-1 d-flex flex-column'> 
            {/* Title and description*/}
            <div>
              <h5 className="card-title fw-bold mb-3">{pattern.name}</h5>
              <p className="card-text text-light mb-3 opacity-75">{pattern.description}</p>
            </div>

            {/* Stats pushed to bottom of content area */}
            <div className="mt-auto"> 
              <div className="mb-2">
                <small className="text-light opacity-75">
                  <i className="bi bi-person-fill me-1"></i> {pattern.creator_display_name}
                </small>
              </div>
              <div className="d-flex justify-content-between">
                <small className="text-light opacity-75">
                  <i className="bi bi-heart-fill me-1"></i> {likesCount} likes
                </small>
                <small className="text-light opacity-75">
                  <i className="bi bi-calendar me-1"></i>
                  {new Date(parseInt(pattern.created_at)).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>

          <div className="mt-auto d-flex">
            <div className="w-50">
              <DownloadPattern s3_url={pattern.s3_url} />
            </div>
            <div className="w-50">
              <LikeFunction
                patternId={pattern.id}
                isLiked={pattern.liked_by_user}
                onLikeUpdate={setLikesCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternCard;
