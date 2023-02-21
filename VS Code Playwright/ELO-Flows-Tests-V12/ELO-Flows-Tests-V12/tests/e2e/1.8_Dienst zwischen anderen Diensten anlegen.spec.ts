import { test, expect } from '@playwright/test'
import { Aktionen } from '../../page_objects/Aktionen'
import { ClickButtonAction } from '../../page_objects/ClickButtonAction'
import { FillTextAction } from '../../page_objects/FillTextAction'
import { beforeEach_ } from '../../page_objects/BeforEach_'
import { Dienste } from '../../page_objects/Dienste'

//Eine aktivität muss vorhanden sein, sonst schlägt der Test fehl
//Test
test('1.8', async ({ page }) => {
  let aktionen: Aktionen
  let clickButtonAction: ClickButtonAction
  let fillTextAction: FillTextAction
  let dienste: Dienste
  await beforeEach_(page)
  aktionen = new Aktionen(page)
  clickButtonAction = new ClickButtonAction(page)
  fillTextAction = new FillTextAction(page)
  dienste = new Dienste(page)
  await aktionen.clickOnManuelleVorlagen()
  await aktionen.clickOnEineVorlage()
  await page.pause()
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
