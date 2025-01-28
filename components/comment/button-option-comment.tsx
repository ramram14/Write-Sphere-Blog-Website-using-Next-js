'use client'

import { useUserStore } from '@/store/user.store'
import { EllipsisVertical, ThumbsUp } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { deleteComment, toggleLikeCommentButton } from '@/lib/action/comment.action'

export function LikeButton({
  likeUsers,
  commentId
}: {
  likeUsers: string[],
  commentId: string
}) {
  const { user, isAuthenticated } = useUserStore()
  const [data, action, isPending] = useActionState(toggleLikeCommentButton, undefined)
  if (data && data.success === false) {
    toast.error(data.message)
  }
  return (
    <form action={action} className='flex items-center'>
      <input type="text" name="blogId" defaultValue={commentId} hidden />
      <Button
        type='submit'
        disabled={isPending}
        variant={'ghost'}
      >
        <ThumbsUp
          className={`w-4 h-4 
        ${isAuthenticated && likeUsers.length > 0 && likeUsers.includes(user?._id ?? '') ? 'fill-black' : ''}`}
        />
      </Button>
      <p>{likeUsers.length}</p>
    </form>
  )
}

export function OptionButtonComment({
  commentId
}: {
  commentId: string
}) {
  const [isPopupEditCommentVisible, setIsPopupEditCommentVisible] = useState(false);
  const [dataEditFunction, actionEditFunction, isPending] = useActionState(toggleLikeCommentButton, undefined)
  const [dataDeletefunction, actionDeleteFunction] = useActionState(deleteComment, undefined)

  useEffect(() => {
    if (dataEditFunction && dataEditFunction.success === false) {
      toast.dismiss();
      toast.error(dataEditFunction.message);
    }

    if (dataDeletefunction && dataDeletefunction.success === false) {
      toast.dismiss();
      toast.error(dataDeletefunction.message);
    }
  }, [dataEditFunction, dataDeletefunction]);
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
            type='submit'
            className='p-2 hover:bg-slate-300 cursor-pointer w-full text-start'
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
            Delete
          </button>
        </form>
      </div>
    </div>
  )
}