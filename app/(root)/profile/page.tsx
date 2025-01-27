import UserPageDirection from '@/components/profile/user-direction';
import { ProfileData, ProfileImage } from './profile-form';

export default function Page() {
  return (
    <>
      <UserPageDirection direction='Profile' />
      <section className='grid md:grid-cols-2 p-1 min-h-48 bg-slate-100 mt-2'>
        <div className='space-y-4'>
          <ProfileImage />
          <p className='text-xs text-start'>*File size: maximum 2,000,000 bytes (2 Mb).</p>
        </div>

        <div>
          <ProfileData />
        </div>
      </section>
    </>
  )
}