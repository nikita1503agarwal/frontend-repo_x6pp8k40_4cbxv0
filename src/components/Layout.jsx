import { useMemo } from 'react'
import { Home, Boxes, Users, FlaskConical, Palette, Workflow, Sparkles, Layers, CalendarCheck2, Settings, Search } from 'lucide-react'

export default function Layout({ current, onNavigate, children }) {
  const nav = useMemo(() => ([
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'service', label: 'Service Studio', icon: Boxes },
    { key: 'clients', label: 'Client & Project Hub', icon: Users },
    { key: 'lab', label: 'Prompt & Engine Lab', icon: FlaskConical },
    { key: 'creative', label: 'Creative Studio', icon: Palette },
    { key: 'audit', label: 'Workflow Audit Lab', icon: Workflow },
    { key: 'persona', label: 'Persona Forge', icon: Sparkles },
    { key: 'subscription', label: 'Subscription Tier Planner', icon: Layers },
    { key: 'tasks', label: 'My Day / Tasks', icon: CalendarCheck2 },
    { key: 'settings', label: 'Settings & Resources', icon: Settings },
  ]), [])

  const now = new Date()
  const dateStr = now.toLocaleString()

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_800px_at_20%_-10%,rgba(56,189,248,0.15),transparent),radial-gradient(1000px_600px_at_120%_-10%,rgba(168,85,247,0.12),transparent)] bg-[#0b0e13] text-slate-100">
      <div className="flex">
        <aside className="hidden md:block w-72 h-screen sticky top-0 border-r border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="p-5">
            <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">AI Founder</div>
            <div className="text-lg font-semibold">Command Console</div>
          </div>
          <nav className="px-3 space-y-1">
            {nav.map(item => {
              const ActiveIcon = item.icon
              const active = current === item.key
              return (
                <button key={item.key} onClick={() => onNavigate(item.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${active ? 'bg-gradient-to-r from-fuchsia-600/30 to-cyan-500/30 text-white border border-white/10' : 'hover:bg-white/5 text-slate-300'}`}>
                  <ActiveIcon className={`w-4 h-4 ${active ? 'text-cyan-300' : 'text-slate-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="p-4 text-xs text-slate-400 mt-4">Built for a solo founder. Focused. Fast. Yours.</div>
        </aside>
        <main className="flex-1 min-h-screen">
          <header className="sticky top-0 z-20 backdrop-blur bg-[#0b0e13]/70 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
              <div className="md:hidden">
                <span className="text-sm font-semibold">AI Founder Console</span>
              </div>
              <div className="relative flex-1 max-w-xl">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="Quick search: clients, projects, prompts" className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40" />
              </div>
              <div className="text-xs text-slate-400">{dateStr}</div>
            </div>
          </header>
          <div className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
