## OrangeHRM Playwright UI + API Automation Framework
Playwright + TypeScript test automation framework covering:

- **UI:** [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com) — login and dashboard flows using the Page Object Model.
- **API:** [ReqRes](https://reqres.in) — authentication and user CRUD API testing using a reusable REST client.

## Tech Stack
- Playwright
- TypeScript
- REST API
- dotenv
- Jenkins
- Git/GitHub

## Project Structure
```text
src/
├── api/
│   ├── clients/
│   ├── data/
│   └── utils/
├── pages/
└── utils/

tests/
├── api/
└── ui/

playwright.config.ts
Jenkinsfile
package.json
tsconfig.json
```

## Setup
### Prerequisites
- Node.js 18+ LTS
- npm
- Git

Check versions:

```bash
node --version
npm --version
git --version
```

### Installation
Clone the repository:

```bash
git clone <your-repository-url>
cd orangehrm-playwright-ui-api-automation
```

Install dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install
```

## Environment Configuration
Create a `.env` file in the project root:

```env
UI_BASE_URL=https://opensource-demo.orangehrmlive.com
API_BASE_URL=https://reqres.in
USERNAME=Admin
PASSWORD=your_password
REQRES_API_KEY=your_api_key
```

Do not commit real passwords, API keys, or tokens to GitHub.

## Run Tests
```bash
# Run all tests
npx playwright test

# Run UI tests
npx playwright test tests/ui/

# Run API tests
npx playwright test tests/api/

# Run a specific test
npx playwright test tests/ui/login.spec.ts
npx playwright test tests/api
```

View the last HTML report:
```
npm run test:report
```

Type-check without running tests:
```
npm run typecheck
```

## Configuration Notes

- Tests run across multiple projects (see `playwright.config.ts` → `projects`): `chrome`, `edge`, `firefox`, `webkit`, `mobile-chrome`, `mobile-safari`, `tablet`. Target one with `npx playwright test --project=<name>` or `npm run test:<name>`.
- Headless on CI (`process.env.CI` set), headed locally so you can watch the run.
- On CI, tests retry twice and run with a single worker; locally there are no retries and workers default to Playwright's auto-detection.
- Screenshots and traces are captured only on failure; video is retained only on failure.
- API requests authenticate via the `x-api-key` header, read from `REQRES_API_KEY`.

## CI (Jenkins)

The `Jenkinsfile` at the repo root defines the pipeline: checkout → `npm ci` → write `.env` → install Playwright browsers → typecheck → run tests → publish the Playwright HTML report and archive `test-results/`. See the Jenkins job `ORANGEHRM_AUTOMATION` for the configured job (built off the `feature` branch).
