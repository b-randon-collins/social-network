import React, { useState, useEffect, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../redux/slices/commentsSlice';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const CommentFormBlock = forwardRef(({ postId, shouldFocus }, ref) => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      dispatch(addComment({ postId, content }));
      setContent('');
    }
  };

  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus(); // Focus the input if shouldFocus is true
    }
  }, [shouldFocus, ref]);

  return (
    <form className="post-comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        ref={ref}
      />
      <button type="submit"><NavigateNextIcon /></button>
    </form>
  );
});

export default CommentFormBlock;
