import { Page, Locator, expect } from '@playwright/test';
import { config } from '../utils/config';

export class DashboardPage {
  private page: Page;
  readonly widgets: Locator;
  readonly widgetHeadings: Locator;
  readonly myActionsItems: Locator;
  readonly quickLaunchButtons: Locator;
  readonly buzzPostContent: Locator;
  readonly employeesOnLeave: Locator;
  readonly noEmployeesOnLeaveMessage: Locator;
  readonly topBar: Locator;
  readonly sidebarMenuItem: Locator;
  readonly leftBarSearch: Locator;
  readonly homeLogo: Locator;

  constructor(page: Page) {
    this.page               = page;
    this.widgets            = page.locator('.oxd-sheet.oxd-sheet--rounded');
    this.widgetHeadings     = page.locator('.orangehrm-dashboard-widget-header');
    this.myActionsItems     = page.locator('.orangehrm-todo-list-item');
    this.quickLaunchButtons = page.locator('.oxd-icon-button.orangehrm-quick-launch-icon');
    this.buzzPostContent    = page.locator('.oxd-grid-item.oxd-grid-item--gutters.orangehrm-buzz-widget-card');
    this.employeesOnLeave   = page.locator('.orangehrm-leave-card');
    this.noEmployeesOnLeaveMessage = page.locator('.orangehrm-dashboard-widget-body-nocontent');
    this.topBar             = page.locator('.oxd-topbar-header');
    this.sidebarMenuItem    = page.locator('.oxd-main-menu-item');
    this.leftBarSearch      = page.locator('.oxd-main-menu-search');
    this.homeLogo           = page.locator('.oxd-brand-banner');
  }

  async goto() {
    await this.page.goto(config.uiUrl + '/web/index.php/dashboard/index');
  }

  // ── Page Load ──────────────────────────────────────────────────────────────

  async waitForLoad() {
    await this.widgetHeadings.first().waitFor({ state: 'visible' });
  }

  async verifyDashboardUrl() {
    await expect(this.page).toHaveURL(/dashboard/);
  }

  async verifyPageTitle() {
    await expect(this.page).toHaveTitle(/OrangeHRM/);
  }


  // ── Widgets ────────────────────────────────────────────────────────────────

  async verifyWidgetCount(count: number) {
    await expect(this.widgets).toHaveCount(count);
  }

  async verifyWidgetHeadings(headings: string[]) {
    await expect(this.widgetHeadings).toHaveText(headings);
  }

  // ── Time at Work ───────────────────────────────────────────────────────────

  async clickTimeAtWorkIcon() {
    await this.widgets
      .filter({ hasText: 'Time at Work' })
      .locator('.oxd-icon-button')
      .first()
      .click();
  }

  async verifyAttendanceUrl() {
    await expect(this.page).toHaveURL(/attendance/);
  }

  // ── Employees on Leave Today ───────────────────────────────────────────────

  async clickLeaveSettingsIcon() {
    await this.widgets
      .filter({ hasText: 'Employees on Leave Today' })
      .locator('.orangehrm-leave-card-icon')
      .click();
  }

  async verifyLeaveConfigDialogVisible() {
    await expect(
      this.page.locator('.orangehrm-dialog-modal').filter({ hasText: 'Configurations' })
    ).toBeVisible();
  }

  async verifyLeaveWidgetRendered() {
    const widget = this.widgets.filter({ hasText: 'Employees on Leave Today' });
    await widget.waitFor({ state: 'visible' });
    await widget
      .locator('.orangehrm-dashboard-widget-loader')
      .waitFor({ state: 'detached' })
      .catch(() => {});
    const rows    = await widget.locator('.orangehrm-leave-card').count();
    const message = await widget.locator('.orangehrm-dashboard-widget-body-nocontent').count();
    expect(rows + message).toBeGreaterThan(0);
  }

  // ── My Actions ─────────────────────────────────────────────────────────────

  async verifyMyActionsItemsVisible() {
    await expect(this.myActionsItems.first()).toBeVisible();
  }

  async clickMyActionsItem(index: number) {
    await this.myActionsItems.nth(index).click();
  }

  // ── Quick Launch ───────────────────────────────────────────────────────────

  async getQuickLaunchButtonCount(): Promise<number> {
    await this.quickLaunchButtons.first().waitFor({ state: 'visible' });
    return this.quickLaunchButtons.count();
  }

  async verifyQuickLaunchButtonsEnabled() {
    const count = await this.quickLaunchButtons.count();
    for (let i = 0; i < count; i++) {
      await expect(this.quickLaunchButtons.nth(i)).toBeEnabled();
    }
  }

  async clickQuickLaunchButton(index: number) {
    await this.quickLaunchButtons.nth(index).click();
  }

  // ── Buzz Latest Posts ──────────────────────────────────────────────────────

  async verifyBuzzPostVisible() {
    await expect(this.buzzPostContent.first()).toBeVisible();
  }

  async verifyBuzzPostContentNotEmpty() {
    const text = await this.buzzPostContent.first().textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async verifyTopBarVisible() {
    await expect(this.topBar).toBeVisible();
  }

  async clickSidebarMenuItem(menuText: string) {
    await this.sidebarMenuItem.filter({ hasText: menuText }).click();
  }

  async searchLeftBarMenu(searchText: string) {
    await this.leftBarSearch.fill(searchText);
  }

  async verifyAdminUrl() {
    await expect(this.page).toHaveURL(/\/admin\//);
  }

  async verifyPIMUrl() {
    await expect(this.page).toHaveURL(/\/pim\//);
  }

  async clickHomeLogo() {
    await this.homeLogo.click();
  }

  async verifyHomeLogoLinksToOrangeHRMSite() {
    await expect(this.page).toHaveURL(/orangehrm\.com/);
  }

  async navigateBack() {
    await this.page.goBack();
    await this.page.waitForLoadState('networkidle');
  }
}
