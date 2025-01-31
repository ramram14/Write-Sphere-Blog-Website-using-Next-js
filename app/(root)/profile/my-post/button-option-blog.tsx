'use client'

import { Button } from '@/components/ui/button'
import { deleteBlog } from '@/lib/action/blog.action'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useActionState } from 'react'
import toast from 'react-hot-toast'

export default function ButtonOptionBlog({
  slugBlog
}: {
  slugBlog: string
}) {

  const [data, action, isPending] = useActionState(deleteBlog, undefined)



  if (data && !data.success) {
    toast.dismiss()
    toast.error(data.message)
  }

  if (data && data.success) {
    toast.dismiss()
    toast.success(data.message)
  }
  return (

    <div className='flex flex-col gap-2 w-full'>
      <Link href={`/${slugBlog}/edit`} className='w-full hover:bg-slate-300 md:p-1'>
        <Button
          variant={'outline'}
          type="submit"
          className='w-full text-xs md:text- p-0 md:p-1'
        >
          Edit
        </Button>
      </Link>
      <form action={action} className='w-full hover:bg-slate-300 md:p-1'>
        <input type="text" name="slugBlog" hidden defaultValue={slugBlog} />
        <Button
          variant={'outline'}
          type="submit"
          className='w-full text-xs md:text-sm p-0 md:p-1'
        >
          {isPending ? <Loader className='animate-spin' /> : 'Delete'}
        </Button>
      </form>
    </div>

  )

}