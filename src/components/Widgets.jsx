import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export function HeroAura() {
  return (
    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-fuchsia-900/20 via-indigo-900/10 to-cyan-900/20">
      <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0b0e13] via-transparent to-transparent"></div>
      <div className="absolute inset-0 flex items-end">
        <div className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold">AI Founder Command Console</h2>
          <p className="text-slate-400 text-sm">Your single-player HQ for planning, delivery, and growth.</p>
        </div>
      </div>
    </div>
  )
}

export function Card({ title, subtitle, children, actions }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f131a] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="p-4 md:p-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{title}</div>
          {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </div>
  )
}

export function Pill({ children, active }) {
  return <span className={`text-xs px-2.5 py-1 rounded-full border ${active ? 'bg-gradient-to-r from-fuchsia-600/20 to-cyan-600/20 border-white/20' : 'border-white/10 bg-white/5'} `}>{children}</span>
}

export function GradientButton({ children, ...props }) {
  return (
    <button {...props} className="px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-300 transition-colors">
      {children}
    </button>
  )
}

export function Progress({ value }) {
  return (
    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" style={{ width: `${value}%` }} />
    </div>
  )
}
