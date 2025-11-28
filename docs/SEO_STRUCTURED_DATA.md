# SEO Technical & Structured Data Guide (2025)

## Why Structured Data Matters

**Structured data** helps search engines understand your content, enabling:
- **Rich snippets** in search results (stars, prices, images)
- **Knowledge panels** (business info, logo, social profiles)
- **Enhanced visibility** and click-through rates
- **Voice search** optimization
- **Google Discover** eligibility

## JSON-LD Format

**JSON-LD** (JavaScript Object Notation for Linked Data) is Google's recommended format for structured data.

### Basic Syntax

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MM Digital",
  "url": "https://mmdigital.com"
}
</script>
```

**Advantages over Microdata:**
- Easier to maintain (separate from HTML)
- No impact on page structure
- Can be dynamically generated
- Google's preferred format

## Schema.org Types for MM Digital

### 1. Organization Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MM Digital",
  "url": "https://mmdigital.com",
  "logo": "https://mmdigital.com/images/logo.png",
  "description": "Agencia de transformación digital especializada en identidad digital y desarrollo web profesional.",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CL",
    "addressLocality": "Santiago",
    "addressRegion": "Región Metropolitana"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "contacto@mmdigital.com",
    "availableLanguage": ["Spanish"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/mmdigital",
    "https://twitter.com/mmdigital",
    "https://www.instagram.com/mmdigital"
  ]
}
</script>
```

### 2. LocalBusiness Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "MM Digital",
  "image": "https://mmdigital.com/images/office.jpg",
  "@id": "https://mmdigital.com",
  "url": "https://mmdigital.com",
  "telephone": "+56912345678",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Providencia 123",
    "addressLocality": "Santiago",
    "addressRegion": "RM",
    "postalCode": "7500000",
    "addressCountry": "CL"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -33.4489,
    "longitude": -70.6693
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  }
}
</script>
```

### 3. Service Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Desarrollo Web y Transformación Digital",
  "provider": {
    "@type": "Organization",
    "name": "MM Digital"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Chile"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicios de Identidad Digital",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Plan Semilla",
          "description": "Landing Page esencial para validar tu idea",
          "offers": {
            "@type": "Offer",
            "price": "70000",
            "priceCurrency": "CLP"
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Plan Identidad Digital",
          "description": "Diseño a medida con dominio propio",
          "offers": {
            "@type": "Offer",
            "price": "280000",
            "priceCurrency": "CLP"
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Plan Presencia Pyme",
          "description": "Web corporativa robusta con integraciones",
          "offers": {
            "@type": "Offer",
            "price": "550000",
            "priceCurrency": "CLP"
          }
        }
      }
    ]
  }
}
</script>
```

### 4. WebSite Schema (with SearchAction)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MM Digital",
  "url": "https://mmdigital.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://mmdigital.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>
```

### 5. BreadcrumbList Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://mmdigital.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Servicios",
      "item": "https://mmdigital.com#servicios"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Contacto",
      "item": "https://mmdigital.com#contacto"
    }
  ]
}
</script>
```

### 6. FAQPage Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es la identidad digital?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La identidad digital es el cimiento de tu presencia online. Define quién eres en el mundo digital y cómo te perciben tus clientes potenciales."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto tiempo toma desarrollar un sitio web?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El Plan Semilla se entrega en 48 horas. El Plan Identidad Digital toma 1-2 semanas, y el Plan Presencia Pyme entre 2-4 semanas."
      }
    }
  ]
}
</script>
```

## Essential Meta Tags

### Basic SEO Meta Tags

```html
<head>
    <!-- Title (50-60 characters) -->
    <title>MM Digital - Tu Viaje de Identidad Digital | Desarrollo Web Profesional</title>
    
    <!-- Description (150-160 characters) -->
    <meta name="description" content="Transformación digital profesional. Desde landing pages hasta ecosistemas digitales completos. Construye tu identidad digital paso a paso.">
    
    <!-- Keywords (optional, low impact) -->
    <meta name="keywords" content="desarrollo web, identidad digital, transformación digital, diseño web, Chile">
    
    <!-- Author -->
    <meta name="author" content="MM Digital">
    
    <!-- Robots -->
    <meta name="robots" content="index, follow">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://mmdigital.com">
    
    <!-- Language -->
    <html lang="es">
