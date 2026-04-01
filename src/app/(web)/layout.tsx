import NavWeb from './nav-web'

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavWeb />
      {children}
    </>
  )
}