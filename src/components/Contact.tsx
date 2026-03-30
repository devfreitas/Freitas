import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../context/LangContext'
import { t } from '../i18n/translations'

type FormState = { name: string; email: string; message: string }
type Errors = Partial<FormState>

const socials = [
  { label: 'GitHub',   href: 'https://github.com/devfreitas' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/rafael-de-freitass' },
  { label: 'Twitter',  href: 'https://x.com/s0mew4y' },
]

export default function Contact() {
  const { ref, visible } = useReveal()
  const { lang } = useLang()
  const tr = t[lang].contact

  const [form, setForm]     = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const validate = (f: FormState): Errors => {
    const e: Errors = {}
    if (!f.name.trim()) e.name = tr.errors.name
    if (!f.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = tr.errors.email
    if (f.message.trim().length < 10) e.message = tr.errors.message
    return e
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(err => ({ ...err, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('sending')
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name: form.name, email: form.email, message: form.message,
          time: new Date().toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', { dateStyle: 'long', timeStyle: 'short' }) },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      )
      setStatus('sent')
    } catch { setStatus('error') }
  }

  return (
    <section id="contact" ref={ref as React.RefObject<HTMLElement>}
      className={`py-32 px-6 max-w-5xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

      <div className="flex items-center gap-4 mb-16">
        <span className="section-label">{tr.label}</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-3xl font-bold mb-4 leading-snug" style={{ color: 'var(--primary)' }}>
            {tr.title}<br />
            <span className="font-normal" style={{ color: 'var(--muted)' }}>{tr.subtitle}</span>
          </h2>
          <p className="text-[15px] leading-relaxed mb-10" style={{ color: 'var(--subtle)' }}>{tr.bio}</p>
          <div className="flex flex-col gap-3">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-between group rounded-xl px-4 py-3 border transition-all duration-200"
                 style={{ borderColor: 'var(--border)' }}
                 onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--muted)' }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}>
                <span className="text-sm transition-colors" style={{ color: 'var(--subtle)' }}>{s.label}</span>
                <svg className="w-4 h-4 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
                     style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          {status === 'sent' ? (
            <div className="card p-8 text-center">
              <p className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>{tr.sent}</p>
              <p className="text-sm" style={{ color: 'var(--subtle)' }}>{tr.sentSub}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {(['name', 'email'] as const).map(field => (
                <div key={field}>
                  <input type={field === 'email' ? 'email' : 'text'} name={field}
                    placeholder={field === 'name' ? tr.namePlaceholder : tr.emailPlaceholder}
                    value={form[field]} onChange={handleChange}
                    className={`input-field ${errors[field] ? 'border-red-900/60' : ''}`} />
                  {errors[field] && <p className="font-mono text-[11px] text-red-500/70 mt-1.5">{errors[field]}</p>}
                </div>
              ))}
              <div>
                <textarea name="message" placeholder={tr.messagePlaceholder} rows={5}
                  value={form.message} onChange={handleChange}
                  className={`input-field resize-none ${errors.message ? 'border-red-900/60' : ''}`} />
                {errors.message && <p className="font-mono text-[11px] text-red-500/70 mt-1.5">{errors.message}</p>}
              </div>
              {status === 'error' && (
                <p className="font-mono text-[11px] text-red-500/70">{tr.errorMsg}</p>
              )}
              <button type="submit" disabled={status === 'sending'}
                className="text-sm font-semibold py-3 rounded-xl transition-colors duration-200 mt-1 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: 'var(--primary)', color: 'var(--bg)' }}>
                {status === 'sending' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {tr.sending}
                  </>
                ) : tr.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
