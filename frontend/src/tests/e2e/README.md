# E2E and Visual Testing with Playwright

This directory contains End-to-End (E2E) and Visual regression tests for the Aris frontend application.

## Overview

- **Framework**: Playwright
- **Languages**: JavaScript (ES modules)
- **Test Organization**: Functional grouping with utilities and fixtures
- **Visual Testing**: Screenshot comparison and responsive design validation

## Directory Structure

```
e2e/
├── tests/                          # Test files organized by feature
│   ├── auth/                       # Authentication flow tests
│   │   ├── login.spec.js
│   │   ├── registration.spec.js
│   │   └── logout.spec.js
│   ├── workspace/                  # File management and workspace tests
│   │   └── file-management.spec.js
│   ├── manuscript/                 # RSM editing and document tests
│   │   └── rsm-editing.spec.js
│   ├── critical-paths/             # End-to-end user journey tests
│   │   └── user-workflow.spec.js
│   └── visual/                     # Visual regression tests
│       ├── component-visual-regression.spec.js
│       └── responsive-visual.spec.js
├── utils/                          # Reusable helper functions
│   ├── auth-helpers.js            # Authentication utilities
│   └── manuscript-helpers.js      # File and manuscript utilities
├── fixtures/                       # Test data and sample files
│   ├── test-users.json            # User credentials for testing
│   └── sample-manuscripts.rsm     # Sample RSM content
└── README.md                      # This file
```

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers (if not already installed):
   ```bash
   npx playwright install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Available Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run tests with browser visible (headed mode)
npm run test:e2e:headed

# Run only visual tests
npm run test:visual

# Run all tests (unit + E2E)
npm run test:all
```

### Running Specific Test Groups

```bash
# Authentication tests only
npx playwright test auth/

# Visual tests only
npx playwright test visual/

# Critical path tests only
npx playwright test critical-paths/

# Run specific test file
npx playwright test auth/login.spec.js

# Run tests matching pattern
npx playwright test --grep "login"
```

## Test Categories

### 1. Authentication Tests (`auth/`)

**Files**: `login.spec.js`, `registration.spec.js`, `logout.spec.js`

**Coverage**:
- User login flow with valid/invalid credentials
- User registration with validation
- Logout functionality and session cleanup
- Keyboard navigation and accessibility
- Error handling and loading states

### 2. File Management Tests (`workspace/`)

**Files**: `file-management.spec.js`

**Coverage**:
- File creation, opening, and deletion
- File upload and download
- Tag management and filtering
- File search and sorting
- Context menu operations
- Bulk file operations

### 3. RSM Manuscript Tests (`manuscript/`)

**Files**: `rsm-editing.spec.js`

**Coverage**:
- RSM syntax rendering and validation
- Real-time editing and auto-save
- Mathematical expressions and citations
- Document export functionality
- Find and replace operations
- Performance with large documents

### 4. Critical Path Tests (`critical-paths/`)

**Files**: `user-workflow.spec.js`

**Coverage**:
- Complete user workflows (login → create → edit → save → logout)
- Collaboration workflows
- Mobile responsive workflows
- Error recovery scenarios
- Data persistence across sessions
- Performance under load

### 5. Visual Regression Tests (`visual/`)

**Files**: `component-visual-regression.spec.js`, `responsive-visual.spec.js`

**Coverage**:
- Component visual states (buttons, inputs, modals, etc.)
- Responsive design across viewport sizes
- Theme consistency (light/dark modes)
- Animation visual consistency
- Accessibility visual checks
- Print layout validation

## Configuration

### Playwright Configuration

The main configuration is in `playwright.config.js`:

- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Base URL**: `http://localhost:5173`
- **Retries**: 2 retries on CI, 0 locally
- **Parallel**: Full parallel execution
- **Reporters**: HTML reporter with traces and screenshots
- **Auto-start**: Automatically starts dev server before tests

### Visual Testing Configuration

Visual tests use `@visual` tag for filtering and include:

- **Screenshot comparison**: Pixel-perfect visual regression detection
- **Responsive testing**: Multiple viewport sizes automatically tested
- **Theme testing**: Light/dark mode visual consistency
- **Animation testing**: Visual verification of animations and transitions

## Utilities and Helpers

### Authentication Helpers (`utils/auth-helpers.js`)

```javascript
import { loginUser, logoutUser, setupAuthenticatedSession } from '../utils/auth-helpers.js';

// Login with credentials
await loginUser(page, { email: 'test@example.com', password: 'password' });

// Setup authenticated session (reusable)
await setupAuthenticatedSession(page);

// Logout current user
await logoutUser(page);
```

### Manuscript Helpers (`utils/manuscript-helpers.js`)

