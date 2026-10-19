import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useParams } from 'react-router-dom'
import useRecipe from './hooks/useRecipe.js'
import useRecipes from './hooks/useRecipes.js'
import { KERALA_RECIPES } from './data/keralaRecipes.js'
import './App.css'

const FAVORITES_KEY = 'mise-favorites'

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')
    if (
      Array.isArray(saved) &&
      saved.every(
        (recipe) =>
          recipe &&
          typeof recipe.idMeal === 'string' &&
          typeof recipe.strMeal === 'string' &&
          typeof recipe.strMealThumb === 'string' &&
          typeof recipe.strArea === 'string',
      )
    ) {
      return saved
    }

    console.error('Saved favorites have an invalid format.')
  } catch (error) {
    console.error('Unable to read saved favorites.', error)
  }

  return []
}

function Navbar({ favoriteCount }) {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Nadan home">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19.5 3.5C12.3 3.9 7 5.3 4.9 9.5c-1.1 2.1-.6 4.3 1.2 5.3 1.6.9 3.5.5 5-.4 3.4-2 5.8-6.1 8.4-10.9Z" />
            <path d="M4.5 20c4.2-4.2 8.2-8 13.6-12.8" />
          </svg>
        </span>
        <span>nadan<span className="brand-period">.</span></span>
      </Link>
      <div className="delivery-location" aria-label="Delivery location: Kochi, Kerala">
        <span className="location-pin" aria-hidden="true">⌖</span>
        <span><strong>Kochi</strong><small>Kerala, India <span aria-hidden="true">⌄</span></small></span>
      </div>
      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/recipes">Explore menu</NavLink>
        <NavLink to="/favourites" className="favorites-nav">
          <span aria-hidden="true">♡</span> Favourites
          {favoriteCount > 0 && <span className="nav-count">{favoriteCount}</span>}
        </NavLink>
      </nav>
      <Link className="header-cta" to="/recipes"><span aria-hidden="true">⌕</span> Search dishes</Link>
    </header>
  )
}

function RecipePhoto({ recipe, loading = 'lazy' }) {
  const [failedSource, setFailedSource] = useState(null)
  const source = failedSource === recipe.strMealThumb
    ? '/hero-sadya.svg'
    : recipe.strMealThumb

  return (
    <img
      src={source}
      alt={recipe.strMeal}
      loading={loading}
      onError={() => setFailedSource(recipe.strMealThumb)}
    />
  )
}

function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  return (
    <article className="recipe-card">
      <Link className="recipe-image-link" to={`/recipes/${recipe.idMeal}`}>
        <RecipePhoto recipe={recipe} />
        <span className="recipe-image-shade" aria-hidden="true" />
        <span className="image-category">{recipe.strCategory || 'Kerala favourite'}</span>
        <span className="card-open" aria-hidden="true">↗</span>
      </Link>
      <div className="recipe-card-content">
        <div className="recipe-card-copy">
          <Link className="recipe-title" to={`/recipes/${recipe.idMeal}`}>{recipe.strMeal}</Link>
          <p className="recipe-card-description">{recipe.strDescription}</p>
        </div>
        <button
          className={`favorite-button${isFavorite ? ' is-saved' : ''}`}
          type="button"
          onClick={() => onToggleFavorite(recipe)}
          aria-label={isFavorite ? `Remove ${recipe.strMeal} from favourites` : `Save ${recipe.strMeal} to favourites`}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
    </article>
  )
}

function RecipeGrid({ recipes, favorites, onToggleFavorite }) {
  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.idMeal}
          recipe={recipe}
          isFavorite={favorites.some((favorite) => favorite.idMeal === recipe.idMeal)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}

function LoadingState({ label = 'Finding something delicious' }) {
  return (
    <div className="status-state" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{label}<span className="loading-dots">...</span></p>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="status-state error-state" role="alert">
      <span className="status-icon" aria-hidden="true">!</span>
      <h2>We couldn’t load that just now.</h2>
      <p>{message}</p>
      <p>Please check your connection and try again.</p>
    </div>
  )
}

