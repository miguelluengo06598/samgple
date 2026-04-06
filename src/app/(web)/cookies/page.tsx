import React from 'react'

export const metadata = {
  title: 'Política de Cookies | SAMGPLE',
  description: 'Información sobre el uso de cookies en la plataforma SAMGPLE.',
}

export default function CookiesPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8 lg:py-24">
        
        {/* Encabezado */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-4 border border-amber-100">
            Última revisión: 6 de abril de 2026
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Política de Cookies
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Transparencia total sobre cómo usamos las cookies para que SAMGPLE funcione correctamente.
          </p>
        </div>

        {/* Contenido Legal */}
        <div className="prose prose-slate prose-lg max-w-none">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. ¿Qué son las cookies?</h2>
            <p className="text-slate-700 leading-relaxed">
              Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando visitas nuestra web. Nos ayudan a recordarte, mantener tu sesión iniciada y procesar tus análisis de riesgo de forma segura.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Cookies Técnicas (Obligatorias)</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Estas cookies son esenciales para que puedas navegar por SAMGPLE y usar sus funciones:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>Supabase:</strong> Para mantener tu sesión de usuario activa de forma segura.</li>
              <li><strong>Seguridad (CSRF):</strong> Para prevenir ataques malintencionados en los formularios de envío.</li>
              <li><strong>Preferencias:</strong> Para recordar si has aceptado o no este aviso de cookies.</li>
            </ul>
          </section>

          <section className="mb-10 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 text-blue-700">3. Cookies de Terceros</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Usamos servicios externos que pueden instalar sus propias cookies:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>Lemon Squeezy:</strong> Necesarias para procesar tus pagos y prevenir el fraude en las transacciones bancarias.</li>
              <li><strong>Análisis (Opcional):</strong> Podemos usar herramientas como Google Analytics o Plausible para entender cómo se usa la web y mejorar el servicio (siempre de forma anónima).</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Cómo gestionar tus cookies</h2>
            <p className="text-slate-700 leading-relaxed">
              Puedes configurar tu navegador para bloquear todas las cookies o para que te avise cuando se envíe una. Sin embargo, ten en cuenta que si desactivas las cookies de sesión (Supabase), **no podrás entrar en tu panel de control** ni realizar análisis de pedidos.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contacto</h2>
            <p className="text-slate-700 leading-relaxed italic text-slate-500">
              Para cualquier duda sobre nuestra política de cookies, puedes contactarnos en <strong>soporte@samgple.com</strong>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}