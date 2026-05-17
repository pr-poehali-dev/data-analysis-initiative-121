import type { ReactNode } from "react"

export interface Section {
  id: string
  title: string
  subtitle?: ReactNode
  content?: string
  showButton?: boolean
  buttonText?: string
  buttonHref?: string
  showForm?: boolean
}

export interface SectionProps extends Section {
  isActive: boolean
}