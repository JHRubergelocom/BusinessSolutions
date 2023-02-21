import { test, expect } from '@playwright/test'
import { Aktionen } from '../../page_objects/Aktionen'
import { ClickButtonAction } from '../../page_objects/ClickButtonAction'
import { Checkboxen } from '../../page_objects/Checkboxen'
import { beforeEach } from '../../page_objects/BeforEach'
import { FillTextAction} from '../../page_objects/FillTextAction'

//Test
test('0.1', async ({ page }) => {
  let clickButtonAction = new ClickButtonAction(page)
  let fillTextAction = new FillTextAction(page)
  await beforeEach(page)
  await clickButtonAction.ClickButtonPaketVerwaltung()
  await clickButtonAction.ClickButtonPaketErstellen()
  await fillTextAction.fillPaketErstellen("Playwright-Paket")
  await fillTextAction.fillPaketName("Playwrightpaket")
  await fillTextAction.fillPaketBeschreibung("Playwright erstelltes Paket")
  await fillTextAction.fillPaketMaintainer("Administrator")
  await clickButtonAction.clickButtonUebernehmen()


})
