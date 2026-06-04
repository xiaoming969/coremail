import { expect, test } from '@playwright/test';

test('calendar shell renders with search entry hidden', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '日历' }).click();

  await expect(page.getByText('Coremail')).toBeVisible();
  await expect(page.getByText('1月 5日–11日')).toBeVisible();
  await expect(page.getByPlaceholder('搜索日程')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '搜索日程' })).toHaveCount(0);
  await expect(page.getByRole('checkbox', { name: '显示小华' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: '显示张三' })).toBeChecked();
  await expect(page.locator('[data-calendar-account-checkbox="acc1"]')).toHaveClass(/rounded-md/);
  await expect
    .poll(() =>
      page.locator('[data-calendar-account-checkbox="acc1"]').evaluate((node) => window.getComputedStyle(node).backgroundColor),
    )
    .toBe('rgb(10, 89, 247)');
  await expect(page.locator('[data-calendar-account-color-dot="acc1"]')).toHaveCount(0);
  const calendarSidebar = page.locator('[data-app-sidebar="calendar"]');
  const miniMonthLabel = page.locator('[data-calendar-mini-month-label="true"]');
  const calendarProductDock = calendarSidebar.locator('[data-app-sidebar-product-dock="true"]');
  await expect(calendarSidebar).toBeVisible();
  await expect(miniMonthLabel).toHaveText('2026年1月');
  await expect
    .poll(() => miniMonthLabel.evaluate((node) => window.getComputedStyle(node).whiteSpace))
    .toBe('nowrap');
  await expect.poll(() => miniMonthLabel.evaluate((node) => node.getClientRects().length)).toBe(1);
  await expect(calendarProductDock).toBeVisible();
  await expect
    .poll(() => calendarSidebar.evaluate((node) => window.getComputedStyle(node.children[0]).paddingLeft))
    .toBe('24px');
  await expect
    .poll(() =>
      calendarSidebar.evaluate((node) => {
        const scrollPanel = Array.from(node.children).find((child) => child.className.includes('overflow-y-auto'));
        return window.getComputedStyle(scrollPanel).paddingLeft;
      }),
    )
    .toBe('24px');
  await expect
    .poll(async () => Math.round((await calendarSidebar.boundingBox()).width))
    .toBeGreaterThanOrEqual(240);
  await expect
    .poll(async () => Math.round((await calendarSidebar.boundingBox()).width))
    .toBeLessThanOrEqual(320);
  await expect.poll(() => calendarProductDock.evaluate((node) => window.getComputedStyle(node).borderTopWidth)).toBe('0px');
  await expect
    .poll(async () => {
      const sidebarBox = await calendarSidebar.boundingBox();
      const dockBox = await calendarProductDock.boundingBox();
      return Math.round(sidebarBox.y + sidebarBox.height - (dockBox.y + dockBox.height));
    })
    .toBe(0);
});

