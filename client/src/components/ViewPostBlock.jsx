// ViewPostBlock.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addLike, removeLike } from '../redux/slices/postSlice';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

const ViewPostBlock = ({ post, userId }) => {
  const dispatch = useDispatch();
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [liked, setLiked] = useState(post.logged_user_liked);

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

  return (
    <div className="post">
      <p><b>{post.name}</b><br />
        <small>{new Date(post.created_at).toLocaleString()}</small></p>
      <p style={{"fontSize":"larger"}}>{post.content}</p>
      <div className='post-footer'>
        <span>
          {userId ? (
            liked ? (
              <ThumbUpAltIcon onClick={handleUnlike} style={{"color":"dodgerBlue", "fontSize":"2em"}} >Unlike</ThumbUpAltIcon>
            ) : (
              <ThumbUpOffAltIcon onClick={handleLike} style={{"color":"lightGrey", "fontSize":"2em", "cursor":"pointer"}}>Like</ThumbUpOffAltIcon>
            )
          ) : null}
        </span>
        <span>{likesCount} Likes</span>
      </div>
    </div>
  );
};

export default ViewPostBlock;
