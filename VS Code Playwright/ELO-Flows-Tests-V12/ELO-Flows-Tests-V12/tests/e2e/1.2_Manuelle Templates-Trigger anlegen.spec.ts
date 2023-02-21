import { test, expect } from '@playwright/test'
import { Aktionen } from '../../page_objects/Aktionen'
import { ClickButtonAction } from '../../page_objects/ClickButtonAction'
import { Checkboxen } from '../../page_objects/Checkboxen'
import { beforeEach_ } from '../../page_objects/BeforEach_'
import { FillTextAction } from '../../page_objects/FillTextAction'

//Test
test('1.2', async ({ page }) => {
  let aktionen: Aktionen
  let clickButtonAction: ClickButtonAction
  let checkboxen: Checkboxen
  let fillTextAction: FillTextAction

  aktionen = new Aktionen(page)
  clickButtonAction = new ClickButtonAction(page)
  checkboxen = new Checkboxen(page)
  fillTextAction = new FillTextAction(page)

  await beforeEach_(page)
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
})