test('workspace splitters resize calendar and mail panes', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: '日历' }).click();

  const calendarSidebar = page.locator('[data-app-sidebar="calendar"]');
  const calendarSplitter = page.locator('[data-layout-resizer="calendar-a"]');
  await expect(calendarSidebar).toBeVisible();
  await expect(calendarSplitter).toBeVisible();
  await expect.poll(() => calendarSplitter.evaluate((node) => window.getComputedStyle(node).cursor)).toBe('col-resize');
  await expect.poll(async () => Math.round((await calendarSidebar.boundingBox()).width)).toBe(276);

  const calendarWidthBefore = Math.round((await calendarSidebar.boundingBox()).width);
  const calendarSplitterBox = await calendarSplitter.boundingBox();
  await page.mouse.move(calendarSplitterBox.x + calendarSplitterBox.width / 2, calendarSplitterBox.y + calendarSplitterBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(calendarSplitterBox.x - 40, calendarSplitterBox.y + calendarSplitterBox.height / 2);
  await page.mouse.up();
  await expect.poll(async () => Math.round((await calendarSidebar.boundingBox()).width)).toBeLessThan(calendarWidthBefore - 20);
  const miniMonthLabel = page.locator('[data-calendar-mini-month-label="true"]');
  await expect(miniMonthLabel).toHaveText('2026年1月');
  await expect.poll(() => miniMonthLabel.evaluate((node) => node.getClientRects().length)).toBe(1);

  await page.getByRole('button', { name: '邮件' }).click();
  const mailSidebar = page.locator('[data-app-sidebar="mail"]');
  const mailListPane = page.locator('[data-mail-list-pane="true"]');
  const mailASplitter = page.locator('[data-layout-resizer="mail-a"]');
  const mailBSplitter = page.locator('[data-layout-resizer="mail-b"]');
  await expect(mailSidebar).toBeVisible();
  await expect(mailListPane).toBeVisible();
  await expect(mailASplitter).toBeVisible();
  await expect(mailBSplitter).toBeVisible();
  await expect.poll(() => mailASplitter.evaluate((node) => window.getComputedStyle(node).cursor)).toBe('col-resize');
  await expect.poll(() => mailBSplitter.evaluate((node) => window.getComputedStyle(node).cursor)).toBe('col-resize');
  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBe(320);
  await expect.poll(async () => Math.round((await mailListPane.boundingBox()).width)).toBe(544);

  const mailSidebarWidthBefore = Math.round((await mailSidebar.boundingBox()).width);
  const mailASplitterBox = await mailASplitter.boundingBox();
  await page.mouse.move(mailASplitterBox.x + mailASplitterBox.width / 2, mailASplitterBox.y + mailASplitterBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(mailASplitterBox.x - 44, mailASplitterBox.y + mailASplitterBox.height / 2);
  await page.mouse.up();
  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBeLessThan(mailSidebarWidthBefore - 20);

  const mailListWidthBefore = Math.round((await mailListPane.boundingBox()).width);
  const mailBSplitterBox = await mailBSplitter.boundingBox();
  await page.mouse.move(mailBSplitterBox.x + mailBSplitterBox.width / 2, mailBSplitterBox.y + mailBSplitterBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(mailBSplitterBox.x + 72, mailBSplitterBox.y + mailBSplitterBox.height / 2);
  await page.mouse.up();
  await expect.poll(async () => Math.round((await mailListPane.boundingBox()).width)).toBeGreaterThan(mailListWidthBefore + 40);
  await expect(page.locator('[data-mail-reading-pane="true"]')).toBeVisible();
});

test('mail layout switches between ABC and AB reading modes', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 900 });
  await page.goto('/');

  const mailView = page.locator('[data-mail-workspace="true"]');
  const mailSidebar = page.locator('[data-app-sidebar="mail"]');
  const mailListPane = page.locator('[data-mail-list-pane="true"]');
  const mailReaderPane = page.locator('[data-mail-reader-region="true"]');
  const mailBSplitter = page.locator('[data-layout-resizer="mail-b"]');

  await expect(mailView).toBeVisible();
  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'ABC');
  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBe(320);
  await expect.poll(async () => Math.round((await mailListPane.boundingBox()).width)).toBe(544);
  await expect.poll(async () => Math.round((await mailReaderPane.boundingBox()).width)).toBe(864);

  const mailBSplitterBox = await mailBSplitter.boundingBox();
  await page.mouse.move(mailBSplitterBox.x + mailBSplitterBox.width / 2, mailBSplitterBox.y + mailBSplitterBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(mailBSplitterBox.x + 340, mailBSplitterBox.y + mailBSplitterBox.height / 2);
  await page.mouse.up();

  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'ABC');
  await expect(mailReaderPane).toBeVisible();

  const mailBSplitterBoxAfterSoftDrag = await mailBSplitter.boundingBox();
  await page.mouse.move(mailBSplitterBoxAfterSoftDrag.x + mailBSplitterBoxAfterSoftDrag.width / 2, mailBSplitterBoxAfterSoftDrag.y + mailBSplitterBoxAfterSoftDrag.height / 2);
  await page.mouse.down();
  await page.mouse.move(mailBSplitterBoxAfterSoftDrag.x + 470, mailBSplitterBoxAfterSoftDrag.y + mailBSplitterBoxAfterSoftDrag.height / 2);
  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'AB');
  await page.mouse.up();

  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'AB');
  await expect(mailReaderPane).toHaveCount(0);
  await expect(mailBSplitter).toBeVisible();
  await expect.poll(async () => Math.round((await mailListPane.boundingBox()).width)).toBeGreaterThan(1200);
  await expect(mailListPane).toHaveAttribute('data-mail-list-mode', 'table');
  await expect(mailView.locator('[data-mail-wide-list-header="true"]')).toBeVisible();
  const firstWideRow = mailView.locator('[data-mail-list-card="m1"]');
  await expect(firstWideRow).toHaveAttribute('data-mail-row-mode', 'table');
  await expect(firstWideRow.locator('[data-mail-wide-column="sender"]')).toContainText('产品经理');
  await expect(firstWideRow.locator('[data-mail-wide-column="sender"]')).not.toContainText('@');
  await expect(firstWideRow.locator('[data-mail-wide-column="subject"]')).toContainText('Q2 路线评审材料已更新');
  const firstWideStatus = firstWideRow.locator('[data-mail-wide-column="status"]');
  await expect(firstWideStatus).not.toContainText('附件 1');
  await expect(firstWideStatus).not.toContainText('关联日程');
  await expect(firstWideStatus.getByLabel('未读邮件')).toBeVisible();
  await expect(firstWideStatus.getByLabel('旗标邮件')).toBeVisible();
  await expect(firstWideStatus.getByLabel('含 1 个附件')).toBeVisible();
  await expect(firstWideStatus.getByLabel('关联日程')).toHaveCount(0);
  await expect(firstWideRow.locator('[data-mail-wide-column="time"]')).toContainText('09:20');
  const selectedActions = mailView.locator('[data-mail-selected-actions="true"]');
  await expect(selectedActions).toBeVisible();
  await expect(selectedActions.getByRole('button', { name: '标为已读' })).toBeVisible();
  await expect(selectedActions.getByRole('button', { name: '取消旗标' })).toBeVisible();
  await expect(selectedActions.getByRole('button', { name: '归档邮件' })).toBeVisible();
  await expect(selectedActions.getByRole('button', { name: '删除邮件' })).toBeVisible();
  const senderColumnWidthBefore = Math.round((await firstWideRow.locator('[data-mail-wide-column="sender"]').boundingBox()).width);
  const senderColumnResizer = mailView.locator('[data-mail-column-resizer="sender"]');
  await expect(senderColumnResizer).toBeVisible();
  const senderColumnResizerBox = await senderColumnResizer.boundingBox();
  await page.mouse.move(senderColumnResizerBox.x + senderColumnResizerBox.width / 2, senderColumnResizerBox.y + senderColumnResizerBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(senderColumnResizerBox.x + 48, senderColumnResizerBox.y + senderColumnResizerBox.height / 2);
  await page.mouse.up();
  await expect.poll(async () => Math.round((await firstWideRow.locator('[data-mail-wide-column="sender"]').boundingBox()).width)).toBeGreaterThan(senderColumnWidthBefore + 24);
  await firstWideRow.hover();
  const firstWideActions = firstWideRow.locator('[data-mail-hover-actions="true"]');
  await expect(firstWideRow.getByRole('button', { name: '取消旗标' })).toHaveAttribute('data-mail-flag-icon-mode', 'filled');
  await expect
    .poll(() =>
      firstWideActions.evaluate((node) =>
        Array.from(node.querySelectorAll('button'))
          .map((button) => button.getAttribute('aria-label'))
          .join('|'),
      ),
    )
    .toBe('标为已读|取消旗标|删除邮件');
  await firstWideRow.getByRole('button', { name: '取消旗标' }).focus();
  await page.mouse.move(1500, 120);
  await expect
    .poll(() => firstWideActions.evaluate((node) => window.getComputedStyle(node).opacity))
    .toBe('0');
  await firstWideRow.click();
  await expect(firstWideRow.locator('[data-mail-read-state="read"]')).toBeVisible();
  await firstWideRow.hover();
  await expect
    .poll(() =>
      firstWideActions.evaluate((node) =>
        Array.from(node.querySelectorAll('button'))
          .map((button) => button.getAttribute('aria-label'))
          .join('|'),
      ),
    )
    .toBe('标为未读|取消旗标|删除邮件');
  await firstWideRow.click({ button: 'right' });
  const wideContextMenu = mailView.locator('[data-mail-context-menu="true"]');
  await expect(wideContextMenu).toBeVisible();
  await expect
    .poll(() =>
      wideContextMenu.evaluate((node) =>
        Array.from(node.querySelectorAll('[role="menuitem"]'))
          .map((button) => button.textContent.trim())
          .slice(0, 3)
          .join('|'),
      ),
    )
    .toBe('标为未读|取消旗标|删除邮件');
  await page.keyboard.press('Escape');
  const mailBRestoreSplitterBox = await mailBSplitter.boundingBox();
  await page.mouse.move(mailBRestoreSplitterBox.x + mailBRestoreSplitterBox.width / 2, mailBRestoreSplitterBox.y + mailBRestoreSplitterBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(mailBRestoreSplitterBox.x - 560, mailBRestoreSplitterBox.y + mailBRestoreSplitterBox.height / 2);
  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'ABC');
  await page.mouse.up();
  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'ABC');
  await expect(mailReaderPane).toBeVisible();

  const mailBSplitterBoxForListMode = await mailBSplitter.boundingBox();
  await page.mouse.move(mailBSplitterBoxForListMode.x + mailBSplitterBoxForListMode.width / 2, mailBSplitterBoxForListMode.y + mailBSplitterBoxForListMode.height / 2);
  await page.mouse.down();
  await page.mouse.move(mailBSplitterBoxForListMode.x + 520, mailBSplitterBoxForListMode.y + mailBSplitterBoxForListMode.height / 2);
  await page.mouse.up();
  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'AB');
  await firstWideRow.dblclick();
  const listDetailPage = mailView.locator('[data-mail-list-detail-page="true"]');
  await expect(listDetailPage).toBeVisible();
  await expect(listDetailPage.getByRole('heading', { name: 'Q2 路线评审材料已更新' })).toBeVisible();
  await expect(mailView.locator('[data-mail-wide-list-header="true"]')).toHaveCount(0);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await listDetailPage.getByRole('button', { name: '返回邮件列表' }).click();
  await expect(mailView.locator('[data-mail-wide-list-header="true"]')).toBeVisible();
  await expect(mailView.getByRole('button', { name: '显示阅读区' })).toBeVisible();
  await mailView.getByRole('button', { name: '显示阅读区' }).click();
  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'ABC');
  await expect(mailReaderPane).toBeVisible();
  await expect.poll(async () => Math.round((await mailReaderPane.boundingBox()).width)).toBeGreaterThanOrEqual(720);
});

