import { test, expect } from '@playwright/test'
import { WebClientLogin } from '../../page_objects/1.0_WebClientLogin'
import { Aktionen } from '../../page_objects/Aktionen'
import { ClickButtonAction } from '../../page_objects/ClickButtonAction'
import { Checkboxen } from '../../page_objects/Checkboxen'
import { ACLogin } from '../../page_objects/1.1_ACLogin'
import { FillTextAction } from '../../page_objects/FillTextAction'
import { FlowsAktivitaeten } from '../../page_objects/FlowsAktivitaeten'
import { Dienste } from '../../page_objects/Dienste'
import { DiensteBreadcrumb } from '../../page_objects/DiensteBreadcrumb'

test.describe('Sequenz @all', () => {
  let webClientLogin: WebClientLogin
  let aktionen: Aktionen
  let clickButtonAction: ClickButtonAction
  let checkboxen: Checkboxen
  let aCLogin: ACLogin
  let fillTextAction: FillTextAction
  let flowsAktivitaeten: FlowsAktivitaeten
  let dienste: Dienste
  let diensteBreadcrumb: DiensteBreadcrumb

  test.beforeEach(async ({ page }) => {
    aktionen = new Aktionen(page)
    webClientLogin = new WebClientLogin(page)
    clickButtonAction = new ClickButtonAction(page)
    checkboxen = new Checkboxen(page)
    aCLogin = new ACLogin(page)
    fillTextAction = new FillTextAction(page)
    flowsAktivitaeten = new FlowsAktivitaeten(page)
    dienste = new Dienste(page)
    diensteBreadcrumb = new DiensteBreadcrumb(page)

    await webClientLogin.visit()

    await webClientLogin.login('0', 'elo')
    await aCLogin.visit()
  })
  test('1.1_Manuelle Vorlage erstellen', async ({ page }) => {
    await page.locator('text=ELO Flows Konfiguration').click();
    await expect(page).toHaveURL('http://vmdbsrv01:9090/ix-Repository1/plugin/com.elo.ix.plugin.ac/#/internal/L2l4LVJlcG9zaXRvcnkxL3BsdWdpbi9kZS5lbG8uaXgucGx1Z2luLnByb3h5L2Zsb3dzLz9jbGllbnQ9RUxPYWMmbGFuZz1kZQ/?client=ELOac')
    await aktionen.clickOnManuelleVorlagen()
    await clickButtonAction.clickNeuerFlow()
    await aktionen.fillBezeichner('Playwright')
    await aktionen.fillBeschreibung('Playwright')
    await clickButtonAction.clickButtonErstellen()
    await clickButtonAction.clickButtonZurueck()
    //noch aktionen für Knotenschlüssel und Knotenbeschreibung
  })
  test('1.2_Trigger anlegen', async ({ page }) => {
    await aktionen.clickOnManuelleVorlagen()
    await aktionen.clickOnEineVorlage()
    await fillTextAction.fillLabel('openTest.label.txt')
    await fillTextAction.fillLabelTranslation('Open Test')
    await clickButtonAction.clickButtonSaveLabelUebersetzung()
    await fillTextAction.fillHinweisTranslationVariable('openHinweis')
    await fillTextAction.fillHinweisTranslation('Open Hinweis')
    await clickButtonAction.clickButtonSaveHinweisUebersetzung()
    await checkboxen.checkboxKontextAktivierenFür()
    await checkboxen.checkboxOrdner()
    await checkboxen.checkboxDokument()
    //await checkboxen.checkboxKachel()
    await checkboxen.checkboxMenueBand()
    await clickButtonAction.clickButtonWeiter()
    await clickButtonAction.clickButtonAbschliesen()
    await clickButtonAction.clickButtonSpeichern()
    //noch aktionen für Knotenschlüssel und Knotenbeschreibung
  })
  test('1.3', async ({ page }) => {
    await aktionen.clickOnManuelleVorlagen()
    await aktionen.clickOnEineVorlage()
    //------
    await aktionen.clickFlowsAddIcon()
    await flowsAktivitaeten.addActivityInformation()
    await fillTextAction.fillInfoActivityTranslationVariable('info1')
    await fillTextAction.fillInfoActivityTranslation('Information1')
    await clickButtonAction.clickButtonSaveActivityTranslation()
    await clickButtonAction.clickButtonAddActivityVariable()
    await clickButtonAction.clickButtonWeiter()
    await fillTextAction.fillEigenschaftenTranslationVariable('eigenschaft')
    await fillTextAction.fillEigenschaftenTranslation('Eigenschaften')
    await clickButtonAction.clickButtonAbschliesen()
    await clickButtonAction.clickButtonSpeichern()
    await clickButtonAction.clickButtonZurueck()
    //noch assert hinzufügen
  })
  //})
  test('1.4_Weitere Aktivitäten anlegen', async ({ page }) => {
    await aktionen.clickOnManuelleVorlagen()
    await aktionen.clickOnEineVorlage()
    //nodeChain
    await aktionen.clickActivityChainItem() //nodeChainItem
    await clickButtonAction.clickbuttonKnotenLoeschen()
    await clickButtonAction.clickButtonSpeichern().finally()
    await aktionen.clickFlowsAddIcon()

    //--------------Agreement-----------------------
    await flowsAktivitaeten.addActivityAgreement()

    await fillTextAction.fillAgreementActivityTranslationVariable('agreement') //OK
    await fillTextAction.fillAgreementActivityTranslation('Agreement')
    //await clickButtonAction.clickButtonAddActivityVariable()
    await fillTextAction.fillActivityAgreementKey('Key') //OK

    //
    await fillTextAction.fillActivityAgreementTranslationLabelKey(
      'label.label.txt'
    )
    await fillTextAction.fillLabelActivityAgreementTranslation('Label') //OK

    await fillTextAction.fillTooltipAgreementTranslationKey('Tooltip')
    await clickButtonAction.clickButtonWeiter()
    await clickButtonAction.clickButtonAbschliesen()
    await clickButtonAction.clickButtonSpeichern()
    //noch aktionen für Knotenschlüssel und Knotenbeschreibung
  })
  test('1.5', async ({ page }) => {
    await aktionen.clickOnManuelleVorlagen()

    await aktionen.clickOnEineVorlage()
    await clickButtonAction.clickButtonAddDienst()
    await dienste.diensteObjekteUndMetadaten()
    await clickButtonAction.clickButtonAuswaehlen()
    await aktionen.clickOnMetadaten()
    await aktionen.clickOnFarbeAendern()
    await clickButtonAction.clickButtonAuswaehlenFirst()
    await aktionen.clickOnDefaultUser()
    await clickButtonAction.clickButtonWeiter()
    await aktionen.clickOnObjektId()
    await clickButtonAction.clickButtonTrigger()
    await clickButtonAction.clickButtonObjectIdUnterauswahl()
    await aktionen.clickOnMetaFarbeAendern()
    await aktionen.clickOnVorschlaege()
    await aktionen.clickOnFarbeWaehlenRot()
    await clickButtonAction.clickButtonWeiter()
    await clickButtonAction.clickButtonAbschliesen()
    await clickButtonAction.clickButtonSpeichern()
  })
  test('1.6', async ({ page }) => {
    await aktionen.clickOnManuelleVorlagen()
    await aktionen.clickOnEineVorlage()
    await dienste.diensteObjekteUndMetadatenFarbeAendern()

    //await diensteBreadcrumb.clickTabZusammenfassung()
    await expect(diensteBreadcrumb.tabEinstellungen).toBeHidden()
    await page.waitForTimeout(1000)
    await page.mouse.click(1100, 50, { button: 'left' })
    await diensteBreadcrumb.ClickTabEinstellungen()
    await aktionen.clickOnMetaFarbeAendern()
    await aktionen.clickOnVorschlaege()
    await aktionen.clickOnFarbeWaehlenGruen()
    await clickButtonAction.clickButtonWeiter()
    await clickButtonAction.clickButtonAbschliesen()
    await clickButtonAction.clickButtonSpeichern()
    //weitere Methodenaufrufe
  })
  test('1.8', async ({ page }) => {
    await aktionen.clickOnManuelleVorlagen()
    await aktionen.clickOnEineVorlage()
    await page.mouse.click(600, 300, { button: 'left' })
    await page.mouse.move(650, 350)
    await clickButtonAction.clickButtonAddServiceBefore()
    await dienste.diensteEloFeed()
    await clickButtonAction.clickButtonAuswaehlen()
    await aktionen.clickOnBeitragSchreiben()
    await clickButtonAction.clickButtonAuswaehlen()
    await aktionen.clickOnDefaultUser()
    await clickButtonAction.clickButtonWeiter()
    await aktionen.clickOnObjektId()
    await clickButtonAction.clickButtonTrigger()
    await aktionen.clickOneloFeedTriggerObjId()
    await aktionen.clickOnMetaFarbeAendern()
    await fillTextAction.fillAktivityTextAreaFeed('Feed')
    await clickButtonAction.clickButtonWeiter()
    await clickButtonAction.clickButtonAbschliesen()
    await clickButtonAction.clickButtonSpeichern()
    await clickButtonAction.clickButtonZurueck()
  })
  test('2.1', async ({ page }) => {
    //noch aktionen für Knotenschlüssel und Knotenbeschreibung

    await aktionen.clickOnZugangsdaten()
    await dienste.diensteEloFeed()
    await clickButtonAction.clickButtonAuswaehlen()
    await clickButtonAction.clickButtonNeu()
    await fillTextAction.fillTextTitel('Testuser')
    await fillTextAction.fillTextURL(
      'https://vmjovicflows:9093/ix-ELO_FLOWS/ix'
    )
    await fillTextAction.fillTextUser('Testuser')
    await fillTextAction.fillTextPassword('elo')
    await clickButtonAction.clickButtonErstellen()
    await expect(page.locator('img[alt="Testuser"]')).toBeVisible()
    // await clickButtonAction.clickButtonZurueck()
  })
  test('2.2', async ({ page }) => {
    //noch aktionen für Knotenschlüssel und Knotenbeschreibung

    await aktionen.clickOnManuelleVorlagen()
    await aktionen.clickOnEineVorlage()
    await clickButtonAction.clickButtonAddServiceAfter()
    await dienste.diensteEloFeed()
    await clickButtonAction.clickButtonAuswaehlen()
    await aktionen.clickOnBeitragSchreiben()
    await clickButtonAction.clickButtonAuswaehlen()
    await aktionen.clickOnTestUser()
    await clickButtonAction.clickButtonWeiter()
    await aktionen.clickOnObjektId()
    await aktionen.clickOnTextDaten() // page.locator('text="Daten"').click()
    await clickButtonAction.clickButtonTrigger()
    await aktionen.clickOneloFeedTriggerObjId()
    await aktionen.clickOnMetaFarbeAendern() //hier andere Funktion
    await fillTextAction.fillAktivityTextAreaFeed('Feed')
    await clickButtonAction.clickButtonWeiter()
    await clickButtonAction.clickButtonAbschliesen()
    await clickButtonAction.clickButtonSpeichern()

    await clickButtonAction.clickButtonZurueck()
    await page.pause()
  })
  test.skip('100.7_Vorlage löschen', async ({ page }) => {
    await aktionen.clickOnManuelleVorlagen()
    await aktionen.clickOnMenuDeleteTemplate() //Vorlage Löschen
    await aktionen.clickDeleteTemplate()
    await aktionen.clickConfirmDeleteTemplate()
    await aktionen.clickCommitDeleteTemplate()
    await clickButtonAction.clickButtonVorlageLoeschen()
  })
})