</head>
```

### Open Graph (Facebook, LinkedIn)

```html
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://mmdigital.com">
<meta property="og:title" content="MM Digital - Tu Viaje de Identidad Digital">
<meta property="og:description" content="Transformación digital profesional. Construye tu identidad digital paso a paso.">
<meta property="og:image" content="https://mmdigital.com/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="MM Digital">
<meta property="og:locale" content="es_CL">
```

### Twitter Cards

```html
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@mmdigital">
<meta name="twitter:creator" content="@mmdigital">
<meta name="twitter:title" content="MM Digital - Tu Viaje de Identidad Digital">
<meta name="twitter:description" content="Transformación digital profesional. Construye tu identidad digital paso a paso.">
<meta name="twitter:image" content="https://mmdigital.com/images/twitter-card.jpg">
```

### Mobile & App

```html
<!-- Mobile -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#0f172a">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="MM Digital">

<!-- App Icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
```

## Complete SEO Head for MM Digital

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Basic Meta -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0f172a">
    
    <!-- SEO Meta -->
    <title>MM Digital - Tu Viaje de Identidad Digital | Desarrollo Web Profesional</title>
    <meta name="description" content="Transformación digital profesional. Desde landing pages hasta ecosistemas digitales completos. Construye tu identidad digital paso a paso con MM Digital.">
    <meta name="keywords" content="desarrollo web, identidad digital, transformación digital, diseño web, landing page, Chile, Santiago">
    <meta name="author" content="MM Digital">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://mmdigital.com">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mmdigital.com">
    <meta property="og:title" content="MM Digital - Tu Viaje de Identidad Digital">
    <meta property="og:description" content="Transformación digital profesional. Construye tu identidad digital paso a paso.">
    <meta property="og:image" content="https://mmdigital.com/images/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="MM Digital">
    <meta property="og:locale" content="es_CL">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="MM Digital - Tu Viaje de Identidad Digital">
    <meta name="twitter:description" content="Transformación digital profesional. Construye tu identidad digital paso a paso.">
    <meta name="twitter:image" content="https://mmdigital.com/images/twitter-card.jpg">
    
    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="css/style.css">
    
    <!-- Structured Data: Organization -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MM Digital",
      "url": "https://mmdigital.com",
      "logo": "https://mmdigital.com/images/logo.png",
      "description": "Agencia de transformación digital especializada en identidad digital y desarrollo web profesional.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CL",
        "addressLocality": "Santiago"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "contacto@mmdigital.com",
        "availableLanguage": ["Spanish"]
      }
    }
    </script>
    
    <!-- Structured Data: Service -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Desarrollo Web y Transformación Digital",
      "provider": {
        "@type": "Organization",
        "name": "MM Digital"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Chile"
      }
    }
    </script>
</head>
<body>
    <!-- Content -->
</body>
</html>
```

## Technical SEO Checklist

### On-Page SEO
- [ ] Unique, descriptive title (50-60 chars)
- [ ] Compelling meta description (150-160 chars)
- [ ] Single H1 per page
- [ ] Logical heading hierarchy (H1 > H2 > H3)
- [ ] Descriptive alt text for all images
- [ ] Internal linking structure
- [ ] Clean, descriptive URLs
- [ ] Canonical tags to prevent duplicates

### Structured Data
- [ ] Organization schema
- [ ] Service/Product schema
- [ ] BreadcrumbList schema
- [ ] FAQPage schema (if applicable)
- [ ] Review schema (if applicable)
- [ ] Validate with Google Rich Results Test

### Performance
- [ ] Fast loading (< 3s)
- [ ] Mobile-friendly
- [ ] Core Web Vitals passing
- [ ] HTTPS enabled
- [ ] Sitemap.xml created
- [ ] Robots.txt configured

### Content
- [ ] High-quality, original content
- [ ] Keyword optimization (natural)
- [ ] Regular updates
- [ ] Multimedia (images, videos)
- [ ] Engaging, valuable to users

## Testing Tools

### Google Tools

1. **[Rich Results Test](https://search.google.com/test/rich-results)**
   - Test structured data
   - Preview rich snippets

2. **[Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)**
   - Check mobile usability

3. **[PageSpeed Insights](https://pagespeed.web.dev/)**
   - Performance + Core Web Vitals

4. **[Google Search Console](https://search.google.com/search-console)**
   - Monitor search performance
   - Submit sitemap
   - Check indexing

### Validation Tools

```bash
# Validate JSON-LD
https://validator.schema.org/

# Check structured data
https://search.google.com/test/rich-results

# SEO audit
https://web.dev/measure/
```

## Sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mmdigital.com/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mmdigital.com/#servicios</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mmdigital.com/#contacto</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

## Robots.txt

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: https://mmdigital.com/sitemap.xml
```

## Resources

- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [JSON-LD](https://json-ld.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
