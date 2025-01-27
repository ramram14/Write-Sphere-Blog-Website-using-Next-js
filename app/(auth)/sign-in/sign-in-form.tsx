'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/store/user.store';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignInForm() {
  const router = useRouter();
  const { signIn, isLoading } = useUserStore();
  const [inputData, SetInputData] = useState({
    email: '',
    password: '',
  })
  const [errorApiResponse, setErrorApiResponse] = useState<[] | string>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('email', inputData.email);
    formData.append('password', inputData.password);

    const error = await signIn(formData, () => router.push('/'));
    if (error) {
      console.log(error);
      setErrorApiResponse(error as [] | string);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col space-y-2'
    >
      <label htmlFor="fullname">email</label>
      <Input
        type="email"
        id='email'
        name='email'
        placeholder='email'
        required
        className='p-1 w-full'
        onChange={(e) => SetInputData({ ...inputData, email: e.target.value })}
      />
      <label htmlFor="fullname">password</label>
      <div className='relative'>
        <Input
          type={isPasswordVisible ? 'text' : 'password'}
          id='password'
          name='password'
          placeholder='password'
          required
          className='p-1 w-full'
          onChange={(e) => SetInputData({ ...inputData, password: e.target.value })}
        />
        {isPasswordVisible ? (
          <Eye
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className='absolute right-2 top-2 cursor-pointer p-1'
          />
        ) : (
          <EyeOff
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className='absolute right-2 top-2 cursor-pointer p-1'
          />
        )}
      </div>
      {
        Array.isArray(errorApiResponse) && errorApiResponse.length > 0 ? (
          <div className='text-xs text-red-700 bg-red-100 font-semibold rounded-md p-1'>
            {errorApiResponse.map((error, i) => (
              <p key={i} className=''>{error}</p>
            ))}
          </div>
        ) : errorApiResponse && (
          <div className='text-xs text-red-700 bg-red-100 font-semibold rounded-md p-1'>
            {errorApiResponse}
          </div>
        )
      }
      <Button
        type='submit'
        className='bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-md'
      >
        Sign In {isLoading && <LoaderCircle className='animate-spin' />}
      </Button>
    </form>
  )
}