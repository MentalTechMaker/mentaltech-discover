import { apiFetch, setTokens } from './client';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function register(email: string, password: string, name: string): Promise<TokenResponse> {
  const data = await apiFetch<TokenResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const data = await apiFetch<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function getMe(): Promise<UserResponse> {
  return apiFetch<UserResponse>('/auth/me', {}, true);
}
