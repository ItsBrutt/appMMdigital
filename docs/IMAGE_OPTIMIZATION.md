# Image Optimization Guide - Next-Gen Formats (2025)

## The Problem

Images typically account for **50-70% of a webpage's total weight**. Using outdated formats (JPG, PNG) without optimization is a major performance bottleneck.

## Modern Image Formats

### Format Comparison

| Format | Compression | Quality | Browser Support | Use Case |
|--------|-------------|---------|-----------------|----------|
| **AVIF** | Excellent (50% smaller than JPG) | Excellent | 90%+ (2025) | Primary choice |
| **WebP** | Very Good (30% smaller than JPG) | Very Good | 95%+ | Fallback for AVIF |
| **JPG** | Good | Good | 100% | Final fallback |
| **PNG** | Poor (lossless) | Excellent | 100% | Transparency needed |

### File Size Comparison (Same Quality)

```
Original JPG:  500 KB
WebP:          350 KB (-30%)
AVIF:          250 KB (-50%)
```

## The `<picture>` Element

### Basic Syntax

```html
<picture>
    <!-- Modern format: AVIF -->
    <source srcset="image.avif" type="image/avif">
    
    <!-- Fallback: WebP -->
    <source srcset="image.webp" type="image/webp">
    
    <!-- Final fallback: JPG -->
    <img src="image.jpg" alt="Description" width="800" height="600">
</picture>
```

**How it works:**
1. Browser checks if it supports AVIF → uses it
2. If not, checks WebP → uses it
3. If not, uses JPG from `<img>`

### Responsive Images with Modern Formats

```html
<picture>
    <!-- AVIF with responsive sizes -->
    <source 
        type="image/avif"
        srcset="
            hero-400.avif 400w,
            hero-800.avif 800w,
            hero-1200.avif 1200w,
            hero-1600.avif 1600w
        "
        sizes="
            (max-width: 768px) 100vw,
            (max-width: 1024px) 80vw,
            1200px
        "
    >
    
    <!-- WebP with responsive sizes -->
    <source 
        type="image/webp"
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
    >
    
    <!-- JPG fallback with responsive sizes -->
    <img 
        src="hero-800.jpg"
        srcset="
            hero-400.jpg 400w,
            hero-800.jpg 800w,
            hero-1200.jpg 1200w,
            hero-1600.jpg 1600w
        "
        sizes="
            (max-width: 768px) 100vw,
            (max-width: 1024px) 80vw,
            1200px
        "
        alt="Hero Image"
        width="1200"
        height="600"
        loading="lazy"
    >
</picture>
```

## Art Direction

Different images for different screen sizes:

```html
<picture>
    <!-- Desktop: Wide landscape image -->
    <source 
        media="(min-width: 1024px)"
        srcset="hero-desktop.avif"
        type="image/avif"
    >
    <source 
        media="(min-width: 1024px)"
        srcset="hero-desktop.webp"
        type="image/webp"
    >
    
    <!-- Tablet: Medium crop -->
    <source 
        media="(min-width: 768px)"
        srcset="hero-tablet.avif"
        type="image/avif"
    >
    <source 
        media="(min-width: 768px)"
        srcset="hero-tablet.webp"
        type="image/webp"
    >
    
    <!-- Mobile: Portrait crop -->
    <source 
        srcset="hero-mobile.avif"
        type="image/avif"
    >
    <source 
        srcset="hero-mobile.webp"
        type="image/webp"
    >
    
    <!-- Fallback -->
    <img 
        src="hero-mobile.jpg" 
        alt="Hero" 
        width="400" 
        height="600"
    >
</picture>
```

## Lazy Loading

### Native Lazy Loading

```html
<!-- Load immediately (above the fold) -->
<img src="hero.jpg" alt="Hero" loading="eager">

<!-- Lazy load (below the fold) -->
<img src="image.jpg" alt="Description" loading="lazy" width="800" height="600">

<!-- Works with picture too -->
<picture>
    <source srcset="image.avif" type="image/avif">
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Description" loading="lazy" width="800" height="600">
</picture>
```

### When to Use

