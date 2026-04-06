'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Order {
  id: string
  order_number: string | number
  created_at: string
  next_call_at?: string
  last_call_at?: string
  call_status?: string
  call_attempts?: number
  call_summary?: string
  total_price?: number
  status?: string
  phone?: string
  customers?: { first_name?: string; last_name?: string; phone?: string }
  order_items?: Array<{ name: string; quantity: number; price: number }>
  order_risk_analyses?: Array<{ risk_score: number; summary: string }>
}

// ─── Static config ────────────────────────────────────────────────────────────
const CALL_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  confirmed:    { label: 'Confirmado',    color: '#16a34a', bg: '#f0fdf4', dot: '#22c55e' },
  no_answer:    { label: 'No contestó',   color: '#d97706', bg: '#fffbeb', dot: '#f59e0b' },
  cancelled:    { label: 'Cancelado',     color: '#dc2626', bg: '#fef2f2', dot: '#ef4444' },
  voicemail:    { label: 'Buzón de voz',  color: '#7c3aed', bg: '#f5f3ff', dot: '#8b5cf6' },
  wrong_number: { label: 'Nº incorrecto', color: '#64748b', bg: '#f8fafc', dot: '#94a3b8' },
  calling:      { label: 'Llamando…',     color: '#0284c7', bg: '#f0f9ff', dot: '#38bdf8' },
  pending:      { label: 'Pendiente',     color: '#64748b', bg: '#f8fafc', dot: '#94a3b8' },
  rescheduled:  { label: 'Reagendado',    color: '#0284c7', bg: '#f0f9ff', dot: '#38bdf8' },
}

const ORDER_STATUS_OPTIONS = [
  { value: 'por_confirmar', label: 'Por confirmar', color: '#64748b', bg: '#f8fafc', ring: '#e2e8f0' },
  { value: 'confirmado',    label: 'Confirmado',    color: '#16a34a', bg: '#f0fdf4', ring: '#bbf7d0' },
  { value: 'enviado',       label: 'Enviado',       color: '#0284c7', bg: '#f0f9ff', ring: '#bae6fd' },
  { value: 'entregado',     label: 'Entregado',     color: '#15803d', bg: '#dcfce7', ring: '#86efac' },
  { value: 'incidencia',    label: 'Incidencia',    color: '#d97706', bg: '#fffbeb', ring: '#fde68a' },
  { value: 'cancelado',     label: 'Cancelado',     color: '#dc2626', bg: '#fef2f2', ring: '#fecaca' },
]

const FILTERS = [
  { key: 'all',       label: 'Todos' },
  { key: 'pending',   label: 'Pendientes' },
  { key: 'confirmed', label: 'Confirmados' },
  { key: 'no_answer', label: 'No contestó' },
  { key: 'cancelled', label: 'Cancelados' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scoreConfig(score: number) {
  if (score <= 35) return { label: 'Bajo riesgo',  color: '#16a34a', bar: '#22c55e', bg: '#f0fdf4', width: score }
  if (score <= 65) return { label: 'Riesgo medio', color: '#d97706', bar: '#f59e0b', bg: '#fffbeb', width: score }
  return               { label: 'Alto riesgo',  color: '#dc2626', bar: '#ef4444', bg: '#fef2f2', width: score }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = memo(function Skeleton({ w = '100%', h = 12, r = 6 }: { w?: string | number; h?: number; r?: number }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: 'linear-gradient(90deg,#f1f5f9 25%,#e9edf2 50%,#f1f5f9 75%)', backgroundSize: '300% 100%', animation: 'ped-shimmer 1.5s ease-in-out infinite' }} />
})

const SkeletonCard = memo(function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9', padding: '20px 22px', animation: `ped-fadein 0.25s ease ${delay}s both`, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Skeleton w={48} h={48} r={14} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton w="55%" h={13} />
          <Skeleton w="35%" h={10} />
          <div style={{ display: 'flex', gap: 6 }}><Skeleton w={72} h={22} r={20} /><Skeleton w={72} h={22} r={20} /></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <Skeleton w={64} h={22} /><Skeleton w={80} h={18} r={20} />
        </div>
      </div>
    </div>
  )
})

// ─── Pill ─────────────────────────────────────────────────────────────────────
const Pill = memo(function Pill({ label, color, bg, dot }: { label: string; color: string; bg: string; dot?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: bg, color }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot, flexShrink: 0 }} />}
      {label}
    </span>
  )
})

