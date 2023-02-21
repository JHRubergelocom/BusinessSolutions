import { expect, Locator, Page } from '@playwright/test'

export class WebClientLogin {
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
  async visit() {
    await this.page.goto(
      'http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/web/'
    )
  }
  async login(username: string, password: string) {
    await this.usernameInput.type(username)
    await this.passwordInput.type(password)
    await this.submitButton.click()
    await Promise.all([
      this.page.waitForNavigation(/*{ url: 'http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/web/' }*/),
      this.page.click('#button-1011-btnIconEl'),
    ])
  }

  async assertErrorMessage() {
    await expect(this.errorMessage).toContainText(
      'Unbekannter Benutzer, falsches Passwort oder Konto gesperrt.'
    )
  }
}
