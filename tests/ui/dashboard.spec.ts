import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../../src/utils/authHelper';
import { DashboardPage } from '../../src/pages/DashboardPage';

const WIDGET_HEADINGS = [
  'Time at Work',
  'My Actions',
  'Quick Launch',
  'Buzz Latest Posts',
  'Employees on Leave Today',
  'Employee Distribution by Sub Unit',
  'Employee Distribution by Location',
];

// ── Authenticated Tests ──────────────────────────────────────────────────────

test.describe('Dashboard', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    dashboard = new DashboardPage(page);
    await dashboard.waitForLoad();
  });

  // 1. Page Load & URL
  test.describe('Page Load & URL', () => {
    test('Verify URL contains /dashboard after login', async () => {
      await dashboard.verifyDashboardUrl();
    });

    test('Verify page title is OrangeHRM', async () => {
      await dashboard.verifyPageTitle();
    });
  });

  // 2. Widgets — Presence & Count
  test.describe('Widgets — Presence & Count', () => {
    test('Dashboard contains exactly 7 widgets', async () => {
      await dashboard.verifyWidgetCount(7);
    });

    test('Widget headings are correct and in expected order', async () => {
      await dashboard.verifyWidgetHeadings(WIDGET_HEADINGS);
    });
  });

  // 4. Time at Work Widget
  test.describe('Time at Work Widget', () => {
    test('Clicking the clock icon navigates to attendance page', async () => {
      await dashboard.clickTimeAtWorkIcon();
      await dashboard.verifyAttendanceUrl();
    });

    test('Verify navigating back returns to dashboard', async () => {
      await dashboard.clickTimeAtWorkIcon();
      await dashboard.verifyAttendanceUrl();
      await dashboard.navigateBack();
      await dashboard.verifyDashboardUrl();
    });
  });

  // 5. Employees on Leave Today Widget
  test.describe('Employees on Leave Today Widget', () => {
    test('Verify clicking the settings icon opens the configuration dialog', async () => {
      await dashboard.clickLeaveSettingsIcon();
      await dashboard.verifyLeaveConfigDialogVisible();
    });

    test('Verify employee leave data or empty state message is shown', async () => {
      await dashboard.verifyLeaveWidgetRendered();
    });
  });

  // 6. My Actions Widget
  test.describe('My Actions Widget', () => {
    test('Verify at least one action item is visible', async () => {
      await dashboard.verifyMyActionsItemsVisible();
    });

    test('Clicking an action item navigates away from dashboard', async ({ page }) => {
      await dashboard.clickMyActionsItem(0);
      await expect(page).not.toHaveURL(/dashboard/);
      await dashboard.navigateBack();
      await dashboard.verifyDashboardUrl();
    });
  });

  // 7. Quick Launch Widget
  test.describe('Quick Launch Widget', () => {
    test('Quick Launch widget has at least one button', async () => {
      const count = await dashboard.getQuickLaunchButtonCount();
      expect(count).toBeGreaterThan(0);
    });

    test('Verify all Quick Launch buttons are enabled', async () => {
      await dashboard.verifyQuickLaunchButtonsEnabled();
    });

    test('Clicking each Quick Launch button navigates away from dashboard', async ({ page }) => {
      const count = await dashboard.getQuickLaunchButtonCount();
      for (let i = 0; i < count; i++) {
        await dashboard.clickQuickLaunchButton(i);
        await expect(page).not.toHaveURL(/dashboard/);
        await dashboard.navigateBack();
        await dashboard.verifyDashboardUrl();
      }
    });
  });

  // 8. Buzz Latest Posts Widget
  test.describe('Buzz Latest Posts Widget', () => {
    test('Verify at least one Buzz post is visible', async () => {
      await dashboard.verifyBuzzPostVisible();
    });

    test('Verify Buzz post content is not empty', async () => {
      await dashboard.verifyBuzzPostContentNotEmpty();
    });
  });

  // 9. Navigation — Top Menu
  test.describe('Navigation — Top Menu', () => {
    test('Verify top navigation bar is visible on dashboard', async () => {
      await dashboard.verifyTopBarVisible();
    });

    test('Verify clicking Admin menu navigates to admin page', async () => {
      await dashboard.clickSidebarMenuItem('Admin');
      await dashboard.verifyAdminUrl();
    });

    test('Verify clicking PIM navigates to PIM page', async () => {
      await dashboard.clickSidebarMenuItem('PIM');
      await dashboard.verifyPIMUrl();
    });

    test('Verify clicking home logo navigates to the OrangeHRM website', async () => {
      await dashboard.clickSidebarMenuItem('Admin');
      await dashboard.clickHomeLogo();
      await dashboard.verifyHomeLogoLinksToOrangeHRMSite();
    });
  });
});


