function Categories({ onCategorySelect }) {
  const categories = [
    { name: "Clothing", className: "category-clothing" },
    { name: "Electronics", className: "category-electronics" },
    { name: "Footwear", className: "category-footwear" },
    { name: "Books", className: "category-books" }
  ];

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    document.getElementById("products-section")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <section id="categories-section" className="py-5">
      <div className="container">

        <div className="section-heading">
          <p className="section-eyebrow">EXPLORE</p>
          <h2>
            Shop by <span className="head-span">Category</span>
          </h2>
        </div>

        <div className="row g-4">
          {categories.map((category) => (
            <div
              className="col-12 col-sm-6 col-lg-3"
              key={category.name}
            >
              <button
                className={`category-card ${category.className} category-jump`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <span>{category.name}</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;