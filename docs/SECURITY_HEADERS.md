# Security Headers Guide - OWASP Best Practices (2025)

## Why Security Headers Matter

HTTP security headers protect against common web vulnerabilities:
- **XSS (Cross-Site Scripting)** - Injecting malicious scripts
- **Clickjacking** - Embedding site in iframe to trick users
- **MITM (Man-in-the-Middle)** - Intercepting HTTP traffic
- **MIME Sniffing** - Executing files as wrong type
- **Data Leakage** - Exposing sensitive information

## Critical Security Headers

### 1. Content-Security-Policy (CSP)

**Purpose:** Prevents XSS attacks by whitelisting allowed content sources.

#### Basic CSP
```http
Content-Security-Policy: default-src 'self'
```

**Effect:** Only load resources from same origin.

#### Recommended CSP for MM Digital
```http
Content-Security-Policy: 
    default-src 'self';
    script-src 'self' https://fonts.googleapis.com;
    style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self';
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
```

#### CSP Directives Explained

| Directive | Purpose | Example |
|-----------|---------|---------|
| `default-src` | Fallback for all resources | `'self'` |
| `script-src` | JavaScript sources | `'self' https://cdn.example.com` |
| `style-src` | CSS sources | `'self' 'unsafe-inline'` |
| `img-src` | Image sources | `'self' data: https:` |
| `font-src` | Font sources | `'self' https://fonts.gstatic.com` |
| `connect-src` | AJAX/WebSocket sources | `'self' https://api.example.com` |
| `frame-src` | iframe sources | `'none'` |
| `frame-ancestors` | Who can embed this page | `'none'` |
| `base-uri` | `<base>` tag URLs | `'self'` |
| `form-action` | Form submission URLs | `'self'` |

#### Special Keywords

- `'self'` - Same origin
- `'none'` - Block all
- `'unsafe-inline'` - Allow inline scripts/styles (avoid if possible)
- `'unsafe-eval'` - Allow eval() (avoid!)
- `'strict-dynamic'` - Trust scripts with nonce/hash
- `data:` - Allow data: URIs
- `https:` - Allow any HTTPS source

#### CSP with Nonces (Recommended)

```html
<!-- Server generates random nonce -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'nonce-r4nd0m123'">

<!-- Only scripts with matching nonce execute -->
<script nonce="r4nd0m123">
    console.log('Allowed!');
</script>

<script>
    console.log('Blocked!'); // No nonce
</script>
```

### 2. Strict-Transport-Security (HSTS)

**Purpose:** Forces HTTPS, prevents protocol downgrade attacks.

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Directives:**
- `max-age=31536000` - Remember for 1 year
- `includeSubDomains` - Apply to all subdomains
- `preload` - Include in browser's HSTS preload list

**Important:** Only set after ensuring HTTPS works!

### 3. X-Content-Type-Options

**Purpose:** Prevents MIME sniffing attacks.

```http
X-Content-Type-Options: nosniff
```

**Effect:** Browser respects `Content-Type` header exactly.

### 4. X-Frame-Options

**Purpose:** Prevents clickjacking by controlling iframe embedding.

```http
X-Frame-Options: DENY
```

**Options:**
- `DENY` - Cannot be embedded in any iframe
- `SAMEORIGIN` - Can be embedded only by same origin
- `ALLOW-FROM https://example.com` - Deprecated, use CSP instead

### 5. Referrer-Policy

**Purpose:** Controls how much referrer information is sent.

```http
Referrer-Policy: strict-origin-when-cross-origin
```

**Options:**
- `no-referrer` - Never send referrer
- `no-referrer-when-downgrade` - Send on HTTPS→HTTPS, not HTTPS→HTTP
- `same-origin` - Send only to same origin
- `strict-origin` - Send origin only, not full URL
- `strict-origin-when-cross-origin` - Full URL to same origin, origin only to others (recommended)

### 6. Permissions-Policy

**Purpose:** Controls browser features (camera, microphone, geolocation).

```http
Permissions-Policy: 
    camera=(),
    microphone=(),
    geolocation=(),
    payment=()
```

**Effect:** Disables specified features.

### 7. X-XSS-Protection

**Purpose:** Legacy XSS filter (deprecated, use CSP instead).

```http
X-XSS-Protection: 0
```

**Note:** Set to `0` to disable, as it can introduce vulnerabilities. Use CSP instead.

## Complete Security Headers Configuration

### Recommended Headers for MM Digital

```http
# CSP - Prevent XSS
Content-Security-Policy: default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests

# HSTS - Force HTTPS
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# Prevent MIME sniffing
X-Content-Type-Options: nosniff

# Prevent clickjacking
X-Frame-Options: DENY

# Control referrer
Referrer-Policy: strict-origin-when-cross-origin

# Disable browser features
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()

# Disable XSS filter (use CSP instead)
X-XSS-Protection: 0
```

