import { test, expect } from '@playwright/test'
import { Aktionen } from '../../page_objects/Aktionen'
import { ClickButtonAction } from '../../page_objects/ClickButtonAction'
import { FillTextAction } from '../../page_objects/FillTextAction'
import { DiensteBreadcrumb } from '../../page_objects/DiensteBreadcrumb'
import { beforeEach_ } from '../../page_objects/BeforEach_'
import { Dienste } from '../../page_objects/Dienste'

//Test
test('1.6', async ({ page }) => {
  let aktionen: Aktionen
  let clickButtonAction: ClickButtonAction
  let fillTextAction: FillTextAction
  let dienste: Dienste
  let diensteBreadcrumb: DiensteBreadcrumb
  await beforeEach_(page)
  aktionen = new Aktionen(page)
  clickButtonAction = new ClickButtonAction(page)
  fillTextAction = new FillTextAction(page)
  dienste = new Dienste(page)
  diensteBreadcrumb = new DiensteBreadcrumb(page)

  await aktionen.clickOnManuelleVorlagen()
  await aktionen.clickOnEineVorlage()
  await dienste.diensteObjekteUndMetadatenFarbeAendern()
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
})
