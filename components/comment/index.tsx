
import { commentData } from '@/lib/types'
import FormComment from './form-comment'
import { getCommentByBlogId } from '@/lib/action/comment.action'
import CommentMap from './comment-map'

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
  const parentComment = comments.filter((comment) => comment.parentComment === null);
  const childComment = comments.filter((comment) => comment.parentComment !== null);
  return (
    <div className='pb-72'>
      <hr />
      <hr />
      <p>{comments.length} Comments</p>
      <FormComment blogId={blogId} />
      <br />
      <CommentMap comments={parentComment} childComment={childComment} />
    </div>
  )
}