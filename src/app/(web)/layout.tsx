// src/app/(web)/layout.tsx
import NavWeb from './nav-web'
import Footer from './footer'  // ← créalo aquí mismo

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavWeb />
      {children}
      <Footer />
    </>
  )
}