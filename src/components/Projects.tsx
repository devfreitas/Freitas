import { useReveal } from '../hooks/useReveal'
import { useLang } from '../context/LangContext'
import { t } from '../i18n/translations'

export default function Projects() {
  const { ref, visible } = useReveal()
  const { lang } = useLang()
  const tr = t[lang].projects

  return (
    <section id="projects" ref={ref as React.RefObject<HTMLElement>}
      className={`py-32 px-6 max-w-5xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

      <div className="flex items-center gap-4 mb-16">
        <span className="section-label">{tr.label}</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      <div className="flex flex-col divide-theme">
        {tr.items.map((p, i) => (
          <a key={p.title} href={p.href} target="_blank" rel="noopener noreferrer"
             className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[2rem_1fr_auto_auto] items-start gap-4 md:gap-8 py-6 -mx-4 px-4 rounded-xl transition-all duration-200"
             style={{ animationDelay: `${i * 60}ms` }}
             onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--surface) 50%, transparent)')}
             onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

            <span className="font-mono text-xs pt-1 hidden md:block" style={{ color: 'var(--muted)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>

            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h3 className="font-semibold transition-colors duration-200" style={{ color: 'var(--primary)' }}>
                  {p.title}
                </h3>
                <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                     style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--subtle)' }}>{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map(tag => (
                  <span key={tag} className="font-mono text-[11px] px-2 py-0.5 rounded-md border"
                        style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <span className="font-mono text-xs pt-1 hidden md:block" style={{ color: 'var(--muted)' }}>{p.year}</span>

            <div className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg className="w-4 h-4" style={{ color: 'var(--subtle)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
