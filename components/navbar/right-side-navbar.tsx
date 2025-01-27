'use client';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useUserStore } from '@/store/user.store';
import { SquarePen, UserIcon } from 'lucide-react';
import Image from 'next/image';

export default function RightSideNavbar() {
  const { isAuthenticated, user } = useUserStore();
  return (
    <div className='flex items-center gap-2 md:gap-4 justify-end'>
      <Link
        href={'/write'}
      >
        <Button
          type='button'
          variant={'outline'}
          className='p-1 text-xs md:p-2 md:text-base'
        >
          <SquarePen />
          <p>Write</p>
        </Button>

      </Link>
      {!isAuthenticated && (
        <>
          <Link
            href={'/sign-up'}
          >
            <Button
              type='button'
              variant={'default'}
              className='bg-gray-900 text-white p-1 text-xs md:p-2 md:text-base hidden md:block'
            >
              Sign Up
            </Button>
          </Link>
          <Link
            href={'/sign-in'}
          >
            <Button
              type='button'
              variant={'outline'}
              className='p-1 text-xs md:p-2 md:text-base hidden md:block'
            >
              Sign In
            </Button>
          </Link>
        </>
      )}

      <Link
        href={'/profile'}
      >
        <div className='relative block w-8 h-8 min-w-10 min-h-10'>
          {isAuthenticated && user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt={`${user.username} profile image`}
              fill
              priority
              sizes='(max-width: 768px) 75vw, (max-width: 1200px) 33vw, 22vw'
              className=" h-full w-full rounded-full object-cover "
            />
          ) : (
            <UserIcon
              className='w-full h-full'
            />
          )}
        </div>
      </Link>
    </div>
  )
}