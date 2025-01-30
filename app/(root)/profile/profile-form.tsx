'use client'

import EditProfileDataModal from '@/components/profile/edit-profile-data-modal';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user.store'
import { EllipsisVertical, Loader, Pencil, Save, Trash, UserIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';


export function ProfileImage() {
  const { user, isAuthenticated, updateProfile, deleteImage, isLoading } = useUserStore();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [imagePreview, setimagePreview] = useState('');
  const [file, setFile] = useState<File>();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFile(file);
      setIsPopUpOpen(false);
      setimagePreview(URL.createObjectURL(file));
    }
  }

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append('profileImage', file!);
    const { success, message } = await updateProfile(formData);
    setimagePreview('');
    if (!success) return toast.error(message)
  }
  const handleDeleteImage = async () => {
    const { success, message } = await deleteImage()
    setIsPopUpOpen(false)
    setimagePreview('')
    if (!success) return toast.error(message)
  }
  return (
    <div className='space-y-2 relative'>
      <input type="file" id='profileImage' name='profileImage' hidden onChange={handleImageChange} />

      {/* Modal */}
      <div className='absolute top-0 left-0'>
        <EllipsisVertical
          onClick={() => setIsPopUpOpen(!isPopUpOpen)}
          className='p-1 cursor-pointer hover:bg-slate-300' size={30}
        />
        <div
          hidden={!isPopUpOpen}
          className='abolute top-5 left-2 bg-white border rounded-md text-sm'
        >
          <label htmlFor='profileImage' className='p-1 cursor-pointer hover:bg-slate-300'>Change</label>
          <p
            onClick={handleDeleteImage}
            className='p-1 cursor-pointer hover:bg-slate-300'
          >
            {isLoading ? <Loader className='animate-spin w-fit mx-auto' /> : 'Delete'}
          </p>
        </div>

      </div>
      <div className='relative w-48 h-48 mx-auto'>
        {isAuthenticated && imagePreview || user?.profileImage ? (
          <Image
            src={imagePreview || user?.profileImage || ''}
            alt={`${user?.username} profile image`}
            fill
            priority
            sizes='(max-width: 768px) 75vw, (max-width: 1200px) 33vw, 22vw'
            className="rounded-full object-cover "
          />
        ) : (
          <UserIcon
            className='w-full h-full rounded-full border-4 border-black'
          />
        )}
      </div>
      {imagePreview && (
        <div className='flex gap-2 md:gap-4 justify-center'>
          <Button
            type='button'
            variant={'outline'}
            size={'icon'}
            onClick={() => setimagePreview('')}
            className='hover:bg-red-500'
            disabled={isLoading}
          >
            <Trash />
          </Button>

          <Button
            type='button'
            variant={'outline'}
            onClick={handleUpdateProfile}
            className='hover:bg-green-500'
            disabled={isLoading}
          >
            Save {isLoading ? <Loader className='animate-spin' /> : <Save />}
          </Button>
        </div>
      )}
    </div>
  )
}

export function ProfileData() {
  const { user, isAuthenticated, signOut } = useUserStore();
  const [editField, setEditField] = useState<{ key: string; value: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = (key: string, value: string) => {
    setEditField({ key, value });
    setIsModalOpen(true);
  };

  return (
    <div className='space-y-4'>
      {
        isAuthenticated ? (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='font-semibold'>
                <span className='text-sm font-medium'>Fullname</span>
                <h1>{user?.fullname}</h1>
              </div>
              <Pencil className='p-1  cursor-pointer hover:bg-slate-300 hover:fill-slate-400' size={30} onClick={() => openModal('fullname', user?.fullname || '')} />
            </div>
            <div className='flex items-center justify-between'>
              <div className='font-semibold'>
                <span className='text-sm font-medium'>Username</span>
                <h1>{user?.username}</h1>
              </div>
              <Pencil className='p-1  cursor-pointer hover:bg-slate-300 hover:fill-slate-400' size={30} onClick={() => openModal('username', user?.username || '')} />
            </div>
            <div className='flex items-center justify-between'>
              <div className='font-semibold'>
                <span className='text-sm font-medium'>Email</span>
                <h1>{user?.email}</h1>
              </div>
              <Pencil className='p-1  cursor-pointer hover:bg-slate-300 hover:fill-slate-400' size={30} onClick={() => openModal('email', user?.email || '')} />
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center min-h-48'>
            <h1 className='font-medium'>You are not sign in yet</h1>
          </div>
        )
      }
      {/* Modal */}
      {isModalOpen && editField && (
        <EditProfileDataModal
          onClose={() => setIsModalOpen(false)}
          name={editField.key}
          defaultValue={editField.value}
        />
      )}

      <Button
        type='button'
        variant={'outline'}
        onClick={async () => {
          if (isAuthenticated) {
            await signOut(() => router.refresh());
          } else {
            router.push('/sign-in')
          }
        }}
        className={`p-1 text-xs md:p-2 md:text-base w-full ml-auto font-semibold ${isAuthenticated ? 'bg-red-500 hover:bg-red-600' : ''}`}
      >
        {isAuthenticated ? 'Sign out' : 'Sign in'}
      </Button>
    </div>
  )
}