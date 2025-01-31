import { useActionState, useEffect, useRef, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { editComment } from '@/lib/action/comment.action';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditCommentModal({
  onClose,
  name,
  defaultValue,
  commentId
}: {
  onClose: () => void
  name: string
  defaultValue: string;
  commentId: string
}) {
  const [value, setValue] = useState(defaultValue);
  const modalRef = useRef<HTMLDivElement>(null);
  const [data, action, isPending] = useActionState(editComment, undefined)
  const modalClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      onClose()
    }
  }

  // If success, close modal
  // If failed, display error
  useEffect(() => {
    if (data && !data.success) {
      toast.dismiss();
      toast.error(data.message);
    }
    if (data && data.success) {
      onClose()
    }
  })

  return (
    <div
      ref={modalRef}
      onClick={modalClose}
      className='fixed inset-0  flex items-center justify-center backdrop-blur-sm h-full z-50'
    >
      <div className='p-4 bg-white border-2 rounded-md space-y-4 w-full max-w-sm z-50'>
        <h1 className='text-2xl'>Change {name}</h1>
        <form action={action}>
          <input type="text" id='commentId' name='commentId' defaultValue={commentId} hidden />
          <Textarea name={'content'} id={'content'} value={value} placeholder={defaultValue} className='w-full' onChange={(e) => setValue(e.target.value)} />
          <div className='flex justify-around items-center mt-4'>
            <button
              type='button'
              onClick={onClose}
              disabled={isPending}
              className='font-medium border rounded-xl p-2  cursor-pointer bg-slate-400 hover:bg-slate-600 '
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isPending}
              className='font-medium border rounded-xl p-2  cursor-pointer bg-red-600 hover:bg-red-700 '
            >
              {isPending ? <Loader className='animate-spin' /> : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}