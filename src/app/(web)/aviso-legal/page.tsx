import React from 'react'

export const metadata = {
  title: 'Aviso Legal | SAMGPLE',
  description: 'Información legal sobre el titular del sitio web SAMGPLE.',
}

export default function AvisoLegalPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8 lg:py-24">
        
        {/* Encabezado */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-4 border border-slate-200">
            Documento de Identidad Legal
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Aviso Legal
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).
          </p>
        </div>

        {/* Contenido Legal */}
        <div className="prose prose-slate prose-lg max-w-none">
          
          <section className="mb-10 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">1. Datos Identificativos</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              En cumplimiento con el deber de información, se facilitan los siguientes datos del titular del sitio web:
            </p>
            <div className="space-y-4 text-slate-700">
              <div className="flex flex-col sm:flex-row sm:gap-4 border-b border-slate-100 pb-2">
                <span className="font-bold w-40 shrink-0">Nombre Comercial:</span>
                <span>SAMGPLE</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4 border-b border-slate-100 pb-2">
                <span className="font-bold w-40 shrink-0">Titular / Empresa:</span>
                <span className="text-blue-600 italic">[Tu Nombre Completo o Nombre de tu SL]</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4 border-b border-slate-100 pb-2">
                <span className="font-bold w-40 shrink-0">NIF / CIF:</span>
                <span className="text-blue-600 italic">[Tu DNI o CIF de empresa]</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4 border-b border-slate-100 pb-2">
                <span className="font-bold w-40 shrink-0">Domicilio Social:</span>
                <span className="text-blue-600 italic">[Tu dirección o ciudad, España]</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-bold w-40 shrink-0">Email de contacto:</span>
                <span>soporte@samgple.com</span>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Propiedad Intelectual</h2>
            <p className="text-slate-700 leading-relaxed">
              Todos los contenidos de este sitio web (textos, gráficos, logotipos, iconos de botones, imágenes y software) son propiedad de SAMGPLE o de sus proveedores de contenidos, protegidos por las leyes de propiedad intelectual internacionales. El algoritmo de scoring y el código fuente del <strong>Risk Engine</strong> son propiedad exclusiva de SAMGPLE.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Exclusión de Responsabilidad</h2>
            <p className="text-slate-700 leading-relaxed">
              SAMGPLE no se hace responsable de los daños y perjuicios que pudieran derivarse de la falta de veracidad, exactitud o actualidad de la información suministrada por los clientes para el análisis de riesgo. El servicio de IA es orientativo y no garantiza la eliminación total del fraude en el eCommerce del cliente.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Venta de Servicios</h2>
            <p className="text-slate-700 leading-relaxed">
              La venta de tokens y planes de suscripción se realiza a través de <strong>Lemon Squeezy</strong>, quien actúa como el vendedor autorizado legalmente (Merchant of Record). Las condiciones de venta específicas se rigen por los Términos de Uso de SAMGPLE y las políticas de Lemon Squeezy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Legislación Aplicable</h2>
            <p className="text-slate-700 leading-relaxed">
              Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades en él desarrolladas, será de aplicación la legislación española, a la que se someten expresamente las partes.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}