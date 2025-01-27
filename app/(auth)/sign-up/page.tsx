import SignUpForm from './sign-up-form';
import { Metadata } from 'next'
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Sign Up',
}
export default function Page() {
  return (
    <section className='p-2 space-y-2 w-full max-w-sm border'>
      <div className='abolute top-2 left-2'>
      </div>
      <h1 className='text-xl text-center'>Sign Up</h1>
      <SignUpForm />
      <p className='text-xs'>Already have an account?
        {' '}
        <Link className='text-blue-600'
          href={'/sign-in'}
        >
          Sign In
        </Link>
      </p>
    </section>
  )
}

{/* <Link
          href={'/'}
          className='rounded-full bg-slate-400 hover:text-slate-600'
        >
          <ArrowLeft size={30} />
</Link> */}