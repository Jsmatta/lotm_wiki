/**
 * Single stroked-outline SVG wrapper. Every icon in the app is one path from
 * `src/config/icons.js` or a category entry, so the surrounding markup lives
 * here instead of being repeated at each call site.
 */
export default function Icon({ path, className = "h-5 w-5", strokeWidth = 2, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d={path}
      />
    </svg>
  );
}