test('mail layout keeps reader width by collapsing A column on narrow desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1159, height: 860 });
  await page.goto('/');

  const mailView = page.locator('[data-mail-workspace="true"]');
  const mailSidebar = page.locator('[data-app-sidebar="mail"]');
  const mailListPane = page.locator('[data-mail-list-pane="true"]');
  const mailReaderPane = page.locator('[data-mail-reader-region="true"]');

  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'ABC');
  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBe(64);
  await expect.poll(async () => Math.round((await mailListPane.boundingBox()).width)).toBeGreaterThanOrEqual(360);
  await expect.poll(async () => Math.round((await mailReaderPane.boundingBox()).width)).toBeGreaterThanOrEqual(720);
  await expect(page.locator('[data-layout-resizer="mail-a"]')).toHaveCount(0);
  await expect(page.locator('[data-layout-resizer="mail-b"]')).toBeVisible();
});

test('mail manually collapsed A column can be dragged back open', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 900 });
  await page.goto('/');

  const mailView = page.locator('[data-mail-workspace="true"]');
  const mailSidebar = page.locator('[data-app-sidebar="mail"]');

  await mailSidebar.getByRole('button', { name: '收起侧边栏' }).click();
  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBe(64);

  const mailASplitter = page.locator('[data-layout-resizer="mail-a"]');
  await expect(mailASplitter).toBeVisible();

  const mailASplitterBox = await mailASplitter.boundingBox();
  await page.mouse.move(mailASplitterBox.x + mailASplitterBox.width / 2, mailASplitterBox.y + mailASplitterBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(mailASplitterBox.x + 220, mailASplitterBox.y + mailASplitterBox.height / 2);
  await page.mouse.up();

  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBeGreaterThanOrEqual(240);
  await expect(mailSidebar.getByRole('button', { name: '收起侧边栏' })).toBeVisible();
  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'ABC');
});

test('mail A column uses mac-style drag collapse and expand thresholds', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 900 });
  await page.goto('/');

  const mailView = page.locator('[data-mail-workspace="true"]');
  const mailSidebar = page.locator('[data-app-sidebar="mail"]');
  const mailASplitter = page.locator('[data-layout-resizer="mail-a"]');

  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBe(320);
  const mailASplitterBox = await mailASplitter.boundingBox();
  await page.mouse.move(mailASplitterBox.x + mailASplitterBox.width / 2, mailASplitterBox.y + mailASplitterBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(mailASplitterBox.x - 220, mailASplitterBox.y + mailASplitterBox.height / 2);
  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBe(64);
  await page.mouse.up();

  await expect(mailSidebar.getByRole('button', { name: '展开侧边栏' })).toBeVisible();
  await expect(mailASplitter).toBeVisible();
  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'ABC');

  const collapsedSplitterBox = await mailASplitter.boundingBox();
  await page.mouse.move(collapsedSplitterBox.x + collapsedSplitterBox.width / 2, collapsedSplitterBox.y + collapsedSplitterBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(collapsedSplitterBox.x + 220, collapsedSplitterBox.y + collapsedSplitterBox.height / 2);
  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBeGreaterThanOrEqual(240);
  await page.mouse.up();

  await expect(mailSidebar.getByRole('button', { name: '收起侧边栏' })).toBeVisible();
  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'ABC');
});

test('mail A column expands from auto-collapsed narrow desktop into pure list mode', async ({ page }) => {
  await page.setViewportSize({ width: 1159, height: 860 });
  await page.goto('/');

  const mailView = page.locator('[data-mail-workspace="true"]');
  const mailSidebar = page.locator('[data-app-sidebar="mail"]');
  const mailListPane = page.locator('[data-mail-list-pane="true"]');
  const mailReaderPane = page.locator('[data-mail-reader-region="true"]');

  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBe(64);
  await mailSidebar.getByRole('button', { name: '展开侧边栏' }).click();
  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBeGreaterThanOrEqual(240);
  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'AB');
  await expect(mailReaderPane).toHaveCount(0);
  await expect(mailListPane).toHaveAttribute('data-mail-list-mode', 'table');
  await expect(mailView.locator('[data-mail-wide-list-header="true"]')).toBeVisible();
  await expect(page.locator('[data-layout-resizer="mail-a"]')).toBeVisible();
  await expect(mailView.locator('[data-mail-list-card="m1"]')).toHaveAttribute('data-mail-row-mode', 'table');

  await mailSidebar.getByRole('button', { name: '收起侧边栏' }).click();
  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBe(64);
  await expect(mailView).toHaveAttribute('data-mail-layout-mode', 'ABC');
  await expect(mailReaderPane).toBeVisible();
  await expect(mailListPane).toHaveAttribute('data-mail-list-mode', 'compact');
});

