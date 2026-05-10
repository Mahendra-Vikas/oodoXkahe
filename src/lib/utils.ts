import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

export function getTripDuration(start: Date | string, end: Date | string) {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function getTripStatusColor(status: string) {
  const map: Record<string, string> = {
    ONGOING: 'text-accent-teal border-accent-teal',
    UPCOMING: 'text-accent-gold border-accent-gold',
    COMPLETED: 'text-accent-purple border-accent-purple',
    DRAFT: 'text-gray-400 border-gray-400',
  }
  return map[status] || 'text-gray-400'
}
