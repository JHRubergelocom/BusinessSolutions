import { test, expect } from '@playwright/test'
import { Aktionen } from '../../page_objects/Aktionen'
import { ClickButtonAction } from '../../page_objects/ClickButtonAction'
import { FillTextAction } from '../../page_objects/FillTextAction'
import { beforeEach_ } from '../../page_objects/BeforEach_'
import { Dienste } from '../../page_objects/Dienste'
import { makroWeiterAbschliessenSpeichern } from '../../page_objects/Makros'

//Eine aktivität muss vorhanden sein, sonst schlägt der Test fehl
//Test
test('1.5', async ({ page }) => {
  let aktionen: Aktionen
  let clickButtonAction: ClickButtonAction
  let fillTextAction: FillTextAction
  let dienste: Dienste
  await beforeEach_(page)
  aktionen = new Aktionen(page)
  clickButtonAction = new ClickButtonAction(page)
  fillTextAction = new FillTextAction(page)
  dienste = new Dienste(page)
  //Test
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
  await aktionen.clickOnMetaFarbeAendern() //------
  await aktionen.clickOnVorschlaege() // Eingabefeld Farbe
  await aktionen.clickOnFarbeWaehlenRot()

  //await makroWeiterAbschliessenSpeichern(page) // Makro funktioniert nicht ?wieso?
  await clickButtonAction.clickButtonWeiter() // zusammnefassen
  await clickButtonAction.clickButtonAbschliesen() // zusammnefassen
  await clickButtonAction.clickButtonSpeichern() // zusammnefassen
})
