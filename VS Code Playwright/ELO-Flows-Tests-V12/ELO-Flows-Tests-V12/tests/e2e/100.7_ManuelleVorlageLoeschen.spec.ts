import { test, expect } from '@playwright/test'
import { Aktionen } from '../../page_objects/Aktionen'
import { ClickButtonAction } from '../../page_objects/ClickButtonAction'
import { beforeEach_ } from '../../page_objects/BeforEach_'

//Test
test('100.7', async ({ page }) => {
  let aktionen: Aktionen
  let clickButtonAction: ClickButtonAction
 
  aktionen = new Aktionen(page)
  clickButtonAction = new ClickButtonAction(page)
  
  await beforeEach_(page)
  //hier
  await page.locator('text=ELO Flows Konfiguration').click();
  //await expect(page).toHaveURL('http://vmdbsrv01:9090/ix-Repository1/plugin/com.elo.ix.plugin.ac/#/internal/L2l4LVJlcG9zaXRvcnkxL3BsdWdpbi9kZS5lbG8uaXgucGx1Z2luLnByb3h5L2Zsb3dzLz9jbGllbnQ9RUxPYWMmbGFuZz1kZQ/?client=ELOac')
 
  await aktionen.clickOnManuelleVorlagen() 
  await aktionen.clickOnMenuDeleteTemplate() //Vorlage Löschen
  await aktionen.clickDeleteTemplate()
  await aktionen.clickConfirmDeleteTemplate()
  await aktionen.clickCommitDeleteTemplate()
  //await clickButtonAction.clickButtonVorlageLoeschen()
 
})
