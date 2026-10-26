import { useCallback, useEffect, useState } from 'react'
import { fetchProducts, type CatalogProduct } from '../api/products'

type ProductState = {
  products: CatalogProduct[]
  usdToInrRate: number | null
  rateDate: string | null
  loading: boolean
  error: string | null
}

export function useProducts() {
  const [state, setState] = useState<ProductState>({
    products: [],
    usdToInrRate: null,
    rateDate: null,
    loading: true,
    error: null,
  })
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState((current) => ({ ...current, loading: true, error: null }))

    fetchProducts(controller.signal)
      .then(({ products, usdToInrRate, rateDate }) =>
        setState({ products, usdToInrRate, rateDate, loading: false, error: null }),
      )
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message =
          error instanceof Error ? error.message : 'Could not load the product catalog.'
        setState((current) => ({ ...current, loading: false, error: message }))
      })

    return () => controller.abort()
  }, [retryCount])

  const retry = useCallback(() => setRetryCount((count) => count + 1), [])
  return { ...state, retry }
}
