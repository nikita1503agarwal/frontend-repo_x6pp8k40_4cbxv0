import { useEffect, useState } from 'react'
import { Card, GradientButton, Pill, Progress, HeroAura } from './Widgets'
import { Plus, Focus, ChevronRight } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function create(collection, data) {
  const res = await fetch(`${API}/api/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ collection, data }) })
  return res.json()
}
async function list(collection) {
  const res = await fetch(`${API}/api/list/${collection}`)
  return res.json()
}

export function Dashboard() {
  const [focusMode, setFocusMode] = useState(false)
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const t = await list('task'); setTasks(t.items || [])
        const p = await list('project'); setProjects(p.items || [])
      } catch (e) {}
    })()
  }, [])

  const topSummary = [
    { label: 'AI Engine', key: 'AI Engine' },
    { label: 'Prompt', key: 'Prompt' },
    { label: 'Creative', key: 'Creative' },
    { label: 'Audit', key: 'Audit' },
    { label: 'Persona', key: 'Persona' },
  ].map(s => ({
    ...s,
    count: projects.filter(p => p.service_type === s.key && p.status !== 'Done').length
  }))

  const today = new Date().toISOString().slice(0,10)
  const todaysTasks = tasks.filter(t => t.due_date ? t.due_date.startsWith(today) : false)

  return (
    <div className="space-y-6">
      <HeroAura />

      <div className="grid md:grid-cols-5 gap-4">
        {topSummary.map(s => (
          <Card key={s.key} title={s.label} subtitle="Active client projects">
            <div className="text-3xl font-semibold">{s.count}</div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="My Day" subtitle="Plan the work. Then work the plan." actions={
          <div className="flex items-center gap-2">
            <button onClick={() => setFocusMode(v=>!v)} className={`text-xs px-2 py-1 rounded bg-white/5 border border-white/10 ${focusMode ? 'text-cyan-300' : ''}`}>Focus Mode</button>
            <GradientButton onClick={() => create('task', { title: 'New Task', service_tag: 'Business Ops', priority: 'Medium' }).then(()=>list('task').then(d=>setTasks(d.items||[])))}><Plus className="w-4 h-4 inline mr-1"/>Add Task</GradientButton>
          </div>
        }>
          <div className="space-y-2">
            {(focusMode ? todaysTasks.slice(0,3) : todaysTasks).map(t => (
              <div key={t._id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-slate-400">{t.service_tag} • {t.priority}{t.due_date ? ` • due ${t.due_date.slice(0,10)}`:''}</div>
                </div>
                <Pill>{t.done ? 'Done' : 'Open'}</Pill>
              </div>
            ))}
            {todaysTasks.length === 0 && <div className="text-sm text-slate-400">No tasks due today. Add one to focus your energy.</div>}
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Start fast. Iterate faster.">
          <div className="grid grid-cols-1 gap-2">
            {['New Client Brief','Draft AI Engine Blueprint','Add Prompt to Library','Start Workflow Audit','New Persona Forge Session'].map(a => (
              <button key={a} className="w-full text-left px-3 py-2 rounded-lg bg-gradient-to-r from-fuchsia-600/20 to-cyan-500/20 border border-white/10 hover:from-fuchsia-600/30 hover:to-cyan-500/30">
                <span className="text-sm">{a}</span>
                <ChevronRight className="w-4 h-4 inline ml-2"/>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Upcoming Deliverables" subtitle="Deadlines keep momentum alive.">
          <div className="space-y-3">
            {projects.filter(p=>p.due_date).slice(0,5).map(p => (
              <div key={p._id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-slate-400">{p.service_type} • Due {p.due_date.slice(0,10)}</div>
                <div className="mt-2"><Progress value={p.status === 'Done' ? 100 : 45} /></div>
              </div>
            ))}
            {projects.filter(p=>p.due_date).length===0 && <div className="text-sm text-slate-400">No deadlines yet. Add due dates to anchor commitments.</div>}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function ServiceStudio() {
  const services = [
    { key: 'AI Engine', desc: 'Proprietary engines from knowledge, workflows, and voice.' },
    { key: 'Prompt', desc: 'Audited, reusable prompt systems aligned to outcomes.' },
    { key: 'Creative', desc: 'Campaign concepts and production mapped to briefs.' },
    { key: 'Audit', desc: 'End-to-end workflow diagnostics and optimization.' },
    { key: 'Persona', desc: 'Tone guide, lexicon, and reusable copy prompts.' },
    { key: 'Subscription', desc: 'Tiered access to packs, toolkits, and model library.' },
  ]
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        {services.map(s => (
          <Card key={s.key} title={s.key} subtitle={s.desc} actions={<GradientButton>Open</GradientButton>}>
            <div className="text-sm text-slate-300">Blueprint, scope, and templates to standardize delivery.</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ClientHub() {
  const [clients, setClients] = useState([])
  useEffect(()=>{ list('client').then(d=>setClients(d.items||[])) }, [])
  return (
    <div className="space-y-4">
      <Card title="Clients" subtitle="Every engagement in one glance." actions={<GradientButton onClick={()=>create('client',{name:'New Client'}).then(()=>list('client').then(d=>setClients(d.items||[])))}>Add</GradientButton>}>
        <div className="grid md:grid-cols-3 gap-3">
          {clients.map(c => (
            <div key={c._id} className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-slate-400">{(c.services||[]).join(', ')||'No services yet'}</div>
              <div className="mt-2 flex gap-2"><Pill>{c.status||'Discovery'}</Pill><Pill>{c.next_action||'No next action'}</Pill></div>
            </div>
          ))}
          {clients.length===0 && <div className="text-sm text-slate-400">No clients added. Create one to start a project.</div>}
        </div>
      </Card>
    </div>
  )
}

export function PromptLab() {
  const [prompts, setPrompts] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  useEffect(()=>{ list('prompt').then(d=>setPrompts(d.items||[])) }, [])

  return (
    <div className="space-y-4">
      <Card title="Prompt Library" subtitle="Reusable, outcome-driven prompts.">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-1 space-y-2">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Prompt name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Prompt text" rows={6} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
            <GradientButton onClick={()=>create('prompt',{name, text, target_model:'External'}).then(()=>{setName('');setText('');list('prompt').then(d=>setPrompts(d.items||[]))})}>Add Prompt</GradientButton>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 gap-3">
            {prompts.map(p => (
              <div key={p._id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-slate-400">Target: {p.target_model}</div>
                <pre className="text-xs mt-2 whitespace-pre-wrap text-slate-300">{p.text}</pre>
              </div>
            ))}
            {prompts.length===0 && <div className="text-sm text-slate-400">No prompts yet. Add your first template above.</div>}
          </div>
        </div>
      </Card>

      <Card title="AI Engine Blueprint Designer" subtitle="Define purpose, knowledge, persona, and guardrails.">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-1 space-y-2">
            <EngineForm />
          </div>
          <div className="md:col-span-2 text-sm text-slate-300">
            Capture both off-the-shelf and custom-tailored configurations. Use this as the source of truth for delivery.
          </div>
        </div>
      </Card>
    </div>
  )
}

function EngineForm(){
  const [form, setForm] = useState({ name:'', flavor:'Off-the-shelf', purpose:'', domain:'', persona:'', knowledge_sources:'', input_format:'', output_format:'', guardrails:'' })
  const update = (k,v)=>setForm(s=>({ ...s, [k]: v }))
  const save = async ()=>{
    const payload = {
      name: form.name,
      flavor: form.flavor,
      purpose: form.purpose,
      domain: form.domain || undefined,
      persona: form.persona || undefined,
      knowledge_sources: form.knowledge_sources ? form.knowledge_sources.split('\n').filter(Boolean) : [],
      input_format: form.input_format || undefined,
      output_format: form.output_format || undefined,
      guardrails: form.guardrails ? form.guardrails.split('\n').filter(Boolean) : []
    }
    await create('engineblueprint', payload)
    alert('Blueprint saved')
  }
  return (
    <div className="space-y-2">
      <input value={form.name} onChange={e=>update('name', e.target.value)} placeholder="Engine name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
      <select value={form.flavor} onChange={e=>update('flavor', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
        <option>Off-the-shelf</option>
        <option>Custom-tailored</option>
      </select>
      <textarea value={form.purpose} onChange={e=>update('purpose', e.target.value)} placeholder="Purpose" rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
      <input value={form.domain} onChange={e=>update('domain', e.target.value)} placeholder="Domain" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
      <input value={form.persona} onChange={e=>update('persona', e.target.value)} placeholder="Persona & tone" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
      <textarea value={form.knowledge_sources} onChange={e=>update('knowledge_sources', e.target.value)} placeholder="Knowledge sources (one per line)" rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
      <input value={form.input_format} onChange={e=>update('input_format', e.target.value)} placeholder="Input format" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
      <input value={form.output_format} onChange={e=>update('output_format', e.target.value)} placeholder="Output format" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
      <textarea value={form.guardrails} onChange={e=>update('guardrails', e.target.value)} placeholder="Guardrails (one per line)" rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
      <GradientButton onClick={save}>Save Blueprint</GradientButton>
    </div>
  )
}

export function CreativeStudio() {
  const [brief, setBrief] = useState({ platforms:'', audience:'', goal:'', tone_style:'', deliverables:'', formats:'', timeline:'' })
  const save = async ()=>{
    await create('creativebrief',{
      platforms: brief.platforms? brief.platforms.split(',').map(s=>s.trim()).filter(Boolean):[],
      audience: brief.audience||undefined,
      goal: brief.goal||undefined,
      tone_style: brief.tone_style||undefined,
      deliverables: brief.deliverables? brief.deliverables.split('\n').filter(Boolean):[],
      formats: brief.formats? brief.formats.split('\n').filter(Boolean):[],
      timeline: brief.timeline? brief.timeline.split('\n').filter(Boolean):[],
    })
    alert('Brief saved')
  }
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card title="Creative Brief Builder" subtitle="Turn client inputs into actionable production.">
        <div className="space-y-2">
          <input placeholder="Platforms (comma separated)" value={brief.platforms} onChange={e=>setBrief({...brief, platforms:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Target audience" value={brief.audience} onChange={e=>setBrief({...brief, audience:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Campaign goal" value={brief.goal} onChange={e=>setBrief({...brief, goal:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Tone & style" value={brief.tone_style} onChange={e=>setBrief({...brief, tone_style:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Deliverables (one per line)" value={brief.deliverables} onChange={e=>setBrief({...brief, deliverables:e.target.value})} rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Formats/dimensions (one per line)" value={brief.formats} onChange={e=>setBrief({...brief, formats:e.target.value})} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Timeline & milestones (one per line)" value={brief.timeline} onChange={e=>setBrief({...brief, timeline:e.target.value})} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <GradientButton onClick={save}>Save Brief</GradientButton>
        </div>
      </Card>
      <Card title="Asset Checklist & Progress" subtitle="Track copy, visuals, and scripts as you build.">
        <div className="space-y-3 text-sm text-slate-300">
          <div>
            <div className="font-medium mb-1">Copy</div>
            <Progress value={35} />
          </div>
          <div>
            <div className="font-medium mb-1">Visuals</div>
            <Progress value={20} />
          </div>
          <div>
            <div className="font-medium mb-1">Video/Scripts</div>
            <Progress value={10} />
          </div>
        </div>
      </Card>
      <Card title="Content Calendar" subtitle="See planned publish dates at a glance.">
        <div className="grid grid-cols-7 gap-2 text-xs text-center">
          {Array.from({length:28}).map((_,i)=>(
            <div key={i} className="aspect-square rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">{i+1}</div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function AuditLab(){
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Current Workflow Map" subtitle="Document tools, steps, and triggers.">
        <div className="space-y-2 text-sm">
          <textarea placeholder="Tools used (one per line)" className="w-full h-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <textarea placeholder="Steps in current process" className="w-full h-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <textarea placeholder="Triggers for each step" className="w-full h-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
        </div>
      </Card>
      <Card title="Pain Points & Optimization Ideas" subtitle="Pair issues with improvements.">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <textarea placeholder="Pain points (one per line)" className="h-64 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <textarea placeholder="Optimizations (one per line)" className="h-64 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
        </div>
      </Card>
      <Card title="Report Builder" subtitle="Summarize findings and recommendations.">
        <div className="space-y-2 text-sm">
          <input placeholder="Executive summary" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <textarea placeholder="Current workflow snapshot" className="w-full h-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <textarea placeholder="Findings" className="w-full h-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <textarea placeholder="Recommendations" className="w-full h-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
        </div>
      </Card>
    </div>
  )
}

export function PersonaForge(){
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card title="Intake" subtitle="Distill mission, values, and references.">
        <div className="space-y-2 text-sm">
          <input placeholder="Brand mission" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <input placeholder="Values (comma separated)" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <input placeholder="Audience" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <input placeholder="Slogans/Taglines (comma separated)" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <textarea placeholder="Reference links (one per line)" className="w-full h-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
        </div>
      </Card>
      <Card title="Tone Definition" subtitle="Define how it should and should not sound.">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {['Formal ↔ Casual','Playful ↔ Serious','Bold ↔ Reserved','Warm ↔ Analytical'].map(axis=> (
            <div key={axis} className="p-3 rounded-lg bg-white/5 border border-white/10">{axis}</div>
          ))}
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <textarea placeholder="How this brand should sound" className="w-full h-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <textarea placeholder="How this brand should never sound" className="w-full h-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
        </div>
      </Card>
      <Card title="Lexicon & Prompt Kit" subtitle="Signature phrases and reusable prompts.">
        <div className="space-y-2 text-sm">
          <textarea placeholder="Preferred words / phrases (one per line)" className="w-full h-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <textarea placeholder="Words to avoid (one per line)" className="w-full h-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          <textarea placeholder="Prompt template" className="w-full h-32 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
        </div>
      </Card>
    </div>
  )
}

export function SubscriptionPlanner(){
  const features = ['Prompt pack volume','Toolkit access','Integration resources','Model library access','Support/strategy']
  return (
    <div className="space-y-4">
      <Card title="Tier Comparison" subtitle="Differentiate Entry, Growth, and Pro.">
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div></div>
          {['Entry','Growth','Pro'].map(t=> <div key={t} className="font-medium text-center">{t}</div>)}
          {features.map(f => (
            <>
              <div className="text-slate-400">{f}</div>
              {[0,1,2].map(i => (
                <div key={f+i} className="text-center">
                  <input className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs w-full" placeholder={f.includes('volume')?'e.g., 50 prompts':'Add detail'} />
                </div>
              ))}
            </>
          ))}
        </div>
      </Card>
      <Card title="Notes & Strategy" subtitle="Positioning, upgrade paths, retention ideas.">
        <textarea className="w-full h-40 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Capture positioning angles, upgrade triggers, and retention tactics." />
      </Card>
    </div>
  )
}

export function Tasks(){
  const [title, setTitle] = useState('')
  const [tasks, setTasks] = useState([])
  const [due, setDue] = useState('')
  const add = async ()=>{
    if(!title) return
    await create('task',{ title, service_tag: 'Business Ops', priority: 'Medium', due_date: due || undefined })
    setTitle(''); setDue(''); const d = await list('task'); setTasks(d.items||[])
  }
  useEffect(()=>{ list('task').then(d=>setTasks(d.items||[])) }, [])
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card title="Task Inbox" subtitle="Quick capture with tags, priority, and due dates." actions={<GradientButton onClick={add}>Add</GradientButton>}>
        <div className="space-y-2">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <input type="date" value={due} onChange={e=>setDue(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        </div>
      </Card>
      <Card title="Today / This Week" subtitle="Stay realistic and win the day.">
        <div className="space-y-2">
          {tasks.map(t => (
            <div key={t._id} className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm font-medium">{t.title}</div>
              <div className="text-xs text-slate-400">{t.service_tag} • {t.priority}{t.due_date?` • ${t.due_date.slice(0,10)}`:''}</div>
            </div>
          ))}
          {tasks.length===0 && <div className="text-sm text-slate-400">No tasks captured yet.</div>}
        </div>
      </Card>
      <Card title="Eisenhower Matrix" subtitle="Triage by urgency and importance.">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {['Urgent & Important','Not-Urgent & Important','Urgent & Not-Important','Not-Urgent & Not-Important'].map(x => (
            <div key={x} className="aspect-square p-2 rounded-lg bg-white/5 border border-white/10">{x}</div>
          ))}
        </div>
      </Card>
    </div>
  )
}
