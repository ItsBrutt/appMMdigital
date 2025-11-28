# Core Web Vitals Optimization Guide (2025)

## The Three Critical Metrics

Google's Core Web Vitals are the foundation of web performance in 2025:

1. **LCP (Largest Contentful Paint)**: Loading performance
2. **CLS (Cumulative Layout Shift)**: Visual stability
3. **INP (Interaction to Next Paint)**: Responsiveness

## 1. LCP - Largest Contentful Paint

**Goal: < 2.5 seconds**

### What is LCP?

The time it takes for the largest visible content element to render (hero image, main heading, etc.).

### Optimization Techniques

#### ❌ Before: No Optimization
```html
<header style="background: url('hero.jpg');">
    <h1>Welcome</h1>
</header>
```

**Problems:**
- Browser discovers background image late
- No priority hints
- Blocks rendering

#### ✅ After: Optimized
```html
<head>
    <!-- Preload critical resources -->
    <link rel="preload" as="image" href="hero.jpg" fetchpriority="high">
    
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>

<body>
    <!-- Use <img> instead of background-image for LCP element -->
    <header>
        <img src="hero.jpg" alt="Hero" width="1200" height="600" fetchpriority="high">
        <h1>Welcome</h1>
    </header>
</body>
```

### LCP Optimization Checklist

- [ ] Identify LCP element (use Chrome DevTools)
- [ ] Preload LCP image with `<link rel="preload">`
- [ ] Use `fetchpriority="high"` on LCP image
- [ ] Serve images in modern formats (WebP, AVIF)
- [ ] Use responsive images with `srcset`
- [ ] Minimize CSS blocking time
- [ ] Defer non-critical JavaScript
- [ ] Use CDN for static assets
- [ ] Enable compression (Gzip/Brotli)

### Code Example: Responsive Images
```html
<img 
    src="hero-800.webp"
    srcset="
        hero-400.webp 400w,
        hero-800.webp 800w,
        hero-1200.webp 1200w,
        hero-1600.webp 1600w
    "
    sizes="
        (max-width: 768px) 100vw,
        (max-width: 1024px) 80vw,
        1200px
    "
    alt="Hero Image"
    width="1200"
    height="600"
    fetchpriority="high"
    loading="eager"
>
```

## 2. CLS - Cumulative Layout Shift

**Goal: < 0.1**

### What is CLS?

Measures unexpected layout shifts during page load. Lower is better.

### Common Causes

1. Images without dimensions
2. Ads/embeds without reserved space
3. Web fonts causing FOIT/FOUT
4. Dynamically injected content

### Optimization Techniques

#### ❌ Before: No Dimensions
```html
<!-- Causes layout shift when image loads -->
<img src="photo.jpg" alt="Photo">

<div class="ad-container">
    <!-- Ad loads and pushes content down -->
</div>
```

#### ✅ After: Reserved Space
```html
<!-- Browser reserves space immediately -->
<img src="photo.jpg" alt="Photo" width="800" height="600">

<!-- Reserve space for ad -->
<div class="ad-container" style="min-height: 250px;">
    <!-- Ad loads into reserved space -->
</div>
```

### CSS Aspect Ratio
```css
/* Modern approach: aspect-ratio */
.image-container {
    aspect-ratio: 16 / 9;
    width: 100%;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Fallback for older browsers */
.image-container-fallback {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* 16:9 ratio */
}

.image-container-fallback img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

### Font Loading Strategy
```html
<head>
    <!-- Preload critical fonts -->
    <link rel="preload" 
          href="/fonts/outfit-regular.woff2" 
          as="font" 
          type="font/woff2" 
          crossorigin>
</head>
```

```css
/* Use font-display to control FOUT/FOIT */
@font-face {
    font-family: 'Outfit';
    src: url('/fonts/outfit-regular.woff2') format('woff2');
    font-display: swap; /* Show fallback immediately, swap when loaded */
}

