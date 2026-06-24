import type { ApiResponse, ExecutePayload, ResponseState } from '../types';
import { getExecuteUrl } from './config';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchExecute(payload: ExecutePayload): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fetch(getExecuteUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Failed to fetch');
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  throw lastError ?? new Error('Failed to fetch');
}

function networkErrorMessage(error: Error): string {
  if (error.message === 'Failed to fetch') {
    return (
      'Could not reach the proxy server. This often happens when a Render-hosted API is waking up ' +
      '(cold start). Wait a moment and try again, or check that VITE_API_URL and CORS_ORIGIN are configured correctly.'
    );
  }
  return error.message;
}

export async function executeRequest(payload: ExecutePayload): Promise<ResponseState> {
  try {
    const response = await fetchExecute(payload);
    const text = await response.text();

    let data: ApiResponse;
    try {
      data = JSON.parse(text) as ApiResponse;
    } catch {
      return {
        status: 0,
        statusText: 'Error',
        headers: {},
        body: null,
        duration: 0,
        error: `API returned a non-JSON response (${response.status}). Check VITE_API_URL points to your backend.`,
      };
    }

    if (!data.success) {
      return {
        status: 0,
        statusText: 'Error',
        headers: {},
        body: null,
        duration: 0,
        error: data.error,
      };
    }

    return {
      status: data.data.status,
      statusText: data.data.statusText,
      headers: data.data.headers,
      body: data.data.body,
      duration: data.data.duration,
    };
  } catch (error) {
    const message = error instanceof Error ? networkErrorMessage(error) : 'Failed to execute request';
    return {
      status: 0,
      statusText: 'Network Error',
      headers: {},
      body: null,
      duration: 0,
      error: message,
    };
  }
}

export function formatJson(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function isJsonBody(body: unknown): boolean {
  if (typeof body === 'object' && body !== null) return true;
  if (typeof body === 'string') {
    const trimmed = body.trim();
    return (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    );
  }
  return false;
}

export function getStatusColor(status: number): string {
  if (status === 0) return 'text-red-500';
  if (status >= 200 && status < 300) return 'text-green-500';
  if (status >= 300 && status < 400) return 'text-blue-500';
  if (status >= 400 && status < 500) return 'text-orange-500';
  return 'text-red-500';
}

export function getMethodColor(method: string): string {
  switch (method) {
    case 'GET':
      return 'text-green-500';
    case 'POST':
      return 'text-yellow-500';
    case 'PUT':
      return 'text-blue-500';
    case 'PATCH':
      return 'text-purple-500';
    case 'DELETE':
      return 'text-red-500';
    default:
      return 'text-text-secondary';
  }
}
