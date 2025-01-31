'use client';

import { useUserStore } from '@/store/user.store';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';


// Delete Profile Modal

export default function DeleteProfileModal({
  onClose,
}: {
  onClose: () => void
}) {
  const { isLoading, deleteAccount } = useUserStore()
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  const [password, setPassword] = useState('');
  const [errorFields, setErrorFields] = useState('')
  const modalClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      onClose()
    }
  }

  const handleDeleteAccount = async () => {
    const formData = new FormData();
    formData.append('password', password);
    const data = await deleteAccount(formData)
    if (!data.success && data.message) {
      setErrorFields(data.message)
      return
    }
    router.replace('/')
  }
  return (
    <div
      ref={modalRef}
      onClick={modalClose}
      className='fixed inset-0  flex items-center justify-center backdrop-blur-sm '
    >
      <div className='p-4 bg-white border-2 rounded-md space-y-4'>
        <p className='text-red-600 text-center'>Warning!</p>
        <h1 className='text-2xl text-center'>Are you sure</h1>
        <p>Your account, blog, and comment will be gone.</p>
        <div>
          <Label>Password :</Label>
          <Input
            type='password'
            name={password}
            id={password}
            value={password}
            placeholder='Password'
            minLength={6}
            required className='w-full' onChange={(e) => setPassword(e.target.value)} />
        </div>
        {

          errorFields && (
            <p className='bg-red-600 text-center'>{errorFields}</p>
          )
        }
        <div className='flex justify-around items-center mt-4'>
          <button
            type='button'
            onClick={onClose}
            disabled={isLoading}
            className='font-medium border rounded-xl p-2  cursor-pointer bg-slate-400 hover:bg-slate-600 '
          >
            Cancel
          </button>
          <button
            type='button'
            disabled={isLoading}
            onClick={handleDeleteAccount}
            className='font-medium border rounded-xl p-2  cursor-pointer bg-red-600 hover:bg-red-700 '
          >
            {isLoading ? <Loader className='animate-spin' /> : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}