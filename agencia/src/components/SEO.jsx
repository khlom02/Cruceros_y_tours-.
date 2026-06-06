import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Cruceros y Tours';
const BASE_URL = 'https://cruceros-y-tours.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/logo_cruceros_y_tours_completo_color.png`;
const DEFAULT_DESCRIPTION =
  'Agencia de viajes especializada en cruceros de lujo, tours, vuelos y servicios especiales. Descubre destinos únicos en el Caribe, Mediterráneo y más.';
const SITE_KEYWORDS = 'agencia de viajes, cruceros de lujo, tours, vuelos internacionales, viajes, turismo, Venezuela, Caribe, Mediterráneo';

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  imageWidth = 1200,
  imageHeight = 630,
  type = 'website',
  noindex = false,
  nofollow = false,
  jsonLd = null,
  publishedTime,
  modifiedTime,
  locale = 'es_ES',
}) => {
  const robotsValue = noindex
    ? `noindex${nofollow ? ', nofollow' : ', follow'}`
    : `index${nofollow ? ', nofollow' : ', follow'}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const secureImage = image.startsWith('http:') ? image.replace('http:', 'https:') : image;

  return (
    <Helmet>
      {/* Básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={SITE_KEYWORDS} />
      <link rel="canonical" href={fullCanonical} />
      <meta name="robots" content={robotsValue} />
      <meta name="author" content={SITE_NAME} />
      <meta name="theme-color" content="#003366" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={secureImage} />
      <meta property="og:image:secure_url" content={secureImage} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={`${SITE_NAME} — Agencia de Viajes`} />
      <meta property="og:locale" content={locale} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={secureImage} />
      <meta name="twitter:site" content="@crucerosytours" />

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
