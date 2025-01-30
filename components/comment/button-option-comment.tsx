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
  likeUsers: string[];
  commentId: string;
}) {
  const { user, isAuthenticated } = useUserStore();
  const [data, action, isPending] = useActionState(toggleLikeCommentButton, undefined);
  const [optimisticLiked, setOptimisticLiked] = useState(false);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(likeUsers.length);

  // Sinkronkan state lokal dengan data dari server saat komponen dimuat
  useEffect(() => {
    if (isAuthenticated && likeUsers.includes(user?._id ?? '')) {
      setOptimisticLiked(true);
    } else {
      setOptimisticLiked(false);
    }
    setOptimisticLikeCount(likeUsers.length);
  }, [likeUsers, user, isAuthenticated]);

  // Handle klik tombol Like
  const handleLikeClick = async () => {
    // Optimistic update
    const wasLiked = optimisticLiked;
    const newLikeCount = wasLiked ? optimisticLikeCount - 1 : optimisticLikeCount + 1;
    setOptimisticLiked(!wasLiked);
    setOptimisticLikeCount(newLikeCount);

    try {
      // Kirim permintaan ke server
      const formData = new FormData();
      formData.append('blogId', commentId);
      await action(formData);

      if (!data?.success) {
        setOptimisticLiked(wasLiked);
        setOptimisticLikeCount(likeUsers.length);
        toast.error(data?.message);
      }

    } catch {
      setOptimisticLiked(wasLiked);
      setOptimisticLikeCount(likeUsers.length);
      toast.error('Failed to update like. Please try again.');
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLikeClick(); }} className='flex items-center'>
      <input type="text" name="blogId" defaultValue={commentId} hidden />
      <Button
        type='submit'
        disabled={isPending}
        variant={'ghost'}
      >
        <ThumbsUp
          className={`w-4 h-4 ${optimisticLiked ? 'fill-black' : ''}`}
        />
      </Button>
      <p>{optimisticLikeCount}</p>
    </form>
  );
}

export function OptionButtonComment({
  commentId
}: {
  commentId: string
}) {
  const [isPopupEditCommentVisible, setIsPopupEditCommentVisible] = useState(false);
  const [dataDeletefunction, actionDeleteFunction] = useActionState(deleteComment, undefined)

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