## Server Configuration

### Apache (.htaccess)

```apache
# .htaccess
<IfModule mod_headers.c>
    # CSP
    Header set Content-Security-Policy "default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
    
    # HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Prevent MIME sniffing
    Header set X-Content-Type-Options "nosniff"
    
    # Prevent clickjacking
    Header set X-Frame-Options "DENY"
    
    # Referrer policy
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Permissions policy
    Header set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
    
    # Disable XSS filter
    Header set X-XSS-Protection "0"
</IfModule>

# Force HTTPS redirect
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

### Nginx

```nginx
# nginx.conf or site config
server {
    listen 443 ssl http2;
    server_name mmdigital.com;
    
    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
    add_header X-XSS-Protection "0" always;
    
    # Force HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }
    
    location / {
        root /var/www/html;
        index index.html;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name mmdigital.com;
    return 301 https://$server_name$request_uri;
}
```

### Node.js (Express)

```javascript
// server.js
import express from 'express';
import helmet from 'helmet';

const app = express();

// Use Helmet for security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://fonts.googleapis.com"],
            styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: []
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    frameguard: {
        action: 'deny'
    },
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    }
}));

// Additional headers
app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    res.setHeader('X-XSS-Protection', '0');
    next();
});

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

app.listen(3000);
```

### Static Hosting (Netlify)

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=()"
    X-XSS-Protection = "0"

# Force HTTPS
[[redirects]]
  from = "http://mmdigital.com/*"
  to = "https://mmdigital.com/:splat"
  status = 301
  force = true
```

### Vercel

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), payment=()"
        },
        {
          "key": "X-XSS-Protection",
          "value": "0"
        }
      ]
    }
  ]
}
```

## Testing Security Headers

### Online Tools

1. **[Security Headers](https://securityheaders.com/)**
   - Enter URL
   - Get grade (A+ is best)
   - See missing headers

2. **[Mozilla Observatory](https://observatory.mozilla.org/)**
   - Comprehensive security scan
   - Detailed recommendations

3. **[CSP Evaluator](https://csp-evaluator.withgoogle.com/)**
   - Test CSP policy
   - Find weaknesses

### Browser DevTools

```javascript
// Check headers in console
fetch('https://yoursite.com')
    .then(response => {
        console.log('CSP:', response.headers.get('content-security-policy'));
        console.log('HSTS:', response.headers.get('strict-transport-security'));
        console.log('X-Frame-Options:', response.headers.get('x-frame-options'));
    });
```

### Command Line

```bash
# Check headers with curl
curl -I https://mmdigital.com

# Check specific header
curl -I https://mmdigital.com | grep -i "content-security-policy"
```

## Common Issues & Solutions

### Issue 1: CSP Blocks Inline Styles

```html
<!-- ❌ Blocked by CSP -->
<div style="color: red;">Text</div>

<!-- ✅ Solution 1: Use classes -->
<div class="text-red">Text</div>

<!-- ✅ Solution 2: Use nonce -->
<style nonce="r4nd0m123">
    .text-red { color: red; }
</style>
```

### Issue 2: CSP Blocks Google Fonts

```http
# ❌ Wrong: Blocks fonts
Content-Security-Policy: default-src 'self'

# ✅ Correct: Allow fonts
Content-Security-Policy: 
    default-src 'self';
    style-src 'self' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com
```

### Issue 3: Mixed Content Warnings

```http
# Add to CSP to upgrade HTTP to HTTPS
Content-Security-Policy: upgrade-insecure-requests
```

## Security Checklist

- [ ] CSP configured with strict policy
- [ ] HSTS enabled with long max-age
- [ ] X-Content-Type-Options set to nosniff
- [ ] X-Frame-Options set to DENY
- [ ] Referrer-Policy configured
- [ ] Permissions-Policy disables unused features
- [ ] HTTPS enforced (redirect HTTP)
- [ ] SSL certificate valid and up-to-date
- [ ] Test with securityheaders.com (aim for A+)
- [ ] Monitor CSP violations
- [ ] Regular security audits

## CSP Violation Reporting

```http
Content-Security-Policy: 
    default-src 'self';
    report-uri /csp-violation-report;
    report-to csp-endpoint
```

```javascript
// Server endpoint to receive reports
app.post('/csp-violation-report', (req, res) => {
    console.log('CSP Violation:', req.body);
    // Log to monitoring service
    res.status(204).end();
});
```

## Resources

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN: CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN: HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Helmet.js](https://helmetjs.github.io/)
