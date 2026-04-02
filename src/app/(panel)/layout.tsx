import NavBottom from '@/components/ui/nav-bottom'

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBottom />
      <main>
        {children}
      </main>
    </div>
  )
}