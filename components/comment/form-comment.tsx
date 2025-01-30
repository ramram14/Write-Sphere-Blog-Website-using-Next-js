'use client'

import { useUserStore } from '@/store/user.store'
import Image from 'next/image'
import { Loader, UserIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useActionState, useEffect, useState } from 'react'
import { createComment } from '@/lib/action/comment.action'
import { Textarea } from '../ui/textarea'
export default function FormComment({
  blogId,
}: {
  blogId: string,
}) {
  const { user, isAuthenticated } = useUserStore()
  const [commentInput, setCommentInput] = useState('')
  const [data, action, isPending] = useActionState(createComment, undefined)
  useEffect(() => {
    if (!isPending && !data) {
      setCommentInput('');
    }
  }, [isPending, data]);


  return (
    <div>
      {data?.success === false && <div className='p-2 bg-red-600 rounded-md'>{data.message}</div>}
      <div className='flex items-center gap-2 my-4'>
        <div className='relative block w-8 h-8 min-w-10 min-h-10'>
          {isAuthenticated && user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt={`${user.username} profile image`}
              width={100}
              height={100}
              priority
              className=" h-full w-full rounded-full object-cover "
            />
          ) : (
            <UserIcon
              className='w-full h-full'
            />
          )}
        </div>
        <form action={action} id='comment' className='w-full'>
          <Textarea
            id='content'
            name='content'
            placeholder='Write a comment...'
            onChange={(e) => setCommentInput(e.target.value)}
            value={commentInput}
          />
          <input type="text" name='blogId' defaultValue={blogId} hidden />
        </form>
      </div>

      <div className={`flex gap-2 justify-end ${commentInput ? '' : 'hidden'}`}>
        <Button
          type='submit'
          variant={'outline'}
          className='p-1 md:p-2 bg-red-500 hover:bg-red-600'
          onClick={() => setCommentInput('')}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          variant={'outline'}
          className='p-1 md:p-2'
          form='comment'
          disabled={isPending}
        >
          Comment {isPending && <Loader className='animate-spin' />}
        </Button>
      </div>

    </div>
  )
}

