import NavBottom from '@/components/ui/nav-bottom'

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-28">
        {children}
      </main>
      <NavBottom />
    </div>
  )
}