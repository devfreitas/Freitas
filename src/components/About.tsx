import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../context/LangContext'
import { t } from '../i18n/translations'

const traits = ['React', 'TypeScript', 'TailwindCSS', 'Python', 'Flask', 'Java', 'SpringBoot', 'PHP', '.NET', 'PLSQL', 'Linux']

function Counter({ target, visible }: { target: number; visible: boolean }) {
  const [count, setCount] = useState(0)
  const raf = useRef<number>(0)
  useEffect(() => {
    if (!visible) return
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min((now - start) / 1400, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [visible, target])
  return <>{count}+</>
}

export default function About() {
  const { ref, visible } = useReveal()
  const { lang } = useLang()
  const tr = t[lang].about

  return (
    <section id="about" ref={ref as React.RefObject<HTMLElement>}
      className={`py-32 px-6 max-w-5xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

      <div className="flex items-center gap-4 mb-16">
        <span className="section-label">{tr.label}</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 items-start">
        <div>
          <div className="grid grid-cols-1 rounded-2xl overflow-hidden mb-8"
               style={{ border: '1px solid var(--border)', gap: '1px', background: 'var(--border)' }}>
            {tr.stats.map(s => (
              <div key={s.label} className="px-6 py-5 flex items-center justify-between"
                   style={{ background: 'var(--surface)' }}>
                <span className="text-sm" style={{ color: 'var(--subtle)' }}>{s.label}</span>
                <span className="font-mono text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                  <Counter target={s.value} visible={visible} />
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {traits.map(t => (
              <span key={t} className="font-mono text-[11px] px-2.5 py-1 rounded-md border"
                    style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6 leading-snug" style={{ color: 'var(--primary)' }}>
            {tr.title}<br />
            <span className="font-normal" style={{ color: 'var(--muted)' }}>{tr.subtitle}</span>
          </h2>
          <p className="text-[15px] leading-relaxed mb-4" style={{ color: 'var(--secondary)' }}>{tr.bio1}</p>
          <p className="text-[15px] leading-relaxed" style={{ color: 'var(--subtle)' }}>{tr.bio2}</p>
        </div>
      </div>
    </section>
  )
}
