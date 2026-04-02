import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SAMGPLE — Confirmación COD con IA',
  description: 'Reduce devoluciones y confirma pedidos COD automáticamente con IA y llamadas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}