// ─── RiskBar ──────────────────────────────────────────────────────────────────
const RiskBar = memo(function RiskBar({ score }: { score: number }) {
  const cfg = scoreConfig(score)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, borderRadius: 5, background: '#f1f5f9', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${cfg.width}%`, background: cfg.bar, borderRadius: 5, transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, whiteSpace: 'nowrap' }}>{score} · {cfg.label}</span>
    </div>
  )
})

// ─── TranscriptModal ──────────────────────────────────────────────────────────
const TranscriptModal = memo(function TranscriptModal({ data, onClose }: { data: any; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'ped-fadein 0.15s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: '28px 28px 48px', width: '100%', maxWidth: 580, maxHeight: '75vh', overflowY: 'auto', animation: 'ped-slideup 0.22s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 4, background: '#e2e8f0', margin: '0 auto 24px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>Transcripción de llamada</span>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {data ? (
          <>
            {data.duration_seconds && <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16, fontWeight: 500 }}>Duración: {data.duration_seconds}s</div>}
            {data.summary && (
              <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '14px 16px', marginBottom: 16, border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#15803d', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Resumen IA</p>
                <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.65 }}>{data.summary}</p>
              </div>
            )}
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>{data.transcript ?? 'Sin transcripción disponible.'}</p>
          </>
        ) : (
          <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '32px 0' }}>Sin transcripción disponible todavía.</p>
        )}
      </div>
    </div>
  )
})

// ─── OrderCard ────────────────────────────────────────────────────────────────
interface CardProps {
  order: Order
  isExpanded: boolean
  isNew: boolean
  waMsg: string | undefined
  isLoadingWa: boolean
  isCalling: boolean
  isReanalyzing: boolean
  isSavingStatus: boolean
  onToggle: (id: string) => void
  onGenerateWa: (order: Order) => void
  onSendWa: (order: Order) => void
  onCall: (id: string) => void
  onRetry: (id: string) => void
  onReanalyze: (id: string) => void
  onStatusChange: (id: string, status: string) => void
  onTranscript: (id: string) => void
  index: number
}

const OrderCard = memo(function OrderCard({
  order, isExpanded, isNew, waMsg,
  isLoadingWa, isCalling, isReanalyzing, isSavingStatus,
  onToggle, onGenerateWa, onSendWa,
  onCall, onRetry, onReanalyze, onStatusChange, onTranscript, index,
}: CardProps) {
  const callCfg   = CALL_STATUS_CONFIG[order.call_status ?? 'pending'] ?? CALL_STATUS_CONFIG.pending
  const score     = order.order_risk_analyses?.[0]?.risk_score ?? 50
  const summary   = order.call_summary ?? order.order_risk_analyses?.[0]?.summary
  const name      = `${order.customers?.first_name ?? ''} ${order.customers?.last_name ?? ''}`.trim() || 'Cliente'
  const initial   = name.charAt(0).toUpperCase()
  const phone     = order.customers?.phone ?? order.phone ?? ''
  const items     = order.order_items ?? []
  const statusOpt = ORDER_STATUS_OPTIONS.find(s => s.value === order.status) ?? ORDER_STATUS_OPTIONS[0]
  const scoreCfg  = scoreConfig(score)

  const hasAttempts   = (order.call_attempts ?? 0) > 0
  const isCalling_now = order.call_status === 'calling'
  const callLabel     = isCalling ? 'Llamando…' : hasAttempts ? 'Rellamar' : 'Llamar'
  const callIcon      = isCalling ? <Spinner color="#0284c7" /> : hasAttempts ? <RetryIcon /> : <PhoneIcon />
  const handleCallBtn = () => hasAttempts ? onRetry(order.id) : onCall(order.id)

  return (
    <div
      style={{
        background: '#fff', borderRadius: 20,
        border: `1.5px solid ${isNew ? '#2EC4B6' : '#f1f5f9'}`,
        overflow: 'hidden',
        boxShadow: isNew
          ? '0 0 0 4px rgba(46,196,182,0.08), 0 4px 16px rgba(0,0,0,.06)'
          : '0 2px 8px rgba(0,0,0,.04)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        animation: index < 10 ? `ped-fadein 0.2s ease ${index * 0.03}s both` : 'none',
      }}
      className="ped-card"
    >
      {/* Header */}
      <div onClick={() => onToggle(order.id)} style={{ padding: '18px 22px', cursor: 'pointer', userSelect: 'none' }}>
        {isNew && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 12, fontSize: 10, fontWeight: 700, color: '#0f766e', background: '#f0fdf4', padding: '4px 10px', borderRadius: 20, border: '1px solid #bbf7d0' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', animation: 'ped-pulse 1.2s infinite' }} />
            NUEVO PEDIDO
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
            {/* Avatar con color de riesgo */}
            <div style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: scoreCfg.bg,
              border: `2px solid ${scoreCfg.bar}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: scoreCfg.color, letterSpacing: '-0.5px',
            }}>
              {isCalling_now
                ? <div style={{ width: 20, height: 20, border: '2.5px solid #0284c720', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'ped-spin 0.8s linear infinite' }} />
                : initial
              }
            </div>

            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>
                {name}
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px', fontWeight: 500 }}>
                {phone || '—'}
              </p>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <Pill label={callCfg.label} color={callCfg.color} bg={callCfg.bg} dot={callCfg.dot} />
                <Pill label={statusOpt.label} color={statusOpt.color} bg={statusOpt.bg} />
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 3px', letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
              {Number(order.total_price ?? 0).toFixed(2)}€
            </p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 8px', fontWeight: 500 }}>#{order.order_number}</p>
            <RiskBar score={score} />
          </div>
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div style={{ borderTop: '1px solid #f8fafc', background: '#fafbfc', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14, animation: 'ped-fadein 0.18s ease' }}>

          {/* Products */}
          {items.length > 0 && (
            <Section title="Productos">
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: idx > 0 ? '8px 0 0' : '0', borderTop: idx > 0 ? '1px solid #f1f5f9' : 'none' }}>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
                    {item.name}<span style={{ color: '#94a3b8', fontWeight: 400 }}> ×{item.quantity}</span>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>{Number(item.price).toFixed(2)}€</span>
                </div>
              ))}
            </Section>
          )}

          {/* Summary + WhatsApp */}
          <div className="ped-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <Section title="Resumen IA">
              <p style={{ fontSize: 13, color: summary ? '#374151' : '#94a3b8', lineHeight: 1.7, margin: 0, fontStyle: summary ? 'normal' : 'italic' }}>
                {summary ?? 'La llamada aún no se ha realizado.'}
              </p>
              {(order.call_attempts ?? 0) > 0 && (
                <p style={{ fontSize: 11, color: '#94a3b8', margin: '8px 0 0', fontWeight: 500 }}>
                  {order.call_attempts} intento{order.call_attempts! > 1 ? 's' : ''}{order.last_call_at && ` · ${fmt(order.last_call_at)}`}
                </p>
              )}
            </Section>

            <div style={{ background: '#fff', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <WhatsAppIcon />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#15803d' }}>WhatsApp IA</span>
                </div>
                {!waMsg && (
                  <ActionBtn onClick={() => onGenerateWa(order)} disabled={isLoadingWa} variant="ghost" small>
                    {isLoadingWa ? 'Generando…' : 'Generar'}
                  </ActionBtn>
                )}
              </div>
              {waMsg ? (
                <>
                  <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.65, margin: '0 0 12px' }}>{waMsg}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <ActionBtn onClick={() => onSendWa(order)} variant="green"><WhatsAppIcon />Enviar</ActionBtn>
                    <ActionBtn onClick={() => onGenerateWa(order)} disabled={isLoadingWa} variant="ghost">{isLoadingWa ? '…' : 'Regenerar'}</ActionBtn>
                  </div>
                </>
              ) : (
                !isLoadingWa && <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>Genera un mensaje personalizado para WhatsApp</p>
              )}
            </div>
          </div>

          {/* Order status */}
          <Section title="Estado del pedido">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ORDER_STATUS_OPTIONS.map(s => (
                <button key={s.value} onClick={() => onStatusChange(order.id, s.value)} disabled={isSavingStatus}
                  style={{
                    padding: '6px 14px', borderRadius: 20,
                    border: `1.5px solid ${order.status === s.value ? s.ring : '#f1f5f9'}`,
                    background: order.status === s.value ? s.bg : '#fff',
                    color: order.status === s.value ? s.color : '#94a3b8',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    opacity: isSavingStatus ? 0.55 : 1, transition: 'all 0.12s',
                  }}
                  className="ped-status-btn"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          {/* ── Acciones — 3 botones ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <ActionBtn onClick={() => onTranscript(order.id)} variant="default" icon>
              <DocIcon />Transcripción
            </ActionBtn>

            <ActionBtn onClick={() => onReanalyze(order.id)} disabled={isReanalyzing} variant="purple" icon>
              {isReanalyzing ? <><Spinner color="#7c3aed" />Analizando…</> : <><BrainIcon />Reanalizar</>}
            </ActionBtn>

            <ActionBtn onClick={handleCallBtn} disabled={isCalling || isCalling_now} variant="blue" icon>
              {callIcon}{callLabel}
            </ActionBtn>
          </div>

          {/* Nota coste reanálisis */}
          <p style={{ fontSize: 11, color: '#94a3b8', margin: '-4px 0 0', textAlign: 'center', fontWeight: 500 }}>
            Reanalizar consume <strong style={{ color: '#7c3aed' }}>0,02 tokens</strong>
          </p>

        </div>
      )}

      {/* Footer */}
      <div onClick={() => onToggle(order.id)} style={{ padding: '10px 22px', borderTop: '1px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isExpanded ? '#fafbfc' : '#fff' }}>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
          <ClockIcon />{fmt(order.created_at)}
          {order.next_call_at && ` · Próximo: ${new Date(order.next_call_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
        </span>
        <ChevronIcon up={isExpanded} />
      </div>
    </div>
  )
})

// ─── Atoms ────────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #f1f5f9' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>{title}</p>
      {children}
    </div>
  )
}

function ActionBtn({ children, onClick, disabled, variant, small, icon }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean
  variant?: 'default' | 'green' | 'blue' | 'ghost' | 'purple'; small?: boolean; icon?: boolean
}) {
  const styles: Record<string, React.CSSProperties> = {
    default: { background: '#fff',     border: '1px solid #f1f5f9', color: '#64748b' },
    green:   { background: '#16a34a',  border: 'none',              color: '#fff'    },
    blue:    { background: '#eff6ff',  border: '1px solid #bfdbfe', color: '#1d4ed8' },
    ghost:   { background: '#fff',     border: '1px solid #f1f5f9', color: '#64748b' },
    purple:  { background: '#faf5ff',  border: '1px solid #e9d5ff', color: '#7c3aed' },
  }
  return (
    <button onClick={onClick} disabled={disabled} className="ped-action-btn"
      style={{
        ...styles[variant ?? 'default'],
        padding: small ? '5px 12px' : '10px 14px',
        borderRadius: small ? 20 : 12,
        fontSize: small ? 11 : 12,
        fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        fontFamily: 'inherit', opacity: disabled ? 0.55 : 1, transition: 'all 0.12s', width: '100%',
      }}
    >
      {children}
    </button>
  )
}

function Spinner({ color = '#64748b' }) {
  return <div style={{ width: 13, height: 13, borderRadius: '50%', border: `2px solid ${color}20`, borderTopColor: color, animation: 'ped-spin 0.7s linear infinite', flexShrink: 0 }} />
}

const PhoneIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
const DocIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
const RetryIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.68"/></svg>
const BrainIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
const ClockIcon  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const ChevronIcon = ({ up }: { up: boolean }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">{up ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}</svg>
const WhatsAppIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="#16a34a"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.057 23.428a.75.75 0 00.921.908l5.687-1.488A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.712 9.712 0 01-4.93-1.344l-.354-.21-3.668.961.976-3.564-.23-.368A9.719 9.719 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  :root { --header-height: 0px; }
  @keyframes ped-spin    { to { transform: rotate(360deg); } }
  @keyframes ped-shimmer { 0%{background-position:300% 0} 100%{background-position:-300% 0} }
  @keyframes ped-fadein  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ped-slideup { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes ped-pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
  .ped-card { transition: box-shadow 0.2s, transform 0.15s; }
  .ped-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.08) !important; transform: translateY(-1px); }
  .ped-action-btn:not(:disabled):hover { opacity: 0.82; transform: translateY(-1px); }
  .ped-action-btn:not(:disabled):active { transform: scale(0.97); }
  .ped-status-btn:not(:disabled):hover { opacity: 0.8; transform: translateY(-1px); }
  .ped-filter-btn { transition: all 0.12s; }
  .chip-scroll::-webkit-scrollbar { display: none; }
  @media(min-width:600px) { .ped-grid2 { grid-template-columns: 1fr 1fr !important; } }
`

function GlobalStyles() { return <style>{GLOBAL_CSS}</style> }

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PedidosClient({ initialOrders, accountId }: { initialOrders: Order[]; accountId: string }) {
  const [orders, setOrders]             = useState<Order[]>(initialOrders)
  const [filter, setFilter]             = useState('all')
  const [search, setSearch]             = useState('')
  const [expanded, setExpanded]         = useState<string | null>(null)
  const [waMessages, setWaMessages]     = useState<Record<string, string>>({})
  const [loadingWa, setLoadingWa]       = useState<Record<string, boolean>>({})
  const [loadingCall, setLoadingCall]   = useState<Record<string, boolean>>({})
  const [loadingAnalysis, setLoadingAnalysis] = useState<Record<string, boolean>>({})
  const [savingStatus, setSavingStatus] = useState<Record<string, boolean>>({})
  const [newOrderIds, setNewOrderIds]   = useState<Set<string>>(new Set())
  const [transcript, setTranscript]     = useState<Record<string, any>>({})
  const [showTranscript, setShowTranscript] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel(`pedidos-${accountId}`)

    async function fetchDecryptedOrder(orderId: string) {
      const res = await fetch(`/api/orders/${orderId}`)
      if (!res.ok) return null
      const data = await res.json()
      return data.order ?? null
    }

    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders', filter: `account_id=eq.${accountId}` }, async (payload) => {
      const order = await fetchDecryptedOrder(payload.new.id)
      if (order) {
        setOrders(prev => [order, ...prev])
        setNewOrderIds(prev => new Set([...prev, order.id]))
        setTimeout(() => setNewOrderIds(prev => { const s = new Set(prev); s.delete(order.id); return s }), 4000)
      }
    })

    channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `account_id=eq.${accountId}` }, async (payload) => {
      const order = await fetchDecryptedOrder(payload.new.id)
      if (order) setOrders(prev => prev.map(o => o.id === order.id ? order : o))
    })

    channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'call_logs' }, async (payload) => {
      const log = payload.new as any
      if (!log.order_id) return
      const order = await fetchDecryptedOrder(log.order_id)
      if (order) setOrders(prev => prev.map(o => o.id === order.id ? order : o))
    })

    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [accountId])

  const filtered = useMemo(() => orders.filter(o => {
    const matchFilter = filter === 'all' ? true : filter === 'pending' ? (o.call_status === 'pending' || o.call_status === 'calling') : o.call_status === filter
    const matchSearch = search === '' || `${o.customers?.first_name ?? ''} ${o.customers?.last_name ?? ''}`.toLowerCase().includes(search.toLowerCase()) || String(o.order_number ?? '').includes(search)
    return matchFilter && matchSearch
  }), [orders, filter, search])

  const pendingCount = useMemo(() => orders.filter(o => o.call_status === 'pending' || !o.call_status).length, [orders])

  const handleToggle     = useCallback((id: string) => setExpanded(prev => prev === id ? null : id), [])

  const generateWhatsApp = useCallback(async (order: Order) => {
    setLoadingWa(prev => ({ ...prev, [order.id]: true }))
    try {
      const res  = await fetch(`/api/orders/${order.id}/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: order.id }) })
      const data = await res.json()
      if (data.message) setWaMessages(prev => ({ ...prev, [order.id]: data.message }))
    } finally { setLoadingWa(prev => ({ ...prev, [order.id]: false })) }
  }, [])

  const sendWhatsApp = useCallback((order: Order) => {
    const msg   = waMessages[order.id]; if (!msg) return
    const phone = (order.customers?.phone ?? order.phone ?? '').replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }, [waMessages])

  const handleCall = useCallback(async (orderId: string) => {
    setLoadingCall(prev => ({ ...prev, [orderId]: true }))
    try {
      const res  = await fetch('/api/vapi/call', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: orderId }) })
      const data = await res.json()
      if (!res.ok) console.error('[VAPI call]', data.error)
    } finally { setLoadingCall(prev => ({ ...prev, [orderId]: false })) }
  }, [])

  const handleRetry = useCallback(async (orderId: string) => {
    setLoadingCall(prev => ({ ...prev, [orderId]: true }))
    try {
      const res  = await fetch('/api/vapi/retry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: orderId }) })
      const data = await res.json()
      if (!res.ok) console.error('[VAPI retry]', data.error)
    } finally { setLoadingCall(prev => ({ ...prev, [orderId]: false })) }
  }, [])

  // ── Reanálisis manual → 0.02 tokens ──
  const handleReanalyze = useCallback(async (orderId: string) => {
    setLoadingAnalysis(prev => ({ ...prev, [orderId]: true }))
    try {
      const res  = await fetch(`/api/orders/${orderId}/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ manual: true }) })
      const data = await res.json()
      if (!res.ok) alert(data.error ?? 'Error al reanalizar')
    } finally { setLoadingAnalysis(prev => ({ ...prev, [orderId]: false })) }
  }, [])

  const handleStatusChange = useCallback(async (orderId: string, status: string) => {
    setSavingStatus(prev => ({ ...prev, [orderId]: true }))
    try {
      await fetch(`/api/orders/${orderId}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    } finally { setSavingStatus(prev => ({ ...prev, [orderId]: false })) }
  }, [])

  const handleViewTranscript = useCallback(async (orderId: string) => {
    if (transcript[orderId]) { setShowTranscript(orderId); return }
    const { data } = await supabase.from('call_logs').select('transcript, summary, duration_seconds').eq('order_id', orderId).order('created_at', { ascending: false }).limit(1).single()
    setTranscript(prev => ({ ...prev, [orderId]: data ?? null }))
    setShowTranscript(orderId)
  }, [transcript, supabase])

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const F = 'system-ui,-apple-system,sans-serif'

  return (
    <>
      <GlobalStyles />
      {showTranscript && <TranscriptModal data={transcript[showTranscript]} onClose={() => setShowTranscript(null)} />}

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '16px clamp(16px,4vw,28px) 0', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 'var(--header-height, 0px)', zIndex: 40 }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(18px,3.5vw,24px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.6px' }}>Pedidos</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'ped-pulse 2.4s infinite', display: 'inline-block' }} />
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontWeight: 500 }}>Tiempo real · {filtered.length} pedidos</p>
                </div>
              </div>
              {pendingCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 20, background: '#fffbeb', border: '1.5px solid #fde68a' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', animation: 'ped-pulse 1.8s infinite' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>{pendingCount} pendiente{pendingCount > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14, marginBottom: 12, transition: 'border-color 0.15s, box-shadow 0.15s' }}
              onFocus={e => { const t = e.currentTarget as HTMLDivElement; t.style.borderColor = '#2EC4B6'; t.style.boxShadow = '0 0 0 3px rgba(46,196,182,0.1)' }}
              onBlur={e => { const t = e.currentTarget as HTMLDivElement; t.style.borderColor = '#f1f5f9'; t.style.boxShadow = 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o número de pedido…"
                style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F, fontWeight: 400 }} />
              {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>}
            </div>

            {/* Filters */}
            <div className="chip-scroll" style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
              {FILTERS.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)} className="ped-filter-btn"
                  style={{ padding: '8px 16px', borderRadius: '12px 12px 0 0', fontSize: 12, fontWeight: 600, border: 'none', borderBottom: filter === f.key ? '2.5px solid #2EC4B6' : '2.5px solid transparent', background: filter === f.key ? 'rgba(46,196,182,0.07)' : 'transparent', color: filter === f.key ? '#0f766e' : '#94a3b8', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: F }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,28px) 60px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!mounted && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} delay={i * 0.04} />)}

          {mounted && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,.04)', animation: 'ped-fadein 0.2s ease' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.3px' }}>Sin resultados</p>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>No hay pedidos que coincidan con los filtros actuales</p>
            </div>
          )}

          {mounted && filtered.map((order, i) => (
            <OrderCard
              key={order.id}
              order={order}
              index={i}
              isExpanded={expanded === order.id}
              isNew={newOrderIds.has(order.id)}
              waMsg={waMessages[order.id]}
              isLoadingWa={!!loadingWa[order.id]}
              isCalling={!!loadingCall[order.id]}
              isReanalyzing={!!loadingAnalysis[order.id]}
              isSavingStatus={!!savingStatus[order.id]}
              onToggle={handleToggle}
              onGenerateWa={generateWhatsApp}
              onSendWa={sendWhatsApp}
              onCall={handleCall}
              onRetry={handleRetry}
              onReanalyze={handleReanalyze}
              onStatusChange={handleStatusChange}
              onTranscript={handleViewTranscript}
            />
          ))}
        </div>
      </div>
    </>
  )
}