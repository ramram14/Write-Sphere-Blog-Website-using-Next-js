import { Metadata } from 'next'
import Link from 'next/link';
import SignInForm from './sign-in-form';
export const metadata: Metadata = {
  title: 'Sign In',
}
export default function Page() {
  return (
    <section className='p-2 space-y-2 w-full max-w-sm border'>
      <div className='abolute top-2 left-2'>
      </div>
      <h1 className='text-xl text-center'>Sign In</h1>
      <SignInForm />
      <p className='text-xs'>don&apos;t have an account?
        {' '}
        <Link className='text-blue-600'
          href={'/sign-up'}
        >
          Sign Up
        </Link>
      </p>
    </section>
  )
}