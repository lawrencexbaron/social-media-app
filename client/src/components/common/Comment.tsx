import React, { useState, useEffect } from "react";
import Avatar from "./Avatar";
import Label from "./Label";
import { postAgo } from "../utils/api/timeUtils";

interface CommentProps {
  comment: any;
  avatar: string;
  handleLikeComment: (commentId: string) => void;
  handleUnlikeComment: (commentId: string) => void;
  handleDeleteComment: (commentId: string) => void;
}

const Comment = ({
  comment,
  avatar,
  handleLikeComment,
  handleUnlikeComment,
  handleDeleteComment,
}: CommentProps) => {
  const [isCommentLiked, setIsCommentLiked] = useState(false);

  useEffect(() => {
    setIsCommentLiked(comment.isLiked);
  }, [comment.isLiked]);

  useEffect(() => {
    const storedIsCommentLiked = localStorage.getItem(`isCommentLiked`);
    if (storedIsCommentLiked) {
      setIsCommentLiked(JSON.parse(storedIsCommentLiked));
    }
  }, []);

  const handleLike = async (commentId: string) => {
    await handleLikeComment(commentId);
    setIsCommentLiked(true);
  };

  const handleUnlike = async (commentId: string) => {
    await handleUnlikeComment(commentId);
    setIsCommentLiked(false);
  };

  return (
    <div className='flex w-full py-1 my-1'>
      <Avatar avatar={avatar} size={10} />
      <div className='flex w-full justify-between'>
        <div className='flex flex-col w-full'>
          <Label className={`w-full font-semibold text-slate-800`}>
            {comment.user.firstname} {comment.user.lastname}
          </Label>
          <Label className={`w-full`}>{comment.text}</Label>
          <div className='flex w-full justify-start mt-2 space-x-4'>
            <Label
              className={`text-slate-500 text-xs font-semibold cursor-pointer`}
            >
              <p
                onClick={() => {
                  isCommentLiked
                    ? handleUnlike(comment._id)
                    : handleLike(comment._id);
                }}
              >
                {isCommentLiked ? "Unlike" : "Like"}
              </p>
            </Label>
            <Label
              className={` text-slate-500 text-xs font-semibold cursor-pointer`}
            >
              Reply
            </Label>
            <Label
              className={` text-slate-500 text-xs font-semibold cursor-pointer`}
            >
              <p onClick={() => handleDeleteComment(comment._id)}>Delete</p>
            </Label>
            <Label
              className={` text-slate-500 text-xs font-semibold cursor-pointer`}
            >
              {postAgo(comment.date)}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
