
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

  // If not success, show message
  if (!success) {
    return <h1 className='text-2xl text-center min-h-dvh mt-4'>{message}</h1>
  }

  // If success, put comments into variable
  const comments = Array.isArray(data) ? data as commentData[] : [];

  // Filter parent comment and child comment

  // Parent comment is comment that doesn't have parent comment which is null
  const parentComment = comments.filter((comment) => comment.parentComment === null);

  // Child comment is comment that have parent comment which is not null, they has comments id in parentComment property
  const childComment = comments.filter((comment) => comment.parentComment !== null);
  return (
    <div className='pb-72'>
      <hr />
      <hr />
      <p>{comments.length} Comments</p>

      {/* Form to add comment */}
      <FormComment blogId={blogId} />
      <br />

      {/* Map comment */}
      <CommentMap comments={parentComment} childComments={childComment} />
    </div>
  )
}