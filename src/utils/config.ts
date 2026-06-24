const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export function getExecuteUrl(): string {
  return API_BASE_URL ? `${API_BASE_URL}/execute` : '/execute';
}
