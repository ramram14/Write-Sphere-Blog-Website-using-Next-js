import { CreateBlogForm } from './create-blog-form';

export default function Page() {
  return (
    <section className='min-h-dvh mt-4 space-y-4'>
      <h1 className='text-2xl font-semibold'>Write your thought</h1>
      <p>&#39;It&apos;s never too late to start writing. All big ideas start with one small step.&#39;</p>
      <CreateBlogForm />
    </section>
  )
}