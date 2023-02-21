import { expect, Locator, Page } from '@playwright/test'

export class Aktionen {
  //Define selectors

  readonly page: Page
  readonly menuDeleteTemplate: Locator //die Drei senkrecht angeordnete Punkte
  readonly textDaten: Locator
  readonly forward: Locator // Zwischenschritt vorm "Weiter"
  readonly zugangsdaten: Locator
  readonly eloFeedTriggerObjId: Locator
  readonly bezeichner: Locator //########################
  readonly beitragSchreiben: Locator //Beitrag schreiben im Dienst "Feed"
  readonly beschreibung: Locator
  readonly activityChainItem: Locator // beleibige Aktivität ancklicken
  readonly manuelleVorlagen: Locator
  readonly deleteTemplate: Locator
  readonly confirmDeleteTemplate: Locator
  readonly commitDeleteTemplate: Locator
  readonly vorlageAnwaehlen: Locator // Vorlage aus der Liste nwählen
  readonly flowsAddIcon: Locator // das grüne Plus für die aktivitäten
  readonly metadaten: Locator // Dienst Metadaten
  readonly farbeAendern: Locator // Metadaten Farbe ändern
  readonly defaultUser: Locator // Default User
  readonly testUser: Locator // Testuser Zugangsdaten
  readonly objid: Locator // objid in untermenü (Trigger-objid)
  readonly vorschlaege: Locator // Vorschläge im Untermenü, wie "Farbe"  oder ID
  readonly vorschlaegeFarbeWaehlenRot: Locator // angebotene Farbe wählen
  //--------------------------------
  readonly vorschlaegeFarbeWaehlenBlau: Locator // angebotene Farbe wählen
  readonly vorschlaegeFarbeWaehlenGruen: Locator // angebotene Farbe wählen
  readonly vorschlaegeFarbeWaehlenSystem: Locator // angebotene Farbe wählen
  //-----------------------------------
  readonly ObjektId: Locator // Metadaten-ObjektID
  readonly metadatenFarbe: Locator // Metadaten Farbe bestimmen

  //Init selectors using constructor
  constructor(page: Page) {
    this.menuDeleteTemplate = page.frameLocator('[id="c"]').locator(".f-icon-more") // dieser css-Locator wird bei mehreren Flows nicht funktionieren
    this.textDaten = page.locator('text="Daten"')
    this.forward = page.locator('.forward')
    this.zugangsdaten = page.locator('text=Zugangsdaten')
    this.eloFeedTriggerObjId = page.locator('text=objid')
    this.metadatenFarbe = page.locator('pre').nth(1)
    this.ObjektId = page.locator('pre').first()
    this.vorschlaegeFarbeWaehlenRot = page.locator('code:has-text("Rot")')
    //--------------------------------------------------------------
    this.vorschlaegeFarbeWaehlenBlau = page.locator('code:has-text("Blau")')
    this.vorschlaegeFarbeWaehlenGruen = page.locator('code:has-text("Grün")')
    this.vorschlaegeFarbeWaehlenSystem = page.locator(
      'code:has-text("Systemfarbe")'
    )

    //-----------------------------------------------------------------
    this.vorschlaege = page.locator(':text-is("Vorschläge") >> visible=true')
    this.objid = page.locator('.e-tn-children')

    this.defaultUser = page.locator('img[alt="Default"]')
    this.testUser = page.locator('img[alt="Testuser"]')
    this.farbeAendern = page.locator('text=Farbe ändern')
    this.metadaten = page.locator('text=Metadaten').nth(1)
    this.bezeichner = page
      .frameLocator('[id="c"]')
      .locator('text=Bezeichner* 0 / 128 >> input[type="text"]')
    this.beschreibung = page.frameLocator('[id="c"]').locator('.textarea')
    this.beitragSchreiben = page.locator('.collapse .collapse-trigger')
    this.manuelleVorlagen = page
      .frameLocator('[id="c"]')
      .locator('text=Manuelle Vorlagen')
    //----------------------------------------------------------------------------------
    this.deleteTemplate = page.frameLocator('[id="c"]').locator("//div[@class='dropdown dropdown-menu-animation action-menu is-bottom-left is-active is-mobile-modal']//span[contains(.,'Vorlage löschen')]")
    //Alternative, wenn vollständig (grün)
    //('text=NeueVorlageKein Paket1.0Aktiv Vorlage exportieren Vorlage löschen Vorlage kopier >> button')
    //Alternative, wenn unvollständig (rot)
    //('text=NeueVorlageKein Paket1.0Unvollständig Vorlage exportieren Vorlage löschen Vorlag >> button')
    //---------------------------------------------------------------------------------------------
    this.confirmDeleteTemplate = page.frameLocator('[id="c"]').locator(".check")
     

    this.commitDeleteTemplate = page.frameLocator('[id="c"]').locator(".is-danger.button > span")
    this.vorlageAnwaehlen = page.frameLocator('[id="c"]').locator('.flow-name')
    this.flowsAddIcon = page.frameLocator('[id="c"]').locator("//div[@class='fn-add-btn add-btn']//i[@class='flows f-icon-add f-icon--elo-green f-icon--size-6']")
    this.activityChainItem = page.frameLocator('[id="c"]').locator(".f-icon-information")
  }
  //---------------------------------------------- migrieren ->FillTextAction
  async fillBezeichner(bezeichner: string) {
    await this.bezeichner.type(bezeichner)
  }
  async fillBeschreibung(beschreibung: string) {
    await this.beschreibung.type(beschreibung)
  }

