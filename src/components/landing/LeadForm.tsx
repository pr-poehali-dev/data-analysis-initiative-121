import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import funcUrls from '../../../backend/func2url.json'

interface LeadFormProps {
  isActive?: boolean
}

export default function LeadForm({ isActive }: LeadFormProps) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [vk, setVk] = useState('')
  const [telegram, setTelegram] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const animCls = `transition-all duration-500 delay-[400ms] ${
    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  }`

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      toast({
        title: 'Заполните обязательные поля',
        description: 'ФИО, телефон и email должны быть заполнены',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(funcUrls.leads, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          email,
          vk: vk || undefined,
          telegram: telegram || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка отправки')

      setSent(true)
      setFullName('')
      setPhone('')
      setEmail('')
      setVk('')
      setTelegram('')
      try {
        const w = window as unknown as { VK?: { Goal?: (event: string, params?: Record<string, unknown>) => void } }
        w.VK?.Goal?.('lead')
      } catch {
        // pixel optional
      }
      toast({
        title: 'Заявка отправлена',
        description: 'Мы свяжемся с вами в ближайшее время',
      })
    } catch (err) {
      toast({
        title: 'Не удалось отправить',
        description: err instanceof Error ? err.message : 'Попробуйте позже',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className={`mt-8 max-w-md text-white ${animCls}`}>
        <p className="text-xl">Спасибо! Ваша заявка принята.</p>
        <p className="text-neutral-400 mt-2">Мы свяжемся с вами в ближайшее время.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`mt-8 max-w-md w-full space-y-4 ${animCls}`}>
      <div className="space-y-1.5">
        <Label htmlFor="full_name" className="text-white">ФИО *</Label>
        <Input
          id="full_name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Иванов Иван Иванович"
          className="bg-black/40 border-neutral-700 text-white placeholder:text-neutral-500"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-white">Телефон *</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (999) 123-45-67"
          className="bg-black/40 border-neutral-700 text-white placeholder:text-neutral-500"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-white">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="bg-black/40 border-neutral-700 text-white placeholder:text-neutral-500"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="vk" className="text-white">VK</Label>
          <Input
            id="vk"
            value={vk}
            onChange={(e) => setVk(e.target.value)}
            placeholder="vk.com/username"
            className="bg-black/40 border-neutral-700 text-white placeholder:text-neutral-500"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telegram" className="text-white">Telegram</Label>
          <Input
            id="telegram"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="@username"
            className="bg-black/40 border-neutral-700 text-white placeholder:text-neutral-500"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="bg-[#FF4D00] text-black hover:bg-white font-semibold"
        size="lg"
      >
        {loading ? 'Отправка...' : 'Отправить заявку'}
      </Button>
    </form>
  )
}