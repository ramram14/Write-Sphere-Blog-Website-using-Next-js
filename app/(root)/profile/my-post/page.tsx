import UserPageDirection from '@/components/profile/user-direction';
import { getBlogByAuthor } from '@/lib/action/blog.action';
import { blogData } from '@/lib/types';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import ButtonOptionBlog from './button-option-blog';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'My Post',
};

export default async function Page() {
  const { success, message, data } = await getBlogByAuthor();
  if (!success) return <h1 className='text-2xl text-center min-h-dvh mt-4'>{message}</h1>;
  const blog = Array.isArray(data) ? (data as blogData[]) : [];
  return (
    <>
      <UserPageDirection direction='My Post' />
      <section className='max-w-sm mx-auto md:max-w-full bg-slate-100 mt-2'>
        <h1 className='p-2 text-2xl font-semibold'>Total Post : {blog.length}</h1>
        <div className='space-y-2 border-2 border-b-2 p-2'>
          {blog.map((item) => (
            <div
              key={item._id}
              className='flex justify-between bg-white hover:bg-slate-300 rounded-lg p-2'
            >
              {/* Konten Teks dan Gambar */}
              <Link
                href={`/${item.slug}`}
                className='flex flex-1 min-h-36 h-36 gap-2 items-start justify-between min-w-0'
              >
                {/* Gambar */}
                <div className='my-auto w-32 md:w-48 lg:w-56 flex-shrink-0'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    priority
                    width={300}
                    height={300}
                    className='rounded-lg h-full w-full aspect-square md:aspect-video object-cover'
                  />
                </div>


                {/* Konten Teks */}
                <div className='space-y-2 flex flex-col w-full overflow-hidden min-w-0'>
                  <h1 className='font-bold text-base sm:text-lg md:text-xl lg:text-2xl truncate'>
                    {item.title}
                  </h1>
                  <p className='text-xs md:text-sm'>Views : <span className='font-semibold'>{item.views}</span></p>
                  <p className='text-xs md:text-sm'>
                    Created At : {moment(item.createdAt).format('DD-MM-YYYY')}
                  </p>
                  <p className='text-xs md:text-sm'>
                    Updated At : {moment(item.updatedAt).format('DD-MM-YYYY')}
                  </p>
                </div>
              </Link>

              {/* Tombol Opsi */}
              <div className='flex-shrink-0'>
                <Suspense fallback={<div>Loading...</div>}>
                  <ButtonOptionBlog slugBlog={item.slug} />
                </Suspense>
              </div>

            </div>

          ))}
        </div>
      </section>
    </>
  );
}