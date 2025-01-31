'use client';

// Use relative path because got an error in production
import { Button } from '@../../../components/ui/button';
import { Input } from '@../../../components/ui/input';
import { useUserStore } from '../../../store/user.store';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpForm() {
  const router = useRouter();
  const { signUp, isLoading } = useUserStore();
  const [inputData, SetInputData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
  })
  const [errorApiResponse, setErrorApiResponse] = useState<[] | string>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('fullname', inputData.fullname);
    formData.append('username', inputData.username);
    formData.append('email', inputData.email);
    formData.append('password', inputData.password);

    // If success then push to homepage
    const error = await signUp(formData, () => router.push('/'));
    if (error) {
      setErrorApiResponse(error as [] | string);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col space-y-2'
    >
      <label htmlFor="fullname">Full Name</label>
      <Input
        type="text"
        id='fullname'
        name='fullname'
        placeholder='Full Name'
        minLength={5}
        maxLength={20}
        required
        className='p-1 w-full'
        onChange={(e) => SetInputData({ ...inputData, fullname: e.target.value })}
      />
      <label htmlFor="fullname">username</label>
      <Input
        type="text"
        id='username'
        name='username'
        placeholder='Username'
        minLength={3}
        maxLength={10}
        required
        className='p-1 w-full'
        onChange={(e) => SetInputData({ ...inputData, username: e.target.value })}
      />
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
        {/* Password toggle visibility */}
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

      {/* Displaying error from api response */}
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
        disabled={isLoading}
        className='bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-md'
      >
        Sign Up {isLoading && <LoaderCircle className='animate-spin' />}
      </Button>
    </form>
  )
}