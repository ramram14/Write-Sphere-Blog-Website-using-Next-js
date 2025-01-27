import { getBlogBySlug } from '@/lib/actions'
import { blogData } from '@/lib/types'
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
  return (
    <section className='min-h-dvh'>

    </section>
  )
}