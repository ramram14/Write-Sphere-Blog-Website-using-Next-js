import { commentData } from '@/lib/types'

export default function CommentContainer({
  comments
}: {
  comments: commentData[]
}) {
  console.log(comments)
  return (
    <div>
      <p>{comments.length} Comments</p>
    </div>
  )
}