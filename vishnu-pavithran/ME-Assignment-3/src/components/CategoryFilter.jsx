function CategoryFilter({
  categories = [],
  selectedCategory = "All",
  onSelectCategory = () => {},
}) {
  return (
    <div
      className="category-filter d-flex flex-wrap justify-content-center gap-2"
      role="group"
      aria-label="Filter products by category"
    >
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`btn ${
            selectedCategory === category
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          aria-pressed={selectedCategory === category}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