test('mail workspace uses a focused inbox layout', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 900 });
  await page.goto('/');

  const mailView = page.locator('[data-mail-workspace="true"]');
  await expect(mailView).toBeVisible();
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.locator('[data-mail-sidebar-brand="true"]').getByText('Coremail')).toBeVisible();
  await expect(page.locator('[data-mail-sidebar-compose="true"]').getByText('写邮件')).toBeVisible();
  await expect(mailView.getByRole('button', { name: '写邮件' })).toHaveCount(0);
  const mailSidebar = page.locator('[data-app-sidebar="mail"]');
  const mailProductDock = mailSidebar.locator('[data-app-sidebar-product-dock="true"]');
  await expect(mailSidebar).toBeVisible();
  await expect(mailProductDock).toBeVisible();
  await expect
    .poll(() => page.locator('[data-mail-sidebar-brand="true"]').evaluate((node) => window.getComputedStyle(node.parentElement).paddingLeft))
    .toBe('24px');
  await expect
    .poll(() => page.locator('[data-mail-list-toolbar="true"]').evaluate((node) => window.getComputedStyle(node.parentElement).paddingLeft))
    .toBe('24px');
  await expect
    .poll(async () => Math.round((await mailSidebar.boundingBox()).width))
    .toBeGreaterThanOrEqual(240);
  await expect
    .poll(async () => Math.round((await mailSidebar.boundingBox()).width))
    .toBeLessThanOrEqual(320);
  await expect.poll(() => mailProductDock.evaluate((node) => window.getComputedStyle(node).borderTopWidth)).toBe('0px');
  await expect
    .poll(async () => {
      const sidebarBox = await mailSidebar.boundingBox();
      const dockBox = await mailProductDock.boundingBox();
      return Math.round(sidebarBox.y + sidebarBox.height - (dockBox.y + dockBox.height));
    })
    .toBe(0);
  await expect(page.locator('[data-mail-favorites="true"]').getByText('收藏夹')).toBeVisible();
  await expect(page.locator('[data-mail-favorite="inbox-acc1"]').getByText('收件箱 · me@calendarpro.io')).toBeVisible();
  await expect(page.locator('[data-mail-favorite="drafts"]').getByText('草稿')).toBeVisible();
  await expect(page.getByText('共享邮箱')).toHaveCount(0);
  await expect(page.getByText('华为日历')).toHaveCount(0);
  await expect(page.locator('[data-product-tab="mail"]').first()).toHaveClass(/text-slate-950/);
  await expect(page.locator('[data-product-tab="calendar"]').first()).toHaveClass(/text-slate-500/);
  const primaryMailbox = page.locator('[data-mailbox-id="acc1"]');
  await expect(primaryMailbox).toBeVisible();
  await expect(primaryMailbox.getByText('小华')).toHaveCount(0);
  await expect(primaryMailbox.getByText('me@calendarpro.io')).toBeVisible();
  await expect(primaryMailbox).not.toHaveClass(/bg-white/);
  await expect(primaryMailbox.locator('[data-mailbox-folder="inbox"]').getByText('收件箱')).toBeVisible();
  await expect(primaryMailbox.locator('[data-mailbox-folder="unread"]').getByText('未读邮件')).toBeVisible();
  await expect(primaryMailbox.locator('[data-mailbox-folder="flagged"]').getByText('旗标邮件')).toBeVisible();
  await expect(primaryMailbox.locator('[data-mailbox-folder="drafts"]').getByText('草稿')).toBeVisible();
  await expect(primaryMailbox.locator('[data-mailbox-folder="deleted"]').getByText('已删除邮件')).toBeVisible();
  await expect(primaryMailbox.locator('[data-mailbox-folder="junk"]').getByText('垃圾邮件')).toBeVisible();
  await expect(primaryMailbox.locator('[data-mailbox-folder="outbox"]').getByText('发件箱')).toBeVisible();
  await expect(primaryMailbox.locator('[data-mailbox-folder="conversation"]').getByText('对话历史记录')).toBeVisible();
  await expect(page.getByText('我的日历')).toHaveCount(0);
  await expect(mailView.locator('[data-mail-list-toolbar="true"]')).toBeVisible();
  await expect(mailView.locator('[data-mail-reader-window-controls="true"]')).toBeVisible();
  await expect(mailView.getByRole('button', { name: '全部', exact: true })).toBeVisible();
  await expect(mailView.getByRole('heading', { name: '收件箱' })).toBeVisible();
  await expect(mailView.getByPlaceholder('搜索邮件')).toBeVisible();
  await expect(mailView.getByRole('button', { name: '高级' })).toBeVisible();
  await expect(mailView.getByRole('button', { name: '刷新邮件' })).toBeVisible();
  await expect(mailView.getByRole('button', { name: '多选邮件' })).toBeVisible();
  await expect(mailView.getByRole('button', { name: '筛选邮件' })).toBeVisible();
  await expect(mailView.getByRole('button', { name: '邮件排序' })).toHaveCount(0);
  await expect(mailView.getByRole('button', { name: '重点' })).toHaveCount(0);
  await expect(mailView.getByRole('button', { name: '其他' })).toHaveCount(0);
  await expect(mailView.locator('[data-mail-ai-classifier="compact"]')).toHaveCount(0);
  await expect(mailView.getByText('智能标记已开启')).toHaveCount(0);
  const mailSearchInput = mailView.getByPlaceholder('搜索邮件');
  await mailSearchInput.fill('申诉截止时间');
  await expect(mailView.locator('[data-mail-list-summary="true"]')).toContainText('搜索到 1 封邮件');
  await expect(mailView.locator('[data-mail-list-card="m35"]')).toBeVisible();
  await expect(mailView.locator('[data-mail-list-card="m1"]')).toHaveCount(0);
  await expect(mailView.getByRole('heading', { name: '绩效考核结果公示' })).toBeVisible();
  await mailSearchInput.fill('不存在的邮件关键词');
  const mailEmptyState = mailView.locator('[data-mail-empty-state="true"]');
  await expect(mailEmptyState).toContainText('没有找到与“不存在的邮件关键词”相关的邮件');
  await expect(mailEmptyState.getByRole('button', { name: '清除搜索' })).toBeVisible();
  await mailEmptyState.getByRole('button', { name: '清除搜索' }).click();
  await expect(mailSearchInput).toHaveValue('');
  await page.mouse.move(1, 1);
  await expect(mailView.locator('[data-mail-list-card="m1"]')).toBeVisible();
  await mailView.getByRole('button', { name: '筛选邮件' }).click();
  const mailFilterMenu = mailView.locator('[data-mail-filter-menu="true"]');
  await expect(mailFilterMenu).toBeVisible();
  await expect(mailFilterMenu.getByRole('menuitemradio', { name: '全部' })).toBeVisible();
  await expect(mailFilterMenu.getByRole('menuitemradio', { name: '未读' })).toBeVisible();
  await expect(mailFilterMenu.getByRole('menuitemradio', { name: '已标记' })).toBeVisible();
  await expect(mailFilterMenu.getByRole('menuitemradio', { name: '带附件' })).toBeVisible();
  await expect(mailFilterMenu.getByRole('menuitemradio', { name: '高重要性' })).toBeVisible();
  await expect(mailFilterMenu.getByRole('menuitemradio', { name: '日期：从新到旧' })).toBeVisible();
  await page.keyboard.press('Escape');
  await mailView.getByRole('button', { name: '多选邮件' }).click();
  await expect(mailView.locator('[data-mail-selection-bar="true"]')).toContainText('已选中 1 封邮件');
  await expect(mailView.locator('[data-mail-list-card="m1"]').getByRole('checkbox', { name: '选择邮件：Q2 路线评审材料已更新' })).toBeChecked();
  const secondBatchCard = mailView.locator('[data-mail-list-card="m35"]');
  await secondBatchCard.scrollIntoViewIfNeeded();
  await secondBatchCard.getByRole('checkbox', { name: '选择邮件：绩效考核结果公示' }).click();
  await expect(mailView.locator('[data-mail-selection-bar="true"]')).toContainText('已选中 2 封邮件');
  const bulkReader = mailView.locator('[data-mail-bulk-reader="true"]');
  await expect(bulkReader).toBeVisible();
  await expect(bulkReader.locator('[data-mail-stack-card="true"]')).toHaveCount(2);
  await expect(bulkReader.getByText('Q2 路线评审材料已更新')).toBeVisible();
  await expect(bulkReader.getByText('绩效考核结果公示')).toBeVisible();
  await expect(bulkReader.getByRole('button', { name: '批量标为已读' })).toBeVisible();
  await expect(bulkReader.getByRole('button', { name: '批量删除' })).toBeVisible();
  await mailView.getByRole('button', { name: '退出多选' }).click();
  await page.mouse.move(1500, 120);
  await expect(mailView.locator('[data-mail-selection-bar="true"]')).toHaveCount(0);
  await expect(mailView.locator('[data-mail-bulk-reader="true"]')).toHaveCount(0);
  const firstMailCard = mailView.locator('[data-mail-list-card="m1"]');
  await expect(firstMailCard).toBeVisible();
  await expect
    .poll(() =>
      firstMailCard.evaluate(
        (card) => card.className.includes('bg-[#0A59F7]/10') && card.className.includes('ring-[#0A59F7]/30'),
      ),
    )
    .toBe(true);
  await expect.poll(async () => Math.round((await firstMailCard.boundingBox()).height)).toBeLessThan(84);
  await expect(firstMailCard.locator('[data-mail-account-inline="true"]')).toHaveCount(0);
  const todayTimelineLabel = mailView.locator('[data-mail-timeline-label="true"]').filter({ hasText: '今天' }).first();
  await expect(todayTimelineLabel).toBeVisible();
  await expect(mailView.locator('[data-mail-timeline-label="true"]').filter({ hasText: '昨天' })).toHaveCount(1);
  await expect.poll(() => todayTimelineLabel.evaluate((node) => window.getComputedStyle(node).fontSize)).toBe('14px');
  await expect.poll(() => todayTimelineLabel.evaluate((node) => node.className.includes('text-slate-600'))).toBe(true);
  await expect(firstMailCard.locator('[data-mail-avatar-image="true"]')).toHaveCount(0);
  await expect(firstMailCard.locator('[data-mail-row-content="true"]')).toBeVisible();
  await expect(firstMailCard.locator('[data-mail-read-state="unread"]')).toBeVisible();
  await expect
    .poll(() =>
      firstMailCard.locator('[data-mail-read-state="unread"]').evaluate((node) => window.getComputedStyle(node).backgroundColor),
    )
    .toBe('rgb(10, 89, 247)');
  await expect
    .poll(() =>
      firstMailCard.evaluate((card) => {
        const readState = card.querySelector('[data-mail-read-state="unread"]');
        const content = card.querySelector('[data-mail-row-content="true"]');
        return readState.getBoundingClientRect().right < content.getBoundingClientRect().left;
      }),
    )
    .toBe(true);
  const senderMarkers = firstMailCard.locator('[data-mail-sender-markers="true"]');
  await expect(senderMarkers.getByLabel('旗标邮件')).toBeVisible();
  await expect(senderMarkers.getByLabel('含 1 个附件')).toBeVisible();
  await expect(senderMarkers.getByLabel('关联日程')).toHaveCount(0);
  await expect(senderMarkers).not.toContainText('重要');
  await expect(senderMarkers).not.toContainText('附件');
  await expect(firstMailCard.locator('[data-mail-title-time="true"]').getByLabel('关联日程')).toBeVisible();
  await expect(firstMailCard.locator('[data-mail-title-time="true"]').getByText('01/09 09:20')).toHaveCount(0);
  await expect(firstMailCard.locator('[data-mail-timestamp="true"]')).toHaveText('09:20');
  await expect.poll(() => firstMailCard.locator('[data-mail-timestamp="true"]').evaluate((node) => window.getComputedStyle(node).fontSize)).toBe('12px');
  await expect.poll(() => firstMailCard.locator('[data-mail-timestamp="true"]').evaluate((node) => node.className.includes('text-slate-500'))).toBe(true);
  await expect(firstMailCard.locator('[data-mail-preview="true"]')).toBeVisible();
  await expect
    .poll(() =>
      firstMailCard.evaluate((card) => {
        const content = card.querySelector('[data-mail-row-content="true"]');
        const preview = card.querySelector('[data-mail-preview="true"]');
        return Math.round(content.getBoundingClientRect().right - preview.getBoundingClientRect().right);
      }),
    )
    .toBeLessThanOrEqual(1);
  await expect
    .poll(() =>
      firstMailCard.evaluate((card) => {
        const timestamp = card.querySelector('[data-mail-timestamp="true"]');
        return Math.round(card.getBoundingClientRect().right - timestamp.getBoundingClientRect().right);
      }),
    )
    .toBeLessThanOrEqual(16);
  await expect(firstMailCard.locator('[data-mail-list-tags="true"]')).toHaveCount(0);
  const readMailCard = mailView.locator('[data-mail-list-card="m35"]');
  await readMailCard.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      readMailCard.evaluate((card) => {
        const sender = card.querySelector('[data-mail-sender-name="true"]');
        const title = card.querySelector('[data-mail-title-text="true"]');
        const senderStyle = window.getComputedStyle(sender);
        const titleStyle = window.getComputedStyle(title);
        return senderStyle.color === titleStyle.color && senderStyle.fontWeight === titleStyle.fontWeight;
      }),
    )
    .toBe(true);
  await expect
    .poll(() =>
      readMailCard.locator('[data-mail-sender-name="true"]').evaluate((node) => window.getComputedStyle(node).fontWeight),
    )
    .toBe('900');
  await firstMailCard.scrollIntoViewIfNeeded();
  await firstMailCard.hover();
  await expect
    .poll(() =>
      firstMailCard.locator('[data-mail-hover-actions="true"]').evaluate((node) => window.getComputedStyle(node).opacity),
    )
    .toBe('1');
  await expect
    .poll(() =>
      firstMailCard.locator('[data-mail-hover-actions="true"]').evaluate((node) => window.getComputedStyle(node).backgroundColor),
    )
    .toBe('rgb(255, 255, 255)');
  await expect
    .poll(() =>
      firstMailCard.getByRole('button', { name: '删除邮件' }).evaluate((node) => node.className.includes('text-slate-900')),
    )
    .toBe(true);
  await expect(firstMailCard.getByRole('button', { name: '删除邮件' })).toBeVisible();
  await expect(firstMailCard.getByRole('button', { name: '取消旗标' })).toBeVisible();
  await expect(firstMailCard.getByRole('button', { name: '取消旗标' })).toHaveAttribute('data-mail-flag-icon-mode', 'filled');
  await expect(firstMailCard.getByRole('button', { name: '标为已读' })).toBeVisible();
  await expect
    .poll(() =>
      firstMailCard.locator('[data-mail-hover-actions="true"]').evaluate((node) =>
        Array.from(node.querySelectorAll('button'))
          .map((button) => button.getAttribute('aria-label'))
          .join('|'),
      ),
    )
    .toBe('标为已读|取消旗标|删除邮件');
  await firstMailCard.getByRole('button', { name: '取消旗标' }).focus();
  await page.mouse.move(1500, 120);
  await expect
    .poll(() => firstMailCard.locator('[data-mail-hover-actions="true"]').evaluate((node) => window.getComputedStyle(node).opacity))
    .toBe('0');
  await firstMailCard.click({ button: 'right' });
  const mailContextMenu = mailView.locator('[data-mail-context-menu="true"]');
  await expect(mailContextMenu).toBeVisible();
  await expect
    .poll(() =>
      mailContextMenu.evaluate((node) =>
        Array.from(node.querySelectorAll('[role="menuitem"]'))
          .map((button) => button.textContent.trim())
          .slice(0, 3)
          .join('|'),
      ),
    )
    .toBe('标为已读|取消旗标|删除邮件');
  await expect(mailContextMenu.getByRole('menuitem', { name: '删除邮件' })).toBeVisible();
  await page.keyboard.press('Escape');
  await firstMailCard.hover();
  await firstMailCard.getByRole('button', { name: '删除邮件' }).click();
  await expect(mailView.locator('[data-mail-list-card="m1"]')).toHaveCount(0);
  await expect(page.getByText('邮件已删除')).toBeVisible();
  await page.getByRole('button', { name: '撤销删除邮件' }).click();
  await expect(mailView.locator('[data-mail-list-card="m1"]')).toBeVisible();
  const readerToolbar = mailView.locator('[data-mail-reader-toolbar="true"]');
  const readerToolbarActions = readerToolbar.locator('[data-mail-reader-toolbar-actions="true"]');
  await expect(readerToolbar).toBeVisible();
  await expect(readerToolbarActions).toBeVisible();
  await expect.poll(() => readerToolbar.evaluate((node) => window.getComputedStyle(node).flexWrap)).toBe('nowrap');
  await expect.poll(() => readerToolbarActions.evaluate((node) => window.getComputedStyle(node).overflowX)).toBe('hidden');
  await expect(readerToolbarActions.getByRole('button', { name: '更多邮件操作' })).toHaveCount(0);
  const readerMoreButton = readerToolbar.getByRole('button', { name: '更多邮件操作' });
  await expect(readerMoreButton).toBeVisible();
  await expect(readerMoreButton).toHaveText('');
  await expect
    .poll(() =>
      mailView.locator('[data-mail-reader-window-controls="true"]').evaluate((node) =>
        Array.from(node.querySelectorAll('button'))
          .map((button) => button.getAttribute('aria-label'))
          .join('|'),
      ),
    )
    .toBe('客服帮助|最小化窗口|全屏窗口|关闭窗口');
  await readerMoreButton.click();
  const readerMoreMenu = readerToolbar.locator('[data-mail-reader-more-menu="true"]');
  await expect(readerMoreMenu).toBeVisible();
  await expect(readerMoreMenu.getByRole('menuitem', { name: '回复', exact: true })).toBeVisible();
  await expect(readerMoreMenu.getByRole('menuitem', { name: '回复全部' })).toBeVisible();
  await expect(readerMoreMenu.getByRole('menuitem', { name: '转发' })).toBeVisible();
  await expect(readerMoreMenu.getByRole('menuitem', { name: '标为已读' })).toBeVisible();
  await expect(readerMoreMenu.getByRole('menuitem', { name: '标记旗标' })).toBeVisible();
  await expect(readerMoreMenu.getByRole('menuitem', { name: '归档', exact: true })).toBeVisible();
  await expect(readerMoreMenu.getByRole('menuitem', { name: '删除' })).toBeVisible();
  await expect(readerMoreMenu.getByRole('menuitem', { name: '移动到归档' })).toBeVisible();
  await expect(readerMoreMenu.getByRole('menuitem', { name: '生成日程' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(readerMoreMenu).toHaveCount(0);
  await expect(readerToolbarActions.getByRole('button', { name: '回复', exact: true })).toBeVisible();
  await expect(readerToolbarActions.getByRole('button', { name: '回复全部' })).toBeVisible();
  await expect(readerToolbarActions.getByRole('button', { name: '转发' })).toBeVisible();
  await expect(readerToolbarActions.getByRole('button', { name: '归档' })).toBeVisible();
  await expect(readerToolbarActions.getByRole('button', { name: '标为已读' })).toBeVisible();
  await expect(readerToolbarActions.getByRole('button', { name: '标记旗标' })).toBeVisible();
  await expect(readerToolbarActions.getByRole('button', { name: '删除' })).toBeVisible();
  await expect(readerToolbarActions.getByRole('button', { name: '移动' })).toHaveCount(0);
  await expect(mailView.getByRole('heading', { name: 'Q2 路线评审材料已更新' })).toBeVisible();
  const readerSenderMeta = mailView.locator('[data-mail-reader-sender-meta="true"]');
  await expect(readerSenderMeta).toContainText('产品经理');
  await expect(readerSenderMeta).toContainText('01/09 09:20');
  await expect(readerSenderMeta).not.toContainText('小华');
  await expect(readerSenderMeta.locator('[data-mail-avatar-image="true"]')).toHaveCount(0);
  await expect(mailView.getByText('Q2_路线评审_v4.pptx', { exact: true })).toBeVisible();
});

test('mail AI assistant supports message insights and a create-event style composer', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 900 });
  await page.goto('/');

  const mailView = page.locator('[data-mail-workspace="true"]');
  await expect(mailView.locator('[data-mail-ai-classifier="compact"]')).toHaveCount(0);
  await expect(mailView.getByText('AI 邮件助手')).toBeVisible();
  await expect(mailView.getByText('AI 摘要')).toBeVisible();
  await expect(mailView.getByText('待处理事项', { exact: true })).toBeVisible();
  await expect(mailView.getByText('快速回复建议')).toBeVisible();
  await expect(mailView.getByRole('button', { name: '确认明天下午一起过一遍' })).toBeVisible();

  await page.locator('[data-mail-sidebar-compose="true"]').click();
  const composer = page.getByRole('dialog', { name: '写邮件' });
  await expect(composer).toBeVisible();
  const composerWindow = composer.locator('[data-mail-composer-window="true"]');
  await expect(composerWindow).toBeVisible();
  await expect.poll(async () => (await composerWindow.boundingBox()).width).toBeGreaterThan(900);
  await expect(composer.locator('[data-mail-composer-actionbar="true"]')).toBeVisible();
  await expect(composer.getByRole('button', { name: '发送' })).toBeVisible();
  await expect(composer.getByRole('button', { name: '保存' })).toBeVisible();
  await expect(composer.getByRole('button', { name: '附件' })).toBeVisible();
  await expect(composer.getByRole('button', { name: '加密' })).toBeVisible();
  await expect(composer.getByRole('button', { name: '检查收件人' })).toBeVisible();
  await expect(composer.getByRole('button', { name: '签名' })).toBeVisible();
  await expect(composer.locator('[data-mail-composer-format-toolbar="true"]')).toBeVisible();
  await expect(composer.getByLabel('发件邮箱')).toBeVisible();
  await expect(composer.getByText('自动保存')).toBeVisible();
  await expect(composer.getByPlaceholder('主题')).toBeVisible();
  await expect(composer.getByText('收件人', { exact: true })).toBeVisible();
  await composer.getByPlaceholder('输入收件人邮箱，按 Enter 添加').fill('reviewer@calendarpro.io');
  await composer.getByPlaceholder('输入收件人邮箱，按 Enter 添加').press('Enter');
  await expect(composer.getByText('reviewer@calendarpro.io')).toBeVisible();
  await expect(composer.getByText('常用联系人', { exact: true })).toHaveCount(0);
  await expect(composer.getByText('AI 写作助手')).toBeVisible();
  await expect(composer.getByText('基于正文生成')).toBeVisible();
  await expect(composer.getByRole('button', { name: '润色表达' })).toBeVisible();
  await expect(composer.getByRole('button', { name: '更正式' })).toBeVisible();
  await expect(composer.getByRole('button', { name: '生成标题' })).toBeVisible();
  await composer.getByRole('button', { name: '附件' }).click();
  await expect(composer.locator('[data-mail-attachment-menu="true"]')).toBeVisible();
  await expect(composer.getByRole('menuitem', { name: '添加本地附件' })).toBeVisible();
  await expect(composer.getByRole('menuitem', { name: '添加云空间附件' })).toBeVisible();
  await expect(composer.getByRole('menuitem', { name: '大附件管理' })).toBeVisible();
  await composer.getByRole('menuitem', { name: '添加本地附件' }).click();
  await expect(composer.getByText('附件_1.pdf')).toBeVisible();
  await composer.getByRole('button', { name: '重要性 普通' }).click();
  await expect(composer.locator('[data-mail-importance-menu="true"]')).toBeVisible();
  await composer.getByRole('menuitemradio', { name: '高' }).click();
  await expect(composer.getByRole('button', { name: '重要性 高' })).toBeVisible();
  await composer.getByRole('button', { name: '更多写信设置' }).click();
  await expect(composer.locator('[data-mail-composer-more-menu="true"]')).toBeVisible();
  await expect(composer.getByRole('menuitem', { name: '定时发送' })).toBeVisible();
  await expect(composer.getByRole('menuitem', { name: '标头栏设置' })).toBeVisible();
  await composer.getByRole('menuitem', { name: '密送' }).click();
  await expect(composer.getByText('密送', { exact: true })).toBeVisible();
  await composer.getByPlaceholder('输入邮件正文...').fill('明天下午可以，一起过一下材料。');
  await composer.getByRole('button', { name: '更正式' }).click();
  await expect(composer.getByText('已生成更正式版本')).toBeVisible();
  await composer.getByRole('button', { name: '替换正文' }).click();
  await expect(composer.getByPlaceholder('输入邮件正文...')).toHaveValue(/您好/);
  await expect(composer.getByRole('button', { name: '保存' })).toBeVisible();
  await expect(composer.getByRole('button', { name: '发送' })).toBeVisible();
});

