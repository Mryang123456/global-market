import { expect, test } from '@playwright/test'

const viewports = [
  { name: 'mobile-320', width: 320, height: 720 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'desktop-1440', width: 1440, height: 900 },
]

for (const viewport of viewports) {
  test(`${viewport.name}: search, variant add, cart, and removal`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.addInitScript(() => localStorage.clear())
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'A more considered home, every day' })).toBeVisible()
    await page.getByRole('searchbox', { name: 'Search products' }).fill('Canvas')
    await page.getByRole('searchbox', { name: 'Search products' }).press('Enter')
    await expect(page).toHaveURL(/\/catalog\?q=Canvas/)
    await expect(page.getByRole('heading', { name: '1 products' })).toBeVisible()
    await expect(page.getByRole('searchbox', { name: 'Search products' })).toHaveValue('Canvas')
    await page.reload()
    await expect(page.getByRole('searchbox', { name: 'Search products' })).toHaveValue('Canvas')
    await page.getByRole('button', { name: 'Choose options' }).click()
    await expect(page).toHaveURL(/\/products\//)
    const sizeSelector = page.getByRole('combobox', { name: 'Select size' })
    await sizeSelector.press('ArrowDown')
    await sizeSelector.press('Enter')
    await page.getByRole('button', { name: 'Add to bag' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog').getByText(/Your Bag/)).toBeVisible()
    await page.screenshot({ path: `../artifacts/s3-${viewport.name}-cart.png`, fullPage: true })
    await page.getByRole('button', { name: 'Remove Canvas Sneakers' }).click()
    await expect(page.getByText('Your bag is empty')).toBeVisible()
  })
}
