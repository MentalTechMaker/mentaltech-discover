const API_BASE = '/api';
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 1;

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(callback: () => void) {
  onUnauthorized = callback;
}

function getTokens() {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) return null;
  return { accessToken };
}

function setTokens(accessToken: string, _refreshToken?: string) {
  localStorage.setItem('access_token', accessToken);
  // Refresh token is now stored as HttpOnly cookie by the backend
}

function clearTokens() {
  localStorage.removeItem('access_token');
  // Also remove legacy format
  localStorage.removeItem('auth');
}

function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = REQUEST_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeout));
}

function isRetryable(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return true;
  if (error instanceof TypeError) return true; // network error
  return false;
}

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchWithTimeout(url, options);
    } catch (error) {
      if (attempt < retries && isRetryable(error)) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('La requête a expiré, veuillez réessayer');
      }
      throw error;
    }
  }
  throw new Error('La requête a échoué après plusieurs tentatives');
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    setTokens(data.access_token);
    return data.access_token;
  } catch {
    clearTokens();
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const tokens = getTokens();
    if (tokens?.accessToken) {
      headers.set('Authorization', `Bearer ${tokens.accessToken}`);
    }
  }

  let res = await fetchWithRetry(url, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      res = await fetchWithRetry(url, { ...options, headers });
    } else {
      if (onUnauthorized) onUnauthorized();
      throw new Error('Non authentifié');
    }
  }

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Erreur inconnue' }));
    throw new Error(error.detail || `Erreur ${res.status}`);
  }

  return res.json();
}

export { getTokens, setTokens, clearTokens };
