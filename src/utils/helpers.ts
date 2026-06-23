import type { KeyValuePair } from '../types';

export function keyValuePairsToRecord(pairs: KeyValuePair[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const { key, value } of pairs) {
    const trimmedKey = key.trim();
    if (trimmedKey) {
      result[trimmedKey] = value;
    }
  }
  return result;
}

export function buildUrlWithParams(baseUrl: string, params: KeyValuePair[]): string {
  if (!baseUrl) return '';

  const activeParams = params.filter((p) => p.key.trim());
  if (activeParams.length === 0) return baseUrl;

  try {
    const url = new URL(baseUrl);
    for (const { key, value } of activeParams) {
      url.searchParams.set(key.trim(), value);
    }
    return url.toString();
  } catch {
    const separator = baseUrl.includes('?') ? '&' : '?';
    const query = activeParams
      .map(({ key, value }) => `${encodeURIComponent(key.trim())}=${encodeURIComponent(value)}`)
      .join('&');
    return `${baseUrl}${separator}${query}`;
  }
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
