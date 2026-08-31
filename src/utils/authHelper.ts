import { Page } from '@playwright/test';
import { config } from './config';

export async function loginAsAdmin(page: Page) {
  await page.goto(config.uiUrl + '/web/index.php/auth/login');
  await page.fill('input[name="username"]', config.username);
  await page.fill('input[name="password"]', config.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**');
}
