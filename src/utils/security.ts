/**
 * Utilitaires de sécurité pour l'application MentalTech Discover
 */

// Assainie une URL pour éviter les attaques XSS via les liens
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase().trim();

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      console.warn(`URL bloquée pour raisons de sécurité: ${url}`);
      return '';
    }
  }

  // Autoriser uniquement http, https et mailto
  if (!lowerUrl.startsWith('http://') &&
      !lowerUrl.startsWith('https://') &&
      !lowerUrl.startsWith('mailto:')) {
    console.warn(`Protocole non autorisé: ${url}`);
    return '';
  }

  return url;
}

// Check si value est dans la liste des autorisées
export function validateAnswerValue(value: string, allowedValues: string[]): boolean {
  return allowedValues.includes(value);
}

// Clean les textes pour éviter les failles
export function sanitizeText(text: string, maxLength: number = 1000): string {
  if (!text) return '';

  const truncated = text.slice(0, maxLength);

  // Supprimer les caractères dangereux (sauf espaces, tabs, newlines)
  return truncated.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

// Vérifie si un objet contient uniquement des clés attendues (validation local storage)
export function validateObjectKeys<T extends object>(
  obj: unknown,
  allowedKeys: (keyof T)[]
): obj is T {
  if (!obj || typeof obj !== 'object') return false;

  const objectKeys = Object.keys(obj);
  return objectKeys.every(key => allowedKeys.includes(key as keyof T));
}

// Parse de manière sécurisée les données JSON du localStorage
export function safeJSONParse<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) return fallback;

  try {
    const parsed = JSON.parse(jsonString);
    return parsed ?? fallback;
  } catch (error) {
    console.warn('Erreur lors du parsing JSON:', error);
    return fallback;
  }
}
