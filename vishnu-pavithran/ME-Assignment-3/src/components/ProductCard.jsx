import { Link } from "react-router-dom";

const localProductImages = import.meta.glob("../assets/images/*", {
  eager: true,
  import: "default",
});

function ProductCard({ product }) {
  const { id, name, title, price, category, imageUrl, image } = product;
  const productName = name || title;
  const imagePath = imageUrl || image;
  const imageFilename = imagePath?.split(/[\\/]/).pop();
  const localImagePath = imageFilename
    ? localProductImages[`../assets/images/${imageFilename}`]
    : undefined;
  const productImage = localImagePath || imagePath;

  return (
    <article className="col-sm-6 col-lg-4">
      <div className="card product-card h-100">
        <img
          src={productImage}
          className="card-img-top"
          alt={productName}
        />
        <div className="card-body d-flex flex-column">
          <p className="small text-muted mb-1">{category}</p>
          <h2 className="h5 card-title">{productName}</h2>
          <div className="d-flex align-items-center justify-content-between mt-auto">
            <strong className="text-primary">₹{price}</strong>
            <Link
              className="btn btn-outline-primary"
              to={`/products/${id}`}
              aria-label={`View details for ${productName}`}
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
