export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex min-h-dvh w-screen items-center justify-center'>
      {children}
    </div>
  )
}