test('mail reading pane surfaces enterprise body states and interactions', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 900 });
  await page.goto('/');

  const mailView = page.locator('[data-mail-workspace="true"]');
  const reader = mailView.locator('[data-mail-reading-pane="true"]');
  await expect(reader).toBeVisible();
  await expect(reader.locator('[data-mail-reader-action-bar="true"]')).toBeVisible();
  await expect(reader.locator('[data-mail-reader-header="true"]')).toContainText('产品经理');
  await expect(reader.locator('[data-mail-recipient-summary="true"]')).toContainText('发给我');
  await expect(reader.locator('[data-mail-attachment-list="true"]')).toContainText('Q2_路线评审_v4.pptx');
  await expect(reader.locator('[data-mail-quick-reply="true"]')).toBeVisible();
  await expect(reader.locator('[data-mail-reader-action-bar="true"]').getByRole('button', { name: '归档' })).toBeVisible();
  await expect(reader.locator('[data-mail-reader-action-bar="true"]').getByRole('button', { name: '移动' })).toHaveCount(0);
  await expect.poll(() => reader.getByRole('heading', { name: 'Q2 路线评审材料已更新' }).evaluate((node) => window.getComputedStyle(node).fontSize)).toBe('24px');
  await expect.poll(() => reader.locator('[data-mail-body="true"]').evaluate((node) => window.getComputedStyle(node).fontSize)).toBe('14px');
  await expect
    .poll(() =>
      reader.evaluate((node) => {
        const attachment = node.querySelector('[data-mail-attachment-list="true"]');
        const body = node.querySelector('[data-mail-body="true"]');
        const assistant = node.querySelector('[data-mail-ai-assistant="true"]');
        if (!attachment || !body || !assistant) return false;
        return (
          attachment.getBoundingClientRect().top < assistant.getBoundingClientRect().top &&
          body.getBoundingClientRect().top < assistant.getBoundingClientRect().top
        );
      }),
    )
    .toBe(true);

  await reader.getByRole('button', { name: '查看收件人明细' }).click();
  await expect(reader.locator('[data-mail-recipient-details="true"]')).toContainText('To');
  await expect(reader.locator('[data-mail-recipient-details="true"]')).toContainText('Cc');

  await mailView.locator('[data-mail-list-card="m7"]').scrollIntoViewIfNeeded();
  await mailView.locator('[data-mail-list-card="m7"]').click();
  await expect(reader.locator('[data-mail-external-sender-badge="true"]')).toContainText('外部发件人');
  await expect(reader.locator('[data-mail-security-notice="true"]')).toContainText('邮件包含外部链接或敏感附件');
  await expect(reader.locator('[data-mail-attachment-card="att-m7-risk-html"]')).toContainText('高风险附件');
  await expect(reader.locator('[data-mail-attachment-card="att-m7-risk-html"]').getByRole('button', { name: '下载 代码审查报告.html' })).toBeDisabled();
  await expect
    .poll(() =>
      reader.evaluate((node) => {
        const attachment = node.querySelector('[data-mail-attachment-list="true"]');
        const security = node.querySelector('[data-mail-security-notice="true"]');
        if (!attachment || !security) return false;
        return attachment.getBoundingClientRect().top < security.getBoundingClientRect().top;
      }),
    )
    .toBe(true);

  await mailView.locator('[data-mail-list-card="m35"]').scrollIntoViewIfNeeded();
  await mailView.locator('[data-mail-list-card="m35"]').click();
  const warningAttachment = reader.locator('[data-mail-attachment-card="att-m35-warning-macro"]');
  await expect(warningAttachment).toContainText('有风险');
  await warningAttachment.getByRole('button', { name: '下载 绩效申诉材料宏.xlsm' }).click();
  const warningDownloadDialog = page.getByRole('dialog', { name: '确认下载风险附件' });
  await expect(warningDownloadDialog).toBeVisible();
  await expect(warningDownloadDialog).toContainText('绩效申诉材料宏.xlsm');
  await expect(page.getByText('附件下载中：绩效申诉材料宏.xlsm')).toHaveCount(0);
  await warningDownloadDialog.getByRole('button', { name: '继续下载' }).click();
  await expect(page.getByText('附件下载中：绩效申诉材料宏.xlsm')).toBeVisible();
  await expect(reader.getByRole('button', { name: '展开历史邮件' })).toBeVisible();
  await reader.getByRole('button', { name: '展开历史邮件' }).click();
  await expect(reader.locator('[data-mail-quoted-history="true"]')).toContainText('历史邮件');

  await mailView.locator('[data-mail-list-card="m40"]').scrollIntoViewIfNeeded();
  await mailView.locator('[data-mail-list-card="m40"]').click();
  const systemMailActionBar = reader.locator('[data-mail-reader-action-bar="true"]');
  await expect(systemMailActionBar.getByRole('button', { name: '回复', exact: true })).toBeDisabled();
  await expect(systemMailActionBar.getByRole('button', { name: '回复全部' })).toBeDisabled();
  await expect(systemMailActionBar.getByRole('button', { name: '转发' })).toBeEnabled();
  await expect(reader.locator('[data-mail-quick-reply-disabled="true"]')).toContainText('此邮件为系统通知，不支持直接回复。');

  await mailView.locator('[data-mail-list-card="m42"]').scrollIntoViewIfNeeded();
  await mailView.locator('[data-mail-list-card="m42"]').click();
  await expect(reader.locator('[data-mail-state-view="permissionDenied"]')).toHaveCount(0);
  await expect(reader.locator('[data-mail-body="true"]')).toContainText('经过团队持续努力');

  await mailView.locator('[data-mail-list-card="m50"]').scrollIntoViewIfNeeded();
  await mailView.locator('[data-mail-list-card="m50"]').click();
  await expect(reader.locator('[data-mail-state-view="loading"]')).toContainText('邮件内容加载中');

  await page.locator('[data-mailbox-id="acc1"] [data-mailbox-folder="archive"]').click();
  await mailView.locator('[data-mail-list-card="m56"]').scrollIntoViewIfNeeded();
  await mailView.locator('[data-mail-list-card="m56"]').click();
  await expect(reader.locator('[data-mail-state-view="deleted"]')).toContainText('该邮件已被删除');
});

