'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NavSearch() {
  const searchParams = useSearchParams()
  const [inputSearch, setInputSearch] = useState(searchParams.get('search') || '')
  const router = useRouter();
  return (
    <form className='w-full' onSubmit={(e) => {
      e.preventDefault()
      router.replace(`/?search=${inputSearch}`)
    }}>
      <Input
        type='search'
        placeholder='Search...'
        className='w-full'
        onChange={(e) => setInputSearch(e.target.value)}
      />
    </form>
  )
}