import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addLike, removeLike } from '../redux/slices/postSlice';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CommentFormBlock from './CommentFormBlock';
import CommentListBlock from './CommentListBlock';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const ViewPostBlock = ({ post, userId }) => {
  const dispatch = useDispatch();
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [liked, setLiked] = useState(post.logged_user_liked);
  const commentInputRef = useRef(null);

  const handleLike = () => {
    if (userId) {
      setLikesCount(likesCount + 1);
      setLiked(true);
      dispatch(addLike({ userId, postId: post.id }));
    }
  };

  const handleUnlike = () => {
    if (userId) {
      setLikesCount(likesCount - 1);
      setLiked(false);
      dispatch(removeLike({ userId, postId: post.id }));
    }
  };

  const handleCommentClick = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  return (
    <div className="post">
      <p>
        <b>{post.name}</b><br />
        <small>{new Date(post.created_at).toLocaleString()}</small>
      </p>
      <p style={{ fontSize: 'larger' }}>{post.content}</p>

      <div className="post-footer" style={footerStyle}>
        <div style={footerHalfStyle}>
          <span style={iconTextWrapper} onClick={liked ? handleUnlike : handleLike}>
            {liked ? (
              <ThumbUpAltIcon style={iconStyleThumb1} />
            ) : (
              <ThumbUpOffAltIcon style={iconStyleThumb2} />
            )}
            <span style={{ cursor: 'pointer' }}>{likesCount} Likes</span>
          </span>
        </div>
        <div style={footerHalfStyle} onClick={handleCommentClick}>
          <span style={iconTextWrapper}>
            <ChatBubbleOutlineIcon style={iconStyleChatBubble} />
            <span>{post.comment_count} Comments</span>
          </span>
        </div>
      </div>

      <CommentListBlock postId={post.id} comment_count={post.comment_count} />
      <CommentFormBlock postId={post.id} ref={commentInputRef} />
    </div>
  );
};

const footerStyle = {
  display: 'flex',
  width: '100%',
  borderTop: '1px solid #e0e0e0',
  paddingTop: '10px',
  marginBottom: '20px',
};

const footerHalfStyle = {
  width: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
};

const iconTextWrapper = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const iconStyleThumb1 = {
  fontSize: '2em',
  color: 'dodgerblue',
  cursor: 'pointer',
};

const iconStyleThumb2 = {
  fontSize: '2em',
  color: '#bbbbbb',
  cursor: 'pointer',
};

const iconStyleChatBubble = {
  fontSize: '2em',
  color: '#bbbbbb',
  cursor: 'pointer',
};

export default ViewPostBlock;
