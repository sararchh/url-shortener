export function generateShortUrl(): string {
  return Math.random().toString(36).substring(2, 8);
}
