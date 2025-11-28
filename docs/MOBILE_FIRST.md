# Mobile-First Responsive Design Guide

## Philosophy

**Mobile-First** means writing CSS for mobile devices first (base styles), then progressively enhancing for larger screens using `min-width` media queries.

### Why Mobile-First?

1. **Performance**: Mobile devices parse only base styles + relevant media queries
2. **Progressive Enhancement**: Start simple, add complexity for capable devices
3. **Modern Reality**: 60%+ of web traffic is mobile
4. **Simpler CSS**: Easier to add features than remove them

## Standard Breakpoints (2025)

Based on content, not specific devices:

```css
/* Base styles: Mobile (< 481px) */
/* No media query needed - this is the default */

/* Small tablets / Large phones (≥ 481px) */
@media (min-width: 481px) {
    /* Styles for 481px and up */
}

/* Tablets / Small laptops (≥ 769px) */
@media (min-width: 769px) {
    /* Styles for 769px and up */
}

/* Desktop (≥ 1025px) */
@media (min-width: 1025px) {
    /* Styles for 1025px and up */
}

/* Large desktop (≥ 1440px) */
@media (min-width: 1440px) {
    /* Styles for 1440px and up */
}
```

## CSS Variables for Breakpoints

```css
:root {
    --breakpoint-sm: 481px;
    --breakpoint-md: 769px;
    --breakpoint-lg: 1025px;
    --breakpoint-xl: 1440px;
}
```

## Mobile-First Example

### ❌ Desktop-First (Avoid)

```css
/* Desktop styles first */
.container {
    width: 1200px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

/* Then override for mobile */
@media (max-width: 768px) {
    .container {
        width: 100%;
        grid-template-columns: 1fr;
    }
}
```

**Problems:**
- Mobile devices parse desktop styles first, then override
- More CSS to parse on slower devices
- Uses `max-width` (desktop-first approach)

### ✅ Mobile-First (Correct)

```css
/* Mobile styles first (base) */
.container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    padding: 1rem;
}

/* Enhance for tablets */
@media (min-width: 769px) {
    .container {
        grid-template-columns: repeat(2, 1fr);
        padding: 2rem;
    }
}

/* Enhance for desktop */
@media (min-width: 1025px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
        grid-template-columns: repeat(4, 1fr);
    }
}
```

**Benefits:**
- Mobile devices only parse base styles
- Progressive enhancement
- Cleaner, more logical code flow

## Common Patterns

### Typography

```css
/* Mobile base */
h1 {
    font-size: 2rem;
    line-height: 1.2;
}

/* Tablet */
@media (min-width: 769px) {
    h1 {
        font-size: 3rem;
    }
}

/* Desktop */
@media (min-width: 1025px) {
    h1 {
        font-size: 4rem;
    }
}
```

### Navigation

```css
/* Mobile: Hamburger menu */
.nav-menu {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    flex-direction: column;
}

.nav-menu.active {
    display: flex;
}

.mobile-menu-btn {
    display: block;
}

/* Desktop: Horizontal menu */
@media (min-width: 769px) {
    .nav-menu {
        display: flex;
        position: static;
        width: auto;
        height: auto;
        flex-direction: row;
        gap: 2rem;
    }
    
    .mobile-menu-btn {
        display: none;
    }
}
```

### Grid Layouts

```css
/* Mobile: Single column */
.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

/* Tablet: 2 columns */
@media (min-width: 769px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }
}

/* Desktop: 3-4 columns */
@media (min-width: 1025px) {
    .grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

### Spacing

```css
/* Mobile: Tighter spacing */
section {
    padding: 2rem 1rem;
}

/* Tablet: More breathing room */
@media (min-width: 769px) {
    section {
        padding: 4rem 2rem;
    }
}

/* Desktop: Maximum spacing */
@media (min-width: 1025px) {
    section {
        padding: 6rem 3rem;
    }
}
```

## Testing Checklist

- [ ] Test on actual mobile device (not just browser DevTools)
- [ ] Verify touch targets are at least 44x44px
- [ ] Check text is readable without zooming (min 16px)
- [ ] Ensure horizontal scrolling is never needed
- [ ] Test with slow 3G connection
- [ ] Verify images are responsive
- [ ] Check navigation works on touch devices

## Performance Tips

1. **Load mobile CSS first**: Base styles before media queries
2. **Use CSS containment**: `contain: layout style paint;`
3. **Minimize repaints**: Avoid layout thrashing
4. **Use `will-change` sparingly**: Only for animations
5. **Optimize images**: Use `srcset` and `sizes` attributes

## Common Mistakes to Avoid

❌ **Using `max-width`** (desktop-first)
```css
@media (max-width: 768px) { /* Wrong! */ }
```

✅ **Use `min-width`** (mobile-first)
```css
@media (min-width: 769px) { /* Correct! */ }
```

❌ **Fixed widths on mobile**
```css
.container { width: 1200px; } /* Wrong! */
```

✅ **Fluid widths on mobile**
```css
.container { width: 100%; max-width: 1200px; } /* Correct! */
```

❌ **Tiny touch targets**
```css
button { padding: 2px 4px; } /* Wrong! */
```

✅ **Adequate touch targets**
```css
button { padding: 12px 24px; min-height: 44px; } /* Correct! */
```

## Resources

- [MDN: Mobile First](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals/design-and-ux/responsive)
- [CSS Tricks: Mobile First](https://css-tricks.com/logic-in-media-queries/)
