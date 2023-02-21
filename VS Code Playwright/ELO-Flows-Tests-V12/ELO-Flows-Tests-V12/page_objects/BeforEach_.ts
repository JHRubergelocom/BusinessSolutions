import { Page } from '@playwright/test'
import { ACloginA } from './1.1_ACloginA'

export async function beforeEach_(page: Page) {
  let acLoginA: ACloginA
  acLoginA = new ACloginA(page)
  await acLoginA.aCloginA('0', 'elo')

  await page.locator('a:has-text("QS-Paket")').click()
  await page.locator('a:has-text("Flows")').click()
}
