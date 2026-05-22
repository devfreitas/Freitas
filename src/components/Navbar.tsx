import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LangContext'
import { t } from '../i18n/translations'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive]     = useState('')
  const [open, setOpen]         = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang }   = useLang()
  const tr = t[lang].nav

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const current = tr.links
        .map(l => document.getElementById(l.toLowerCase() === 'sobre' ? 'about'
        : l.toLowerCase() === 'projetos' ? 'projects'
        : l.toLowerCase() === 'contato' ? 'contact'
        : l.toLowerCase()))
        .findLast(s => s && s.getBoundingClientRect().top <= 100)
      setActive(current?.id ?? '')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lang, tr.links])

  const sectionId = (label: string) =>
    ({ sobre: 'about', projetos: 'projects', contato: 'contact' }[label.toLowerCase()] ?? label.toLowerCase())

  const handleDownload = async () => {
    try {
      const response = await fetch('/cv.pdf')
      if (!response.ok) throw new Error('File not found')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'Curriculo_Freitas.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert(lang === 'en' ? 'CV file not found in public folder! (Place cv.pdf in /public)' : 'Arquivo do CV não encontrado na pasta public! (Coloque o cv.pdf em /public)')
    }
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'nav-bg' : ''}`}>
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="#hero" style={{ color: 'var(--subtle)' }}
           className="font-mono text-sm hover:opacity-80 transition-opacity">
          devfreitas<span style={{ color: 'var(--muted)' }}>.dev</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {tr.links.map(l => (
            <li key={l}>
              <a href={`#${sectionId(l)}`}
                 style={{ color: active === sectionId(l) ? 'var(--primary)' : 'var(--subtle)' }}
                 className="text-sm transition-colors duration-200 hover:opacity-80">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Lang */}
          <button onClick={toggleLang}
            className="font-mono text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-200"
            style={{ borderColor: 'var(--border)', color: 'var(--subtle)' }}
            aria-label="Toggle language">
            {lang === 'en' ? 'PT' : 'EN'}
          </button>

          {/* Theme */}
          <button onClick={toggleTheme}
            className="p-2 rounded-lg border transition-all duration-200"
            style={{ borderColor: 'var(--border)', color: 'var(--subtle)' }}
            aria-label="Toggle theme">
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          {/* CV */}
          <button onClick={handleDownload}
            className="hidden md:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-200 hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--subtle)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {tr.downloadCV}
          </button>

          {/* Hamburger */}
          <button className="md:hidden p-1 transition-colors" onClick={() => setOpen(!open)}
            style={{ color: 'var(--subtle)' }} aria-label="Toggle menu">
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-px bg-current transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t px-6 py-6 flex flex-col gap-5"
             style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
          {tr.links.map(l => (
            <a key={l} href={`#${sectionId(l)}`} onClick={() => setOpen(false)}
               style={{ color: 'var(--subtle)' }}
               className="text-sm transition-colors hover:opacity-80">{l}</a>
          ))}
          <button onClick={() => { handleDownload(); setOpen(false); }}
            className="flex items-center gap-2 text-sm font-mono mt-2"
            style={{ color: 'var(--secondary)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {tr.downloadCV}
          </button>
        </div>
      )}
    </nav>
  )
}