import UserPageDirection from '@/components/profile/user-direction';
import { ProfileData, ProfileImage } from './profile-form';
import { Metadata } from 'next';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/loading-spinner';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function Page() {
  return (
    <>
      {/* Page Direction */}
      <UserPageDirection direction='Profile' />
      <section className='grid md:grid-cols-2 p-1 min-h-48 bg-slate-100 mt-2'>
        <div className='space-y-4'>

          {/* Profile Image */}
          <Suspense fallback={<LoadingSpinner />}>
            <ProfileImage />
          </Suspense>
          <p className='text-xs text-start'>*File size: maximum 2,000,000 bytes (2 Mb).</p>
        </div>

        <div>

          {/* Profile Data */}
          <Suspense fallback={<LoadingSpinner />}>
            <ProfileData />
          </Suspense>
        </div>

      </section>
    </>
  )
}