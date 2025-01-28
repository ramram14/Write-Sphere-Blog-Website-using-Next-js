import { formatTimeAgo } from '@/helpers/utils';
import { getAllBlogs } from '@/lib/action/blog.action';
import { blogData } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

export default async function Page() {
  const { success, message, data } = await getAllBlogs()

  if (!success) return <h1 className='text-2xl text-center min-h-dvh mt-4'>{message}</h1>
  const blog = data as blogData[]

  return (
    <section className='min-h-dvh'>
      {
        blog.map((item) => (
          <Link
            key={item._id}
            href={`/${item.slug}`}
            className='flex min-h-36 h-36 relative gap-2 items-start justify-between border-b-2 p-2 hover:bg-slate-100'
          >
            <div className='space-y-2  w-full'>
              <h1 className='text-sm'>by @{item.author.username}</h1>
              <h1 className='font-bold text-lg md:text-xl lg:text-2xl'>{item.title}</h1>
              <h1 className='text-slate-700'>{item.subtitle}</h1>
              <div className='flex justify-between text-xs text-slate-700'>
                <p>{formatTimeAgo(new Date(item.createdAt))}</p>
                <p>{item.views} Views</p>
              </div>
            </div>

            <div className='my-auto max-w-40 md:max-w-48 lg:min-w-56'>
              <Image
                src={item.image}
                alt={item.title}
                priority
                width={300}
                height={300}
                className="rounded-lg h-full w-full "
              />
            </div>
          </Link>
        ))
      }
    </section>
  )
}