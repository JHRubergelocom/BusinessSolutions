//import { Page } from '@playwright/test'
import { expect, Locator, Page } from '@playwright/test'

export class ACloginA {
  //Define selectors
  readonly page: Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator

  //Init selectors using constructor
  constructor(page: Page) {
    this.page = page
    this.usernameInput = page.locator('id=username')
    this.passwordInput = page.locator('id=password')
    this.submitButton = page.locator('text=Anmelden')
  }

  //Define login page methods
  async aCloginA(username: string, password: string) {
    /* await this.page.goto(
      'http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/ac/registry/index.xhtml'
    ) */
    await this.page.goto(
      'http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/ac/registry/index.xhtml'
    )

    await this.usernameInput.type(username)
    await this.passwordInput.type(password)
    await this.submitButton.click()
  }
}
