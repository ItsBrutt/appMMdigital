# CSS Refactoring Checklist - Mobile-First Migration

## Current State Analysis

The `style.css` file currently uses a **mixed approach**:
- ❌ Line 485: `@media (max-width: 768px)` - Desktop-first (incorrect)
- ✅ Line 529: `@media (min-width: 769px)` - Mobile-first (correct)

### Issues Found

1. **Desktop-first media query** at line 485
   - Uses `max-width` instead of `min-width`
   - Overrides desktop styles for mobile (inefficient)

2. **Desktop-first base styles**
   - `.timeline-content { width: 45%; }` assumes desktop layout
   - Should start with mobile (`width: 100%`)

3. **Inconsistent breakpoints**
   - Uses 768px in some places, 769px in others
   - Should standardize on content-based breakpoints

## Recommended Breakpoints

```css
/* Mobile (base): < 481px */
/* Small tablets: ≥ 481px */
@media (min-width: 481px) {}

/* Tablets: ≥ 769px */
@media (min-width: 769px) {}

/* Desktop: ≥ 1025px */
@media (min-width: 1025px) {}

/* Large desktop: ≥ 1440px */
@media (min-width: 1440px) {}
```

## Refactoring Steps

### Phase 1: Document Current State ✅
- [x] Create MOBILE_FIRST.md guide
- [x] Create this checklist
- [x] Identify problematic code

### Phase 2: Refactor Navigation (Priority: High)
- [ ] Remove `@media (max-width: 768px)` at line 485
- [ ] Make mobile menu the base style
- [ ] Use `@media (min-width: 769px)` for desktop nav

### Phase 3: Refactor Timeline (Priority: Medium)
- [ ] Change `.timeline-content` base to `width: 100%`
- [ ] Move desktop layout (`width: 45%`) to `@media (min-width: 769px)`
- [ ] Simplify mobile timeline (vertical, left-aligned)

### Phase 4: Refactor Typography (Priority: Low)
- [ ] Set mobile font sizes as base
- [ ] Progressively enhance for larger screens
- [ ] Remove `!important` flags

### Phase 5: Refactor Grids (Priority: Medium)
- [ ] `.pricing-grid`: Start with 1 column
- [ ] Add 2 columns at 769px
- [ ] Add 3-4 columns at 1025px

## Example Refactoring

### Before (Desktop-First) ❌
```css
/* Base styles assume desktop */
.timeline-content {
    width: 45%;
    margin-left: auto;
}

/* Override for mobile */
@media (max-width: 768px) {
    .timeline-content {
        width: calc(100% - 60px);
        margin-left: 60px !important;
    }
}
```

### After (Mobile-First) ✅
```css
/* Base styles for mobile */
.timeline-content {
    width: calc(100% - 60px);
    margin-left: 60px;
    padding: 1.5rem;
}

/* Enhance for desktop */
@media (min-width: 769px) {
    .timeline-content {
        width: 45%;
        margin-left: auto;
        padding: 2rem;
    }
}
```

## Benefits of Refactoring

1. **Performance**: Mobile devices parse less CSS
2. **Maintainability**: Logical progression from simple to complex
3. **Best Practices**: Follows 2025 industry standards
4. **Scalability**: Easier to add new breakpoints

## Testing Plan

After refactoring:

1. **Mobile (< 481px)**
   - [ ] Navigation hamburger works
   - [ ] Timeline is vertical
   - [ ] Text is readable (16px minimum)
   - [ ] Touch targets are 44x44px

2. **Tablet (769px - 1024px)**
   - [ ] Navigation is horizontal
   - [ ] 2-column grids display correctly
   - [ ] Timeline alternates sides

3. **Desktop (≥ 1025px)**
   - [ ] Full layout displays
   - [ ] 4-column grids work
   - [ ] Hover effects function

## Priority Order

1. **Critical** (Do first): Navigation refactoring
2. **High**: Timeline and grid layouts
3. **Medium**: Typography scaling
4. **Low**: Fine-tuning and polish

## Notes

- **Don't break existing functionality**: Test thoroughly
- **Use feature detection**: Not just screen size
- **Consider touch vs mouse**: Different interaction patterns
- **Test on real devices**: Not just browser DevTools

## Resources

- See `docs/MOBILE_FIRST.md` for detailed guide
- See `docs/CSS_ARCHITECTURE.md` for BEM methodology
- MDN: [Mobile First](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)

## Status

- **Current**: Mixed desktop-first and mobile-first
- **Target**: 100% mobile-first with `min-width` media queries
- **Estimated effort**: 2-3 hours
- **Risk**: Low (mostly reorganizing existing code)