  //------------------------------------------------
  async clickOnMenuDeleteTemplate() {
    await this.menuDeleteTemplate.click()
  }
  async clickOnTextDaten() {
    await this.textDaten.click()
  }
  async clickOnForward() {
    await this.forward.click()
  }
  async clickOnZugangsdaten() {
    await this.zugangsdaten.click()
  }
  async clickOneloFeedTriggerObjId() {
    await this.eloFeedTriggerObjId.click()
  }
  async clickOnBeitragSchreiben() {
    await this.beitragSchreiben.click()
  }
  async clickOnManuelleVorlagen() {
    await this.manuelleVorlagen.click()
  }
  async clickOnMetaFarbeAendern() {
    await this.metadatenFarbe.click()
  }
  async clickOnObjektId() {
    await this.ObjektId.click()
  }
  async clickOnFarbeWaehlenRot() {
    await this.vorschlaegeFarbeWaehlenRot.click()
  }
  //---------------------------------------
  async clickOnFarbeWaehlenBlau() {
    await this.vorschlaegeFarbeWaehlenBlau.click()
  }
  async clickOnFarbeWaehlenGruen() {
    await this.vorschlaegeFarbeWaehlenGruen.click()
  }
  async clickOnFarbeWaehlenSystem() {
    await this.vorschlaegeFarbeWaehlenSystem.click()
  }
  //-------------------------------------------
  async clickOnObjid() {
    await this.objid.click()
  }
  async clickOnVorschlaege() {
    await this.vorschlaege.click()
  }
  async clickOnDefaultUser() {
    await this.defaultUser.click()
  }
  async clickOnTestUser() {
    await this.testUser.click()
  }
  async clickOnFarbeAendern() {
    await this.farbeAendern.click()
  }
  async clickOnMetadaten() {
    await this.metadaten.click()
  }

  async clickDeleteTemplate() {
    await this.deleteTemplate.click()
  }
  async clickConfirmDeleteTemplate() { //Umzug -> Checkboxen
    await this.confirmDeleteTemplate.click()
  }
  async clickCommitDeleteTemplate() {
    await this.commitDeleteTemplate.click()
  }

  async clickOnEineVorlage() {
    //eine von den angelegten Vorlagen anwählen
    await this.vorlageAnwaehlen.click()
  }

  async clickFlowsAddIcon() {
    await this.flowsAddIcon.click()
  }

  async clickActivityChainItem() {
    await this.activityChainItem.click()
  }
}
