import React from 'react'

// ─── Design tokens ──────────────────────────────────────────────────────────
export const N = {
  bg: '#f4f4f4',
  surface: '#ffffff',
  surface2: '#f0f0f0',
  surface3: '#e8e8e8',
  border: 'rgba(0,0,0,0.08)',
  border2: 'rgba(0,0,0,0.13)',
  text: '#1a1a1a',
  muted: '#666',
  muted2: '#999',
  green: '#911619',
  greenDim: 'rgba(145,22,25,0.08)',
  greenGlow: 'rgba(145,22,25,0.12)',
  red: '#ff6b6b',
  redDim: 'rgba(255,107,107,0.1)',
  blue: '#4d9fff',
  blueDim: 'rgba(77,159,255,0.1)',
  yellow: '#f5c542',
}

export function ProgressBar({ value, color = N.green, height = 4 }) {
  return (
    <div style={{ background: N.surface3, borderRadius: 99, height, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${Math.min(100, value)}%`,
        background: color,
        borderRadius: 99,
        transition: 'width 0.6s ease',
        boxShadow: `0 0 8px ${color}55`,
      }} />
    </div>
  )
}

export function Badge({ children, color = 'default' }) {
  const map = {
    default: { bg: N.surface3, color: N.muted, border: N.border },
    green:   { bg: 'rgba(145,22,25,0.07)', color: '#911619', border: 'rgba(145,22,25,0.18)' },
    blue:    { bg: '#eff6ff', color: '#2563a8', border: 'rgba(37,99,168,0.2)' },
    red:     { bg: 'rgba(145,22,25,0.07)', color: '#911619', border: 'rgba(145,22,25,0.18)' },
    yellow:  { bg: 'rgba(245,197,66,0.12)', color: '#9a6a00', border: 'rgba(245,197,66,0.3)' },
  }
  const s = map[color] || map.default
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 4,
      fontSize: 12, fontWeight: 500, letterSpacing: '0.03em',
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontFamily: 'inherit',
    }}>{children}</span>
  )
}

export function Card({ children, style = {}, onClick }) {
  const [hover, setHover] = React.useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover && onClick ? '#fafafa' : N.surface,
        border: `1px solid ${hover && onClick ? N.border2 : N.border}`,
        borderRadius: 12,
        padding: '16px 20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
        boxShadow: hover && onClick ? '0 4px 16px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
        ...style,
      }}>
      {children}
    </div>
  )
}

export function Btn({ children, onClick, variant = 'default', size = 'md', style = {}, disabled }) {
  const [hover, setHover] = React.useState(false)
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: 'none', borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.15s',
    opacity: disabled ? 0.4 : 1,
  }
  const sizes = {
    sm: { padding: '4px 10px', fontSize: 13 },
    md: { padding: '7px 14px', fontSize: 14 },
    lg: { padding: '9px 18px', fontSize: 15 },
  }
  const variants = {
    default: {
      background: hover ? N.surface3 : N.surface2, color: N.text,
      border: `1px solid ${N.border}`,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.07)',
    },
    primary: {
      background: hover ? '#7a1215' : '#911619', color: '#fff',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.12), 0 2px 6px rgba(145,22,25,0.25)',
    },
    ghost:  { background: hover ? N.surface2 : 'transparent', color: N.muted },
    danger: { background: hover ? N.redDim : 'transparent', color: N.red, border: `1px solid rgba(255,107,107,0.2)` },
  }
  return (
    <button
      onClick={disabled ? null : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  )
}

export function Input({ value, onChange, placeholder, type = 'text', style = {} }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '8px 12px',
        background: N.surface2, border: `1px solid ${N.border}`,
        borderRadius: 6, color: N.text, fontSize: 14,
        fontFamily: 'inherit', outline: 'none',
        ...style,
      }}
    />
  )
}

export function Select({ value, onChange, options, style = {} }) {
  return (
    <select
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
      style={{
        width: '100%', padding: '8px 12px',
        background: N.surface2, border: `1px solid ${N.border}`,
        borderRadius: 6, color: N.text, fontSize: 14,
        fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
        ...style,
      }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

export function Textarea({ value, onChange, placeholder, rows = 4, style = {} }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '8px 12px',
        background: N.surface2, border: `1px solid ${N.border}`,
        borderRadius: 6, color: N.text, fontSize: 14,
        fontFamily: 'inherit', outline: 'none', resize: 'vertical',
        ...style,
      }}
    />
  )
}

export function Avatar({ name, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: N.greenDim, border: `1px solid rgba(145,22,25,0.22)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 600, color: N.green,
      flexShrink: 0,
    }}>
      {name?.[0] ?? '?'}
    </div>
  )
}

export function SectionTitle({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <h2 style={{ fontSize: 11, fontWeight: 600, color: N.muted2, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{children}</h2>
      {action}
    </div>
  )
}

export function Divider({ style = {} }) {
  return <div style={{ borderTop: `1px solid ${N.border}`, ...style }} />
}

export function StatCard({ label, value, suffix = '', color = N.text }) {
  return (
    <Card style={{ flex: 1 }}>
      <div style={{ fontSize: 11, color: N.muted2, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>
        {value}<span style={{ fontSize: 14, fontWeight: 400, color: N.muted, marginLeft: 2 }}>{suffix}</span>
      </div>
    </Card>
  )
}
