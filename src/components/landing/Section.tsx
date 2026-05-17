import { Button } from "@/components/ui/button"
import type { SectionProps } from "@/types"
import LeadForm from "./LeadForm"

export default function Section({ id, title, subtitle, content, isActive, showButton, buttonText, buttonHref, showForm }: SectionProps) {
  const animCls = `transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`

  const trackTelegramClick = () => {
    if (!buttonHref || !buttonHref.includes('t.me')) return
    try {
      const w = window as unknown as { _tmr?: Array<Record<string, unknown>> }
      w._tmr = w._tmr || []
      w._tmr.push({ id: '3766690', type: 'reachGoal', goal: 'telegram_click' })
    } catch {
      // pixel optional
    }
  }

  return (
    <section id={id} className="relative min-h-screen w-full snap-start flex flex-col justify-center p-8 md:p-16 lg:p-24">
      {subtitle && (
        <div className={`mb-12 ${animCls}`}>
          {subtitle}
        </div>
      )}
      <h2 className={`text-4xl md:text-6xl lg:text-[5rem] xl:text-[6rem] font-bold leading-[1.1] tracking-tight max-w-4xl text-white ${animCls}`}>
        {title}
      </h2>
      {content && (
        <p className={`text-lg md:text-xl lg:text-2xl max-w-2xl mt-6 text-neutral-400 transition-all duration-500 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {content}
        </p>
      )}
      {showButton && (
        <div className={`mt-12 md:mt-16 transition-all duration-500 delay-[400ms] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-[#FF4D00] bg-transparent border-[#FF4D00] hover:bg-[#FF4D00] hover:text-black transition-colors"
          >
            <a href={buttonHref} target="_blank" rel="noopener noreferrer" onClick={trackTelegramClick}>
              {buttonText}
            </a>
          </Button>
        </div>
      )}
      {showForm && <LeadForm isActive={isActive} />}
    </section>
  )
}