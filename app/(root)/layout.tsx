import Navbar from '@/components/navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className='min-h-dvh w-screen max-w-4xl mx-auto'>
        {children}
      </main>
    </>
  )
}