function HomePage({ favorites, onToggleFavorite }) {
  const categories = [
    { name: 'Sadya', recipe: KERALA_RECIPES[3] },
    { name: 'Breakfast', recipe: KERALA_RECIPES[2] },
    { name: 'Seafood', recipe: KERALA_RECIPES[0] },
    { name: 'Veg delights', recipe: KERALA_RECIPES[6] },
    { name: 'Tea-time bites', recipe: KERALA_RECIPES[7] },
    { name: 'Sweet treats', recipe: KERALA_RECIPES[8] },
  ]

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span /> GOOD FOOD, GOOD MOOD</p>
          <h1>Your Kerala<br />cravings, <span>sorted.</span></h1>
          <p className="hero-description">
            From coastal favourites to comforting classics, find something
            delicious to bring a little taste of Kerala to your table.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/recipes">Explore dishes <span aria-hidden="true">→</span></Link>
            <span className="hero-note"><span aria-hidden="true">✦</span> Made with a little extra love</span>
          </div>
          <div className="hero-promises">
            <span><b aria-hidden="true">✓</b> Freshly made</span>
            <span><b aria-hidden="true">✓</b> Full of flavour</span>
          </div>
        </div>
        <div className="hero-art">
          <img src="/images/malabar-chicken.jpg" alt="Rich, aromatic Malabar chicken curry with rice" />
          <div className="hero-sticker"><span>MADE WITH<br />LOVE IN KERALA</span><span aria-hidden="true">♥</span></div>
          <div className="hero-caption"><span>MALABAR SPECIAL</span><span>BIG FLAVOUR, EVERY BITE</span></div>
        </div>
      </section>
      <section className="category-section" aria-labelledby="category-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHAT ARE YOU IN THE MOOD FOR?</p>
            <h2 id="category-heading">Order by <span>category</span></h2>
          </div>
          <Link className="section-link" to="/recipes">See all dishes <span aria-hidden="true">→</span></Link>
        </div>
        <div className="category-list">
          {categories.map(({ name, recipe }) => (
            <Link className="category-item" key={name} to={`/recipes/${recipe.idMeal}`}>
              <span className="category-image"><RecipePhoto recipe={recipe} /></span>
              <span>{name}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="popular-section" aria-labelledby="popular-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE TASTE OF HOME</p>
            <h2 id="popular-heading">Popular near <span>you</span></h2>
          </div>
          <Link className="section-link" to="/recipes">Browse all <span aria-hidden="true">→</span></Link>
        </div>
        <RecipeGrid
          recipes={KERALA_RECIPES.slice(0, 4)}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      </section>
    </div>
  )
}

function RecipesPage({ favorites, onToggleFavorite }) {
  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const { data, loading, error, isKeralaResults } = useRecipes(query)

  function handleSubmit(event) {
    event.preventDefault()
    const nextQuery = searchInput.trim()
    if (!nextQuery) {
      setValidationMessage('Enter an ingredient or dish to get started.')
      return
    }
    setValidationMessage('')
    setQuery(nextQuery)
  }

  return (
    <main className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">KERALA RECIPES, MADE WITH LOVE</p>
        <h1>Craving a taste of <span>Kerala?</span></h1>
        <p>Search Kerala favourites by dish or ingredient, from coconut-rich curries to comforting coastal classics.</p>
      </section>
      <form className="search-form" onSubmit={handleSubmit}>
        <span className="search-icon" aria-hidden="true">⌕</span>
        <label className="visually-hidden" htmlFor="recipe-search">Search Kerala recipes by dish or ingredient</label>
        <input
          id="recipe-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Try “fish curry”, “coconut”, “chicken”..."
        />
        <button className="button button-dark" type="submit">Search <span aria-hidden="true">↗</span></button>
      </form>
      {validationMessage && <p className="validation-message" role="alert">{validationMessage}</p>}
      {!query && !loading && !error && data.length > 0 && (
        <div className="results-heading"><h2>A taste of Kerala to <span>start.</span></h2></div>
      )}
      {query && (
        <div className="results-heading">
          <h2>{isKeralaResults ? 'Kerala recipes for' : 'More Indian recipes for'} <span>“{query}”</span></h2>
        </div>
      )}
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!query && !loading && !error && (
        <p className="collection-note">
          A small collection inspired by Kerala home cooking. Recipes are original adaptations;
          adjust the chilli, sourness, and seasoning to your taste.
        </p>
      )}
      {!loading && !error && data.length > 0 && (
        <RecipeGrid recipes={data} favorites={favorites} onToggleFavorite={onToggleFavorite} />
      )}
      {!loading && !error && data.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">⌕</span>
          <h2>{query ? 'No Kerala recipe matched that search.' : 'Kerala recipes are unavailable right now.'}</h2>
          <p>{query ? 'Try appam, puttu, avial, fish, chicken, banana, or coconut.' : 'Please check back in a moment.'}</p>
        </div>
      )}
    </main>
  )
}

