import { useEffect, useRef } from 'react'

export default function MouseSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -1000, y: -1000 })
  const current = useRef({ x: -1000, y: -1000 })
  const raf = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // Smooth lerp loop
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const tick = () => {
      current.current.x = lerp(current.current.x, pos.current.x, 0.08)
      current.current.y = lerp(current.current.y, pos.current.y, 0.08)

      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(600px circle at ${current.current.x}px ${current.current.y}px,
          rgba(255,255,255,0.04) 0%,
          rgba(255,255,255,0.015) 25%,
          transparent 70%
        )`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      {/* Dot grid — revealed by spotlight */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          opacity: 0.6,
        }}
      />

      {/* Spotlight layer */}
      <div ref={spotRef} className="fixed inset-0 pointer-events-none z-0 transition-none" />
    </>
  )
}