```html
<!-- Above the fold: eager loading -->
<picture>
    <source srcset="hero.avif" type="image/avif">
    <img src="hero.jpg" alt="Hero" loading="eager" fetchpriority="high">
</picture>

<!-- Below the fold: lazy loading -->
<picture>
    <source srcset="gallery-1.avif" type="image/avif">
    <img src="gallery-1.jpg" alt="Gallery" loading="lazy">
</picture>
```

## Image Conversion Tools

### Command Line (ImageMagick + cwebp + avifenc)

```bash
# Convert to WebP
cwebp -q 85 input.jpg -o output.webp

# Convert to AVIF
avifenc --min 20 --max 63 input.jpg output.avif

# Batch convert all JPGs to WebP
for file in *.jpg; do
    cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done

# Batch convert all JPGs to AVIF
for file in *.jpg; do
    avifenc --min 20 --max 63 "$file" "${file%.jpg}.avif"
done
```

### Online Tools

- [Squoosh](https://squoosh.app/) - Google's image optimizer
- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [Cloudinary](https://cloudinary.com/) - Automated image optimization

### Build Tools (npm)

```json
{
  "scripts": {
    "optimize:images": "npm run convert:webp && npm run convert:avif",
    "convert:webp": "cwebp -q 85 src/images/*.jpg -o dist/images/",
    "convert:avif": "avifenc --min 20 --max 63 src/images/*.jpg dist/images/"
  },
  "devDependencies": {
    "imagemin": "^8.0.1",
    "imagemin-webp": "^7.0.0",
    "imagemin-avif": "^0.1.5"
  }
}
```

## Responsive Images Explained

### srcset Attribute

```html
<!-- Browser chooses based on device pixel ratio and viewport width -->
<img 
    src="image-800.jpg"
    srcset="
        image-400.jpg 400w,
        image-800.jpg 800w,
        image-1200.jpg 1200w,
        image-1600.jpg 1600w
    "
    sizes="
        (max-width: 768px) 100vw,
        (max-width: 1024px) 80vw,
        1200px
    "
    alt="Responsive Image"
>
```

**How it works:**
- `400w` = image is 400px wide
- `sizes` tells browser how wide image will be displayed
- Browser calculates: `display width × device pixel ratio`
- Browser picks smallest image that fits

### sizes Attribute

```html
sizes="
    (max-width: 768px) 100vw,    /* Mobile: full width */
    (max-width: 1024px) 80vw,    /* Tablet: 80% width */
    1200px                        /* Desktop: fixed 1200px */
"
```

## Background Images in CSS

### Problem: Can't use `<picture>` for backgrounds

### Solution: CSS image-set()

```css
.hero {
    /* Fallback */
    background-image: url('hero.jpg');
    
    /* Modern browsers with image-set */
    background-image: image-set(
        url('hero.avif') type('image/avif'),
        url('hero.webp') type('image/webp'),
        url('hero.jpg') type('image/jpeg')
    );
    
    /* Responsive background */
    background-image: image-set(
        url('hero-mobile.avif') 1x,
        url('hero-mobile-2x.avif') 2x
    );
}

/* Media queries for art direction */
@media (min-width: 768px) {
    .hero {
        background-image: image-set(
            url('hero-tablet.avif') type('image/avif'),
            url('hero-tablet.webp') type('image/webp'),
            url('hero-tablet.jpg') type('image/jpeg')
        );
    }
}

@media (min-width: 1024px) {
    .hero {
        background-image: image-set(
            url('hero-desktop.avif') type('image/avif'),
            url('hero-desktop.webp') type('image/webp'),
            url('hero-desktop.jpg') type('image/jpeg')
        );
    }
}
```

## Performance Best Practices

### 1. Critical Images (LCP)
```html
<!-- Hero image: eager + high priority -->
<picture>
    <source srcset="hero.avif" type="image/avif">
    <source srcset="hero.webp" type="image/webp">
    <img 
        src="hero.jpg" 
        alt="Hero" 
        loading="eager" 
        fetchpriority="high"
        width="1200"
        height="600"
    >
</picture>
```

### 2. Below-the-Fold Images
```html
<!-- Gallery images: lazy loading -->
<picture>
    <source srcset="gallery.avif" type="image/avif">
    <source srcset="gallery.webp" type="image/webp">
    <img 
        src="gallery.jpg" 
        alt="Gallery" 
        loading="lazy"
        width="800"
        height="600"
    >
</picture>
```

### 3. Decorative Images
```html
<!-- Use aria-hidden for decorative images -->
<img src="decoration.svg" alt="" aria-hidden="true" loading="lazy">
```

## Image Optimization Checklist

- [ ] Convert all images to AVIF + WebP + JPG
- [ ] Use `<picture>` element for format negotiation
- [ ] Add `width` and `height` to prevent CLS
- [ ] Use `srcset` for responsive images
- [ ] Use `loading="lazy"` for below-fold images
- [ ] Use `loading="eager"` + `fetchpriority="high"` for LCP image
- [ ] Compress images (quality 80-85 for photos)
- [ ] Use SVG for logos and icons
- [ ] Implement art direction for different viewports
- [ ] Add descriptive `alt` text for accessibility

## Real-World Example: MM Digital Project

### Current State
```html
<!-- Inline styles with no optimization -->
<div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
```

### Optimized Version
```html
<!-- Replace emoji with optimized image -->
<picture>
    <source srcset="icons/target.avif" type="image/avif">
    <source srcset="icons/target.webp" type="image/webp">
    <img 
        src="icons/target.png" 
        alt="Target icon" 
        width="48" 
        height="48"
        loading="lazy"
    >
</picture>
```

### Hero Section Optimization
```html
<!-- If hero has background image -->
<header id="inicio" class="hero">
    <picture class="hero__background">
        <source 
            media="(min-width: 1024px)"
            srcset="hero-desktop.avif"
            type="image/avif"
        >
        <source 
            media="(min-width: 1024px)"
            srcset="hero-desktop.webp"
            type="image/webp"
        >
        <source 
            media="(min-width: 768px)"
            srcset="hero-tablet.avif"
            type="image/avif"
        >
        <source 
            media="(min-width: 768px)"
            srcset="hero-tablet.webp"
            type="image/webp"
        >
        <source srcset="hero-mobile.avif" type="image/avif">
        <source srcset="hero-mobile.webp" type="image/webp">
        <img 
            src="hero-mobile.jpg" 
            alt="" 
            loading="eager"
            fetchpriority="high"
            width="1200"
            height="800"
        >
    </picture>
    
    <div class="container">
        <h1>Construye tu Imperio Digital</h1>
        <!-- ... -->
    </div>
</header>
```

## Automated Workflow

### package.json Script
```json
{
  "scripts": {
    "images:optimize": "node scripts/optimize-images.js",
    "images:convert": "npm run images:webp && npm run images:avif",
    "images:webp": "cwebp -q 85 src/images/**/*.{jpg,png} -o dist/images/",
    "images:avif": "avifenc src/images/**/*.{jpg,png} dist/images/",
    "prebuild": "npm run images:optimize"
  }
}
```

### optimize-images.js
```javascript
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminAvif from 'imagemin-avif';
import imageminMozjpeg from 'imagemin-mozjpeg';

async function optimizeImages() {
    // Convert to WebP
    await imagemin(['src/images/*.{jpg,png}'], {
        destination: 'dist/images',
        plugins: [
            imageminWebp({ quality: 85 })
        ]
    });
    
    // Convert to AVIF
    await imagemin(['src/images/*.{jpg,png}'], {
        destination: 'dist/images',
        plugins: [
            imageminAvif({ quality: 65 })
        ]
    });
    
    // Optimize JPG
    await imagemin(['src/images/*.jpg'], {
        destination: 'dist/images',
        plugins: [
            imageminMozjpeg({ quality: 85 })
        ]
    });
    
    console.log('Images optimized!');
}

optimizeImages();
```

## Resources

- [WebP](https://developers.google.com/speed/webp)
- [AVIF](https://web.dev/compress-images-avif/)
- [Picture Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
- [Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)
