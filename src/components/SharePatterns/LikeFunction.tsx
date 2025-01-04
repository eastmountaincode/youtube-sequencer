import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { LIKE_PATTERN } from '../../graphql/mutations';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Tooltip } from 'bootstrap';
import './LikeFunction.css';
import { getRefetchQueries } from '../../utils/refetchQueries';

interface LikeFunctionProps {
    patternId: string;
    isLiked: boolean;
    onLikeUpdate: (likesCount: number) => void;
    currentLikeCount: number; // Add this prop
}

const DisabledLikeButton: React.FC = () => {
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (wrapperRef.current) {
            const tooltip = new Tooltip(wrapperRef.current, {
                title: "Please login to like patterns",
                placement: 'top',
                trigger: 'hover'
            });

            return () => tooltip.dispose();
        }
    }, []);

    return (
        <span ref={wrapperRef} className="d-flex justify-content-center w-100">
            <button
                className="btn p-0 border-0 w-100 d-flex justify-content-center align-items-center"
                disabled
                style={{
                    cursor: 'not-allowed',
                    backgroundColor: 'transparent'
                }}
            >
                <i className="bi bi-heart text-secondary"></i>
            </button>
        </span>
    );
};

const EnabledLikeButton: React.FC<{
    liked: boolean;
    onClick: () => void;
}> = ({ liked, onClick }) => (
    <button
        onClick={onClick}
        className="btn p-0 border-0 w-100 d-flex justify-content-center align-items-center like-button"
        style={{ backgroundColor: 'transparent' }}
    >
        <i className={`bi ${liked ? 'bi-heart-fill text-danger' : 'bi-heart text-danger'}`}></i>
    </button>
);

const LikeFunction: React.FC<LikeFunctionProps> = ({ patternId, isLiked, onLikeUpdate, currentLikeCount }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [liked, setLiked] = useState(isLiked);
    const { orderBy, itemsPerPage } = useSelector((state: RootState) => state.patternsDisplay);
    const [likePattern] = useMutation(LIKE_PATTERN, {
        refetchQueries: getRefetchQueries(itemsPerPage, orderBy, user?.uid)
    });

    useEffect(() => {
        setLiked(isLiked);
    }, [isLiked]);

    const handleLikeClick = async () => {
        try {
            const { data } = await likePattern({
                variables: {
                    patternId,
                    userId: user.uid
                }
            });
            const newLikeCount = liked ? currentLikeCount - 1 : currentLikeCount + 1;
            setLiked(!liked);
            onLikeUpdate(newLikeCount); // update parent component, PatternCard

        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <div className="d-flex align-items-stretch h-100 btn-rounded-bottom-right">
            {user ? (
                <EnabledLikeButton liked={liked} onClick={handleLikeClick} />
            ) : (
                <DisabledLikeButton />
            )}
        </div>
    );
};

export default LikeFunction;