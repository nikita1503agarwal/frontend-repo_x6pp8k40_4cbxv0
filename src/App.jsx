import { useState } from 'react'
import Layout from './components/Layout'
import { Dashboard, ServiceStudio, ClientHub, PromptLab, CreativeStudio, AuditLab, PersonaForge, SubscriptionPlanner, Tasks } from './components/Sections'

function App() {
  const [route, setRoute] = useState('dashboard')
  return (
    <Layout current={route} onNavigate={setRoute}>
      {route === 'dashboard' && <Dashboard />}
      {route === 'service' && <ServiceStudio />}
      {route === 'clients' && <ClientHub />}
      {route === 'lab' && <PromptLab />}
      {route === 'creative' && <CreativeStudio />}
      {route === 'audit' && <AuditLab />}
      {route === 'persona' && <PersonaForge />}
      {route === 'subscription' && <SubscriptionPlanner />}
      {route === 'tasks' && <Tasks />}
      {route === 'settings' && (
        <div className="space-y-4">
          <div className="text-lg font-semibold">Settings & Resources</div>
          <div className="text-sm text-slate-400">Set your API base URL and explore helpful resources.</div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-slate-400 mb-2">Backend URL in use</div>
            <div className="text-sm">{import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}</div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default App
