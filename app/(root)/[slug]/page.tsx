import CommentContainer from '@/components/comment'
import { getBlogBySlug } from '@/lib/actions'
import { blogData } from '@/lib/types'
import moment from 'moment'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function Page({
  params
}: {
  params: Promise<{
    slug: string
  }>
}) {
  const slug = (await params).slug
  const blog = await getBlogBySlug(slug) as blogData
  if (!blog) return notFound()

  console.log(blog)
  return (
    <section className='min-h-dvh space-y-2 md:space-y-4 mt-4'>
      <p className='text-sm text-slate-600'>{blog.category}</p>
      <h1 className='text-2xl font-semibold'>{blog.title}</h1>
      <h1 className='text-2xl text-gray-700'>{blog.subtitle}</h1>
      <p className='w-fit ml-auto font-semibold text-gray-700'>{blog.views} Views</p>
      <div className='flex gap-4'>
        <div>
          <Image
            src={blog.author.profileImage}
            alt={`${blog.author.username} Profile Image`}
            width={100}
            height={100}
            className="rounded-full w-10 h-10 md:w-14 md:h-14 object-cover"
          />
        </div>
        <div className='flex-1'>
          <p>@{blog.author.username}</p>
          <p>Created at {moment(blog.createdAt).format('D MM YYYY')}</p>
        </div>
      </div>
      <hr />
      <div className='max-w-2xl mx-auto relative p-1'>
        <Image
          src={blog.image}
          alt={`${blog.title} Image`}
          width={300}
          height={170}
          sizes='(max-width: 768px) 75vw, (max-width: 1200px) 33vw, 22vw'
          className="rounded-lg object-cover w-full aspect-video"
        />
      </div>
      <hr />
      <div>
        <p>{blog.content}</p>
      </div>
      <CommentContainer comments={blog.comments} />
    </section>
  )
}