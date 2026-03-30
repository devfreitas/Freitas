import { useLang } from '../context/LangContext'
import { t } from '../i18n/translations'

export default function Footer() {
  const { lang } = useLang()
  const tr = t[lang].footer
  return (
    <footer className="py-8 px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>devfreitas.dev</span>
        <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
          Rafael Freitas — {tr.rights} © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
