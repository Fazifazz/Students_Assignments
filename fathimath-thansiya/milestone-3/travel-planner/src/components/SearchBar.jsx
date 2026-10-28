import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search destinations",
}) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <Search size={18} />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search destinations"
      />
      <button type="submit" className="primary-btn compact-btn">
        Search
      </button>
    </form>
  );
}
