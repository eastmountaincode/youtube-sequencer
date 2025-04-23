import React, { useState } from 'react';
import DownloadPattern from './DownloadPattern';
import LikeFunction from './LikeFunction';
import { Pattern } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useMutation } from '@apollo/client';
import { DELETE_PATTERN } from '../../graphql/mutations';
import { GET_PATTERNS, GET_USER_PATTERNS } from '../../graphql/queries';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { getRefetchQueries } from '../../utils/refetchQueries';
import LoadIntoSequencer from './LoadIntoSequencer';

interface PatternCardProps {
  pattern: Pattern;
}

const PatternCard: React.FC<PatternCardProps> = ({ pattern }) => {
  const [likesCount, setLikesCount] = useState(pattern.likes_count);
  const user = useSelector((state: RootState) => state.auth.user);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { orderBy, itemsPerPage } = useSelector((state: RootState) => state.patternsDisplay);

  const [deletePattern] = useMutation(DELETE_PATTERN, {
    refetchQueries: getRefetchQueries(itemsPerPage, orderBy, user?.uid)
  });

  const handleConfirmDelete = async () => {
    try {
      await deletePattern({
        variables: { patternId: pattern.id }
      });
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting pattern:', error);
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card bg-dark text-light border-primary h-100">
        <div className="card-body p-0 d-flex flex-column">
          <div className='p-4 flex-grow-1 d-flex flex-column'>
            {/* Header with title and delete button */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5 className="card-title fw-bold mb-0 me-4" style={{ wordBreak: 'break-word' }}>
                {pattern.name}
              </h5>
              {user?.uid === pattern.creator_id && (
                <button
                  className="btn btn-outline-secondary flex-shrink-0"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>

            {/* Description */}
            <p className="card-text text-light mb-3 opacity-75">
              {pattern.description}
            </p>

            {/* Pattern metadata */}
            <div className="mt-auto">
              {/* <div className="mb-2">
                <small className="text-light opacity-75">
                  <i className="bi bi-person-fill me-2"></i>
                  {pattern.creator_display_name}
                </small>
              </div> */}
              <div className="d-flex flex-column flex-lg-row justify-content-between gap-2">
                <small className="text-light opacity-75">
                  <i className="bi bi-heart-fill me-2"></i>
                  {likesCount} likes
                </small>
                <small className="text-light opacity-75">
                  <i className="bi bi-calendar me-2"></i>
                  {new Date(parseInt(pattern.created_at)).toLocaleDateString()}
                </small>
              </div>
            </div>

          </div>

          {/* Action buttons */}
          <div className="mt-auto d-flex flex-wrap">
            <div className="w-100">
              <LoadIntoSequencer s3_url={pattern.s3_url} />
            </div>
            <div className="w-50">
              <DownloadPattern s3_url={pattern.s3_url} />
            </div>
            <div className="w-50">
              <LikeFunction
                patternId={pattern.id}
                isLiked={pattern.liked_by_user}
                onLikeUpdate={setLikesCount}
                currentLikeCount={likesCount}
              />
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        patternName={pattern.name}
      />
    </div>
  );
};

export default PatternCard;
