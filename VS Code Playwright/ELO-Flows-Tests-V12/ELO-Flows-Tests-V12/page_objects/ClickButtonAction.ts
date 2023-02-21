import { expect, Locator, Page } from '@playwright/test'

export class ClickButtonAction {
  //Define selectors

  readonly page: Page
  readonly buttonPaketErstellen: Locator
  readonly buttonAddActivityVariable: Locator
  readonly buttonSaveActivityTranslation: Locator
  readonly buttonSaveHinweisUebersetzung: Locator
  readonly buttonSaveLabelUebersetzung: Locator
  readonly buttonAddServiceBefore: Locator
  readonly buttonAddServiceAfter: Locator
  readonly buttonUebernehmen: Locator
  readonly buttonHinzufuegen: Locator
  readonly buttonNeu: Locator
  readonly buttonAuswaehlen: Locator
  readonly buttonAuswaehlenFirst: Locator // wenn mehrere Buttons vorhanden
  readonly buttonNeuerFlow: Locator
  readonly buttonVorlageLoeschen: Locator // Abfalleimer
  readonly buttonAbschliesen: Locator
  readonly buttonSpeichern: Locator
  readonly buttonWeiter: Locator
  readonly buttonZurueck: Locator // Pfeil "zurück"
  readonly buttonErstellen: Locator
  readonly buttonAddDienst: Locator // Flows-Dienste anlegen
  readonly buttonObjectIdUnterauswahl: Locator //
  readonly buttonTrigger: Locator // Button Trigger im Untermenü
  readonly buttonKnotenLoeschen: Locator // eine angelegte Aktivität löschen
  readonly buttonPaketVerwaltung: Locator // Paketverwaltung

  constructor(page: Page) {
    this.page = page
    this.buttonAddActivityVariable = page
      .frameLocator('[id="c"]')
      .locator("//button[@class='button']/span[contains(.,'Einfügen')]")
    this.buttonSaveActivityTranslation = page
      .frameLocator('[id="c"]')
      .locator('.e-icon--pen')
    this.buttonSaveHinweisUebersetzung = page
      .frameLocator('[id="c"]')
      .locator(
        '.ad-properties-input > div:nth-of-type(2) div:nth-of-type(3) i:nth-of-type(1)'
      )
    this.buttonSaveLabelUebersetzung = page
      .frameLocator('[id="c"]')
      .locator(
        "//div[@class='translation-input translation-input--valid']//i[@class='e-100x e-icon--pen']"
      )
    this.buttonAddServiceAfter = page.locator(
      '.is-inline-block.action-node-chain-item.last > .add-btn-container.after > .flow-tn > .flow-tn-content > .fn-add-btn'
    )
    this.buttonAddServiceBefore = page.locator(
      '.is-inline-block.action-node-chain-item > .add-btn-container.before > .flow-tn > .flow-tn-content > .fn-add-btn > .icon > .flows'
    )
    this.buttonUebernehmen = page.locator('button:has-text("Übernehmen")')
    this.buttonHinzufuegen = page.locator('button:has-text("Hinzufügen")')
    this.buttonNeu = page.locator('button:has-text("Neu")')
    this.buttonKnotenLoeschen = page
      .frameLocator('[id="c"]')
      .locator("//span[contains(.,'Knoten löschen')]")

    this.buttonTrigger = page.locator('.e-tn-btn >> nth=0')
    this.buttonObjectIdUnterauswahl = page.locator('text=objid')
    this.buttonAuswaehlen = page.locator('button:has-text("Auswählen")')
    this.buttonAuswaehlenFirst = page
      .locator('button:has-text("Auswählen")')
      .first()
    this.buttonErstellen = page
      .frameLocator('[id="c"]')
      .locator("//span[contains(.,'Erstellen')]")
    this.buttonWeiter = page
      .frameLocator('[id="c"]')
      .locator("//span[.='Weiter']")
    this.buttonAbschliesen = page
      .frameLocator('[id="c"]')
      .locator("//span[.='Abschließen']")
    this.buttonZurueck = page
      .frameLocator('[id="c"]')
      .locator('.e-icon--arrow-left') // CSS Selector,hoch zuverlässig, immer wenn möglich einsetzen
    this.buttonNeuerFlow = page
      .frameLocator('[id="c"]')
      .locator('button:has-text("Neuer Flow")')
    this.buttonSpeichern = page
      .frameLocator('[id="c"]')
      .locator("//span[contains(.,'Speichern')]")

    this.buttonVorlageLoeschen = page.locator(
      'button:has-text("Vorlage löschen")'
    )
    this.buttonAddDienst = page.locator(
      '.fn-add-btn.trigger-add-btn > .icon > .flows'
    )
    this.buttonPaketVerwaltung = page.locator(
      "[target='_self'][href='/ix-Repository1/plugin/com.elo.ix.plugin.ac/#/packages/']"
    )
    this.buttonPaketErstellen = page.locator(
      '.is-root button:nth-of-type(1) > span:nth-of-type(2)'
    )
  }
  async ClickButtonPaketVerwaltung() {
    await this.buttonPaketVerwaltung.click()
  }
  async ClickButtonPaketErstellen() {
    await this.buttonPaketErstellen.click()
  }

  async clickButtonAddActivityVariable() {
    await this.buttonAddActivityVariable.click()
  }
  async clickButtonSaveActivityTranslation() {
    await this.buttonSaveActivityTranslation.click()
    await this.page.waitForTimeout(1000)
  }
  async clickButtonSaveLabelUebersetzung() {
    await this.buttonSaveLabelUebersetzung.click()
  }

  async clickButtonSaveHinweisUebersetzung() {
    await this.buttonSaveHinweisUebersetzung.click()
  }

  async clickButtonAddServiceAfter() {
    await this.buttonAddServiceAfter.click()
  }

  async clickButtonAddServiceBefore() {
    await this.buttonAddServiceBefore.click()
  }
  async clickButtonUebernehmen() {
    await this.buttonUebernehmen.click()
  }
  async clickButtonHinzufuegen() {
    await this.buttonHinzufuegen.click()
  }
  async clickButtonNeu() {
    await this.buttonNeu.click()
  }
  async clickbuttonKnotenLoeschen() {
    await this.buttonKnotenLoeschen.click()
  }
  async clickButtonVorlageLoeschen() {
    await this.buttonVorlageLoeschen.click()
  }
  async clickButtonTrigger() {
    await this.buttonTrigger.click()
  }
  async clickButtonObjectIdUnterauswahl() {
    await this.buttonObjectIdUnterauswahl.click()
  }
  async clickButtonAuswaehlen() {
    await this.buttonAuswaehlen.click()
  }
  async clickButtonAuswaehlenFirst() {
    await this.buttonAuswaehlenFirst.click()
  }
  async clickButtonWeiter() {
    await this.buttonWeiter.click()
  }
  async clickButtonZurueck() {
    await this.buttonZurueck.click()
  }
  async clickNeuerFlow() {
    await this.buttonNeuerFlow.click()
  }
  async clickButtonAbschliesen() {
    await this.buttonAbschliesen.click()
  }
  async clickButtonSpeichern() {
    await this.buttonSpeichern.click()
  }
  async clickButtonErstellen() {
    await this.buttonErstellen.click()
  }
  async clickButtonAddDienst() {
    await this.buttonAddDienst.click()
  }
}
