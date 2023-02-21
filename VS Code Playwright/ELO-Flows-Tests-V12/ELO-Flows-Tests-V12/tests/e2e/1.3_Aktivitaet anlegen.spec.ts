import { test, expect } from '@playwright/test'
import { Aktionen } from '../../page_objects/Aktionen'
import { ClickButtonAction } from '../../page_objects/ClickButtonAction'
import { FillTextAction } from '../../page_objects/FillTextAction'
import { beforeEach_ } from '../../page_objects/BeforEach_'
import { FlowsAktivitaeten } from '../../page_objects/FlowsAktivitaeten'

//Test
test('1.3', async ({ page }) => {
  let aktionen: Aktionen
  let clickButtonAction: ClickButtonAction
  let fillTextAction: FillTextAction
  let flowsAktivitaeten: FlowsAktivitaeten

  aktionen = new Aktionen(page)
  clickButtonAction = new ClickButtonAction(page)
  fillTextAction = new FillTextAction(page)
  flowsAktivitaeten = new FlowsAktivitaeten(page)

  await beforeEach_(page)
  //zusammenlegbar für die meinsten Tests
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
})