function RecipeDetailPage({ favorites, onToggleFavorite }) {
  const { id } = useParams()
  const { data: recipe, loading, error } = useRecipe(id)
  const isFavorite = recipe
    ? favorites.some((favorite) => favorite.idMeal === recipe.idMeal)
    : false

  if (loading) return <main className="page-shell"><LoadingState label="Getting the full recipe" /></main>
  if (error) return <main className="page-shell"><ErrorState message={error} /></main>
  if (recipe && !['India', 'Kerala'].includes(recipe.strArea)) {
    return (
      <main className="page-shell">
        <div className="empty-state">
          <h2>This recipe isn’t in our recipe collection.</h2>
          <p>Explore the flavours of God’s Own Country or search another Indian dish.</p>
          <Link className="button button-dark" to="/recipes">Explore Kerala recipes <span aria-hidden="true">↗</span></Link>
        </div>
      </main>
    )
  }
  if (!recipe) {
    return (
      <main className="page-shell">
        <div className="empty-state">
          <h2>We couldn’t find that recipe.</h2>
          <Link className="text-link" to="/recipes">Back to recipes <span aria-hidden="true">→</span></Link>
        </div>
      </main>
    )
  }

  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1
    const name = recipe[`strIngredient${number}`]?.trim()
    const measure = recipe[`strMeasure${number}`]?.trim()
    return name ? { name, measure } : null
  }).filter(Boolean)

  return (
    <main className="page-shell detail-page">
      <Link className="back-link" to="/recipes"><span aria-hidden="true">←</span> Back to recipes</Link>
      <section className="detail-hero">
        <div className="detail-media">
          <div className="detail-image"><RecipePhoto recipe={recipe} loading="eager" /></div>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{[recipe.strArea, recipe.strCategory].filter(Boolean).join(' · ')}</p>
          <h1>{recipe.strMeal}</h1>
          <p className="detail-summary">
            {recipe.strDescription || 'Inspired by the kitchens of Kerala, where coconut, curry leaves, and carefully layered spices bring every meal to life.'}
          </p>
          <button
            type="button"
            className={`button ${isFavorite ? 'button-saved' : 'button-dark'}`}
            onClick={() => onToggleFavorite(recipe)}
            aria-pressed={isFavorite}
          >
            <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
            {isFavorite ? 'Saved to favourites' : 'Save to favourites'}
          </button>
          {recipe.strYoutube && (
            <a className="text-link video-link" href={recipe.strYoutube} target="_blank" rel="noreferrer">
              Watch the video <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </section>
      <section className="recipe-method">
        <div className="ingredients-panel">
          <p className="eyebrow">WHAT YOU’LL NEED</p>
          <h2>The ingredients<span>.</span></h2>
          <ul>
            {ingredients.map(({ name, measure }) => (
              <li key={`${name}-${measure}`}><span>{name}</span><span>{measure}</span></li>
            ))}
          </ul>
        </div>
        <div className="instructions-panel">
          <p className="eyebrow">LET’S GET COOKING</p>
          <h2>The method<span>.</span></h2>
          <div className="instructions-copy">
            {recipe.strInstructions.split(/\r?\n/).filter((step) => step.trim()).map((step, index) => (
              <p key={`${index}-${step.slice(0, 24)}`}><span>{String(index + 1).padStart(2, '0')}</span>{step.trim()}</p>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function FavoritesPage({ favorites, onToggleFavorite }) {
  return (
    <main className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">YOUR KERALA RECIPE BOX</p>
        <h1>Kerala favourites to <span>keep.</span></h1>
        <p>All the flavours of God’s Own Country you’ve saved, ready for your next meal.</p>
      </section>
      {favorites.length > 0 ? (
        <>
          <div className="results-heading"><h2>Your favourites <span>({favorites.length})</span></h2></div>
          <RecipeGrid recipes={favorites} favorites={favorites} onToggleFavorite={onToggleFavorite} />
        </>
      ) : (
        <div className="empty-state favorites-empty">
          <span className="empty-icon" aria-hidden="true">♡</span>
          <h2>Your recipe box is waiting.</h2>
          <p>Save a Kerala recipe you love and it’ll be right here next time.</p>
          <Link className="button button-dark" to="/recipes">Find Kerala recipes <span aria-hidden="true">↗</span></Link>
        </div>
      )}
    </main>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <Link className="brand footer-brand" to="/" aria-label="Nadan home">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19.5 3.5C12.3 3.9 7 5.3 4.9 9.5c-1.1 2.1-.6 4.3 1.2 5.3 1.6.9 3.5.5 5-.4 3.4-2 5.8-6.1 8.4-10.9Z" />
            <path d="M4.5 20c4.2-4.2 8.2-8 13.6-12.8" />
          </svg>
        </span>
        <span>nadan<span className="brand-period">.</span></span>
      </Link>
      <p>A little taste of God’s Own Country.</p>
 
      <span>FROM KERALA, WITH LOVE <span aria-hidden="true">✳</span></span>
    </footer>
  )
}

function App() {
  const [favorites, setFavorites] = useState(readFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.error('Unable to save favorites.', error)
    }
  }, [favorites])

  function toggleFavorite(recipe) {
    setFavorites((currentFavorites) =>
      currentFavorites.some((favorite) => favorite.idMeal === recipe.idMeal)
        ? currentFavorites.filter((favorite) => favorite.idMeal !== recipe.idMeal)
        : [...currentFavorites, recipe],
    )
  }

  return (
    <div className="app">
      <Navbar favoriteCount={favorites.length} />
      <Routes>
        <Route path="/" element={<HomePage favorites={favorites} onToggleFavorite={toggleFavorite} />} />
        <Route path="/recipes" element={<RecipesPage favorites={favorites} onToggleFavorite={toggleFavorite} />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage favorites={favorites} onToggleFavorite={toggleFavorite} />} />
        <Route path="/favourites" element={<FavoritesPage favorites={favorites} onToggleFavorite={toggleFavorite} />} />
        <Route path="*" element={<main className="page-shell not-found"><p className="eyebrow">404 / WRONG TURN</p><h1>No Kerala flavours <span>here.</span></h1><Link className="button button-dark" to="/">Back home <span aria-hidden="true">↗</span></Link></main>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
