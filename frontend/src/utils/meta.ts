const SITE_NAME = "MentalTech Discover";

/**
 * Update the page title and meta description.
 * Call inside a useEffect(() => { ... }, []) in each page component.
 */
export function setPageMeta(title: string, description?: string): void {
  document.title = `${title} | ${SITE_NAME}`;

  if (description) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", description);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", `${title} | ${SITE_NAME}`);

  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute("content", `${title} | ${SITE_NAME}`);
}

/**
 * Inject or replace a JSON-LD <script> tag in <head>.
 * The `id` ensures only one instance per type exists.
 */
export function injectJsonLd(id: string, data: Record<string, unknown>): void {
  document.getElementById(id)?.remove();
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

/** Remove a JSON-LD tag when the component unmounts. */
export function removeJsonLd(id: string): void {
  document.getElementById(id)?.remove();
}

/** Update or create the canonical URL link tag. */
export function setCanonical(path: string): void {
  const href = `https://discover.mentaltech.fr${path}`;
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", href);
  const twUrl = document.querySelector('meta[name="twitter:url"]');
  if (twUrl) twUrl.setAttribute("content", href);
}
