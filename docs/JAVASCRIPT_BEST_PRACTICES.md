# JavaScript Best Practices Guide - ES6+ (2025)

## Variable Declarations

### The Rule: const > let > never var

```javascript
// ✅ CORRECT: Use const by default
const API_URL = 'https://api.example.com';
const user = { name: 'John', age: 30 };
const elements = document.querySelectorAll('.item');

// ✅ CORRECT: Use let only when reassignment is needed
let counter = 0;
for (let i = 0; i < 10; i++) {
    counter += i;
}

// ❌ WRONG: Never use var
var oldStyle = 'bad practice'; // Don't do this!
```

### Why const?

1. **Immutable references**: Prevents accidental reassignment
2. **Clearer intent**: Signals that the reference won't change
3. **Better optimization**: Engines can optimize const better
4. **Easier debugging**: Reduces mental overhead

### Why not var?

```javascript
// var has function scope (confusing)
function example() {
    if (true) {
        var x = 10; // Hoisted to function scope
    }
    console.log(x); // 10 (unexpected!)
}

// const/let have block scope (predictable)
function example() {
    if (true) {
        const x = 10; // Block scoped
    }
    console.log(x); // ReferenceError (expected!)
}
```

## const vs let Decision Tree

```
Is the variable reassigned?
├─ No  → Use const
└─ Yes → Use let
```

### Examples

```javascript
// ✅ const: DOM elements (reference doesn't change)
const button = document.getElementById('btn');
const nav = document.querySelector('nav');

// ✅ const: Objects and arrays (reference doesn't change)
const config = { theme: 'dark', lang: 'es' };
config.theme = 'light'; // OK! Mutating object, not reassigning

const items = [1, 2, 3];
items.push(4); // OK! Mutating array, not reassigning

// ✅ let: Loop counters
for (let i = 0; i < 10; i++) {
    console.log(i);
}

// ✅ let: Accumulator variables
let total = 0;
items.forEach(item => {
    total += item; // Reassignment needed
});

// ❌ WRONG: Using let when const would work
let name = 'John'; // Should be const if never reassigned
```

## Arrow Functions

### Use arrow functions for callbacks

```javascript
// ✅ CORRECT: Arrow functions
elements.forEach(el => {
    el.classList.add('active');
});

button.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Clicked!');
});

// ❌ WRONG: Traditional functions for callbacks
elements.forEach(function(el) {
    el.classList.add('active');
});
```

### When NOT to use arrow functions

```javascript
// ❌ WRONG: Methods that need 'this' context
const obj = {
    name: 'Test',
    greet: () => {
        console.log(this.name); // 'this' is undefined!
    }
};

// ✅ CORRECT: Use method shorthand
const obj = {
    name: 'Test',
    greet() {
        console.log(this.name); // Works correctly
    }
};
```

## Modern Array Methods

Prefer functional methods over traditional loops:

```javascript
// ✅ CORRECT: forEach for side effects
const items = [1, 2, 3];
items.forEach(item => console.log(item));

// ✅ CORRECT: map for transformations
const doubled = items.map(item => item * 2);

// ✅ CORRECT: filter for filtering
const evens = items.filter(item => item % 2 === 0);

// ✅ CORRECT: reduce for accumulation
const sum = items.reduce((acc, item) => acc + item, 0);

// ❌ AVOID: Traditional for loops (when functional methods work)
for (let i = 0; i < items.length; i++) {
    console.log(items[i]);
}
```

## Template Literals

Use template literals for string interpolation:

```javascript
// ✅ CORRECT: Template literals
const name = 'John';
const age = 30;
const message = `Hello, ${name}! You are ${age} years old.`;

// ❌ WRONG: String concatenation
const message = 'Hello, ' + name + '! You are ' + age + ' years old.';
```

## Destructuring

Extract values cleanly:

```javascript
// ✅ CORRECT: Object destructuring
const user = { name: 'John', age: 30, city: 'NYC' };
const { name, age } = user;

// ✅ CORRECT: Array destructuring
const [first, second] = [1, 2, 3];

// ✅ CORRECT: Function parameters
function greet({ name, age }) {
    console.log(`Hello ${name}, age ${age}`);
}
```

## Default Parameters

```javascript
// ✅ CORRECT: Default parameters
function greet(name = 'Guest') {
    console.log(`Hello, ${name}`);
}

// ❌ WRONG: Manual default checking
function greet(name) {
    name = name || 'Guest';
    console.log(`Hello, ${name}`);
}
```

## Spread Operator

```javascript
// ✅ CORRECT: Array spreading
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];

// ✅ CORRECT: Object spreading
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };

// ✅ CORRECT: Function arguments
const numbers = [1, 2, 3];
Math.max(...numbers);
```

## Optional Chaining & Nullish Coalescing

```javascript
// ✅ CORRECT: Optional chaining
const user = { profile: { name: 'John' } };
const name = user?.profile?.name; // Safe access

// ✅ CORRECT: Nullish coalescing
const count = 0;
const value = count ?? 10; // 0 (not 10, because 0 is not null/undefined)

// ❌ WRONG: Using || for defaults
const value = count || 10; // 10 (wrong! 0 is falsy)
```

## Async/Await

Prefer async/await over promise chains:

```javascript
// ✅ CORRECT: async/await
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// ❌ AVOID: Promise chains (when async/await is clearer)
function fetchData() {
    return fetch('/api/data')
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error:', error));
}
```

## Code Quality Checklist

- [ ] All variables use `const` unless reassignment is needed
- [ ] No `var` declarations anywhere
- [ ] Arrow functions for all callbacks
- [ ] Template literals for string interpolation
- [ ] Destructuring for object/array extraction
- [ ] Spread operator instead of `concat`/`Object.assign`
- [ ] Optional chaining for safe property access
- [ ] Async/await for asynchronous code
- [ ] Functional array methods over loops
- [ ] Meaningful variable names (no `x`, `temp`, `data`)

## ESLint Rules

Enforce these rules in `eslint.config.js`:

```javascript
rules: {
    'no-var': 'error',              // Prohibit var
    'prefer-const': 'error',        // Prefer const over let
    'prefer-arrow-callback': 'warn', // Arrow functions for callbacks
    'prefer-template': 'warn',      // Template literals
    'no-useless-concat': 'error',   // No unnecessary concatenation
}
```

## Common Mistakes

### ❌ Mistake 1: Using let when const works
```javascript
let name = 'John'; // Never reassigned
// Should be: const name = 'John';
```

### ❌ Mistake 2: Mutating const and thinking it's wrong
```javascript
const arr = [1, 2, 3];
arr.push(4); // This is OK! const prevents reassignment, not mutation
```

### ❌ Mistake 3: Using var
```javascript
var x = 10; // Never use var!
// Should be: const x = 10;
```

### ❌ Mistake 4: Traditional function in callbacks
```javascript
items.forEach(function(item) { }); // Old style
// Should be: items.forEach(item => { });
```

## Resources

- [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
- [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
- [MDN: Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [JavaScript.info: Modern JavaScript](https://javascript.info/)
