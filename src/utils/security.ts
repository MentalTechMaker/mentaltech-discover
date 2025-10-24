/**
 * Utilitaires de sécurité pour l'application MentalTech Discover
 */

/**
 * Sanitize une URL pour éviter les attaques XSS via les liens
 * @param url - L'URL à vérifier
 * @returns L'URL si elle est sûre, sinon une chaîne vide
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  // Bloquer les protocoles dangereux
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase().trim();

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      console.warn(`URL bloquée pour raisons de sécurité: ${url}`);
      return '';
    }
  }

  // Autoriser uniquement http, https, et mailto
  if (!lowerUrl.startsWith('http://') &&
      !lowerUrl.startsWith('https://') &&
      !lowerUrl.startsWith('mailto:')) {
    console.warn(`Protocole non autorisé: ${url}`);
    return '';
  }

  return url;
}

/**
 * Valide que la valeur est dans la liste des options autorisées
 * Utilisé pour prévenir l'injection de valeurs malicieuses
 */
export function validateAnswerValue(value: string, allowedValues: string[]): boolean {
  return allowedValues.includes(value);
}

/**
 * Nettoie et limite la taille d'un texte pour éviter les abus
 */
export function sanitizeText(text: string, maxLength: number = 1000): string {
  if (!text) return '';

  // Limiter la longueur
  const truncated = text.slice(0, maxLength);

  // Supprimer les caractères de contrôle dangereux (sauf espaces, tabs, newlines)
  return truncated.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Vérifie si un objet contient uniquement des clés attendues
 * Utile pour valider les données du localStorage
 */
export function validateObjectKeys<T extends object>(
  obj: unknown,
  allowedKeys: (keyof T)[]
): obj is T {
  if (!obj || typeof obj !== 'object') return false;

  const objectKeys = Object.keys(obj);
  return objectKeys.every(key => allowedKeys.includes(key as keyof T));
}

/**
 * Parse de manière sécurisée les données JSON du localStorage
 */
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

/**
 * Génère un nonce cryptographiquement sûr pour CSP
 * Note: Cette fonction n'est pas utilisée côté client mais peut servir
 * pour générer des nonces si le projet évolue vers du SSR
 */
export function generateNonce(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback (ne devrait pas arriver en production)
  return Math.random().toString(36).substring(2, 15);
}
