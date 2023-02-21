import { expect, Locator, Page } from '@playwright/test'

export class Pattern {
  //Define selectors

  readonly page: Page
  readonly patternAction: Locator

  constructor(page: Page) {
    this.page = page
    this.patternAction = page.locator('')
  }

  async patternActionMethod() {
    await this.patternAction.click()
  }
}
