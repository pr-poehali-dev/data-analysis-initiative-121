import { useEffect, useRef, useState } from 'react'
import Section from './Section'
import Layout from './Layout'
import { sections } from './sections'
import Icon from '@/components/ui/icon'

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        setActiveSection(Math.floor(scrollTop / window.innerHeight))
        setScrollProgress(scrollTop / (scrollHeight - clientHeight))
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const handleNavClick = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      })
    }
  }

  const handleTelegramClick = () => {
    try {
      const w = window as unknown as { _tmr?: Array<Record<string, unknown>> }
      w._tmr = w._tmr || []
      w._tmr.push({ id: '3766690', type: 'reachGoal', goal: 'telegram_click' })
    } catch {
      // pixel optional
    }
  }

  return (
    <Layout>
      <nav className="fixed top-0 right-0 h-screen flex flex-col justify-center z-30 p-4">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`w-3 h-3 rounded-full my-2 transition-all ${
              index === activeSection ? 'bg-white scale-150' : 'bg-gray-600'
            }`}
            onClick={() => handleNavClick(index)}
          />
        ))}
      </nav>
      <div
        className="fixed top-0 left-0 right-0 h-0.5 bg-white origin-left z-30 transition-transform duration-200"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory"
      >
        {sections.map((section, index) => (
          <Section
            key={section.id}
            {...section}
            isActive={index === activeSection}
          />
        ))}
      </div>
      <a
        href="https://t.me/kredit13bot_bot"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleTelegramClick}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF4D00] text-black font-semibold shadow-lg hover:bg-white transition-colors animate-tg-pulse"
      >
        <Icon name="Send" size={20} />
        Перейти в Telegram
      </a>
    </Layout>
  )
}