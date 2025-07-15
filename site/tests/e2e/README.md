# E2E Test Suite

Comprehensive end-to-end tests for the Aris marketing site using Playwright.

## Overview

The E2E test suite covers critical user flows and cross-browser compatibility to ensure the marketing site works flawlessly across different browsers and devices.

## Test Structure

```
tests/e2e/
├── critical/                    # High-priority business-critical flows
│   ├── signup-flow.spec.js     # Complete signup form testing
│   ├── navigation.spec.js      # Site navigation and routing
│   └── mobile-responsiveness.spec.js # Mobile viewport testing
├── user-experience/             # User experience and interaction testing
│   ├── interactive-elements.spec.js # CTA buttons, forms, animations
│   └── accessibility.spec.js   # Keyboard navigation, ARIA, screen readers
├── browser-compatibility/       # Cross-browser testing
│   └── cross-browser.spec.js   # Compatibility across Chrome, Firefox, Safari
└── README.md                   # This file
```

## Running Tests

### Prerequisites

```bash
# Install dependencies (includes Playwright)
npm install

# Install Playwright browsers
npx playwright install
```

### Available Commands

```bash
# Run E2E tests (Chromium only for local development)
npm run test:e2e

# Run E2E tests on all browsers (for CI/comprehensive testing)
npm run test:e2e:all

# Run E2E tests with UI mode (visual test runner)
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run both unit and E2E tests (local)
npm run test:all

# Run both unit and E2E tests (CI - all browsers)
npm run test:all:ci

# Run specific test file
npx playwright test tests/e2e/critical/signup-flow.spec.js

# Run tests for specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Browser Projects

The test suite is configured for efficient testing:

- **Local Development**: Chromium only (~74 tests) - fast iteration
- **CI/Comprehensive**: All browsers (~193 tests) - full coverage
  - Chrome Desktop + Mobile Chrome (all tests)
  - Firefox, Safari, Mobile Safari (compatibility tests only)

Use `npm run test:e2e` locally and `npm run test:e2e:all` for comprehensive testing.

## Test Categories

### 🚨 Critical Tests (Must Pass)

#### Signup Flow (`critical/signup-flow.spec.js`)
- Complete form submission with validation
- API integration testing (success/error states)
- Character limits and email validation
- Form state management and loading states
- Keyboard accessibility

#### Navigation (`critical/navigation.spec.js`)
- Page-to-page navigation (Home → Signup → Legal pages)
- Mobile menu functionality
- Browser back/forward button handling
- Footer navigation and "back to top"
- Invalid route handling

#### Mobile Responsiveness (`critical/mobile-responsiveness.spec.js`)
- Layout adaptation across viewports (375px to 1440px)
- Mobile menu toggle and interaction
- Touch target sizing (44px minimum)
- Orientation change handling
- No horizontal scroll on mobile

### 🔄 User Experience Tests

#### Interactive Elements (`user-experience/interactive-elements.spec.js`)
- CTA button functionality and hover states
- Form interactions and state changes
- Scroll behavior and animations
- Loading states and error recovery
- Dropdown menu interactions

#### Accessibility (`user-experience/accessibility.spec.js`)
- Keyboard navigation throughout site
- ARIA attributes and semantic HTML
- Focus management and visible indicators
- Screen reader compatibility
- Touch target accessibility on mobile

### 🌐 Cross-Browser Tests

#### Browser Compatibility (`browser-compatibility/cross-browser.spec.js`)
- Core functionality across all browsers
- CSS layout integrity
- JavaScript feature compatibility
- Mobile browser specific testing
- Performance and error handling consistency

## Test Data and Mocking

### API Mocking

Tests mock API calls to ensure consistent, fast test execution:

```javascript
// Mock successful signup
await page.route('**/signup/', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ id: 1, email: 'test@example.com' })
  });
});
```

### Test Data

Tests use consistent test data:
- Email: `test@example.com`
- Name: `Dr. Jane Doe`
- Institution: `University of Science`
- Research Area: `Computational Biology`

## Configuration

### Playwright Config (`playwright.config.js`)

- **Base URL**: `http://localhost:${process.env.SITE_PORT}` (configured via environment variables)
- **Retries**: 2 on CI, 0 locally
- **Timeout**: Default Playwright timeouts
- **Screenshots**: On failure only
- **Video**: Retained on failure
- **Trace**: On first retry

### Dev Server

Tests automatically start the Nuxt dev server (`npm run dev`) before running.

## Writing New Tests

### Best Practices

1. **Follow the AAA pattern**: Arrange, Act, Assert
2. **Use descriptive test names**: What functionality is being tested
3. **Mock external dependencies**: API calls, slow operations
4. **Test user journeys, not implementation details**
5. **Use proper selectors**: Prefer user-facing selectors over technical ones

### Example Test Structure

```javascript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/relevant-page');
  });

  test('should perform specific user action', async ({ page }) => {
    // Arrange
    await page.fill('input[type="email"]', 'test@example.com');
    
    // Act
    await page.click('button[type="submit"]');
    
    // Assert
    await expect(page.locator('text=Success message')).toBeVisible();
  });
});
```

### Selector Guidelines

Prefer (in order):
1. User-facing text: `text=Sign Up`
2. Accessible attributes: `button[aria-label="Submit"]`
3. Semantic HTML: `button[type="submit"]`
4. Test IDs: `[data-testid="signup-form"]`
5. CSS classes: `.signup-button` (last resort)

## Debugging Tests

### UI Mode
```bash
npm run test:e2e:ui
```
Visual interface showing test execution, can pause and inspect.

### Debug Mode
```bash
npm run test:e2e:debug
```
Opens browser in headed mode with debugger attached.

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots at point of failure
- Video recording of full test run
- Trace files for step-by-step debugging

Files saved to `test-results/` directory.

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Maintenance

### Regular Updates

1. **Review and update test data** as the application evolves
2. **Update selectors** if UI changes significantly
3. **Add new test cases** for new features
4. **Monitor test execution time** and optimize slow tests
5. **Update browser versions** in CI configuration

### Performance Monitoring

- Tests should complete within 5 minutes total
- Individual tests should not exceed 30 seconds
- Monitor for flaky tests and investigate root causes

## Troubleshooting

### Common Issues

**Tests failing with timeout**: Increase timeout or check for slow operations
**Element not found**: Verify selectors are correct and elements exist
**Flaky tests**: Add proper waits, check for race conditions
**CI failures**: Ensure browsers are properly installed in CI environment

For comprehensive CI failure analysis across all services, use the Claude Code CI reporting tool:
```bash
/ci-report                    # Analyze CI for current branch's PR
/ci-report 123               # Analyze CI for specific PR number
```

### Debug Commands

```bash
# Run single test with verbose output
npx playwright test tests/e2e/critical/signup-flow.spec.js --headed

# Run with browser console logs
npx playwright test --headed --browser=chromium

# Generate trace file
npx playwright test --trace=on
```

For more information, see the [Playwright documentation](https://playwright.dev/).