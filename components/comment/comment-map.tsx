import { commentData } from '@/lib/types'
import { LikeButton, OptionButtonComment } from './button-option-comment'
import Image from 'next/image'
import { formatTimeAgo } from '@/helpers/utils'

export default function CommentMap({
  comments,
  childComment
}: {
  comments: commentData[],
  childComment: commentData[]
}) {
  return (
    <>
      {comments.map((comment) => (
        <div key={comment._id} className='flex gap-4 items-start border-y pb-2 relative'>
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

            <div className='text-smx flex items-center gap-2'

            >{childComment?.filter((child) => typeof child.parentComment === 'string' && child.parentComment === comment._id).length} Replies</div>
          </div>


          <OptionButtonComment initialContent={comment.content} commentId={comment._id} />
        </div>
      ))}
    </>
  )
}