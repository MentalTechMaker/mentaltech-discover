import { Head } from "vite-react-ssg";
import { SITE_URL } from "./meta";

const SITE_NAME = "MentalTech Discover";

interface PageMetaProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Declarative head management for SSG'd routes. Renders <title>, meta tags,
 * canonical, OG/Twitter tags, and JSON-LD as part of the React tree — so they
 * appear in the SSG'd HTML (not just after client-side hydration).
 */
export function PageMeta({
  title,
  description,
  canonical,
  ogImage,
  jsonLd,
}: PageMetaProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {description && (
        <meta property="og:description" content={description} />
      )}
      {description && (
        <meta name="twitter:description" content={description} />
      )}
      <meta property="og:title" content={fullTitle} />
      <meta name="twitter:title" content={fullTitle} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {canonicalUrl && <meta name="twitter:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Head>
  );
}
