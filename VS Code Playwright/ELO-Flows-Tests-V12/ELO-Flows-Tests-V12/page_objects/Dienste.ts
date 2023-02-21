import { expect, Locator, Page } from '@playwright/test'

export class Dienste {
  //Define selectors

  readonly page: Page
  readonly objekteUndMetadatenFarbeAendern: Locator
  readonly objekteUndMetadaten: Locator
  readonly eloFeed: Locator
  readonly eloWorkFlow: Locator

  constructor(page: Page) {
    this.page = page
    this.objekteUndMetadatenFarbeAendern = page.locator(
      'text=[ step0 ] Farbe ändern'
    )
    this.eloFeed = page.locator('text=ELO Feed').first()
    this.eloWorkFlow = page.locator('platzhalter')

    this.objekteUndMetadaten = page.locator(
      'img[alt="ELO Objekte \\& Metadaten"]'
    )
  }
  async diensteObjekteUndMetadatenFarbeAendern() {
    await this.objekteUndMetadatenFarbeAendern.click()
  }
  async diensteObjekteUndMetadaten() {
    await this.objekteUndMetadaten.click()
  }
  async diensteEloFeed() {
    await this.eloFeed.click()
  }
  async diensteEloWorkFlow() {
    await this.eloWorkFlow.click()
  }
}
