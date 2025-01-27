import { Input } from '../ui/input';

export default function NavSearch() {
  return (
    <div className='w-full'>
      <Input
        type='search'
        placeholder='Search...'
        className='w-full'
      />
    </div>
  )
}