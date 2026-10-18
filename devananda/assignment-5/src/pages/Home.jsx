import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()

    const query = searchTerm.trim()

    if (query) {
      navigate(`/recipes?q=${encodeURIComponent(query)}`)
    } else {
      navigate('/recipes?q=chicken')
    }
  }

  return (
    <main className="home">
      <div className="hero-content">
        <span className="eyebrow">YOUR DAILY FOOD INSPIRATION</span>

        <h1>
          Find Your Favourite <span>Recipe</span> 🍲
        </h1>

        <p>
          Discover delicious recipes from around the world.
          Find something wonderful to cook today.
        </p>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search recipes... e.g. chicken"
            aria-label="Search recipes"
          />

          <button type="submit">Search →</button>
        </form>

        <div className="popular-searches">
          <span>Try:</span>
          {['Chicken', 'Pasta', 'Cake'].map((item) => (
            <button
              key={item}
              onClick={() => navigate(
                `/recipes?q=${encodeURIComponent(item)}`
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Home