import React from 'react'

export const metadata = {
  title: 'Política de Privacidad | SAMGPLE',
  description: 'Información sobre cómo tratamos tus datos en SAMGPLE.',
}

export default function PrivacidadPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8 lg:py-24">
        
        {/* Encabezado */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-4 border border-emerald-100">
            Última actualización: 6 de abril de 2026
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            En SAMGPLE nos tomamos muy en serio la seguridad de tus datos y la de tus clientes finales.
          </p>
        </div>

        {/* Contenido Legal */}
        <div className="prose prose-slate prose-lg max-w-none">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Quiénes somos</h2>
            <p className="text-slate-700 leading-relaxed">
              SAMGPLE es una plataforma de análisis de riesgo para e-commerce basada en Inteligencia Artificial. Nuestra misión es ayudar a los comercios a reducir devoluciones y fraudes en pedidos contra reembolso (COD).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Datos que recopilamos</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Para prestar nuestro servicio de "Risk Scoring", procesamos los siguientes datos de los pedidos que integras en nuestra plataforma:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Nombres y apellidos (encriptados).</li>
              <li>Direcciones de envío (encriptadas).</li>
              <li>Números de teléfono (encriptados mediante algoritmos de seguridad).</li>
              <li>Historial de pedidos y comportamiento de compra.</li>
            </ul>
          </section>

          <section className="mb-10 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Seguridad y Encriptación</h2>
            <p className="text-slate-700 leading-relaxed">
              Utilizamos un sistema de **criptografía avanzada** para asegurar que los datos sensibles de tus clientes nunca queden expuestos. Los datos se desencriptan únicamente en memoria durante milisegundos para que nuestra IA realice el análisis de riesgo y se vuelven a proteger inmediatamente.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Proveedores de servicios (Terceros)</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Para el correcto funcionamiento de SAMGPLE, trabajamos con proveedores de primer nivel que cumplen con el RGPD:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>Supabase:</strong> Para el almacenamiento seguro de la base de datos.</li>
              <li><strong>Vapi / OpenAI:</strong> Para el análisis inteligente de voz y texto de los pedidos.</li>
              <li><strong>Lemon Squeezy:</strong> Como nuestro <em>Merchant of Record</em> para la gestión de pagos, facturación e impuestos internacionales.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Tus derechos</h2>
            <p className="text-slate-700 leading-relaxed">
              Como usuario de SAMGPLE, tienes derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento desde tu panel de control o enviando un correo a <strong>hola@samgple.com</strong>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}