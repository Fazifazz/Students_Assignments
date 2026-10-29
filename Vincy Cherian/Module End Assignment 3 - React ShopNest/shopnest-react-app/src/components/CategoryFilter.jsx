

export function CategoryFilter({
    categories,
    selectedCategory,
    onCategoryChange
}) {
    return (
        <div className="category-sidebar">
            <br/>
            <h5 className="mb-3">CATEGORY</h5>

            <ul className="list-group">
                {categories.map(category => (
                    <li
                        key={category}
                        className="list-group-item p-0"
                    >
                        <button
                            type="button"
                            onClick={() => onCategoryChange(category)}
                            className={`list-group-item list-group-item-action border-0 ${
                                selectedCategory === category
                                    ? "active"
                                    : ""
                            }`}
                        >
                            {category === "ALL"
                                ? "ALL PRODUCTS"
                                : category}
                        </button>
                    </li>
                ))}
            </ul>
            <br/><br/><br/>
        </div>
    );
}