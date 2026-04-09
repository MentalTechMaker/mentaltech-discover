import { apiFetch, setTokens } from "./client";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  email_sent?: boolean;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  email_verified: boolean;
  is_verified_prescriber?: boolean;
  profession?: string | null;
  organization?: string | null;
  rpps_adeli?: string | null;
  company_name?: string | null;
  siret?: string | null;
  company_website?: string | null;
  is_verified_publisher?: boolean;
}

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<TokenResponse> {
  const data = await apiFetch<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
    credentials: "include",
  });
  setTokens(data.access_token);
  return data;
}

export async function registerPrescriber(
  email: string,
  password: string,
  name: string,
  profession: string,
  organization?: string,
  rppsAdeli?: string,
): Promise<TokenResponse> {
  const data = await apiFetch<TokenResponse>("/auth/register-prescriber", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      name,
      profession,
      organization: organization || null,
      rpps_adeli: rppsAdeli || null,
    }),
    credentials: "include",
  });
  setTokens(data.access_token);
  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const data = await apiFetch<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  setTokens(data.access_token);
  return data;
}

export async function getMe(): Promise<UserResponse> {
  return apiFetch<UserResponse>("/auth/me", {}, true);
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    "/auth/change-password",
    {
      method: "PUT",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    },
    true,
  );
}

export async function forgotPassword(
  email: string,
): Promise<{ message: string; email_sent?: boolean }> {
  return apiFetch<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    `/auth/verify-email?token=${encodeURIComponent(token)}`,
    {},
  );
}

export async function resendVerification(): Promise<{
  message: string;
  email_sent?: boolean;
}> {
  return apiFetch<{ message: string }>(
    "/auth/resend-verification",
    {
      method: "POST",
    },
    true,
  );
}
