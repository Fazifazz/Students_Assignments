import { useEffect } from 'react'
import { setStorageError } from '../features/invoices/invoiceSlice'
import { useAppDispatch, useAppSelector } from './reduxHooks'

const storageKey = 'ledgerly.invoices.v1'

export function useInvoicePersistence() {
  const dispatch = useAppDispatch()
  const invoices = useAppSelector((state) => state.invoices.items)
  const nextInvoiceNumber = useAppSelector((state) => state.invoices.nextInvoiceNumber)
  const storageError = useAppSelector((state) => state.invoices.storageError)

  useEffect(() => {
    if (storageError) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ items: invoices, nextInvoiceNumber }))
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Browser storage is unavailable.'
      dispatch(setStorageError(`Could not save invoices in this browser. ${detail}`))
    }
  }, [dispatch, invoices, nextInvoiceNumber, storageError])
}
