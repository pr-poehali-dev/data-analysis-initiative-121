import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import funcUrls from '../../backend/func2url.json'

interface Lead {
  id: number
  full_name: string
  phone: string
  email: string
  vk: string | null
  telegram: string | null
  created_at: string | null
}

const STORAGE_KEY = 'admin_password'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchLeads = async (pwd: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch((funcUrls as Record<string, string>)['admin-leads'], {
        method: 'GET',
        headers: { 'X-Admin-Password': pwd },
      })
      if (res.status === 401) {
        setError('Неверный пароль')
        setAuthed(false)
        localStorage.removeItem(STORAGE_KEY)
        return
      }
      if (!res.ok) throw new Error('Ошибка загрузки')
      const data = await res.json()
      setLeads(data.leads || [])
      setAuthed(true)
      localStorage.setItem(STORAGE_KEY, pwd)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setPassword(saved)
      fetchLeads(saved)
    }
  }, [])

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    if (password.trim()) fetchLeads(password.trim())
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAuthed(false)
    setLeads([])
    setPassword('')
  }

  const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleString('ru-RU')
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 bg-neutral-900 p-8 rounded-xl border border-neutral-800">
          <h1 className="text-2xl font-semibold text-white">Вход в админ-панель</h1>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-white">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/40 border-neutral-700 text-white"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-[#FF4D00] text-black hover:bg-white">
            {loading ? 'Проверка...' : 'Войти'}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Заявки</h1>
            <p className="text-neutral-400 mt-1">Всего: {leads.length}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => fetchLeads(password)} disabled={loading} variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800">
              {loading ? 'Обновление...' : 'Обновить'}
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800">
              Выйти
            </Button>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="text-neutral-400 py-12 text-center">Пока нет заявок.</div>
        ) : (
          <div className="rounded-lg border border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Дата</TableHead>
                  <TableHead className="text-neutral-400">ФИО</TableHead>
                  <TableHead className="text-neutral-400">Телефон</TableHead>
                  <TableHead className="text-neutral-400">Email</TableHead>
                  <TableHead className="text-neutral-400">VK</TableHead>
                  <TableHead className="text-neutral-400">Telegram</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="border-neutral-800 hover:bg-neutral-900">
                    <TableCell className="text-neutral-300 whitespace-nowrap">{formatDate(lead.created_at)}</TableCell>
                    <TableCell className="font-medium">{lead.full_name}</TableCell>
                    <TableCell>
                      <a href={`tel:${lead.phone}`} className="text-[#FF4D00] hover:underline">{lead.phone}</a>
                    </TableCell>
                    <TableCell>
                      <a href={`mailto:${lead.email}`} className="text-[#FF4D00] hover:underline">{lead.email}</a>
                    </TableCell>
                    <TableCell className="text-neutral-300">{lead.vk || '—'}</TableCell>
                    <TableCell className="text-neutral-300">{lead.telegram || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
