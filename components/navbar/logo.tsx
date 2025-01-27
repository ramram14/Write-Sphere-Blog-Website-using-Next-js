import Link from 'next/link';

export default function Logo() {
  return (
    <Link
      href={'/'}
    >
      <h1
        className='text-xs md:text-xl lg:text-2xl font-bold cursor-pointer'
      >WriteSphere
      </h1>
    </Link>
  )
}