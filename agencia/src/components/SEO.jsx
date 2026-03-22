import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Cruceros y Tours';
const BASE_URL = 'https://crucerosytours.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/logo_cruceros_y_tours_completo_color.png`;
const DEFAULT_DESCRIPTION =
  'Agencia de viajes especializada en cruceros de lujo, tours, vuelos y servicios especiales. Descubre destinos únicos en el Caribe, Mediterráneo y más.';

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd = null,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      {/* Básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="author" content={SITE_NAME} />

      {/* Open Graph — para redes sociales, Google y la mayoría de IAs */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${SITE_NAME} — Agencia de Viajes`} />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Datos estructurados (opcional por página) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
