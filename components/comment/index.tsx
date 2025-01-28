import { commentData } from '@/lib/types'
import FormComment from './form-comment'
import Image from 'next/image'
import { formatTimeAgo } from '@/helpers/utils'
import { LikeButton, OptionButtonComment } from './button-option-comment'
import { getCommentByBlogId } from '@/lib/action/comment.action'

export default async function CommentContainer({
  blogId,
}: {
  blogId: string
}) {
  const { success, message, data } = await getCommentByBlogId(blogId)
  if (!success) {
    return <h1 className='text-2xl text-center min-h-dvh mt-4'>{message}</h1>
  }

  const comments = Array.isArray(data) ? data as commentData[] : [];
  return (
    <div className='pb-72'>
      <hr />
      <hr />
      <p>{comments.length} Comments</p>
      <FormComment blogId={blogId} />
      <br />
      {comments.map((comment) => (
        <div key={comment._id} className='flex gap-4 items-start border-y pb-2'>
          <div>
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
              <span className='text-slate-700'>{formatTimeAgo(new Date(comment.createdAt))}</span>
            </div>
            <div className='space-y-2'>
              <p className='my-2'>{comment.content}</p>
              <LikeButton commentId={comment._id} likeUsers={comment.LikeUsers as string[]} />
            </div>
          </div>

          <OptionButtonComment commentId={comment._id} />
        </div>
      ))}
    </div>
  )
}