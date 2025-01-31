import CategoriesList from '@/components/navbar/categories-list';
import { Button } from '@/components/ui/button';
import { formatTimeAgo } from '@/helpers/utils';
import { getAllBlogs } from '@/lib/action/blog.action';
import { blogData } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { PageProps } from '@/.next/types/app/layout';
type Props = PageProps & {
  searchParams: {
    search?: string;
    category?: string;
  };
};


export default async function Page({ searchParams }: Props) {
  const { search, category } = await searchParams;

  // If no search or category is provided, fetch all blogs, otherwise fetch blogs based on search or category
  const response = await getAllBlogs({ search: search || '', category: category || '' });
  if (!response.success) return <h1 className='text-2xl text-center min-h-dvh mt-4'>{response.message}</h1>;
  const blog = response.data as blogData[];


  // If no blog redirect to not found component
  if (!blog.length) return (
    <>
      <CategoriesList />
      <div className='flex flex-col items-center justify-center min-h-dvh mt-4'>
        <h1 className='text-3xl font-bold text-center'>Oops! No Blogs Found</h1>
        <p className='text-lg text-gray-600'>Try adjusting your search or exploring different categories.</p>
        <Link href='/'>
          <Button
            type='button'
            variant='default'
            className='mt-4'>
            Go To Homepage
          </Button>
        </Link>
      </div>
    </>
  );

  return (
    <section className='min-h-dvh'>
      <CategoriesList />
      {/* <div className='py-5 px-2 border-y-2 bg-slate-50'>
        <h1 className='font-semibold text-xl'>Welcome back to Write Sphere,</h1>
        <p>&quot;where your thoughts find their voice through words.&quot;</p>
      </div> */}
      {
        blog.map((item) => (
          <Link
            key={item._id}
            href={`/${item.slug}`}
            className='flex flex-wrap md:flex-nowrap min-h-fit h-36 relative gap-2 items-start justify-between border-b-2 p-2 hover:bg-slate-100'
          >
            <div className=' space-y-2 min-w-0 flex-1'>
              <div className='flex gap-2 items-center'>
                <p className='text-xs'>{item.category}</p>
                <h1 className='text-sm'>by @{item.author.username}</h1>
              </div>
              <h1 className='font-bold text-sm md:text-lg truncate'>{item.title}</h1>
              <h1 className='text-slate-700 truncate text-xs md:text-sm'>{item.subtitle}</h1>
              <div className='flex justify-between text-xs text-slate-700'>
                <p>{formatTimeAgo(new Date(item.createdAt))}</p>
                <p>{item.views} Views</p>
              </div>
            </div>

            <div className='shrink-0 my-auto max-w-28 md:max-w-48 lg:min-w-56'>
              <Image
                src={item.image}
                alt={item.title}
                priority
                width={300}
                height={300}
                className="rounded-lg object-cover h-full w-full aspect-square md:aspect-video"
              />
            </div>
          </Link>
        ))
      }
    </section >
  )
}
