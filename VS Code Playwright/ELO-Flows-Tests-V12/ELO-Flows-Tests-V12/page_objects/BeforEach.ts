import { Page } from '@playwright/test'
import { ACloginA } from './1.1_ACloginA'

export async function beforeEach(page: Page) {
  let acLoginA: ACloginA
  acLoginA = new ACloginA(page)
  await acLoginA.aCloginA('0', 'elo')

 
}
