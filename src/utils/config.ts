const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export function getExecuteUrl(): string {
  // In dev, always use the Vite proxy to avoid CORS issues with localhost.
  if (import.meta.env.DEV) {
    return '/execute';
  }
  return API_BASE_URL ? `${API_BASE_URL}/execute` : '/execute';
}
