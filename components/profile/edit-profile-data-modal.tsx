'use client';

import { Loader } from 'lucide-react';
import { Input } from '../ui/input';
import { useUserStore } from '@/store/user.store';
import toast from 'react-hot-toast';
import { useRef, useState } from 'react';


// Edit Profile Data Modal

export default function EditProfileDataModal({
  onClose,
  name,
  defaultValue
}: {
  onClose: () => void
  name: string,
  defaultValue: string
}) {
  const { updateProfile, isLoading } = useUserStore()
  const [value, setValue] = useState(defaultValue);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      onClose()
    }
  }
  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append(name, value);
    const { success, message } = await updateProfile(formData);
    if (success) onClose()
    if (!success) return toast.error(message)
  }
  return (
    <div
      ref={modalRef}
      onClick={modalClose}
      className='fixed inset-0  flex items-center justify-center backdrop-blur-sm '
    >
      <div className='p-4 bg-white border-2 rounded-md space-y-4'>
        <h1 className='text-2xl'>Change {name}</h1>
        <Input name={name} id={name} value={value} placeholder={defaultValue} className='w-full' onChange={(e) => setValue(e.target.value)} />
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
            onClick={handleUpdateProfile}
            disabled={isLoading}
            className='font-medium border rounded-xl p-2  cursor-pointer bg-red-600 hover:bg-red-700 '
          >
            {isLoading ? <Loader className='animate-spin' /> : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}


