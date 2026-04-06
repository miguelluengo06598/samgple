import React from 'react'

export const metadata = {
  title: 'Términos de Uso | SAMGPLE',
  description: 'Condiciones legales para el uso de la plataforma SAMGPLE.',
}

export default function TerminosPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8 lg:py-24">
        
        {/* Encabezado */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-4 border border-blue-100">
            Vigente desde: 6 de abril de 2026
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Términos de Uso
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Al usar SAMGPLE, aceptas estas condiciones. Por favor, léelas con calma.
          </p>
        </div>

        {/* Contenido Legal */}
        <div className="prose prose-slate prose-lg max-w-none">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Aceptación del Servicio</h2>
            <p className="text-slate-700 leading-relaxed">
              SAMGPLE ofrece un software de análisis de riesgo basado en IA para pedidos eCommerce. Al registrarte y utilizar nuestra plataforma, confirmas que eres mayor de edad y que tienes autoridad para vincular a tu empresa a estos términos.
            </p>
          </section>

          <section className="mb-10 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 text-emerald-700">2. Tarifas y Pagos (Lemon Squeezy)</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Nuestro modelo de negocio se basa en el consumo de créditos (tokens):
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Cada análisis inicial de pedido tiene un coste de <strong>0.17 €</strong> (o su equivalente en créditos).</li>
              <li>Los reanálisis manuales tienen un coste reducido de <strong>0.02 €</strong>.</li>
              <li><strong>Merchant of Record:</strong> Todos los pagos, suscripciones y facturación son gestionados por <strong>Lemon Squeezy</strong>, quien actúa como el vendedor autorizado legalmente.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Uso Responsable de la IA</h2>
            <p className="text-slate-700 leading-relaxed">
              SAMGPLE utiliza modelos de Inteligencia Artificial para generar recomendaciones de riesgo. Estas recomendaciones son **herramientas de apoyo**. El usuario es el único responsable final de decidir si envía o cancela un pedido. SAMGPLE no se hace responsable de pérdidas económicas derivadas de las decisiones tomadas basándose en nuestros análisis.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Propiedad de los Datos</h2>
            <p className="text-slate-700 leading-relaxed">
              Tú mantienes la propiedad de todos los datos de pedidos que subas a la plataforma. Al usarnos, nos otorgas permiso para procesar esos datos (de forma encriptada) con el único fin de generar el análisis de riesgo solicitado y mejorar la precisión de nuestros algoritmos de prevención de fraude.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Cancelación de Cuenta</h2>
            <p className="text-slate-700 leading-relaxed">
              Puedes dejar de usar SAMGPLE en cualquier momento. Al no existir permanencia, simplemente dejarás de consumir créditos. El saldo de créditos no consumidos no es reembolsable, salvo que la ley local indique lo contrario.
            </p>
          </section>

          <section className="mb-10 border-t border-slate-200 pt-8 text-center italic text-slate-500">
            <p>¿Tienes dudas sobre los términos? Escríbenos a <strong>soporte@samgple.com</strong></p>
          </section>

        </div>
      </div>
    </div>
  )
}