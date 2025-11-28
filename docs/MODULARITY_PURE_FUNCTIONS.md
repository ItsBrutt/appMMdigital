# JavaScript Modularity & Pure Functions Guide

## Principles

### 1. Single Responsibility Principle (SRP)
**One function = One job**

```javascript
// ❌ BAD: Function does too many things
function processUser(user) {
    // Validate
    if (!user.email) return false;
    
    // Transform
    user.email = user.email.toLowerCase();
    
    // Save to database
    saveToDatabase(user);
    
    // Send email
    sendWelcomeEmail(user.email);
    
    // Update UI
    document.getElementById('status').textContent = 'User created';
}

// ✅ GOOD: Each function has one responsibility
function validateUser(user) {
    return user.email && user.email.length > 0;
}

function normalizeEmail(email) {
    return email.toLowerCase().trim();
}

function createUser(userData) {
    if (!validateUser(userData)) {
        throw new Error('Invalid user data');
    }
    
    const user = {
        ...userData,
        email: normalizeEmail(userData.email)
    };
    
    return user;
}

function processUserCreation(userData) {
    const user = createUser(userData);
    saveToDatabase(user);
    sendWelcomeEmail(user.email);
    updateUI('User created');
}
```

### 2. Pure Functions
**Same input → Same output, No side effects**

```javascript
// ❌ IMPURE: Depends on external state
let tax = 0.1;
function calculateTotal(price) {
    return price + (price * tax); // Depends on external variable
}

// ✅ PURE: All inputs are parameters
function calculateTotal(price, taxRate) {
    return price + (price * taxRate);
}

// ❌ IMPURE: Modifies input
function addDiscount(product) {
    product.price = product.price * 0.9; // Mutates input
    return product;
}

// ✅ PURE: Returns new object
function addDiscount(product) {
    return {
        ...product,
        price: product.price * 0.9
    };
}

// ❌ IMPURE: Has side effects
function logAndDouble(x) {
    console.log(x); // Side effect!
    return x * 2;
}

// ✅ PURE: No side effects
function double(x) {
    return x * 2;
}
```

## ES Modules (import/export)

### File Structure
```
js/
├── main.js           # Entry point
├── utils/
│   ├── dom.js        # DOM utilities
│   ├── validation.js # Validation functions
│   └── api.js        # API calls
├── components/
│   ├── navigation.js # Navigation component
│   ├── modal.js      # Modal component
│   └── form.js       # Form handling
└── config/
    └── constants.js  # App constants
```

### Exporting

```javascript
// utils/validation.js

// Named exports (recommended for utilities)
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
}

export const MIN_PASSWORD_LENGTH = 8;

// Default export (for single main export)
export default function validateForm(data) {
    return {
        email: isValidEmail(data.email),
        phone: isValidPhone(data.phone)
    };
}
```

### Importing

```javascript
// main.js

// Named imports
import { isValidEmail, isValidPhone, MIN_PASSWORD_LENGTH } from './utils/validation.js';

// Default import
import validateForm from './utils/validation.js';

// Import all as namespace
import * as Validation from './utils/validation.js';

// Mixed
import validateForm, { isValidEmail } from './utils/validation.js';
```

## Refactoring Example: Current Project

### Current State (main.js)
```javascript
// ❌ Monolithic: Everything in one file
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu logic
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Smooth scrolling logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Scroll animations logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section h2, .timeline-item').forEach(el => {
        observer.observe(el);
    });
});
```

### Refactored (Modular)

#### js/utils/dom.js
```javascript
// Pure utility functions
export function getElement(selector) {
    return document.querySelector(selector);
}

export function getAllElements(selector) {
    return Array.from(document.querySelectorAll(selector));
}

export function toggleClass(element, className) {
    if (!element) return;
    element.classList.toggle(className);
}

export function addClass(element, className) {
    if (!element) return;
    element.classList.add(className);
}

export function removeClass(element, className) {
    if (!element) return;
    element.classList.remove(className);
}
```

#### js/components/navigation.js
```javascript
import { getElement, toggleClass, removeClass } from '../utils/dom.js';

export function initMobileMenu() {
    const menuBtn = getElement('#mobileMenuBtn');
    const navMenu = getElement('#navMenu');
    
    if (!menuBtn || !navMenu) return;
    
    // Toggle menu
    menuBtn.addEventListener('click', () => {
        toggleClass(menuBtn, 'active');
        toggleClass(navMenu, 'active');
    });
    
    // Close on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            removeClass(menuBtn, 'active');
            removeClass(navMenu, 'active');
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            removeClass(menuBtn, 'active');
            removeClass(navMenu, 'active');
        }
    });
}
```

#### js/components/smoothScroll.js
```javascript
import { getAllElements } from '../utils/dom.js';

export function initSmoothScroll() {
    const anchors = getAllElements('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', handleAnchorClick);
    });
}

function handleAnchorClick(e) {
    e.preventDefault();
    
    const targetId = e.currentTarget.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
        scrollToElement(target);
    }
}

function scrollToElement(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}
```

