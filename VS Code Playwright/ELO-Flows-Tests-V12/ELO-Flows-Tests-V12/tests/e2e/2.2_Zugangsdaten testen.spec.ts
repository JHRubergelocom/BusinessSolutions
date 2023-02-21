import { test, expect } from '@playwright/test'
import { Aktionen } from '../../page_objects/Aktionen'
import { ClickButtonAction } from '../../page_objects/ClickButtonAction'
import { Checkboxen } from '../../page_objects/Checkboxen'
import { beforeEach_ } from '../../page_objects/BeforEach_'
import { Dienste } from '../../page_objects/Dienste'
import { FillTextAction } from '../../page_objects/FillTextAction'

//Test
test('2.2', async ({ page }) => {
  let aktionen: Aktionen
  let clickButtonAction: ClickButtonAction
  let checkboxen: Checkboxen
  let dienste: Dienste
  let fillTextAction: FillTextAction
  await beforeEach_(page)

  aktionen = new Aktionen(page)
  clickButtonAction = new ClickButtonAction(page)
  checkboxen = new Checkboxen(page)
  dienste = new Dienste(page)
  fillTextAction = new FillTextAction(page)
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
  
})
