import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SectionProps } from "@/types"

export default function Section({ id, title, subtitle, content, isActive, showButton, buttonText, showForm }: SectionProps) {
  const [form, setForm] = useState({ name: '', phone: '', telegram: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('https://functions.poehali.dev/879c0470-f3cd-482b-9b9b-cc662da18143', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setSent(true)
  }

  const anim = (delay = 0) =>
    `transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
      + (delay ? ` delay-[${delay}ms]` : '')

  return (
    <section id={id} className="relative h-screen w-full snap-start flex flex-col justify-center p-8 md:p-16 lg:p-24">
      {subtitle && (
        <div className={`mb-12 ${anim()}`}>
          {subtitle}
        </div>
      )}
      <h2
        className={`text-4xl md:text-6xl lg:text-[5rem] xl:text-[6rem] font-bold leading-[1.1] tracking-tight max-w-4xl text-white ${anim()}`}
      >
        {title}
      </h2>
      {content && (
        <p className={`text-lg md:text-xl lg:text-2xl max-w-2xl mt-6 text-neutral-400 transition-all duration-500 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {content}
        </p>
      )}
      {showForm && (
        <div className={`mt-10 max-w-md w-full transition-all duration-500 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {sent ? (
            <p className="text-xl text-white">Спасибо! Мы свяжемся с вами в ближайшее время.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                placeholder="ФИО"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400 focus:border-[#FF4D00]"
              />
              <Input
                placeholder="Телефон"
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400 focus:border-[#FF4D00]"
              />
              <Input
                placeholder="Telegram (@username)"
                value={form.telegram}
                onChange={e => setForm({ ...form, telegram: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400 focus:border-[#FF4D00]"
              />
              <Button
                type="submit"
                size="lg"
                className="text-black bg-[#FF4D00] border-[#FF4D00] hover:bg-[#e04400] transition-colors mt-2"
              >
                Отправить заявку
              </Button>
            </form>
          )}
        </div>
      )}
      {showButton && (
        <div className={`mt-12 md:mt-16 transition-all duration-500 delay-[400ms] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button
            variant="outline"
            size="lg"
            className="text-[#FF4D00] bg-transparent border-[#FF4D00] hover:bg-[#FF4D00] hover:text-black transition-colors"
          >
            {buttonText}
          </Button>
        </div>
      )}
    </section>
  )
}
