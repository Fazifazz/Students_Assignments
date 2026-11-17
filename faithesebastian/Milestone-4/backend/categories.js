export function createCategory(input, id) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Category details are required.");
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name || name.length > 40) {
    throw new Error("Category name is required and must be 40 characters or fewer.");
  }

  return { id, name };
}
