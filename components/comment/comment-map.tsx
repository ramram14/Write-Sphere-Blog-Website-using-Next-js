'use client'
import Image from 'next/image';
import { commentData } from '@/lib/types';
import { LikeButtonAndAnswerComment, OptionButtonComment } from './button-option-comment';
import { useState } from 'react';
import moment from 'moment';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useUserStore } from '@/store/user.store';


// CommentMap is for map comment

export default function CommentMap({
  comments,
  childComments,
  isChild = false
}: {
  comments: commentData[],
  childComments: commentData[],
  isChild?: boolean
}) {
  const { user } = useUserStore()
  const [childCommentsPopUp, setChildCommentsPopUp] = useState(false)
  return (
    <>
      {comments.map((comment) => {
        const replies = childComments.filter((child) => child.parentComment?._id === comment._id);

        return (
          <div key={comment._id} className='flex gap-4 items-start border-y pb-2 relative'>
            <div>

              {/* Profile Image */}
              <Image
                src={comment.author.profileImage}
                alt={`${comment.author.username} profile image`}
                width={100}
                height={100}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              />
            </div>
            <div className='flex-1'>
              <div className='text-sm flex gap-2'>
                <p className='font-bold tracking-wider'>@{comment.author.username}</p>
                <span className='text-slate-700'>{moment(comment.createdAt).fromNow()}</span>
              </div>
              <div className='space-y-2'>
                <p className='my-2'>{comment.content}</p>

                {/* Like Button and Answer Button */}
                <LikeButtonAndAnswerComment
                  isChild={isChild}
                  commentId={comment._id}
                  likeUsers={comment.LikeUsers as string[]}
                  blogId={comment.blog}
                />
              </div>

              {/* Display the number of replies if there are any */}
              {replies.length > 0 && (
                <div className="mt-2 text-sm text-gray-600 flex items-center gap-2 cursor-pointer" onClick={() => setChildCommentsPopUp(!childCommentsPopUp)}>
                  {childCommentsPopUp ? <ChevronUp /> : <ChevronDown />}  {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                </div>
              )}

              {/* Recursively render child comments but we set isChild to true */}
              {replies.length > 0 && (
                <div className="ml-8 mt-4">
                  {childCommentsPopUp && (
                    <CommentMap comments={replies} childComments={childComments} isChild={true} />
                  )}
                </div>
              )}
            </div>

            {/* Option Button */}
            {user && user._id === comment.author._id && (
              <OptionButtonComment initialContent={comment.content} commentId={comment._id} />
            )}
          </div>
        );
      })}
    </>
  );
}