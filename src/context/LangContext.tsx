import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'pt'

const LangContext = createContext<{ lang: Lang; toggle: () => void }>({
  lang: 'en',
  toggle: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const toggle = () => setLang(l => (l === 'en' ? 'pt' : 'en'))
  return <LangContext.Provider value={{ lang, toggle }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
