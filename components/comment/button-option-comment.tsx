'use client'

import { useUserStore } from '@/store/user.store'
import { EllipsisVertical, ThumbsUp } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { deleteComment } from '@/lib/action/comment.action'
import { axiosInstance } from '@/lib/axios'
import { handleAxiosError } from '@/lib/utils'
import EditCommentModal from './edit-comment-modal'

export function LikeButton({
  likeUsers,
  commentId,
  parentComment
}: {
  likeUsers: string[];
  commentId: string;
  parentComment?: string
}) {
  const { user, isAuthenticated } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isInputAnswerVisible, setIsInputAnswerVisible] = useState(false);

  // Handle klik tombol Like
  const handleLikeClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to give like');
      return;
    }
    const index = likeUsers.indexOf(user?._id ?? '');
    if (index !== -1) {
      likeUsers.splice(index, 1);
    } else {
      likeUsers.push(user?._id ?? '');
    }
    const formData = new FormData();
    formData.append('commentId', commentId);
    try {
      setIsLoading(true);
      await axiosInstance.post(`/comment/like/${commentId}?parentComment=${parentComment ?? null}`, formData);
    } catch (error) {
      const index = likeUsers.indexOf(user?._id ?? '');
      if (index !== -1) {
        likeUsers.splice(index, 1);
      } else {
        likeUsers.push(user?._id ?? '');
      }
      const { message } = handleAxiosError(error);
      toast.dismiss();
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className='flex  items-center gap-4' onSubmit={handleLikeClick}>
        <input type="text" name="commentId" defaultValue={commentId} hidden />
        <Button
          type='submit'
          disabled={isLoading}
          variant={'ghost'}
        >
          <ThumbsUp
            className={`w-4 h-4 ${likeUsers.includes(user?._id ?? '') ? 'fill-black' : ''}`}
          />
          <p>{likeUsers.length}</p>
        </Button>
        <p className='text-sm text-blue-600 cursor-pointer hover:underline'
          onClick={() => setIsInputAnswerVisible(!isInputAnswerVisible)}
        >
          Answer
        </p>
      </form>

    </>
  );
}



// Edit comment and Delete comment button is here
export function OptionButtonComment({
  commentId,
  initialContent
}: {
  commentId: string;
  initialContent: string
}) {
  const [isPopupEditCommentVisible, setIsPopupEditCommentVisible] = useState(false);
  const [dataDeletefunction, actionDeleteFunction, isPending] = useActionState(deleteComment, undefined)
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    if (dataDeletefunction && dataDeletefunction.success === false) {
      toast.dismiss();
      toast.error(dataDeletefunction.message);
    }
  }, [dataDeletefunction]);
  return (
    <div className='relative'>
      <EllipsisVertical
        onClick={() => setIsPopupEditCommentVisible(!isPopupEditCommentVisible)}
        className='w-6 h-6 hover:bg-slate-300 cursor-pointer'
      />
      <div
        hidden={!isPopupEditCommentVisible}
        className='absolute right-0 text-xs border  rounded-md'
      >
        <form action="">
          <input type="text" name="blogId" defaultValue={commentId} hidden id="blogId" />
          <button
            type='button'
            className='p-2 hover:bg-slate-300 cursor-pointer w-full text-start'
            onClick={() => {
              setIsEditing(true);
              setIsPopupEditCommentVisible(false);
            }}
          >
            Edit
          </button>
        </form>
        <form action={actionDeleteFunction}>
          <input type="text" name="blogId" defaultValue={commentId} hidden />
          <button
            type='submit'
            className='p-2 hover:bg-slate-300 cursor-pointer w-full text-start'
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </form>
      </div>
      {
        isEditing &&
        <EditCommentModal
          commentId={commentId}
          onClose={() => setIsEditing(false)}
          name='comment'
          defaultValue={initialContent}
        />
      }
    </div>
  )
}