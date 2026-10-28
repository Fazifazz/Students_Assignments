import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue'
export type InvoiceItem = {
  description: string
  quantity: number
  rate: number
}

export type Invoice = {
  id: string
  invoiceNumber: string
  customerName: string
  customerEmail: string
  issueDate: string
  dueDate: string
  currency: string
  taxPercent: number
  items: InvoiceItem[]
  status: InvoiceStatus
  createdAt: string
}

type InvoiceState = {
  items: Invoice[]
  nextInvoiceNumber: number
  storageError: string | null
}

const storageKey = 'ledgerly.invoices.v1'

function isInvoice(value: unknown): value is Invoice {
  if (typeof value !== 'object' || value === null) return false
  const invoice = value as Partial<Invoice>
  return (
    typeof invoice.id === 'string' &&
    typeof invoice.invoiceNumber === 'string' &&
    typeof invoice.customerName === 'string' &&
    typeof invoice.customerEmail === 'string' &&
    typeof invoice.issueDate === 'string' &&
    typeof invoice.dueDate === 'string' &&
    (invoice.currency === 'INR' || invoice.currency === 'USD') &&
    typeof invoice.taxPercent === 'number' &&
    Number.isFinite(invoice.taxPercent) &&
    ['Draft', 'Sent', 'Paid', 'Overdue'].includes(invoice.status ?? '') &&
    typeof invoice.createdAt === 'string' &&
    Array.isArray(invoice.items) &&
    invoice.items.every((item) =>
      typeof item.description === 'string' &&
      typeof item.quantity === 'number' &&
      Number.isFinite(item.quantity) &&
      typeof item.rate === 'number' &&
      Number.isFinite(item.rate),
    )
  )
}

function readInvoices(): { items: Invoice[]; nextInvoiceNumber: number; storageError: string | null } {
  try {
    const serialized = window.localStorage.getItem(storageKey)
    if (!serialized) return { items: [], nextInvoiceNumber: 1, storageError: null }
    const value: unknown = JSON.parse(serialized)
    if (Array.isArray(value)) {
      if (!value.every(isInvoice)) throw new Error('Saved invoice data has an unexpected format.')
      const maxNumber = value.reduce((max: number, invoice: Invoice) => {
        const number = Number(invoice.invoiceNumber.split('-').at(-1))
        return Number.isSafeInteger(number) ? Math.max(max, number) : max
      }, 0)
      return { items: value, nextInvoiceNumber: maxNumber + 1, storageError: null }
    }
    if (
      typeof value !== 'object' ||
      value === null ||
      !('items' in value) ||
      !('nextInvoiceNumber' in value) ||
      !Array.isArray(value.items) ||
      !value.items.every(isInvoice) ||
      typeof value.nextInvoiceNumber !== 'number' ||
      !Number.isSafeInteger(value.nextInvoiceNumber) ||
      value.nextInvoiceNumber < 1
    ) {
      throw new Error('Saved invoice data has an unexpected format.')
    }
    return {
      items: value.items,
      nextInvoiceNumber: value.nextInvoiceNumber,
      storageError: null,
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Browser storage is unavailable.'
    return {
      items: [],
      nextInvoiceNumber: 1,
      storageError: `Could not read saved invoices. ${detail} New invoices will still appear for this session.`,
    }
  }
}

const initialState: InvoiceState = readInvoices()

export type NewInvoice = Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>
export type UpdatedInvoice = Omit<Invoice, 'invoiceNumber' | 'createdAt'>

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoice(state, action: PayloadAction<NewInvoice>) {
      const now = new Date()
      state.items.unshift({
        ...action.payload,
        id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
        invoiceNumber: `INV-${now.getFullYear()}-${String(state.nextInvoiceNumber).padStart(4, '0')}`,
        createdAt: now.toISOString(),
      })
      state.nextInvoiceNumber += 1
    },
    updateInvoice(state, action: PayloadAction<UpdatedInvoice>) {
      const index = state.items.findIndex((invoice) => invoice.id === action.payload.id)
      if (index === -1) return
      state.items[index] = {
        ...action.payload,
        invoiceNumber: state.items[index].invoiceNumber,
        createdAt: state.items[index].createdAt,
      }
    },
    updateCustomer(
      state,
      action: PayloadAction<{
        customerKey: string
        name: string
        email: string
      }>,
    ) {
      const matchingInvoices = state.items.filter((invoice) => {
        const key =
          invoice.customerEmail.trim().toLowerCase() ||
          invoice.customerName.trim().toLowerCase()
        return key === action.payload.customerKey
      })
      for (const invoice of matchingInvoices) {
        invoice.customerName = action.payload.name
        invoice.customerEmail = action.payload.email
      }
    },
    setInvoiceStatus(state, action: PayloadAction<{ id: string; status: InvoiceStatus }>) {
      const invoice = state.items.find((item) => item.id === action.payload.id)
      if (invoice) invoice.status = action.payload.status
    },
    deleteInvoice(state, action: PayloadAction<string>) {
      state.items = state.items.filter((invoice) => invoice.id !== action.payload)
    },
    setStorageError(state, action: PayloadAction<string>) {
      state.storageError = action.payload
    },
    clearStorageError(state) {
      state.storageError = null
    },
  },
})

export const {
  addInvoice,
  updateInvoice,
  updateCustomer,
  setInvoiceStatus,
  deleteInvoice,
  setStorageError,
  clearStorageError,
} =
  invoiceSlice.actions
export default invoiceSlice.reducer

export function getInvoiceSubtotal(invoice: Invoice) {
  return invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
}

export function getInvoiceTotal(invoice: Invoice) {
  const subtotal = getInvoiceSubtotal(invoice)
  return subtotal + subtotal * (invoice.taxPercent / 100)
}

export function getEffectiveInvoiceStatus(invoice: Invoice, asOf = new Date()): InvoiceStatus {
  if (invoice.status === 'Sent' && new Date(`${invoice.dueDate}T23:59:59`) < asOf) return 'Overdue'
  return invoice.status
}