```javascript
import { createNewFile, openFile, deleteFile } from '../utils/manuscript-helpers.js';

// Create new RSM file
await createNewFile(page, { title: 'My Paper', content: ':rsm:\n\n# Title\n\n::' });

// Open existing file
await openFile(page, 'My Paper');

// Delete file
await deleteFile(page, 'My Paper');
```

## Test Data and Fixtures

### Stable Test User Strategy

For **visual regression testing**, we use a dedicated test user with stable, predictable data:

- **Email**: `testuser@aris.test`
- **Password**: Stored in `.env` files (both frontend and backend)
- **Purpose**: Provides consistent test environment for visual comparisons

**Setup**:
```bash
# Reset test user to known state (run from backend directory)
python3 scripts/reset_test_user.py

# Setup test environment for visual tests (run from puppeteer directory)
node setup-test-environment.js

# Run visual tests with stable user
node test-stable-user.js
```

**Benefits**:
- Screenshots remain consistent across test runs
- No dependency on personal user accounts
- Predictable file list and UI state
- Team members get identical visual test results

### Test Users (`fixtures/test-users.json`)

Predefined user accounts for functional testing:
- `defaultUser`: Standard test account
- `adminUser`: Admin privileges
- `collaboratorUser`: Collaboration testing
- `invalidCredentials`: Various invalid login scenarios

### Sample Content (`fixtures/sample-manuscripts.rsm`)

Complete RSM document with:
- Headers and sections
- Mathematical expressions
- Citations and references
- Lists and formatting
- Multiple content types for testing

## Best Practices

### 1. Test Organization

- **Group related tests** in describe blocks
- **Use descriptive test names** that explain the behavior being tested
- **Setup and teardown** properly in beforeEach/afterEach hooks
- **Keep tests independent** - each test should work in isolation

### 2. Element Selection

- **Use data-testid attributes** for reliable element selection
- **Avoid CSS selectors** that can break with style changes
- **Use semantic selectors** when appropriate (role, text content)

Example:
```javascript
// Good
await page.click('[data-testid="create-file-button"]');

// Avoid
await page.click('.btn.btn-primary.create-btn');
```

### 3. Waiting and Timing

- **Use explicit waits** instead of arbitrary timeouts
- **Wait for network requests** to complete
- **Wait for elements to be visible** before interacting

Example:
```javascript
// Good
await page.waitForSelector('[data-testid="file-list"]');
await page.click('[data-testid="first-file"]');

// Avoid
await page.waitForTimeout(2000);
await page.click('[data-testid="first-file"]');
```

### 4. Visual Testing

- **Take screenshots at stable states** (after animations complete)
- **Use consistent viewport sizes** for comparison
- **Update snapshots intentionally** when UI changes are expected
- **Test multiple states** (hover, focus, error, loading)

### 5. Error Handling

- **Test error scenarios** alongside happy paths
- **Verify error messages** are user-friendly
- **Test recovery from errors**
- **Mock network failures** to test resilience

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout values in playwright.config.js
   - Check if dev server is running
   - Verify network requests complete properly

2. **Visual tests failing**
   - Update snapshots if UI changes are intentional: `npx playwright test --update-snapshots`
   - Check for animation timing issues
   - Verify consistent test environment

3. **Flaky tests**
   - Add proper waits for asynchronous operations
   - Ensure test data cleanup between tests
   - Check for race conditions in application code

4. **Authentication issues**
   - Verify test user credentials are correct
   - Check if authentication tokens expire during tests
   - Ensure proper session cleanup

### Debugging

```bash
# Run single test in debug mode
npx playwright test auth/login.spec.js --debug

# Run with trace viewer
npx playwright test --trace on

# Run in headed mode to see browser
npx playwright test --headed

# Generate and view HTML report
npx playwright show-report
```

### CI/CD Integration

The tests are configured for CI environments:

- **Retry logic**: Automatic retries on failure
- **Parallel execution**: Optimized for CI performance  
- **Artifact collection**: Screenshots and traces on failure
- **Headless execution**: No GUI dependencies

## Contributing

When adding new tests:

1. **Follow the existing directory structure**
2. **Add appropriate helpers** to utils/ for reusable functionality
3. **Update this README** if adding new test categories
4. **Include both positive and negative test cases**
5. **Add visual tests** for new UI components
6. **Use the `@visual` tag** for visual regression tests

## Performance Considerations

- **Run visual tests separately** from functional tests for faster feedback
- **Use parallel execution** but be mindful of resource limitations
- **Clean up test data** to prevent database bloat
- **Optimize test fixtures** for reusability
- **Consider test isolation** vs. performance trade-offs