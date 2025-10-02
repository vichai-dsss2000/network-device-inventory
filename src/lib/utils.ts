import { DeviceFilters, DeviceType, DeviceStatus } from '@/types'

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidIPAddress(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipRegex.test(ip)
}

export function isValidMACAddress(mac: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  return macRegex.test(mac)
}

// Format utilities
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Device status helpers
export function getStatusColor(status: DeviceStatus): string {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100'
    case 'inactive':
      return 'text-gray-600 bg-gray-100'
    case 'maintenance':
      return 'text-yellow-600 bg-yellow-100'
    case 'decommissioned':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getDeviceTypeIcon(type: DeviceType): string {
  switch (type) {
    case 'router':
      return '🔀'
    case 'switch':
      return '🔌'
    case 'firewall':
      return '🛡️'
    case 'access-point':
      return '📶'
    case 'load-balancer':
      return '⚖️'
    default:
      return '📱'
  }
}

// Search and filter utilities
export function buildFilterQuery(filters: DeviceFilters): string {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString())
    }
  })
  
  return params.toString()
}

// Error handling utilities
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}