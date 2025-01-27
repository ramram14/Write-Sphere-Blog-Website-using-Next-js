import Logo from './logo';
import NavSearch from './navSearch';
import RightSideNavbar from './right-side-navbar';

export default function Navbar() {

  return (
    <header className='w-full p-2 border-b'>
      <nav className='grid grid-cols-3  items-center justify-between'>
        <Logo />
        <NavSearch />
        <RightSideNavbar />
      </nav>
    </header>
  )
}