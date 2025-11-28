# GitHub Actions CI/CD Guide

## What is CI/CD?

**CI (Continuous Integration):** Automatically test and validate code on every commit.

**CD (Continuous Deployment):** Automatically deploy code to production after passing tests.

## Why GitHub Actions?

- ✅ Integrated with GitHub
- ✅ Free for public repos (2,000 minutes/month for private)
- ✅ Easy YAML configuration
- ✅ Large marketplace of actions
- ✅ Runs on every push/PR

## Workflow Structure

```
.github/
└── workflows/
    ├── ci.yml           # Test & lint on every push
    ├── deploy.yml       # Deploy to production
    └── pr-check.yml     # Validate pull requests
```

## Basic Workflow: CI (Test & Lint)

### .github/workflows/ci.yml

```yaml
name: CI - Test & Lint

# Trigger on push to main and all pull requests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

# Jobs to run
jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest
    
    steps:
      # 1. Checkout code
      - name: Checkout repository
        uses: actions/checkout@v4
      
      # 2. Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      # 3. Install dependencies (deterministic)
      - name: Install dependencies
        run: npm ci
      
      # 4. Run linters
      - name: Lint CSS
        run: npm run lint:css
      
      - name: Lint JavaScript
        run: npm run lint:js
      
      # 5. Validate HTML
      - name: Validate HTML
        run: npm run validate:html
      
      # 6. Check code formatting
      - name: Check Prettier formatting
        run: npm run format:check
      
      # 7. Build project
      - name: Build production
        run: npm run build
      
      # 8. Upload build artifacts
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7
```

## Advanced Workflow: Deploy to Production

### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

# Trigger only on push to main
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    name: Build & Deploy
    runs-on: ubuntu-latest
    
    steps:
      # 1. Checkout code
      - name: Checkout repository
        uses: actions/checkout@v4
      
      # 2. Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      # 3. Install dependencies
      - name: Install dependencies
        run: npm ci
      
      # 4. Run tests (safety check)
      - name: Run tests
        run: npm test
      
      # 5. Build production
      - name: Build production
        run: npm run build
      
      # 6. Deploy to Netlify
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      
      # Alternative: Deploy to Vercel
      # - name: Deploy to Vercel
      #   uses: amondnet/vercel-action@v25
      #   with:
      #     vercel-token: ${{ secrets.VERCEL_TOKEN }}
      #     vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
      #     vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      #     vercel-args: '--prod'
```

## Pull Request Workflow

### .github/workflows/pr-check.yml

```yaml
name: PR Check

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  pr-check:
    name: Validate Pull Request
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      # Run all quality checks
      - name: Run all tests
        run: npm test
      
      - name: Build project
        run: npm run build
      
      # Comment on PR with results
      - name: Comment PR
        uses: actions/github-script@v7
        if: always()
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ All checks passed! Ready to merge.'
            })
```

## Scheduled Workflow: Dependency Updates

### .github/workflows/dependency-check.yml

```yaml
name: Dependency Check

# Run weekly on Monday at 9 AM
on:
  schedule:
    - cron: '0 9 * * 1'
  workflow_dispatch: # Allow manual trigger

jobs:
  check-dependencies:
    name: Check for outdated dependencies
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Check outdated packages
        run: npm outdated || true
      
      - name: Security audit
        run: npm audit --audit-level=moderate
```

## Multi-Environment Deployment

### .github/workflows/deploy-multi-env.yml

```yaml
name: Multi-Environment Deploy

on:
  push:
    branches:
      - main        # Production
      - develop     # Staging
      - feature/*   # Preview

jobs:
  deploy:
    name: Deploy to ${{ github.ref_name }}
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      # Deploy to different environments based on branch
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: echo "Deploying to production..."
        # Add production deployment steps
      
      - name: Deploy to Staging
        if: github.ref == 'refs/heads/develop'
        run: echo "Deploying to staging..."
        # Add staging deployment steps
      
      - name: Deploy Preview
        if: startsWith(github.ref, 'refs/heads/feature/')
        run: echo "Deploying preview..."
        # Add preview deployment steps
```

## Caching for Faster Builds

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      # Cache node_modules
      - name: Cache node modules
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
```

## Matrix Testing (Multiple Node Versions)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20, 21]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - run: npm ci
      - run: npm test
```

## Secrets Management

### Setting Secrets in GitHub

1. Go to repository Settings
2. Click "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add secrets:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
   - `VERCEL_TOKEN`
   - etc.

### Using Secrets in Workflows

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
    run: |
      echo "Deploying with secret credentials..."
      # Secrets are masked in logs
```

## Status Badges

Add to README.md:

```markdown
# MM Digital

![CI Status](https://github.com/username/mmdigital/workflows/CI/badge.svg)
![Deploy Status](https://github.com/username/mmdigital/workflows/Deploy/badge.svg)
```

## Complete Example: MM Digital CI/CD

### .github/workflows/main.yml

```yaml
name: MM Digital CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  # Job 1: Quality Checks
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint CSS
        run: npm run lint:css
      
      - name: Lint JavaScript
        run: npm run lint:js
      
      - name: Validate HTML
        run: npm run validate:html
      
      - name: Check formatting
        run: npm run format:check
  
  # Job 2: Build
  build:
    name: Build Production
    runs-on: ubuntu-latest
    needs: quality
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: production-build
          path: dist/
  
  # Job 3: Deploy (only on main branch)
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Download artifacts
        uses: actions/download-artifact@v4
        with:
          name: production-build
          path: dist/
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      
      - name: Notify success
        run: echo "✅ Deployed successfully to production!"
```

## Local Testing with Act

Test workflows locally before pushing:

```bash
# Install act
brew install act  # macOS
# or
choco install act  # Windows

# Run workflow locally
act push

# Run specific job
act -j quality

# List workflows
act -l
```

## Best Practices

### 1. Use `npm ci` instead of `npm install`

```yaml
# ✅ GOOD: Deterministic, faster
- run: npm ci

# ❌ BAD: Non-deterministic
- run: npm install
```

### 2. Cache Dependencies

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'  # Automatic caching
```

### 3. Fail Fast

```yaml
strategy:
  fail-fast: true  # Stop all jobs if one fails
  matrix:
    node-version: [18, 20]
```

### 4. Use Environment Variables

```yaml
env:
  NODE_VERSION: '18'
  CI: true

jobs:
  test:
    steps:
      - run: npm test
        env:
          NODE_ENV: test
```

### 5. Conditional Steps

```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main'
  run: npm run deploy
```

## Monitoring & Notifications

### Slack Notification

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  if: always()
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notification

```yaml
- name: Send email
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Build ${{ job.status }}
    body: Build completed with status ${{ job.status }}
    to: team@mmdigital.com
```

## Checklist

- [ ] Create `.github/workflows/` directory
- [ ] Add CI workflow for testing/linting
- [ ] Add deploy workflow for production
- [ ] Set up repository secrets
- [ ] Test workflows with `act` locally
- [ ] Add status badges to README
- [ ] Configure branch protection rules
- [ ] Set up notifications (Slack/Email)
- [ ] Document deployment process
- [ ] Monitor workflow runs

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [Act - Local Testing](https://github.com/nektos/act)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
