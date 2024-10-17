import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments } from '../redux/slices/commentsSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CommentListBlock = ({ postId, comment_count }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments[postId]) || [];
  const loggedInUserId = useSelector((state) => state.user.user ? state.user.user.id : null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (comments.length === 0) {
      dispatch(fetchComments(postId));
    }
  }, [dispatch, postId, comments]);

  const handleExpand = () => {
    setExpanded(!expanded);
    if (!expanded) {
      dispatch(fetchComments(postId));
    }
  };

  const sortedComments = [...comments].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const userComments = loggedInUserId ? sortedComments.filter(comment => comment.user_id === loggedInUserId) : [];
  const mostRecentUserComment = userComments.length > 0 ? userComments.reduce((latest, comment) => {
    return new Date(comment.created_at) > new Date(latest.created_at) ? comment : latest;
  }) : null;

  const firstComment = sortedComments[0];

  return (
    <div className="comments-list-block">
      {firstComment && (
        <ul>
          <li key={firstComment.id} style={{ display: 'block' }}>
            <b>{firstComment.name}</b><br />
            <small>{new Date(firstComment.created_at).toLocaleString()}</small><br />
            {firstComment.content}<br />
          </li>
        </ul>
      )}

      {expanded && sortedComments.length > 1 && (
        <ul>
          {sortedComments.slice(1).map((comment) => (
            <li key={comment.id} style={{ display: 'block' }}>
              <b>{comment.name}</b><br />
              <small>{new Date(comment.created_at).toLocaleString()}</small><br />
              {comment.content}<br />
            </li>
          ))}
        </ul>
      )}

      {comment_count > 1 && (
        <div style={{ textAlign: 'center' }}>
          <a onClick={handleExpand} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
            {expanded ? <><ExpandLessIcon /> Hide Comments</> : <><ExpandMoreIcon /> {comment_count} Comment{comment_count > 1 ? 's' : ''}</>}
          </a>
        </div>
      )}

      {!expanded && mostRecentUserComment && (
        <ul style={{ marginTop: '10px' }}>
          {firstComment.id !== mostRecentUserComment.id && (
            <li style={{ display: 'block' }}>
              <b>{mostRecentUserComment.name}</b><br />
              <small>{new Date(mostRecentUserComment.created_at).toLocaleString()}</small><br />
              {mostRecentUserComment.content}<br />
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CommentListBlock;
