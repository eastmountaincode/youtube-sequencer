import React, { useState } from 'react';
import DownloadPattern from './DownloadPattern';
import LikeFunction from './LikeFunction';

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

interface PatternCardProps {
  pattern: Pattern;
}

const PatternCard: React.FC<PatternCardProps> = ({ pattern }) => {
  const [likesCount, setLikesCount] = useState(pattern.likes_count);

  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{pattern.name}</h5>
          <p className="card-text">{pattern.description}</p>
          <p className="card-text">Likes: {likesCount}</p> {/* // Use local state instead of the prop */}
          <p className="card-text">
            Created on: {new Date(parseInt(pattern.created_at)).toLocaleDateString()}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <DownloadPattern s3_url={pattern.s3_url} />
            <LikeFunction
              patternId={pattern.id}
              isLiked={pattern.liked_by_user}
              onLikeUpdate={setLikesCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternCard;
