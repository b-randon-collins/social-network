import React, { useState, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../redux/slices/commentsSlice';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const CommentFormBlock = forwardRef(({ postId, addNewComment }, ref) => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      dispatch(addComment({ postId, content })).unwrap().then((newComment) => {
        addNewComment(newComment);
      });
      setContent('');
    }
  };

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
