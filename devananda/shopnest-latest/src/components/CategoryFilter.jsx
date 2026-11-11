
export default function CategoryFilter({
  categories,
  selected,
  onSelect
}) {
  return (
    <div className="category-filter">
      <button
        className={selected === 'all' ? 'active' : ''}
        onClick={() => onSelect('all')}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          className={selected === category ? 'active' : ''}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}