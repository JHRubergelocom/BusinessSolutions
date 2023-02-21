import { test, expect } from '@playwright/test'
import { Aktionen } from '../../page_objects/Aktionen'
import { ClickButtonAction } from '../../page_objects/ClickButtonAction'
import { Checkboxen } from '../../page_objects/Checkboxen'
import { beforeEach_ } from '../../page_objects/BeforEach_'
import { Dienste } from '../../page_objects/Dienste'
import { FillTextAction } from '../../page_objects/FillTextAction'

//Test // Es darf kein Testuser angelegt sein, sonst schlägt der Test fehl
test('2.1', async ({ page }) => {
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

  await aktionen.clickOnZugangsdaten()
  await dienste.diensteEloFeed()
  await clickButtonAction.clickButtonAuswaehlen()
  await clickButtonAction.clickButtonNeu()
  await fillTextAction.fillTextTitel('Testuser')
  await fillTextAction.fillTextURL('https://vmjovicflows:9093/ix-ELO_FLOWS/ix')
  await fillTextAction.fillTextUser('Testuser')
  await fillTextAction.fillTextPassword('elo')
  await clickButtonAction.clickButtonErstellen()
  await expect(page.locator('img[alt="Testuser"]')).toBeVisible()
  // await clickButtonAction.clickButtonZurueck()
})
