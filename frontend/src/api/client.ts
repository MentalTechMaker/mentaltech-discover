const API_BASE = '/api';
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 1;

// Access token in memory - not persisted to localStorage (XSS-safe)
// Refresh token lives in HttpOnly cookie set by the backend
let _accessToken: string | null = null;

// Non-sensitive session flag: just tells us whether to attempt a refresh on page load
// Does NOT contain the token itself - safe in localStorage
const SESSION_FLAG = 'has_session';

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(callback: () => void) {
  onUnauthorized = callback;
}

function getTokens() {
  if (!_accessToken) return null;
  return { accessToken: _accessToken };
}

function setTokens(accessToken: string) {
  _accessToken = accessToken;
  localStorage.setItem(SESSION_FLAG, '1');
}

function clearTokens() {
  _accessToken = null;
  localStorage.removeItem(SESSION_FLAG);
  // Cleanup legacy formats
  localStorage.removeItem('access_token');
  localStorage.removeItem('auth');
}

export function hasSessionFlag(): boolean {
  return localStorage.getItem(SESSION_FLAG) === '1';
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
      credentials: 'include',
      // Pas de body ni Content-Type : le refresh token vient du cookie HttpOnly.
      // Envoyer {} avec application/json provoque une 422 FastAPI car
      // TokenRefresh.refresh_token est requis et absent du body vide.
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
    // FastAPI validation errors (422) retournent detail comme tableau d'objets
    let message: string;
    if (Array.isArray(error.detail)) {
      message = error.detail.map((e: { msg?: string }) => e.msg ?? 'Erreur de validation').join(', ');
    } else {
      message = error.detail || `Erreur ${res.status}`;
    }
    throw new Error(message);
  }

  return res.json();
}

export { getTokens, setTokens, clearTokens, refreshAccessToken };
