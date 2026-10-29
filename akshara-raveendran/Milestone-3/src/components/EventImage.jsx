import { useState } from "react";

export default function EventImage({ src, alt, className = "", loading = "lazy" }) {
  const [hasFailed, setHasFailed] = useState(false);

  if (hasFailed) {
    return (
      <span
        className={`image-fallback ${className}`}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={!alt}
      >
        <span className="image-fallback-mark" aria-hidden="true">
          ✳
        </span>
        <span>Image unavailable</span>
      </span>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setHasFailed(true)}
    />
  );
}
