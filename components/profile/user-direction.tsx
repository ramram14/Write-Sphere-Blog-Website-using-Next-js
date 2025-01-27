import Link from 'next/link'


const pageDirection = [
  {
    title: 'Profile',
    url: '/profile'
  },
  {
    title: 'My Post',
    url: '/my-post'
  }
]

type typeDirection = 'Profile' | 'My Post'

export default function UserPageDirection({
  direction
}: {
  direction: typeDirection
}) {
  return (
    <div className={`w-full flex justify-around items-center border-b-2`}>
      {pageDirection.map((item, i) => {
        return (
          <Link
            key={i}
            href={item.url}
            className={`w-full text-center p-1 cursor-pointer ${direction === item.title ? 'bg-slate-900 text-white hover:bg-gray-700' : 'hover:bg-slate-100'}`}
          >
            {item.title}
          </Link>
        )
      })}
    </div>
  )
}