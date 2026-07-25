/**
 * Prefix image paths with basePath for GitHub Pages.
 * In development (no basePath), returns the path as-is.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function img(path: string): string {
  if (!path) return path;
  if (path.startsWith("http") || path.startsWith("//")) return path;
  if (path.startsWith(BASE)) return path;
  return `${BASE}${path}`;
}
