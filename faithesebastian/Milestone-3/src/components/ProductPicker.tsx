import { useMemo, useState } from 'react'
import type { CatalogProduct } from '../api/products'

type ProductPickerProps = {
  products: CatalogProduct[]
  usdToInrRate: number | null
  rateDate: string | null
  loading: boolean
  error: string | null
  onRetry: () => void
  onSelect: (product: CatalogProduct) => void
}

export function ProductPicker({
  products,
  usdToInrRate,
  rateDate,
  loading,
  error,
  onRetry,
  onSelect,
}: ProductPickerProps) {
  const [query, setQuery] = useState('')
  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return products
      .filter((product) => product.title.toLowerCase().includes(normalizedQuery))
      .slice(0, 8)
  }, [products, query])

  return (
    <section className="product-picker" aria-labelledby="catalog-title">
      <div className="product-picker-heading">
        <div>
          <h3 id="catalog-title">Product catalog</h3>
          <p>Live USD → INR conversion{rateDate ? ` · rate dated ${new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(`${rateDate}T00:00:00`))}` : ''}</p>
        </div>
        {loading && <span className="catalog-status"><i /> Loading catalog</span>}
        {!loading && !error && usdToInrRate !== null && (
          <span className="catalog-count">1 USD = ₹{usdToInrRate.toFixed(2)}</span>
        )}
      </div>
      {error ? (
        <div className="catalog-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={onRetry}>Retry</button>
        </div>
      ) : (
        <>
          <label className="catalog-search">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products to add..."
              aria-label="Search products"
              disabled={loading}
            />
          </label>
          {!loading && (
            <div className="product-results">
              {matches.map((product) => (
                <button
                  className="product-option"
                  key={product.id}
                  type="button"
                  onClick={() => onSelect(product)}
                >
                  <span className="product-option-icon" aria-hidden="true">＋</span>
                  <span className="product-option-name">{product.title}<small>{product.category}</small></span>
                  <span className="product-option-prices">
                    <strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.priceInr)}</strong>
                    <small>≈ {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.priceUsd)}</small>
                  </span>
                </button>
              ))}
              {matches.length === 0 && <p className="catalog-empty">No products match “{query}”.</p>}
            </div>
          )}
        </>
      )}
    </section>
  )
}
