import { useReveal } from '../hooks/useReveal'
import { useGitHub } from '../hooks/useGitHub'
import { useLang } from '../context/LangContext'
import { t } from '../i18n/translations'

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded ${className}`} style={{ background: 'var(--surface)' }} />
}

function LangBar({ languages, visible }: {
  languages: { name: string; pct: number; color: string }[]
  visible: boolean
}) {
  return (
    <div>
      <div className="flex h-2 rounded-full overflow-hidden gap-px mb-4">
        {languages.map((l, i) => (
          <div key={l.name} className="h-full transition-all duration-700 ease-out"
               style={{ width: visible ? `${l.pct}%` : '0%', background: l.color, transitionDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {languages.map(l => (
          <div key={l.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
            <span className="text-xs" style={{ color: 'var(--secondary)' }}>{l.name}</span>
            <span className="text-xs ml-auto font-mono" style={{ color: 'var(--muted)' }}>{l.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatsCard({ stats, labels }: {
  stats: Record<string, number>
  labels: readonly { icon: string; key: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-3">
      {labels.map(s => (
        <div key={s.key} className="flex items-center gap-3">
          <span className="text-sm w-5 text-center">{s.icon}</span>
          <span className="text-sm flex-1" style={{ color: 'var(--subtle)' }}>{s.label}</span>
          <span className="font-mono text-sm" style={{ color: 'var(--primary)' }}>{stats[s.key]?.toLocaleString() ?? '—'}</span>
        </div>
      ))}
    </div>
  )
}

export default function Skills() {
  const { ref, visible } = useReveal()
  const { data, loading, error } = useGitHub()
  const { lang } = useLang()
  const tr = t[lang].skills

  return (
    <section id="skills" ref={ref as React.RefObject<HTMLElement>}
      className={`py-32 px-6 max-w-5xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

      <div className="flex items-center gap-4 mb-16">
        <span className="section-label">{tr.label}</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      {error && (
        <p className="font-mono text-xs text-red-500/60 mb-6">GitHub API error: {error}</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card card-hover p-6">
          <p className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--muted)' }}>{tr.languages}</p>
          {loading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-2 w-full" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
              </div>
            </div>
          ) : data?.languages.length ? (
            <LangBar languages={data.languages} visible={visible} />
          ) : (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>{tr.noLang}</p>
          )}
        </div>

        <div className="card card-hover p-6">
          <p className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--muted)' }}>{tr.stats}</p>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
            </div>
          ) : data ? (
            <StatsCard stats={data.stats as unknown as Record<string, number>} labels={tr.ghStats} />
          ) : null}
        </div>
      </div>
    </section>
  )
}
