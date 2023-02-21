import { expect, Locator, Page } from '@playwright/test'

export class PopUpFensterAktionen {
  //Define selectors

  readonly page: Page
  readonly popupButtonKnotenLoeschen: Locator

  constructor(page: Page) {
    this.page = page
    this.popupButtonKnotenLoeschen = page.locator(
      'footer:has-text("Knoten löschen")'
    )
  }

  async popupKnotenLoeschen() {
    await this.popupButtonKnotenLoeschen.click()
  }
}
