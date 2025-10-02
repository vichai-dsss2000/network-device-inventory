// Device types based on the database schema in README
export interface Device {
  id: string
  name: string
  type: DeviceType
  manufacturer: string
  model: string
  serialNumber: string
  ipAddress: string
  macAddress: string
  location: string
  status: DeviceStatus
  purchaseDate: Date
  warrantyExpiry: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type DeviceType = 
  | 'router' 
  | 'switch' 
  | 'firewall' 
  | 'access-point' 
  | 'load-balancer'
  | 'other'

export type DeviceStatus = 
  | 'active' 
  | 'inactive' 
  | 'maintenance' 
  | 'decommissioned'

// User types
export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'user'

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface CreateDeviceInput {
  name: string
  type: DeviceType
  manufacturer: string
  model: string
  serialNumber: string
  ipAddress: string
  macAddress: string
  location: string
  status: DeviceStatus
  purchaseDate: Date
  warrantyExpiry: Date
  notes?: string
}

export interface UpdateDeviceInput extends Partial<CreateDeviceInput> {
  id: string
}

// Search and filter types
export interface DeviceFilters {
  type?: DeviceType
  status?: DeviceStatus
  manufacturer?: string
  location?: string
  search?: string
}

export interface SortOptions {
  field: keyof Device
  direction: 'asc' | 'desc'
}