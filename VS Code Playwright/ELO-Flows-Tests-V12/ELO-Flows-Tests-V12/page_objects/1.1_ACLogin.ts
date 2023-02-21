import { Page } from '@playwright/test'

export class ACLogin {
  //Define selectors
  readonly page: Page

  //Init selectors using constructor
  constructor(page: Page) {
    this.page = page
  }

  //Define login page methods

  async visit() {
    await this.page.goto(
      'http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/flows/'
    )
  }
}
