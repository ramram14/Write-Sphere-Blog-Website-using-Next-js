'use client'

import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user.store'
import { Pencil, UserIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

export function ProfileImage() {
  const { user, isAuthenticated } = useUserStore();
  return (
    <div>
      <div className='relative w-48 h-48 mx-auto'>
        {isAuthenticated && user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt={`${user.username} profile image`}
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
    </div>
  )
}

export function ProfileData() {
  const { user, isAuthenticated, signOut } = useUserStore();
  const router = useRouter();
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
              <Pencil className='p-1  cursor-pointer hover:bg-slate-300 hover:fill-slate-400' size={30} />
            </div>

            <div className='flex items-center justify-between'>
              <div className='font-semibold'>
                <span className='text-sm font-medium'>Username</span>
                <h1>{user?.username}</h1>
              </div>
              <Pencil className='p-1  cursor-pointer hover:bg-slate-300 hover:fill-slate-400' size={30} />
            </div>
            <div className='flex items-center justify-between'>
              <div className='font-semibold'>
                <span className='text-sm font-medium'>Email</span>
                <h1>{user?.email}</h1>
              </div>
              <Pencil className='p-1  cursor-pointer hover:bg-slate-300 hover:fill-slate-400' size={30} />
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center min-h-48'>
            <h1 className='font-medium'>You are not sign in yet</h1>
          </div>
        )
      }

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