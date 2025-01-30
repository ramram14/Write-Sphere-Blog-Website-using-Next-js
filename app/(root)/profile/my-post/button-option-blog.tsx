'use client'

import { Button } from '@/components/ui/button'
import { deleteBlog } from '@/lib/action/blog.action'
import { Loader } from 'lucide-react'
import { useActionState } from 'react'
import toast from 'react-hot-toast'

export default function ButtonOptionBlog({
  slugBlog
}: {
  slugBlog: string
}) {

  const [dataDeleteBlog, actionDeleteBlog, isPending] = useActionState(deleteBlog, undefined)



  if (dataDeleteBlog && dataDeleteBlog.success === false) {
    toast.dismiss()
    toast.error(dataDeleteBlog.message)
  }

  if (dataDeleteBlog && dataDeleteBlog.success) {
    toast.dismiss()
    toast.success(dataDeleteBlog.message)
  }
  return (

    <form action={actionDeleteBlog} className={' hover:bg-slate-300 p-1 '}>
      <input type="text" name="slugBlog" hidden defaultValue={slugBlog} />
      <Button
        variant={'outline'}
        type="submit"
        className='text-sm'
      >
        {isPending ? <Loader className='animate-spin' /> : 'Delete'}
      </Button>
    </form>

  )

}