import { expect, Page } from '@playwright/test'
import { ClickButtonAction } from './ClickButtonAction'
import { Aktionen } from './Aktionen'

let clickButtonAction: ClickButtonAction
let aktionen: Aktionen

export async function addNewActivity(page: Page) {
  clickButtonAction = new ClickButtonAction(page)
  aktionen = new Aktionen(page)

  await aktionen.clickOnManuelleVorlagen()
  await aktionen.clickOnEineVorlage()
  await aktionen.clickActivityChainItem() //nodeChainItem
  await clickButtonAction.clickbuttonKnotenLoeschen()
  await clickButtonAction.clickButtonSpeichern().finally()
  await aktionen.clickFlowsAddIcon()
}
export async function makroWeiterAbschliessenSpeichern(page: Page) {
  // await page.pause()
  await clickButtonAction.clickButtonWeiter()
  await clickButtonAction.clickButtonAbschliesen()
  await clickButtonAction.clickButtonSpeichern()
}

export async function makroReplaceActivity(page: Page) {
  await aktionen.clickActivityChainItem() //nodeChainItem
  await clickButtonAction.clickbuttonKnotenLoeschen()
  await clickButtonAction.clickButtonSpeichern().finally()
  await aktionen.clickFlowsAddIcon()
}
