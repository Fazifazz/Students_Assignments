export type CatalogProduct = {
  id: number
  title: string
  priceUsd: number
  priceInr: number
  category: string
}

type ProductResponse = {
  products: Array<{
    id: number
    title: string
    price: number
    category: string
  }>
}

export type ProductCatalog = {
  products: CatalogProduct[]
  usdToInrRate: number
  rateDate: string
}

type ExchangeRateResponse = {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}

export async function fetchProducts(signal: AbortSignal): Promise<ProductCatalog> {
  const [productResponse, rateResponse] = await Promise.all([
    fetch('https://dummyjson.com/products?limit=100&select=id,title,price,category', { signal }),
    fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR', { signal }),
  ])
  if (!productResponse.ok) {
    throw new Error(`Product catalog request failed (${productResponse.status}).`)
  }
  if (!rateResponse.ok) {
    throw new Error(`USD to INR exchange-rate request failed (${rateResponse.status}).`)
  }

  const [data, exchangeData]: [ProductResponse, ExchangeRateResponse] = await Promise.all([
    productResponse.json(),
    rateResponse.json(),
  ])
  if (
    !Array.isArray(data.products) ||
    !data.products.every(
      (product) =>
        Number.isSafeInteger(product.id) &&
        typeof product.title === 'string' &&
        typeof product.price === 'number' &&
        Number.isFinite(product.price) &&
        product.price >= 0 &&
        typeof product.category === 'string',
    )
  ) {
    throw new Error('The product catalog returned data in an unexpected format.')
  }
  const usdToInrRate = exchangeData.rates?.INR
  if (
    exchangeData.base !== 'USD' ||
    typeof usdToInrRate !== 'number' ||
    !Number.isFinite(usdToInrRate) ||
    usdToInrRate <= 0 ||
    typeof exchangeData.date !== 'string' ||
    !Number.isFinite(Date.parse(exchangeData.date))
  ) {
    throw new Error('The exchange-rate service returned invalid USD to INR data.')
  }

  return {
    products: data.products.map(({ id, title, price, category }) => ({
      id,
      title,
      priceUsd: price,
      priceInr: Math.round(price * usdToInrRate * 100) / 100,
      category,
    })),
    usdToInrRate,
    rateDate: exchangeData.date,
  }
}
