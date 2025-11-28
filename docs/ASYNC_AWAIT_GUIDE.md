# Async/Await Best Practices Guide

## Evolution of Asynchronous JavaScript

### ❌ Callback Hell (2010s)
```javascript
getData(function(a) {
    getMoreData(a, function(b) {
        getMoreData(b, function(c) {
            getMoreData(c, function(d) {
                console.log(d);
            });
        });
    });
});
```

### ⚠️ Promises (Better, but verbose)
```javascript
getData()
    .then(a => getMoreData(a))
    .then(b => getMoreData(b))
    .then(c => getMoreData(c))
    .then(d => console.log(d))
    .catch(error => console.error(error));
```

### ✅ Async/Await (Modern, Clean)
```javascript
async function fetchData() {
    try {
        const a = await getData();
        const b = await getMoreData(a);
        const c = await getMoreData(b);
        const d = await getMoreData(c);
        console.log(d);
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## The Professional Fetch Pattern

### ❌ Wrong: No Error Handling
```javascript
async function getUser(id) {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return data; // What if network fails? What if 404?
}
```

### ✅ Correct: Complete Error Handling
```javascript
async function getUser(id) {
    try {
        const response = await fetch(`/api/users/${id}`);
        
        // Check HTTP status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error; // Re-throw for caller to handle
    }
}
```

## Critical: fetch() Doesn't Reject on HTTP Errors

```javascript
// ❌ WRONG: This won't catch 404 or 500 errors
try {
    const response = await fetch('/api/data');
    const data = await response.json();
} catch (error) {
    // This only catches network errors, not HTTP errors!
}

// ✅ CORRECT: Explicitly check response.ok
try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
} catch (error) {
    // Now catches both network AND HTTP errors
    console.error('Error:', error);
}
```

## Destructuring with Async/Await

### ❌ Verbose
```javascript
async function getUserProfile(id) {
    try {
        const response = await fetch(`/api/users/${id}`);
        const data = await response.json();
        
        const name = data.name;
        const email = data.email;
        const age = data.age;
        
        return { name, email, age };
    } catch (error) {
        console.error(error);
    }
}
```

### ✅ Clean with Destructuring
```javascript
async function getUserProfile(id) {
    try {
        const response = await fetch(`/api/users/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const { name, email, age } = await response.json();
        
        return { name, email, age };
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        throw error;
    }
}
```

## Parallel vs Sequential Execution

### ❌ Sequential (Slow)
```javascript
async function getData() {
    const user = await fetchUser();      // Wait 500ms
    const posts = await fetchPosts();    // Wait 500ms
    const comments = await fetchComments(); // Wait 500ms
    // Total: 1500ms
}
```

### ✅ Parallel (Fast)
```javascript
async function getData() {
    const [user, posts, comments] = await Promise.all([
        fetchUser(),
        fetchPosts(),
        fetchComments()
    ]);
    // Total: 500ms (all run in parallel)
}
```

## Error Handling Patterns

### Pattern 1: Try/Catch per Function
```javascript
async function fetchUserData(id) {
    try {
        const response = await fetch(`/api/users/${id}`);
        
        if (!response.ok) {
            throw new Error(`User not found: ${id}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        return null; // Return fallback value
    }
}
```

### Pattern 2: Let Errors Bubble Up
```javascript
async function fetchUserData(id) {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
        throw new Error(`User not found: ${id}`);
    }
    
    return await response.json();
}

// Caller handles errors
async function displayUser(id) {
    try {
        const user = await fetchUserData(id);
        renderUser(user);
    } catch (error) {
        showErrorMessage('Failed to load user');
        console.error(error);
    }
}
```

### Pattern 3: Custom Error Classes
```javascript
class APIError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'APIError';
    }
}

async function fetchData(url) {
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new APIError(response.status, response.statusText);
    }
    
    return await response.json();
}

// Usage
try {
    const data = await fetchData('/api/data');
} catch (error) {
    if (error instanceof APIError) {
        if (error.status === 404) {
            console.log('Resource not found');
        } else if (error.status === 500) {
            console.log('Server error');
        }
    } else {
        console.log('Network error');
    }
}
```

## Real-World Examples

### Example 1: Form Submission
```javascript
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit form');
        }
        
        const result = await response.json();
        showSuccessMessage('Form submitted successfully!');
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('Failed to submit form. Please try again.');
    }
}
```

### Example 2: Loading Data with Loading State
```javascript
async function loadUserData(userId) {
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('content');
    const errorEl = document.getElementById('error');
    
    try {
        // Show loading
        loadingEl.style.display = 'block';
        contentEl.style.display = 'none';
        errorEl.style.display = 'none';
        
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const { name, email, avatar } = await response.json();
        
        // Show content
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
        contentEl.innerHTML = `
            <h2>${name}</h2>
            <p>${email}</p>
            <img src="${avatar}" alt="${name}">
        `;
        
    } catch (error) {
        // Show error
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = 'Failed to load user data';
        console.error('Error:', error);
    }
}
```

### Example 3: Retry Logic
```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${i + 1} failed, retrying...`);
            
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
    
    throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}
```

## Common Mistakes

### ❌ Mistake 1: Forgetting await
```javascript
async function getData() {
    const data = fetch('/api/data'); // Missing await!
    console.log(data); // Logs a Promise, not the data
}
```

### ❌ Mistake 2: Not handling errors
```javascript
async function getData() {
    const response = await fetch('/api/data');
    return await response.json(); // What if this fails?
}
```

### ❌ Mistake 3: Using async without await
```javascript
async function getData() {
    return 'hello'; // Don't need async if not using await
}
// Should be: function getData() { return 'hello'; }
```

### ❌ Mistake 4: Awaiting in loops (sequential)
```javascript
async function processItems(items) {
    const results = [];
    for (const item of items) {
        results.push(await processItem(item)); // Slow!
    }
    return results;
}

// ✅ Better: Use Promise.all
async function processItems(items) {
    return await Promise.all(items.map(item => processItem(item)));
}
```

## Best Practices Checklist

- [ ] Always use try/catch with async functions
- [ ] Check `response.ok` before parsing JSON
- [ ] Use descriptive error messages
- [ ] Use destructuring to extract data
- [ ] Use `Promise.all()` for parallel operations
- [ ] Avoid awaiting in loops (use map + Promise.all)
- [ ] Return meaningful values or throw errors
- [ ] Log errors for debugging
- [ ] Show user-friendly error messages
- [ ] Consider retry logic for critical operations

## ESLint Rules

```javascript
rules: {
    'require-await': 'error',           // Async functions must use await
    'no-return-await': 'error',         // Don't return await unnecessarily
    'prefer-promise-reject-errors': 'error', // Reject with Error objects
}
```

## Resources

- [MDN: async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JavaScript.info: Async/await](https://javascript.info/async-await)
- [Promise.all() vs Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
