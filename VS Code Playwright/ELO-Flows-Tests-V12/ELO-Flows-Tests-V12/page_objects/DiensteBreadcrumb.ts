import { expect, Locator, Page } from '@playwright/test'

export class DiensteBreadcrumb {
  //Define selectors

  readonly page: Page
  readonly headerMediaBreadcrumb: Locator
  readonly tabZusammenfassung: Locator
  readonly tabEinstellungen: Locator

  constructor(page: Page) {
    this.page = page
    this.headerMediaBreadcrumb = page.locator('.header media')
    this.tabZusammenfassung = page.locator(
      '.has-text-white >> text=Zusammenfassung'
    )
    this.tabEinstellungen = page.locator(
      '.has-text-white >> text=Einstellungen'
    )
  }
  async ClickHeaderMediaBreadcrumb() {
    await this.headerMediaBreadcrumb.click()
  }

  async ClickTabEinstellungen() {
    await this.tabEinstellungen.click()
  }
  async clickTabZusammenfassung() {
    await this.tabZusammenfassung.click()
  }
}
