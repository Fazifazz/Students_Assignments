
function CategoryFilter({ activeCategory, setActiveCategory }) {
  const categories = [
    "All",
    "Clothing",
    "Electronics",
    "Footwear",
    "Books",
  ];

  return (
    <div className="filter-bar">
      <div className="category-buttons" role="group">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
