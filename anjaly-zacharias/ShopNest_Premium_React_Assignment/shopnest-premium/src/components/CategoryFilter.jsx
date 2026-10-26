import { categories } from "../data/products";

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="category-pills d-flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {categories.map((category) => (
        <button key={category.id} type="button" className={`category-pill ${selected === category.id ? "selected" : ""}`} onClick={() => onSelect(category.id)}>
          <i className={`bi ${category.icon} me-2`}></i>{category.label}
        </button>
      ))}
    </div>
  );
}