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
  await expect(page.locator('[data-calendar-account-checkbox="acc1"]')).toHaveClass(/bg-blue-600/);
  await expect(page.locator('[data-calendar-account-color-dot="acc1"]')).toHaveCount(0);
  const calendarSidebar = page.locator('[data-app-sidebar="calendar"]');
  const calendarProductDock = calendarSidebar.locator('[data-app-sidebar-product-dock="true"]');
  await expect(calendarSidebar).toBeVisible();
  await expect(calendarProductDock).toBeVisible();
  await expect.poll(async () => Math.round((await calendarSidebar.boundingBox()).width)).toBe(264);
  await expect.poll(() => calendarProductDock.evaluate((node) => window.getComputedStyle(node).borderTopWidth)).toBe('0px');
  await expect
    .poll(async () => {
      const sidebarBox = await calendarSidebar.boundingBox();
      const dockBox = await calendarProductDock.boundingBox();
      return Math.round(sidebarBox.y + sidebarBox.height - (dockBox.y + dockBox.height));
    })
    .toBe(0);
});

test('mail workspace uses a focused inbox layout', async ({ page }) => {
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
  await expect.poll(async () => Math.round((await mailSidebar.boundingBox()).width)).toBe(264);
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
  await expect(mailView.getByRole('button', { name: '筛选邮件' })).toBeVisible();
  await expect(mailView.getByRole('button', { name: '邮件排序' })).toBeVisible();
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
  await expect(readerMoreMenu.getByRole('menuitem', { name: '删除' })).toBeVisible();
  await expect(readerMoreMenu.getByRole('menuitem', { name: '移动' })).toBeVisible();
  await expect(readerMoreMenu.getByRole('menuitem', { name: '生成日程' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(readerMoreMenu).toHaveCount(0);
  await expect(mailView.getByRole('button', { name: '回复', exact: true })).toBeVisible();
  await expect(mailView.getByRole('button', { name: '回复全部' })).toBeVisible();
  await expect(mailView.getByRole('button', { name: '转发' })).toBeVisible();
  await expect(mailView.getByRole('button', { name: '标为已读' })).toBeVisible();
  await expect(mailView.getByRole('button', { name: '标记旗标' })).toBeVisible();
  await expect(mailView.getByRole('button', { name: '删除' })).toBeVisible();
  await expect(mailView.getByRole('button', { name: '移动' })).toBeVisible();
  await expect(mailView.getByRole('heading', { name: 'Q2 路线评审材料已更新' })).toBeVisible();
  await expect(mailView.getByText('Q2_路线评审_v4.pptx', { exact: true })).toBeVisible();
});

test('mail AI assistant supports classification, summary, todos and writing tools', async ({ page }) => {
  await page.goto('/');

  const mailView = page.locator('[data-mail-workspace="true"]');
  await expect(mailView.getByText('AI 智能分类')).toBeVisible();
  await expect(mailView.getByText('AI 邮件助手')).toBeVisible();
  await expect(mailView.getByText('AI 摘要')).toBeVisible();
  await expect(mailView.getByText('待处理事项', { exact: true })).toBeVisible();
  await expect(mailView.getByText('快速回复建议')).toBeVisible();
  await expect(mailView.getByRole('button', { name: '确认明天下午一起过一遍' })).toBeVisible();

  await page.locator('[data-mail-sidebar-compose="true"]').click();
  const composer = page.getByRole('dialog', { name: '写邮件' });
  await expect(composer).toBeVisible();
  await expect(composer.getByText('AI 写作助手')).toBeVisible();
  await expect(composer.getByRole('button', { name: '润色表达' })).toBeVisible();
  await expect(composer.getByRole('button', { name: '更正式' })).toBeVisible();
  await expect(composer.getByRole('button', { name: '生成标题' })).toBeVisible();
  await composer.getByPlaceholder('输入邮件正文...').fill('明天下午可以，一起过一下材料。');
  await composer.getByRole('button', { name: '更正式' }).click();
  await expect(composer.getByText('已生成更正式版本')).toBeVisible();
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
