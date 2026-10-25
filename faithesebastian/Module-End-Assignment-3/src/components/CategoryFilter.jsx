export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}) {
  return (
    <div className="filters" aria-label="Filter products by category">
      {["All", ...categories].map((category) => (
        <button
          className={`filter-btn${selectedCategory === category ? " active" : ""}`}
          type="button"
          key={category}
          onClick={() => onSelect(category)}
          aria-pressed={selectedCategory === category}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
