import type { ApiResponse, ExecutePayload, ResponseState } from '../types';

const EXECUTE_URL = '/execute';

export async function executeRequest(payload: ExecutePayload): Promise<ResponseState> {
  try {
    const response = await fetch(EXECUTE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as ApiResponse;

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
    return {
      status: 0,
      statusText: 'Network Error',
      headers: {},
      body: null,
      duration: 0,
      error: error instanceof Error ? error.message : 'Failed to execute request',
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