test('calendar reminder modal clears events after joining', async ({ page }) => {
  await page.addInitScript(() => {
    window.__lastOpenedUrl = null;
    window.open = (url) => {
      window.__lastOpenedUrl = url;
      return null;
    };
  });

  await page.goto('/');
  await page.getByRole('button', { name: '日历' }).click();
  await page.getByRole('button', { name: '提醒' }).click();

  const dialog = page.getByRole('dialog', { name: '提醒' });
  const q4Reminder = dialog.locator('[data-reminder-event-id="q4-budget-review"]');
  const ongoingReminder = dialog.locator('[data-reminder-event-id="demo-all-day-10"]');
  const inviteNotice = dialog.locator('[data-reminder-notice-id="notice-meeting-invitation"]');
  const sharedNotice = dialog.locator('[data-reminder-notice-id="notice-shared-calendar"]');
  const eventUpdatedNotice = dialog.locator('[data-reminder-notice-id="notice-event-updated"]');
  const syncNotice = dialog.locator('[data-reminder-notice-id="notice-sync-finished"]');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-reminder-notice-id]')).toHaveCount(0);
  await expect(q4Reminder.getByText('Q4 预算评审会')).toBeVisible();
  await expect(inviteNotice).toHaveCount(0);
  await expect(sharedNotice).toHaveCount(0);
  await expect(eventUpdatedNotice).toHaveCount(0);
  await expect(syncNotice).toHaveCount(0);
  await ongoingReminder.getByText('渠道复盘与线索分配准备周').click();
  await expect(ongoingReminder.getByRole('button', { name: '加入会议' })).toBeVisible();
  await expect(q4Reminder.getByText('5 分钟后开始')).toBeVisible();
  await expect(q4Reminder.getByText('即将开始 · 5 分钟后开始')).toHaveCount(0);
  await expect(q4Reminder.getByText('日历：小华')).toHaveCount(0);
  await expect(q4Reminder.getByText('小华')).toHaveCount(0);
  await q4Reminder.getByText('Q4 预算评审会').click();
  await expect(q4Reminder.locator('[data-reminder-inline-actions="true"]')).toBeVisible();
  await expect(q4Reminder.locator('select')).toContainText('5 分钟后');
  await expect(q4Reminder.locator('select')).toContainText('1 小时后');
  await expect(q4Reminder.locator('select')).not.toContainText('2 小时后');
  await expect(q4Reminder.locator('select')).not.toContainText('开始时');
  await expect(q4Reminder.getByText('推迟', { exact: true })).toHaveCount(0);
  await expect(q4Reminder.getByRole('button', { name: '稍后提醒' })).toHaveCount(0);
  await expect(q4Reminder.getByRole('button', { name: '查看详情' })).toHaveCount(0);
  await expect(q4Reminder.getByRole('button', { name: '清除 Q4 预算评审会' })).toBeVisible();
  await expect(dialog.getByRole('button', { name: '全部清除' })).toBeVisible();
  await expect(dialog.getByRole('button', { name: '打开日程' })).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: '提醒设置' })).toBeVisible();
  await expect(dialog.getByText('双击日程查看详情')).toHaveCount(0);

  await q4Reminder.getByText('Q4 预算评审会').dblclick();
  await expect(dialog).toHaveCount(1);
  await expect(page.getByText('日历详情')).toBeVisible();
  await page.getByRole('button', { name: '关闭', exact: true }).click();
  await expect(dialog).toBeVisible();

  await q4Reminder.getByRole('button', { name: '加入会议' }).click();
  await expect.poll(() => page.evaluate(() => window.__lastOpenedUrl)).toContain('teams.microsoft.com');
  await expect(dialog.getByText('Q4 预算评审会')).toHaveCount(0);

  await dialog.getByRole('button', { name: '全部清除' }).click();
  const confirmDialog = page.getByRole('dialog', { name: '确认全部清除提醒' });
  await expect(confirmDialog).toBeVisible();
  await confirmDialog.getByLabel('下次不再提示').check();
  await confirmDialog.getByRole('button', { name: '全部清除' }).click();
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('coremail.reminderDismissAllSkipConfirm'))).toBe('true');
  await expect(dialog).toHaveCount(0);
});

