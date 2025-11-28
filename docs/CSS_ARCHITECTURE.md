# CSS Architecture Guide - MM Digital

## Current Approach

This project uses a **hybrid CSS architecture** combining:
- **CSS Custom Properties** (CSS Variables) for design tokens
- **Utility classes** for common patterns (`.btn`, `.container`, `.glass-card`)
- **Component-specific classes** for unique elements

## Design Tokens (CSS Variables)

All design decisions are centralized in `:root` for consistency:

```css
:root {
    /* Colors */
    --primary-color: #0f172a;
    --accent-color: #38bdf8;
    
    /* Typography */
    --font-main: 'Outfit', sans-serif;
    
    /* Spacing */
    --section-padding: 4rem 2rem;
}
```

**Benefits:**
- Single source of truth for design system
- Easy theme switching
- Consistent visual language

## BEM Methodology for Future Development

For new components, follow **BEM (Block, Element, Modifier)** naming convention:

### Structure

```
.block {}              /* Component container */
.block__element {}     /* Component part */
.block--modifier {}    /* Component variation */
```

### Naming Rules

1. **Block**: Standalone component (`.card`, `.nav`, `.timeline`)
2. **Element**: Part of a block, separated by `__` (`.card__title`, `.nav__item`)
3. **Modifier**: Variation of block/element, separated by `--` (`.card--featured`, `.btn--large`)

### Examples

#### Navigation Component
```css
/* Block */
.nav {}

/* Elements */
.nav__logo {}
.nav__menu {}
.nav__item {}
.nav__link {}

/* Modifiers */
.nav--fixed {}
.nav__item--active {}
```

#### Pricing Card Component
```css
/* Block */
.price-card {}

/* Elements */
.price-card__icon {}
.price-card__title {}
.price-card__price {}
.price-card__features {}
.price-card__cta {}

/* Modifiers */
.price-card--featured {}
.price-card--disabled {}
```

### BEM Benefits

1. **No naming conflicts**: Unique, descriptive class names
2. **Self-documenting**: Structure visible in class name
3. **Reusability**: Components are independent
4. **Maintainability**: Easy to locate and modify styles

## File Organization

```
css/
├── style.css           # Main stylesheet
├── variables.css       # Design tokens (future)
├── base.css           # Reset & base styles (future)
├── components/        # BEM components (future)
│   ├── nav.css
│   ├── card.css
│   └── timeline.css
└── utilities.css      # Utility classes (future)
```

## Current vs. BEM Comparison

### Current Approach
```html
<div class="glass-card price-card featured">
    <h3>Plan Name</h3>
    <div class="price">$280.000</div>
</div>
```

### BEM Approach (Recommended for new code)
```html
<article class="price-card price-card--featured">
    <h3 class="price-card__title">Plan Name</h3>
    <div class="price-card__price">$280.000</div>
    <ul class="price-card__features">
        <li class="price-card__feature">Feature 1</li>
    </ul>
    <a href="#" class="price-card__cta btn btn--primary">Buy Now</a>
</article>
```

## Migration Strategy

**Do NOT refactor existing code** unless necessary. Instead:

1. **New components**: Use BEM from the start
2. **Major updates**: Gradually migrate to BEM
3. **Utilities**: Keep existing (`.btn`, `.container`, `.glass-card`)
4. **Design tokens**: Continue using CSS variables

## Utility Classes (Keep These)

These are framework-agnostic and should remain:

```css
.container {}          /* Layout container */
.btn {}               /* Base button */
.btn--primary {}      /* Primary button variant */
.btn--secondary {}    /* Secondary button variant */
.glass-card {}        /* Glassmorphism effect */
```

## Alternative: Tailwind CSS

For future projects or major rewrites, consider **Tailwind CSS**:

### Pros
- Rapid development
- Consistent design system
- Automatic optimization (PurgeCSS)
- No naming decisions needed

### Cons
- Verbose HTML
- Learning curve
- Build step required

### Example
```html
<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
    <h3 class="text-xl font-semibold mb-2">Plan Name</h3>
    <div class="text-3xl font-bold text-blue-400">$280.000</div>
</div>
```

## Recommendations

1. **Current project**: Continue with current approach + BEM for new components
2. **Next project**: Consider Tailwind CSS for faster iteration
3. **Team projects**: BEM for better collaboration and code review
4. **Solo projects**: Tailwind for speed

## Code Quality Checklist

- [ ] Use CSS variables for all colors, spacing, and typography
- [ ] Follow BEM naming for new components
- [ ] Keep utility classes generic and reusable
- [ ] Avoid inline styles (use classes instead)
- [ ] Use semantic HTML with proper landmarks
- [ ] Ensure mobile-first responsive design
- [ ] Optimize for performance (minimize CSS size)

## Resources

- [BEM Official](https://getbem.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [CSS Architecture Best Practices](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Organizing)
