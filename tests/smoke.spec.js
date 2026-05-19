import { expect, test } from '@playwright/test';

test('calendar shell renders and search results open', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Coremail')).toBeVisible();
  await expect(page.getByText('1月 5日–11日')).toBeVisible();

  const searchInput = page.getByPlaceholder('搜索日程').first();
  await searchInput.fill('Q4');
  await searchInput.press('Enter');

  await expect(page.getByText(/共找到 \d+ 条结果/)).toBeVisible();
  await expect(page.getByText('相关日程')).toBeVisible();
  await expect(page.getByText('Q4').first()).toBeVisible();
});
