import { expect, Locator, Page } from '@playwright/test'

export class FlowsAktivitaeten {
  //Define selectors

  readonly page: Page

  readonly activityZusammenfassung: Locator // Aktivität "Zusammenfassung" anlegen
  readonly activityEinfachesFormular: Locator // Aktivität "Einfaches Formular" anlegen
  readonly activityInformation: Locator // Aktivität "Information" anlegen
  readonly activityagreement: Locator // Aktivität "Vereinbarung" anlegen
  readonly activityUser: Locator // Aktivität "User" anlegen

  constructor(page: Page) {
    this.page = page
    this.activityZusammenfassung = page.locator('.flows.f-icon-total')
    this.activityEinfachesFormular = page
      .locator('.flows.f-icon-formular-elo')
      .first()
    this.activityInformation = page.frameLocator('[id="c"]').locator("//span[contains(.,'Information')]")
    this.activityagreement = page.frameLocator('[id="c"]').locator("//span[contains(.,'Vereinbarung')]")
    this.activityUser = page.locator('.flows.f-icon-user')
  }

  async addActivityZusammenfassung() {
    await this.activityZusammenfassung.click()
  }
  async addActivityUser() {
    await this.activityUser.click()
  }

  async addActivityInformation() {
    await this.activityInformation.click()
  }
  async addActivityAgreement() {
    await this.activityagreement.click()
  }
  async addAktivityEinfachesFormular() {
    await this.activityEinfachesFormular.click()
  }

  /*
  //-------------------diese noch anlegen-------------------
  async clickAktivityFormular() {
    await this.addActivityInformation.click()
  }
  async clickAktivityDate-Picker() {
    await this.addActivityInformation.click()
  }
  async clickAktivityDokumenten-Upload() {
    await this.addActivityInformation.click()
  }
  
  async clickAktivityZusammenfassung() {
    await this.addActivityInformation.click()
  }
  async clickAktivityRepositoryAuswahl() {
    await this.addActivityInformation.click()
  } 
   */
}
