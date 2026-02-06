export const MIN_PASSWORD_LENGTH = 8;

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
}

export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`;
  }
  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une majuscule";
  }
  if (!/[a-z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une minuscule";
  }
  if (!/\d/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre";
  }
  return null;
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "", color: "bg-gray-200" };

  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Faible", color: "bg-red-500" };
  if (score === 2) return { score: 2, label: "Moyen", color: "bg-orange-500" };
  if (score === 3) return { score: 3, label: "Bon", color: "bg-yellow-500" };
  return { score: 4, label: "Fort", color: "bg-green-500" };
}
