# Critical CSS Strategy Guide

## The Problem: Render-Blocking CSS

By default, browsers **block rendering** until all CSS is downloaded and parsed. This delays the First Contentful Paint (FCP) and Largest Contentful Paint (LCP).

```html
<!-- ❌ Blocks rendering until entire stylesheet loads -->
<link rel="stylesheet" href="style.css">
```

**Impact:**
- User sees blank white screen while CSS loads
- Poor perceived performance
- Hurts Core Web Vitals (LCP)

## The Solution: Critical CSS

**Critical CSS** = The minimum CSS needed to render above-the-fold content.

### Strategy

1. **Inline critical CSS** in `<head>` (no network request)
2. **Defer non-critical CSS** (load asynchronously)
3. **Result**: Instant first paint

## Implementation

### Basic Pattern

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MM Digital</title>
    
    <!-- 1. CRITICAL CSS: Inline in <style> -->
    <style>
        /* Only styles for above-the-fold content */
        :root {
            --primary-color: #0f172a;
            --accent-color: #38bdf8;
            --text-color: #f8fafc;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: var(--primary-color);
            color: var(--text-color);
            line-height: 1.6;
        }
        
        /* Navigation (visible immediately) */
        .nav-header {
            position: fixed;
            top: 1rem;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 1200px;
            padding: 1rem 2rem;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
        }
        
        /* Hero section (visible immediately) */
        #inicio {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: radial-gradient(circle at top right, #1e293b, #0f172a);
            padding-top: 80px;
        }
        
        h1 {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            background: linear-gradient(to right, #fff, var(--accent-color));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    </style>
    
    <!-- 2. PRELOAD FONT (critical resource) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- 3. DEFER NON-CRITICAL CSS -->
    <link rel="preload" href="css/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="css/style.css"></noscript>
    
    <!-- Fallback for browsers without JS -->
    <script>
        // Polyfill for CSS loading
        if (!window.loadCSS) {
            window.loadCSS = function(href) {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            };
        }
    </script>
</head>
<body>
    <!-- Content renders immediately with critical CSS -->
    <nav class="nav-header">
        <!-- ... -->
    </nav>
    
    <header id="inicio">
        <h1>Construye tu Imperio Digital</h1>
    </header>
    
    <!-- Rest of page loads with deferred CSS -->
</body>
</html>
```

## Extracting Critical CSS

### Method 1: Manual Extraction

1. Open DevTools
2. Disable JavaScript
3. Resize viewport to mobile (375px)
4. Copy all styles applied to visible elements
5. Paste into inline `<style>` tag

### Method 2: Automated Tools

#### Critical (npm package)

```bash
npm install --save-dev critical
```

```javascript
// scripts/generate-critical-css.js
import { generate } from 'critical';

async function generateCriticalCSS() {
    await generate({
        // Source HTML
        src: 'index.html',
        
        // Output
        target: {
            html: 'index-critical.html',
            css: 'critical.css'
        },
        
        // Viewport dimensions
        width: 1300,
        height: 900,
        
        // Inline critical CSS
        inline: true,
        
        // Extract CSS from
        css: ['css/style.css'],
        
        // Ignore rules
        ignore: {
            atrule: ['@font-face'],
            rule: [/\.non-critical/]
        }
    });
    
    console.log('Critical CSS generated!');
}

generateCriticalCSS();
```

```json
// package.json
{
  "scripts": {
    "critical:generate": "node scripts/generate-critical-css.js",
    "prebuild": "npm run critical:generate"
  }
}
```

#### Penthouse

```bash
npm install --save-dev penthouse
```

```javascript
import penthouse from 'penthouse';
import fs from 'fs';

async function extractCriticalCSS() {
    const criticalCSS = await penthouse({
        url: 'http://localhost:3000',
        cssString: fs.readFileSync('css/style.css', 'utf8'),
        width: 1300,
        height: 900,
        timeout: 30000
    });
    
    fs.writeFileSync('critical.css', criticalCSS);
    console.log('Critical CSS extracted!');
}

extractCriticalCSS();
```

#### Online Tools

- [Critical Path CSS Generator](https://www.sitelocity.com/critical-path-css-generator)
- [criticalcss.com](https://criticalcss.com/)

## Deferred CSS Loading

### Method 1: Preload + onload

```html
<!-- Recommended approach -->
<link rel="preload" href="style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="style.css"></noscript>
```

### Method 2: JavaScript

```html
<script>
function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// Load after page load
window.addEventListener('load', () => {
    loadCSS('css/style.css');
});
</script>
```

### Method 3: Media Query Trick

```html
<!-- Loads asynchronously, then applies -->
<link rel="stylesheet" href="style.css" media="print" onload="this.media='all'">
```

## Splitting CSS

### Structure

```
css/
├── critical.css      # Inline in <head>
├── above-fold.css    # Load with high priority
├── below-fold.css    # Defer loading
└── print.css         # Load only for print
```

### Example Split

#### critical.css (Inline)
```css
/* Variables */
:root {
    --primary-color: #0f172a;
    --accent-color: #38bdf8;
}

/* Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Body */
body {
    font-family: -apple-system, sans-serif;
    background: var(--primary-color);
    color: #f8fafc;
}

/* Navigation (always visible) */
.nav-header { /* ... */ }

/* Hero (above fold) */
#inicio { /* ... */ }
```

#### below-fold.css (Deferred)
```css
/* Timeline (below fold) */
.journey-timeline { /* ... */ }

/* Pricing (below fold) */
.pricing-grid { /* ... */ }

/* Footer (below fold) */
footer { /* ... */ }

/* Animations (progressive enhancement) */
@keyframes fadeInUp { /* ... */ }
```

## Best Practices

### 1. Keep Critical CSS Small

**Target: < 14KB** (fits in first TCP packet)

```html
<!-- ✅ GOOD: ~10KB critical CSS -->
<style>
    /* Only essential above-fold styles */
</style>

<!-- ❌ BAD: 50KB critical CSS -->
<style>
    /* Entire stylesheet inlined */
</style>
```

### 2. Don't Duplicate Styles

```html
<!-- ❌ BAD: Styles duplicated -->
<style>
    .btn { padding: 1rem; } /* Critical */
</style>
<link rel="stylesheet" href="style.css"> <!-- Contains .btn again -->

<!-- ✅ GOOD: Remove from main stylesheet -->
<style>
    .btn { padding: 1rem; } /* Critical only */
</style>
<link rel="preload" href="non-critical.css" as="style" onload="...">
```

### 3. Use CSS Variables

```css
/* Critical CSS: Define variables */
:root {
    --primary: #0f172a;
    --accent: #38bdf8;
    --spacing: 1rem;
}

.hero {
    background: var(--primary);
    padding: var(--spacing);
}

/* Non-critical CSS: Use same variables */
.footer {
    background: var(--primary);
    padding: calc(var(--spacing) * 2);
}
```

### 4. Progressive Enhancement

```html
<!-- Critical: Basic layout -->
<style>
    .card {
        padding: 1rem;
        background: white;
        border: 1px solid #ccc;
    }
</style>

<!-- Non-critical: Enhanced styles -->
<link rel="preload" href="enhanced.css" as="style" onload="...">
<!-- enhanced.css -->
.card {
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    animation: fadeIn 0.3s;
}
```

## Testing Critical CSS

### Chrome DevTools

1. Open DevTools > Network
2. Throttle to "Slow 3G"
3. Disable cache
4. Reload page
5. Check if content renders before CSS loads

### Lighthouse

```bash
# Run Lighthouse audit
npx lighthouse https://yoursite.com --view
```

Check:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- "Eliminate render-blocking resources" audit

### WebPageTest

1. Go to [webpagetest.org](https://www.webpagetest.org/)
2. Enter URL
3. Run test
4. Check "Start Render" time
5. View filmstrip to see progressive rendering

## Automated Workflow

### Build Script

```javascript
// scripts/build.js
import { generate } from 'critical';
import fs from 'fs';
import path from 'path';

async function build() {
    console.log('Generating critical CSS...');
    
    // Extract critical CSS
    await generate({
        src: 'index.html',
        target: {
            html: 'dist/index.html',
            css: 'dist/critical.css'
        },
        inline: true,
        width: 1300,
        height: 900,
        css: ['css/style.css']
    });
    
    // Copy non-critical CSS
    fs.copyFileSync('css/style.css', 'dist/css/style.css');
    
    console.log('Build complete!');
}

build();
```

```json
// package.json
{
  "scripts": {
    "build": "node scripts/build.js",
    "build:critical": "critical index.html --base . --inline --css css/style.css > dist/index.html"
  }
}
```

## MM Digital Project Implementation

### Current State
```html
<!-- Blocking CSS -->
<link rel="stylesheet" href="css/style.css">
```

### Optimized Version

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MM Digital - Tu Viaje de Identidad Digital</title>
    
    <!-- Critical CSS (inline) -->
    <style>
        :root {
            --primary-color: #0f172a;
            --secondary-color: #1e293b;
            --accent-color: #38bdf8;
            --text-color: #f8fafc;
            --text-muted: #94a3b8;
            --glass-bg: rgba(30, 41, 59, 0.7);
            --glass-border: rgba(255, 255, 255, 0.1);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: var(--primary-color);
            color: var(--text-color);
            line-height: 1.6;
            overflow-x: hidden;
        }
        
        /* Navigation */
        .nav-header {
            position: fixed;
            top: 1rem;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 1200px;
            padding: 1rem 2rem;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--glass-bg);
            backdrop-filter: blur(8px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
        }
        
        /* Hero */
        #inicio {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: radial-gradient(circle at top right, #1e293b, #0f172a);
            padding-top: 80px;
        }
        
        h1 {
            font-size: 2.5rem;
            line-height: 1.2;
            margin-bottom: 1.5rem;
        }
        
        @media (min-width: 769px) {
            h1 { font-size: 4rem; }
        }
    </style>
    
    <!-- Preconnect to fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Defer non-critical CSS -->
    <link rel="preload" href="css/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="css/style.css"></noscript>
    
    <!-- Defer fonts -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
</head>
<body>
    <!-- Content renders immediately -->
</body>
</html>
```

## Performance Impact

### Before (Blocking CSS)
```
0ms:    HTML starts loading
500ms:  CSS starts loading
1500ms: CSS finishes loading
1500ms: First paint ⚠️
2000ms: LCP
```

### After (Critical CSS)
```
0ms:    HTML starts loading
100ms:  Critical CSS parsed (inline)
100ms:  First paint ✅
500ms:  Non-critical CSS starts loading
1000ms: LCP
1500ms: Non-critical CSS finishes
```

**Improvement: 1400ms faster first paint!**

## Checklist

- [ ] Extract critical CSS for above-fold content
- [ ] Inline critical CSS in `<head>`
- [ ] Keep critical CSS < 14KB
- [ ] Defer non-critical CSS
- [ ] Remove duplicates between critical and non-critical
- [ ] Use CSS variables for consistency
- [ ] Test with throttled connection
- [ ] Verify with Lighthouse
- [ ] Automate with build script
- [ ] Monitor Core Web Vitals

## Resources

- [Critical CSS](https://web.dev/extract-critical-css/)
- [Critical npm package](https://github.com/addyosmani/critical)
- [Penthouse](https://github.com/pocketjoso/penthouse)
- [LoadCSS](https://github.com/filamentgroup/loadCSS)
