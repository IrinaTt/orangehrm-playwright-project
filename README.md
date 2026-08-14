# OrangeHRM Playwright E2E

TypeScript + Playwright tests for the OrangeHRM Demo "System Users" flow.

Flow covered:

1. Log in as Admin
2. Open Admin → User Management → Users
3. Create a unique user
4. Search and verify it
5. Disable it and verify the change
6. Delete it and verify it is gone

## Prerequisites

- Node.js 16+ (LTS recommended)
- npm

## Install

```bash
npm install
npx playwright install
```

Note: `npx playwright install` downloads browsers. The test scripts will fail without the browsers installed.

## Run tests

Run the whole suite:

```bash
npm test
```

Run headed (visible) mode:

```bash
npm run test:headed
```

Run a single test file:

```bash
npx playwright test tests/system-users.e2e.spec.ts
```

Run a single test by title (grep):

```bash
npx playwright test -g "Admin can create, search, edit and delete a system user"
```

Run debug mode (opens Playwright inspector):

```bash
npm run test:debug
```

Open HTML report after run:

```bash
npm run report
# or
npx playwright show-report
```

## Environment / configuration notes

- BASE\_URL: override default application URL (defaults to the public demo):

```bash
BASE_URL="https://opensource-demo.orangehrmlive.com" npm test
```

- Credentials can be overridden via environment variables:

```bash
ORANGE_USERNAME=Admin ORANGE_PASSWORD=admin123 npm test
```

- Headed vs headless: the repo provides `test:headed`. The Playwright CLI also accepts `--headed` or `--headed=false`
  flags.
- Artifacts (screenshots, videos, traces) are stored by Playwright under `test-results/` and the HTML report in
  `playwright-report/`.

## Notes about stability

- Tests use Page Object Model. Locators live in `src/pages/*` and tests call high-level methods.
- If tests are flaky due to timing or viewport differences, try `npm run test:headed` to observe behavior and increase
  relevant timeouts.

## Troubleshooting

- If Playwright reports missing browsers, run `npx playwright install` again.
- If a test cannot find UI elements, run in headed mode and inspect selectors with the Playwright inspector (
  `npm run test:debug`).

## Tagging tests (example)

Tests can be tagged by adding a marker in the test title. Example:

```ts
test('Login works @smoke', async ({page}) => {
    // ...
});
```

Then run only tagged tests using the package.json scripts added:

```bash
npm run test:smoke           # runs @smoke tests
npm run test:smoke:headed    # runs @smoke tests in headed mode
npm run test:smoke:debug     # runs @smoke tests with inspector
```

## Important notes: Shared demo instance

This test suite targets a **public shared OrangeHRM demo**. The following design decisions reflect shared-tenant
constraints:

### Data cleanup is critical

Each test **must clean up after itself** (create → delete user). Failure to clean up pollutes the demo for other users
and leaves test artifacts. See the "Delete edited user" step in the test — it is not optional.

### Why unique usernames

Test usernames are generated with a timestamp + random suffix (e.g., `TestUser_1692345678_abc12`). This prevents
collisions when multiple test runs happen concurrently. Even on a shared instance, uniqueness ensures:

- No "user already exists" errors from a previous failed run
- Easy identification of stale test data (old timestamps)

### Concurrent run risks

Running multiple test instances simultaneously against the demo may cause:

- Race conditions when searching for newly created users (eventual consistency)
- User deletion conflicts if cleanup overlaps

**Mitigation:** Keep `workers: 1` in `playwright.config.ts` for the shared demo. For private instances, increase workers
as needed.

## Design decisions

### Why this POM structure

I split the UI into page objects (`LoginPage`, `ViewSystemUserPage`, `SaveSystemUserPage`) so the spec reads in business
language instead of DOM detail.
The test focuses on user intent — create, search, edit, delete — while the page objects keep the selectors and
interaction logic in one place.
That makes the suite easier to maintain and less fragile when the UI layout changes.

### How waits are handled for flaky UI

The suite relies on Playwright’s native waiting behavior: `expect(...).toBeVisible()`, `locator.waitFor()`, and
value-based checks before moving forward. Instead of fixed sleeps, it waits for the actual UI state to appear. That
makes tests more resilient when the app is slower than usual, especially around modals, dropdowns, and table refreshes.

### How shared-demo collisions are avoided

This project targets a public shared OrangeHRM demo, so it avoids collisions by generating unique usernames with a
timestamp and random suffix. The suite also runs with a single worker to reduce parallel conflict risk. Finally, each
test deletes the data it creates so the shared instance stays clean for everyone else.

### One selector I would improve in the product

I would add `data-testid` attributes to the most important controls, especially the Add User form fields and the
username search input. The current UI relies heavily on CSS classes and human-readable text, which is less stable across
redesigns and harder to maintain. Stable automation hooks would make both testing and product regression checks much
cleaner.

### What I would do next with another hour

I would improve the suite in a few focused ways:

- split the flow into even smaller reusable helpers for create/search/edit/delete
- add a negative-path test for duplicate username validation
- add stronger assertions around toast messages and table refresh behavior
- add a lightweight CI smoke job for `@smoke` tests
- document a local/private environment for safer parallel runs outside the shared demo

---

This README provides install steps, run commands and environment hints for local development and CI.