#### js/components/scrollAnimations.js
```javascript
import { getAllElements, addClass } from '../utils/dom.js';

export function initScrollAnimations(selectors = []) {
    const defaultSelectors = [
        'section h2',
        '.timeline-item',
        '.demo-preview',
        '.price-card',
        '.contact-form'
    ];
    
    const elements = getAllElements(
        [...defaultSelectors, ...selectors].join(', ')
    );
    
    const observer = createScrollObserver();
    
    elements.forEach(el => {
        addClass(el, 'fade-in-up');
        observer.observe(el);
    });
}

function createScrollObserver() {
    return new IntersectionObserver(
        handleIntersection,
        { threshold: 0.1 }
    );
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            addClass(entry.target, 'visible');
        }
    });
}
```

#### js/main.js (Clean entry point)
```javascript
import { initMobileMenu } from './components/navigation.js';
import { initSmoothScroll } from './components/smoothScroll.js';
import { initScrollAnimations } from './components/scrollAnimations.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('MM Digital App Initialized');
    
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
});
```

## Pure Functions Benefits

### Testability
```javascript
// ✅ Pure function: Easy to test
function calculateDiscount(price, discountPercent) {
    return price * (1 - discountPercent / 100);
}

// Test
console.assert(calculateDiscount(100, 10) === 90);
console.assert(calculateDiscount(50, 20) === 40);

// ❌ Impure function: Hard to test
let currentUser = null;
function applyUserDiscount(price) {
    if (currentUser && currentUser.isPremium) {
        return price * 0.9;
    }
    return price;
}
// Test requires setting up global state
```

### Predictability
```javascript
// ✅ Pure: Always returns same output for same input
function add(a, b) {
    return a + b;
}

add(2, 3); // Always 5
add(2, 3); // Always 5

// ❌ Impure: Output depends on external state
let counter = 0;
function increment() {
    return ++counter;
}

increment(); // 1
increment(); // 2 (different output!)
```

### Composability
```javascript
// Pure functions compose beautifully
const double = x => x * 2;
const addTen = x => x + 10;
const square = x => x * x;

const result = square(addTen(double(5)));
// 5 -> 10 -> 20 -> 400

// Can create pipelines
function pipe(...fns) {
    return (value) => fns.reduce((acc, fn) => fn(acc), value);
}

const transform = pipe(double, addTen, square);
transform(5); // 400
```

## Best Practices

### 1. Keep Functions Small
```javascript
// ✅ GOOD: Small, focused functions
function getUserName(user) {
    return user.name;
}

function formatUserName(name) {
    return name.trim().toUpperCase();
}

function displayUserName(user) {
    const name = getUserName(user);
    const formatted = formatUserName(name);
    return formatted;
}
```

### 2. Avoid Side Effects
```javascript
// ❌ BAD: Modifies global state
let total = 0;
function addToTotal(amount) {
    total += amount; // Side effect!
}

// ✅ GOOD: Returns new value
function calculateTotal(currentTotal, amount) {
    return currentTotal + amount;
}
```

### 3. Use Immutability
```javascript
// ❌ BAD: Mutates array
function addItem(array, item) {
    array.push(item); // Mutation!
    return array;
}

// ✅ GOOD: Returns new array
function addItem(array, item) {
    return [...array, item];
}

// ❌ BAD: Mutates object
function updateUser(user, updates) {
    user.name = updates.name; // Mutation!
    return user;
}

// ✅ GOOD: Returns new object
function updateUser(user, updates) {
    return { ...user, ...updates };
}
```

### 4. Separate Pure from Impure
```javascript
// Pure functions
function calculatePrice(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

function applyTax(price, taxRate) {
    return price * (1 + taxRate);
}

// Impure functions (clearly separated)
function displayPrice(price) {
    document.getElementById('total').textContent = `$${price}`;
}

function saveOrder(order) {
    localStorage.setItem('order', JSON.stringify(order));
}

// Composition
function processCheckout(items, taxRate) {
    const subtotal = calculatePrice(items);
    const total = applyTax(subtotal, taxRate);
    
    // Impure operations at the end
    displayPrice(total);
    saveOrder({ items, total });
}
```

## Checklist

- [ ] Each function has a single responsibility
- [ ] Functions are small (< 20 lines ideally)
- [ ] Pure functions don't mutate inputs
- [ ] Pure functions don't access global state
- [ ] Side effects are isolated and clearly marked
- [ ] Code is organized into modules
- [ ] Related functions are grouped in files
- [ ] Imports/exports are used properly
- [ ] Functions are composable
- [ ] Functions are testable

## Resources

- [MDN: ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Pure Functions](https://www.freecodecamp.org/news/what-is-a-pure-function-in-javascript-acb887375dfe/)
- [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)
- [Functional Programming in JavaScript](https://github.com/getify/Functional-Light-JS)
