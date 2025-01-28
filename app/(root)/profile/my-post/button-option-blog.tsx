'use client'

import { deleteBlog } from '@/lib/action/blog.action'
import { EllipsisVertical, Loader } from 'lucide-react'
import { useActionState, useState } from 'react'
import toast from 'react-hot-toast'

export default function ButtonOptionBlog({
  slugBlog
}: {
  slugBlog: string
}) {

  const [isPopUpOpen, setIsPopUpOpen] = useState(false)
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
    <div className='relative z-10'>
      <EllipsisVertical className='p-1 bg-white cursor-pointer  hover:bg-slate-500 ' size={30}
        onClick={() => setIsPopUpOpen(!isPopUpOpen)}
      />

      <div
        onClick={() => setIsPopUpOpen(false)}
        hidden={isPopUpOpen}
        className='absolute bg-white border-2 rounded-md border-black overflow-hidden'
      >
        <form action={actionDeleteBlog} className={' hover:bg-slate-300 p-1'}>
          <input type="text" name="slugBlog" hidden defaultValue={slugBlog} />
          <button type="submit" className='text-sm'>
            {isPending ? <Loader className='animate-spin' /> : 'Delete'}
          </button>
        </form>
      </div>
    </div>

  )

}