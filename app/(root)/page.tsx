import { formatTimeAgo } from '@/helpers/utils';
import { getAllBlogs } from '@/lib/actions'
import { blogData } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

export default async function Page() {
  const blog = await getAllBlogs() as blogData[];
  console.log(blog)
  return (
    <section className='min-h-dvh'>
      {
        blog.map((item) => (
          <Link
            key={item._id}
            href={`/${item.slug}`}
            className='flex min-h-36 h-36 relative gap-2 items-start justify-between border-b-2 p-2 hover:bg-slate-100'
          >
            <div className='space-y-2'>
              <h1 className='text-sm'>by @{item.author.username}</h1>
              <h1 className='font-bold text-lg md:text-xl lg:text-2xl'>{item.title}</h1>
              <h1 className='text-slate-700'>{item.subtitle}</h1>
              <p className='text-xs text-slate-700'>{formatTimeAgo(new Date(item.createdAt))}</p>
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