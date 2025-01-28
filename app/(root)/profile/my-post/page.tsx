import UserPageDirection from '@/components/profile/user-direction';
import { getBlogByAuthor } from '@/lib/action/blog.action';
import { blogData } from '@/lib/types';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import ButtonOptionBlog from './button-option-blog';

export default async function Page() {
  const { success, message, data } = await getBlogByAuthor()
  if (!success) return <h1 className='text-2xl text-center min-h-dvh mt-4'>{message}</h1>
  const blog = Array.isArray(data) ? data as blogData[] : [];
  return (
    <>
      <UserPageDirection direction='My Post' />
      <section className=' min-h-48 bg-slate-100 mt-2'>
        <h1 className='p-2 text-2xl font-semibold'>Total Post : {blog.length}</h1>
        <div className='space-y-2  border-2  border-b-2 p-2 '>
          {
            blog.map((item) => (
              <div key={item._id} className='flex justify-between  bg-white hover:bg-slate-300'>
                <Link
                  href={`/${item.slug}`}
                  className='flex flex-1 min-h-36 h-36 relative gap-2 items-start justify-between '
                >

                  <div className='my-auto max-w-40 md:max-w-48 lg:min-w-56'>
                    <Image
                      src={item.image}
                      alt={item.title}
                      priority
                      width={300}
                      height={300}
                      className="rounded-lg h-full w-full aspect-video object-cover"
                    />
                  </div>
                  <div className='space-y-2 flex flex-col  w-full'>
                    <h1 className='font-bold text-lg md:text-xl lg:text-2xl'>{item.title}</h1>
                    <p> Views : {item.views}</p>
                    <p className='text-sm'>
                      Created At : {moment(item.createdAt).format('DD-MM-YYYY')}
                    </p>
                    <p className='text-sm'>
                      Updated At : {moment(item.updatedAt).format('DD-MM-YYYY')}
                    </p>
                  </div>
                </Link>
                <ButtonOptionBlog slugBlog={item.slug} />
              </div>
            ))
          }
        </div>
      </section>
    </>
  )
}