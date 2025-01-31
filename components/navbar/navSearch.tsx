'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NavSearch() {
  const searchParams = useSearchParams()
  const [inputSearch, setInputSearch] = useState(searchParams.get('search') || '')
  const router = useRouter();
  return (
    <form className='w-full flex-1' onSubmit={(e) => {
      e.preventDefault()

      // If user input search, we add it to the url
      router.replace(`/?search=${inputSearch}`)
    }}>
      <Input
        type='search'
        placeholder='Search...'
        className='w-full  dark:bg-muted'
        onChange={(e) => setInputSearch(e.target.value)}
      />
    </form>
  )
}