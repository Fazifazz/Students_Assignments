const MAX_PRICE = 1000000;
const DEFAULT_IMAGE = "/menu/hero-dish.svg";

export function createProduct(input, id) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Product details are required.");
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const category = typeof input.category === "string" ? input.category.trim() : "";
  const description = input.description === undefined
    ? ""
    : typeof input.description === "string" ? input.description.trim() : null;
  const image = input.image === undefined || input.image === null
    ? ""
    : typeof input.image === "string" ? input.image.trim() : null;
  const price = Number(input.price);

  if (!name || name.length > 80) {
    throw new Error("Product name is required and must be 80 characters or fewer.");
  }
  if (!category || category.length > 40) {
    throw new Error("Category is required and must be 40 characters or fewer.");
  }
  if (description === null || description.length > 160) {
    throw new Error("Description must be 160 characters or fewer.");
  }
  if (!Number.isFinite(price) || price <= 0 || price > MAX_PRICE) {
    throw new Error(`Price must be greater than 0 and no more than ${MAX_PRICE}.`);
  }
  const isMenuPath = image && image.startsWith("/menu/") && !image.split("/").includes("..");
  const isHttpsUrl = image && /^https:\/\/[^\s]+$/.test(image);
  if (image === null || image.length > 500 || (image && !isMenuPath && !isHttpsUrl)) {
    throw new Error("Image must be an HTTPS URL or a path under /menu/ and no more than 500 characters.");
  }

  return {
    id,
    name,
    category,
    price,
    description,
    image: image || DEFAULT_IMAGE
  };
}
