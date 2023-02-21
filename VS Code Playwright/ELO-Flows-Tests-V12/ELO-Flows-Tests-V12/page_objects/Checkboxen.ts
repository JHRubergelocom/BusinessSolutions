import { expect, Locator, Page } from '@playwright/test'

export class Checkboxen {
  //Define selectors

  readonly page: Page
  readonly deaktiviert: Locator // Checkbox "Einfaches Formular" deaktiviert Option
  readonly kontextAktivieren: Locator
  readonly kontextOrdner: Locator // checkbox
  readonly kontextDokument: Locator //checkbox
  readonly alsKachel: Locator //checkbox
  readonly alsMenueBand: Locator

  constructor(page: Page) {
    this.page = page
    this.deaktiviert = page.locator('.b-checkbox').first()
    this.kontextOrdner = page.frameLocator('[id="c"]').locator("//div[@class='type-restriction-selection']/label[1]/span[@class='check']")
    this.kontextDokument = page.frameLocator('[id="c"]').locator("//label[2]/span[@class='check']")
    this.alsKachel = page.locator('text=Als Kachel')
    this.alsMenueBand = page.frameLocator('[id="c"]').locator("//div[@class='ad-client-info-input']/div[2]//span[@class='check']")
    this.kontextAktivieren = page.frameLocator('[id="c"]').locator("//div[@class='ad-context-input']/div[2]//span[@class='check']")
      
  }
  async checkboxDeaktiviert() {
    await this.deaktiviert.check()
  }
  async checkboxOrdner() {
    await this.kontextOrdner.check()
  }
  async checkboxDokument() {
    await this.kontextDokument.check()
  }
  async checkboxKachel() {
    await this.alsKachel.check()
  }
  async checkboxMenueBand() {
    await this.alsMenueBand.check()
  }
  async checkboxKontextAktivierenFür() {
    await this.kontextAktivieren.check()
  }
}