/* Define fallback fonts with similar metrics */
body {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### CLS Optimization Checklist

- [ ] All images have `width` and `height` attributes
- [ ] Use `aspect-ratio` CSS for responsive images
- [ ] Reserve space for ads and embeds
- [ ] Use `font-display: swap` for web fonts
- [ ] Preload critical fonts
- [ ] Avoid inserting content above existing content
- [ ] Use CSS transforms for animations (not top/left)
- [ ] Set explicit sizes for iframes and videos

## 3. INP - Interaction to Next Paint

**Goal: < 200ms**

### What is INP?

Measures how quickly the page responds to user interactions (clicks, taps, keyboard input).

### Optimization Techniques

#### ❌ Before: Blocking Main Thread
```javascript
// Heavy computation blocks UI
button.addEventListener('click', () => {
    // This freezes the UI!
    for (let i = 0; i < 1000000; i++) {
        heavyCalculation();
    }
    updateUI();
});
```

#### ✅ After: Non-Blocking
```javascript
// Option 1: Break into chunks with setTimeout
button.addEventListener('click', async () => {
    showLoadingState();
    
    // Yield to browser
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const result = await processInChunks();
    updateUI(result);
    hideLoadingState();
});

function processInChunks() {
    return new Promise(resolve => {
        let processed = 0;
        const chunkSize = 1000;
        
        function processChunk() {
            for (let i = 0; i < chunkSize && processed < total; i++) {
                heavyCalculation();
                processed++;
            }
            
            if (processed < total) {
                setTimeout(processChunk, 0); // Yield to browser
            } else {
                resolve();
            }
        }
        
        processChunk();
    });
}

// Option 2: Use Web Workers for heavy tasks
const worker = new Worker('worker.js');

button.addEventListener('click', () => {
    showLoadingState();
    
    worker.postMessage({ task: 'process', data: largeDataset });
    
    worker.onmessage = (e) => {
        updateUI(e.data);
        hideLoadingState();
    };
});
```

### Debouncing & Throttling
```javascript
// Debounce: Wait for user to stop typing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce((e) => {
    performSearch(e.target.value);
}, 300));

// Throttle: Limit execution frequency
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

window.addEventListener('scroll', throttle(() => {
    updateScrollPosition();
}, 100));
```

### Event Delegation
```javascript
// ❌ BAD: Attaching listeners to many elements
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', handleClick); // 100s of listeners!
});

// ✅ GOOD: Single delegated listener
document.querySelector('.item-container').addEventListener('click', (e) => {
    if (e.target.matches('.item')) {
        handleClick(e);
    }
});
```

### INP Optimization Checklist

- [ ] Break long tasks into smaller chunks
- [ ] Use Web Workers for heavy computations
- [ ] Debounce/throttle frequent events
- [ ] Use event delegation
- [ ] Minimize JavaScript execution time
- [ ] Defer non-critical scripts
- [ ] Use `requestIdleCallback` for low-priority work
- [ ] Optimize third-party scripts
- [ ] Use passive event listeners for scroll/touch

## Measuring Core Web Vitals

### Chrome DevTools
```javascript
// Lighthouse (DevTools > Lighthouse)
// Run audit to get Core Web Vitals scores

// Performance tab
// Record page load to see LCP, CLS, INP
```

### Web Vitals Library
```html
<script type="module">
import {onCLS, onINP, onLCP} from 'https://unpkg.com/web-vitals@3?module';

onCLS(console.log);
onINP(console.log);
onLCP(console.log);
</script>
```

### Real User Monitoring (RUM)
```javascript
import {onCLS, onINP, onLCP} from 'web-vitals';

function sendToAnalytics({name, value, id}) {
    // Send to your analytics endpoint
    fetch('/analytics', {
        method: 'POST',
        body: JSON.stringify({metric: name, value, id}),
        headers: {'Content-Type': 'application/json'}
    });
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
```

## Project-Specific Optimizations

### Current Issues & Fixes

#### 1. Font Loading (LCP Impact)
```html
<!-- Current: Blocks rendering -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">

<!-- Optimized: Preconnect + font-display -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
```

#### 2. Images Need Dimensions (CLS Impact)
```html
<!-- Add to all images -->
<img src="image.jpg" alt="Description" width="800" height="600">
```

#### 3. Defer Non-Critical JS (INP Impact)
```html
<!-- Current -->
<script src="js/main.js"></script>

<!-- Optimized -->
<script src="js/main.js" defer></script>
```

## Performance Budget

Set limits to prevent regression:

```json
{
  "budgets": [
    {
      "resourceSizes": [
        {"resourceType": "script", "budget": 150},
        {"resourceType": "image", "budget": 300},
        {"resourceType": "stylesheet", "budget": 50},
        {"resourceType": "total", "budget": 500}
      ]
    }
  ],
  "metrics": [
    {"metric": "lcp", "budget": 2500},
    {"metric": "cls", "budget": 0.1},
    {"metric": "inp", "budget": 200}
  ]
}
```

## Quick Wins Checklist

- [ ] Add `width` and `height` to all images
- [ ] Preload LCP image
- [ ] Use `font-display: swap`
- [ ] Defer non-critical JavaScript
- [ ] Enable compression (Gzip/Brotli)
- [ ] Minify CSS and JavaScript
- [ ] Use modern image formats (WebP)
- [ ] Implement lazy loading for below-fold images
- [ ] Remove unused CSS and JavaScript
- [ ] Use CDN for static assets

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Optimize LCP](https://web.dev/optimize-lcp/)
- [Optimize CLS](https://web.dev/optimize-cls/)
- [Optimize INP](https://web.dev/optimize-inp/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
