import { expect, Locator, Page } from '@playwright/test'

export class LoginAll {
  //Define selectors

  readonly page: Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  //Init selectors using constructor
  constructor(page: Page) {
    this.page = page
    this.usernameInput = page.locator('[placeholder="Name"]')
    this.passwordInput = page.locator('[placeholder="Passwort"]')
    this.submitButton = page.locator('#button-1023-btnIconEl')
    this.errorMessage = page.locator(
      'text=* * *AnmeldenUnbekannter Benutzer, falsches Passwort oder Konto gesperrt.'
    )
  }

  //Define login page methods
  async loginAll(username: string, password: string) {
    /* await this.page.goto(
      'http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/web/'
    ) */
    await this.page.goto(
      'http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/web/'
    )

    await this.usernameInput.type(username)
    await this.passwordInput.type(password)
    await this.submitButton.click()
    await Promise.all([
      this.page.waitForNavigation(/*{ url: 'http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/web/' }*/),
      this.page.click('#button-1011-btnIconEl'),
    ])
    /* await this.page.goto(
      'http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/flows/'
    ) */
    await this.page.goto(
      'http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/flows/'
    )
  }
}
