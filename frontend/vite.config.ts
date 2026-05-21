import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Routes that must NOT be pre-rendered (private, session-only, dynamic-only).
// They render as a normal SPA — robots.txt + setRobotsNoindex handle indexing.
const SSG_EXCLUDED = [
  '/admin',
  '/dashboard',
  '/nouvelle-prescription',
  '/prescripteur',
  '/connexion',
  '/inscription',
  '/profil',
  '/check-email',
  '/forgot-password',
  '/reset-password',
  '/veille',
  '/confirmer-soumission',
  '/confirmer-candidature',
  '/questionnaire',
  '/resultats',
];

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd() + '/..', 'FRONTEND_URL');
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(env.FRONTEND_URL || 'http://localhost:3033'),
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    ssgOptions: {
      entry: 'src/main.tsx',
      dirStyle: 'nested',
      includedRoutes(paths: string[]) {
        const normalize = (p: string) => (p.startsWith('/') ? p : `/${p}`);
        const excluded = new Set(SSG_EXCLUDED);
        return paths.filter((raw: string) => {
          const p = normalize(raw);
          if (p.includes('*')) return false;
          // Skip the parametric template itself (vite-react-ssg expands :productId
          // via getStaticPaths on the route definition).
          if (p.includes(':')) return false;
          if (excluded.has(p)) return false;
          if (SSG_EXCLUDED.some((ex) => p.startsWith(`${ex}/`))) return false;
          return true;
        });
      },
    },
  }
})
