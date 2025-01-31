import { getBlogBySlug } from '@/lib/action/blog.action'
import { blogData } from '@/lib/types'
import { notFound } from 'next/navigation'
import EditBlogForm from './edit-blog-form'

export default async function Page({
  params
}: {
  params:
  Promise<{
    slug: string
  }>
}) {
  const slug = (await params).slug
  const { success, message, data } = await getBlogBySlug(slug)
  const blog = data as blogData

  // If no blog redirect to not found
  if (success && !blog) return notFound()

  // If api request failed we display the message 
  if (!success) return <h1 className='text-2xl text-center min-h-dvh mt-4'>{message}</h1>
  return (
    <section className='min-h-dvh mt-4 space-y-4 p-4 md:p-0'>
      <h1 className='text-2xl font-semibold'>Write your thought</h1>
      <p>&#39;It&apos;s never too late to start writing. All big ideas start with one small step.&#39;</p>
      <EditBlogForm slug={slug} blog={blog} />
    </section>
  )
}
