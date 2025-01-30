'use client'

import { useUserStore } from '@/store/user.store'
import { ChevronDown, ChevronUp, EllipsisVertical, Loader, ThumbsUp } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { createBlogReplies, deleteComment } from '@/lib/action/comment.action'
import { axiosInstance } from '@/lib/axios'
import { handleAxiosError } from '@/lib/utils'
import EditCommentModal from './edit-comment-modal'
import { Textarea } from '../ui/textarea'

export function LikeButtonAndAnswerComment({
  likeUsers,
  commentId,
  blogId,
  isChild = false
}: {
  likeUsers: string[];
  commentId: string;
  blogId: string;
  isChild?: boolean
}) {
  const { user, isAuthenticated } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isInputAnswerVisible, setIsInputAnswerVisible] = useState(false);
  const [commentInput, setCommentInput] = useState('')
  const [data, action, isPending] = useActionState(createBlogReplies, undefined)


  useEffect(() => {
    if (data && data.success) {
      setIsInputAnswerVisible(false)
    }
  }, [data])


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
    try {
      setIsLoading(true);
      await axiosInstance.post(`/comment/like/${commentId}`);
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
        {
          !isChild && (
            <p className='text-sm text-blue-900 cursor-pointer hover:underline flex items-center gap-2'
              onClick={() => setIsInputAnswerVisible(!isInputAnswerVisible)}
            >
              {isInputAnswerVisible ? <ChevronUp /> : <ChevronDown />}Answer
            </p>
          )
        }

        {/* Answer form */}
      </form>



      {isInputAnswerVisible && (
        <form className='py-2' action={action}>
          <input type="text" name="parentComment" defaultValue={commentId} hidden />
          <input type="text" name='blogId' defaultValue={blogId} hidden />
          <Textarea
            placeholder='Write your answer here'
            className='w-full'
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            name='content'
            id='content'
          />

          <div className={`flex gap-2 justify-end mt-2 ${commentInput ? '' : 'hidden'}`}>
            <Button
              type='button'
              variant={'outline'}
              className='p-1 md:p-2 bg-red-500 hover:bg-red-600'
              onClick={() => setIsInputAnswerVisible(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              // onClick={handleCreateRepliesComment}
              variant={'outline'}
              className='p-1 md:p-2'
              disabled={isPending}
            >
              Comment {isPending && <Loader className='animate-spin' />}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}



// Edit comment and Delete comment button is here
export function OptionButtonComment({
  commentId,
  initialContent,
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