test('calendar reminder settings control new event defaults', async ({ page }) => {
  await page.setViewportSize({ width: 960, height: 760 });
  await page.goto('/');

  await page.getByRole('button', { name: '设置' }).click();
  const settingsDialog = page.getByRole('dialog', { name: '设置中心' });
  await expect(settingsDialog).toBeVisible();
  await expect(settingsDialog.getByRole('heading', { name: '日历提醒' })).toBeVisible();
  await expect(settingsDialog.getByText('设置提醒弹窗，以及你新建日程、别人邀请你参会时的默认提醒时间。')).toHaveCount(0);
  await expect(settingsDialog.getByText('会议未结束时，到点会弹出提醒。')).toBeVisible();
  await expect(settingsDialog.getByText('只影响你之后新建的日程，已有日程不会改变。')).toBeVisible();
  await expect(settingsDialog.getByText('默认按组织者设置提醒，也可以改成你自己的固定时间。')).toBeVisible();
  const settingsWindow = settingsDialog.locator('[data-settings-center-window="true"]');
  await expect
    .poll(() =>
      settingsWindow.evaluate((node) => {
        const main = node.querySelector('main');
        const card = main?.querySelector('[data-reminder-settings-card="true"]');
        return Math.max(main?.scrollWidth - main?.clientWidth || 0, card?.scrollWidth - card?.clientWidth || 0);
      }),
    )
    .toBeLessThanOrEqual(1);
  const normalBox = await settingsWindow.boundingBox();
  await settingsDialog.getByRole('button', { name: '全屏显示' }).click();
  await expect(settingsDialog.getByRole('button', { name: '还原窗口' })).toBeVisible();
  await expect.poll(async () => (await settingsWindow.boundingBox()).width).toBeGreaterThan(normalBox.width);
  await expect.poll(async () => (await settingsWindow.boundingBox()).height).toBeGreaterThan(normalBox.height);
  await settingsDialog.getByRole('button', { name: '还原窗口' }).click();
  await expect(settingsDialog.getByRole('button', { name: '全屏显示' })).toBeVisible();

  const incomingReminderSelect = page.getByLabel('收到会议邀请时的提醒时间');
  await expect(incomingReminderSelect).toHaveValue('follow_organizer');
  await expect(incomingReminderSelect.locator('option[value="none"]')).toHaveCount(0);
  await expect(page.getByLabel('新建日程的默认提醒时间').locator('option[value="none"]')).toHaveCount(1);
  await incomingReminderSelect.selectOption('5m');
  await expect(incomingReminderSelect).toHaveValue('5m');
  await settingsDialog.getByRole('button', { name: '关闭设置中心' }).click();
  await page.reload();
  await page.getByRole('button', { name: '设置' }).click();
  const reopenedSettingsDialog = page.getByRole('dialog', { name: '设置中心' });
  await expect(reopenedSettingsDialog).toBeVisible();
  await expect(page.getByLabel('收到会议邀请时的提醒时间')).toHaveValue('5m');

  await page.getByLabel('新建日程的默认提醒时间').selectOption('5m');
  await reopenedSettingsDialog.getByRole('button', { name: '关闭设置中心' }).click();
  await page.getByRole('button', { name: '日历' }).click();
  await page.getByRole('button', { name: '新建日程' }).first().click();

  await expect(page.getByLabel('提醒')).toHaveValue('5m');
});

test('incoming reminder policy filters reminders by reached trigger time', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: '设置' }).click();
  await page.getByLabel('收到会议邀请时的提醒时间').selectOption('5m');
  await page.getByRole('dialog', { name: '设置中心' }).getByRole('button', { name: '关闭设置中心' }).click();
  await page.getByRole('button', { name: '日历' }).click();
  await page.getByRole('button', { name: '提醒' }).click();

  const dialog = page.getByRole('dialog', { name: '提醒' });
  await expect(dialog.locator('[data-reminder-event-id="q4-budget-review"]')).toBeVisible();
  await expect(dialog.locator('[data-reminder-event-id="q4-budget-sync"]')).toHaveCount(0);
});
