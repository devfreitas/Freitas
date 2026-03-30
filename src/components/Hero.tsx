import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import { t } from '../i18n/translations'

const stack = ['React', 'TypeScript', 'Python', 'Java', 'PHP', '.NET', 'PLSQL']

export default function Hero() {
  const { lang } = useLang()
  const tr = t[lang].hero

  const [idx, setIdx]           = useState(0)
  const [text, setText]         = useState('')
  const [deleting, setDeleting] = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 100) }, [])
  useEffect(() => { setText(''); setDeleting(false); setIdx(0) }, [lang])

  useEffect(() => {
    const target = tr.roles[idx]
    let timer: ReturnType<typeof setTimeout>
    if (!deleting && text.length < target.length)
      timer = setTimeout(() => setText(target.slice(0, text.length + 1)), 70)
    else if (!deleting && text.length === target.length)
      timer = setTimeout(() => setDeleting(true), 2500)
    else if (deleting && text.length > 0)
      timer = setTimeout(() => setText(text.slice(0, -1)), 35)
    else { setDeleting(false); setIdx(i => (i + 1) % tr.roles.length) }
    return () => clearTimeout(timer)
  }, [text, deleting, idx, tr.roles])

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center px-6 max-w-5xl mx-auto pt-28 pb-16">
      <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* Status */}
        <div className="flex items-center gap-2.5 mb-12">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--subtle)' }}>{tr.available}</span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.95] tracking-tight mb-8"
            style={{ color: 'var(--primary)' }}>
          {tr.headline1}<br />
          <span style={{ color: 'var(--muted)' }}>{tr.headline2}</span><br />
          {tr.headline3}
        </h1>

        {/* Typewriter */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-px" style={{ background: 'var(--border)' }} />
          <p className="font-mono text-sm" style={{ color: 'var(--subtle)' }}>
            {text}
            <span className="inline-block w-px h-3.5 ml-0.5 animate-pulse align-middle"
                  style={{ background: 'var(--subtle)' }} />
          </p>
        </div>

        <p className="max-w-md text-[15px] leading-relaxed mb-12" style={{ color: 'var(--secondary)' }}>
          {tr.bio}
        </p>

        {/* Stack */}
        <div className="flex flex-wrap gap-2 mb-12">
          {stack.map(s => (
            <span key={s}
              className="font-mono text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-default"
              style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
              {s}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <a href="#projects"
             className="text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
             style={{ background: 'var(--primary)', color: 'var(--bg)' }}>
            {tr.cta1}
          </a>
          <a href="#contact"
             className="text-sm flex items-center gap-2 transition-colors duration-200"
             style={{ color: 'var(--subtle)' }}>
            {tr.cta2}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-6 flex flex-col items-center gap-2 opacity-30">
        <span className="font-mono text-[10px] tracking-widest [writing-mode:vertical-rl]"
              style={{ color: 'var(--subtle)' }}>{tr.scroll}</span>
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, var(--muted), transparent)' }} />
      </div>
    </section>
  )
}
