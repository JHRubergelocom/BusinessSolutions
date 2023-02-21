import { expect, Locator, Page } from '@playwright/test'

export class FillTextAction {
  //Define selectors

  readonly page: Page
  readonly textPaketBeschreibung: Locator
  readonly textPaketName: Locator
  readonly textPaketErstellen: Locator
  readonly textPaketMaintainer: Locator
  readonly textActivityAgreementTranslationLabelKey: Locator
  readonly textAgreementActivityTranslation: Locator
  readonly textAgreementActivityTranslationVariable: Locator
  readonly eigenschaftenTranslation: Locator
  readonly eigenschaftenTranslationVariable: Locator
  readonly infoActivityTranslationVariable: Locator
  readonly infoActivityTranslation: Locator
  readonly neueHinweisUebersetzung: Locator //
  readonly textMinWert: Locator // einfachesFormular Min. Wert
  readonly textMaxWert: Locator // einfachesFormular Max. Wert
  readonly textPlatzhalter: Locator // Einfaches Formular Platzhalter
  readonly textNameEinfachesFormular: Locator // Einfaches Formular Name
  readonly textTitelEinfachesFormular: Locator // Einfaches Formular Titel
  readonly textPassword: Locator // Zugangsdaten
  readonly textUser: Locator // Zugangsdaten
  readonly textURL: Locator // Zugangsdaten
  readonly textTitel: Locator //Zugangsdaten
  readonly textAreaAktivityFeed: Locator
  readonly textAreaAktivity: Locator // Text für die Aktivitäten
  readonly textAreaAktivityAgreement: Locator // Text für die Aktivitäten
  readonly textKeyActivityAgreement: Locator // Agreement-Schlüssel
  readonly textLabelActivityAgreementTranslation: Locator // Agreement-Label
  readonly textTooltipAktivityAgreementKey: Locator
  readonly textObjectId: Locator // Objekt-Id
  readonly textFarbe: Locator // Metadaten Farbe
  readonly neuerLabel: Locator
  readonly neueLabelUebersetzung: Locator
  readonly neuerHinweis: Locator

  constructor(page: Page) {
    this.page = page

    this.textPaketErstellen = page.locator('input[type="text"]').first()
    this.textPaketName = page.locator('input[type="text"]').nth(1)
    this.textPaketBeschreibung = page.locator('textarea')
    
    this.textPaketMaintainer = page.locator('input[type="text"]').nth(2)
    this.textAgreementActivityTranslation = page
      .frameLocator('[id="c"]')
      .locator(
        "//div[@class='control is-clearfix e-text-input e-mainfield input-medium control']/input[@class='input']"
      ) //(".translation-input--error div:nth-of-type(1) > div:nth-of-type(2) input:nth-of-type(1)")
    this.textActivityAgreementTranslationLabelKey = page
      .frameLocator('[id="c"]')
      .locator(
        'text=Label* ÜbersetzungsschlüsselÜbersetzung >> input[type="text"]'
      )
      .first() //(".translation-input--error div:nth-of-type(1) > div:nth-of-type(2) i:nth-of-type(1)")

    this.textAgreementActivityTranslationVariable = page
      .frameLocator('[id="c"]')
      .locator(
        "//div[@class='is-html-editor-header']//div[@class='field is-horizontal e-field e-dynamic-field field-medium t-_TranslationKey']//input[@class='input']"
      )
    this.eigenschaftenTranslation = page
      .frameLocator('[id="c"]')
      .locator('.control.e-mainfield.e-text-input.input-medium > .input')
    this.eigenschaftenTranslationVariable = page
      .frameLocator('[id="c"]')
      .locator('.field.input-medium .input') //("//div[@class='control is-clearfix']/input[@class='input']")

    this.infoActivityTranslation = page
      .frameLocator('[id="c"]')
      .locator(
        "//div[@class='is-html-editor-header']//div[@class='field is-horizontal e-field e-dynamic-field field-medium t-_']//input[@class='input']"
      )
    this.infoActivityTranslationVariable = page
      .frameLocator('[id="c"]')
      .locator("//div[@class='control is-clearfix']/input[@class='input']")
    this.neueHinweisUebersetzung = page
      .frameLocator('[id="c"]')
      .locator(
        '.ad-properties-input > div:nth-of-type(2) div:nth-of-type(3) input:nth-of-type(1)'
      )
    this.neuerHinweis = page
      .frameLocator('[id="c"]')
      .locator(
        "//div[@class='translation-input']//div[@class='field is-horizontal e-field e-dynamic-field field-medium t-_TranslationKey']//input[@class='input']"
      )
    this.textMinWert = page.locator('input[type="text"]').nth(3)
    this.textMaxWert = page.locator('input[type="text"]').nth(4)
    this.textPlatzhalter = page.locator('input[type="text"]').nth(2)
    this.textNameEinfachesFormular = page.locator(
      'text=Name* Füllen Sie dieses Feld aus. >> input[type="text"]'
    )
    this.textTitelEinfachesFormular = page.locator('input[type="text"]').first()
    this.textPassword = page.locator('input[type="text"]').nth(3)
    this.textUser = page.locator('input[type="text"]').nth(2)
    this.textURL = page.locator('input[type="text"]').nth(1)
    this.textTitel = page.locator('text=Titel* 0 / 128 >> input[type="text"]')
    this.textAreaAktivityFeed = page.locator('textarea').nth(3)
    this.textFarbe = page.locator('pre').nth(1)
    this.textObjectId = page.locator('pre').first()
    this.textAreaAktivity = page
      .frameLocator('[id="c"]')
      .locator("//div[@class='control is-clearfix']/input[@class='input']")
    this.textAreaAktivityAgreement = page.locator(
      'text=Text 0 / 1000 >> textarea'
    )
    this.textKeyActivityAgreement = page
      .frameLocator('[id="c"]')
      .locator('.is-counter-inside')

    this.textTooltipAktivityAgreementKey = page.locator(
      'text=Tooltip 0 / 128 >> textarea'
    )

    this.textLabelActivityAgreementTranslation = page
      .frameLocator('[id="c"]')
      .locator(
        'section[data-v-d99d3410] > div:nth-of-type(2) div:nth-of-type(3) input:nth-of-type(1)'
      )
    this.neuerLabel = page
      .frameLocator('[id="c"]')
      .locator(
        '.ad-properties-input > div:nth-of-type(1) div:nth-of-type(1) div:nth-of-type(1) > div:nth-of-type(1) div:nth-of-type(1) > div:nth-of-type(2) input:nth-of-type(1)'
      )

    this.neueLabelUebersetzung = page
      .frameLocator('[id="c"]')
      .locator(
        '.ad-properties-input > div:nth-of-type(1) div:nth-of-type(3) input:nth-of-type(1)'
      )
  }
  async fillPaketErstellen(activityText: string) {
    await this.textPaketErstellen.focus()
    //await this.textPaketName.dblclick()
    //await this.textPaketErstellen.press('Meta+A')
    //await this.textPaketErstellen.press('Backspace')
    //await this.textPaketErstellen.click()
    await this.textPaketErstellen.type(activityText)
  }
  async fillPaketName(activityText: string) {
    await this.textPaketName.focus()
    await this.textPaketName.dblclick()
    await this.textPaketName.type(activityText)
  }
  async fillPaketBeschreibung(activityText: string) {
    await this.textPaketBeschreibung.focus()
    await this.textPaketBeschreibung.dblclick()
    await this.textPaketBeschreibung.type(activityText)
  }
  async fillPaketMaintainer(activityText: string) {
    await this.textPaketMaintainer.focus()
    await this.textPaketMaintainer.dblclick()
    await this.textPaketMaintainer.type(activityText)
  }

  async fillHinweisTranslation(neueHinweisUebersetzung: string) {
    await this.neueHinweisUebersetzung.click()
    await this.neueHinweisUebersetzung.type(neueHinweisUebersetzung)
    await this.page.mouse.click(900, 500, { button: 'left' })
  }
  async fillEigenschaftenTranslation(eigenschaftenTranslation: string) {
    await this.eigenschaftenTranslation.click()
    await this.eigenschaftenTranslation.type(eigenschaftenTranslation)
    await this.page.waitForTimeout(1000)
    await this.page.mouse.click(900, 500, { button: 'left' })
  }

  async fillLabelTranslation(neueLabelUebersetzung: string) {
    await this.neueLabelUebersetzung.click()
    await this.neueLabelUebersetzung.type(neueLabelUebersetzung)
  }
  async fillLabel(neuerLabel: string) {
    await this.neuerLabel.click()
    await this.neuerLabel.type(neuerLabel)
  }
  async fillTextMinWert(activityText: string) {
    await this.textMinWert.type(activityText)
  }
  async fillTextMaxWert(activityText: string) {
    await this.textMaxWert.type(activityText)
  }
  async fillTextPlatzhalter(activityText: string) {
    await this.textPlatzhalter.type(activityText)
  }
  async fillTextNameEinfachesFormular(activityText: string) {
    await this.textNameEinfachesFormular.type(activityText)
  }
  async fillTextTitelEinfachesFormular(activityText: string) {
    await this.textTitelEinfachesFormular.type(activityText)
  }

  async fillTextPassword(activityText: string) {
    await this.textPassword.type(activityText)
  }
  async fillTextUser(activityText: string) {
    await this.textUser.type(activityText)
  }
  async fillTextURL(activityText: string) {
    await this.textURL.type(activityText)
  }
  async fillTextTitel(activityText: string) {
    await this.textTitel.type(activityText)
  }
  async fillactivityTextAreaFeed(activityText: string) {
    await this.textAreaAktivityFeed.type(activityText)
  }

  async fillInfoActivityTranslation(TranslatingText: string) {
    await this.infoActivityTranslation.click()
    await this.page.waitForTimeout(1000)
    await this.infoActivityTranslation.type(TranslatingText)
    await this.page.mouse.click(900, 500, { button: 'left' })
  }
  async fillInfoActivityTranslationVariable(TranslatingText: string) {
    await this.infoActivityTranslationVariable.click()
    //await this.page.pause()
    await this.infoActivityTranslationVariable.type(TranslatingText)
    await this.page.mouse.click(900, 500, { button: 'left' })
  }
  async fillEigenschaftenTranslationVariable(TranslatingText: string) {
    await this.eigenschaftenTranslationVariable.click()
    //await this.page.pause()
    await this.eigenschaftenTranslationVariable.type(TranslatingText)
    await this.page.mouse.click(900, 500, { button: 'left' })
  }
  async fillFarbe(text: string) {
    //await this.textFarbe.fill('rot')
    await this.textFarbe.click()
  }
  async fillObjectId(text: string) {
    await this.textObjectId.click()

    // await this.textObjectId.type(text)
  }
  async fillAgreementActivityTranslationVariable(activityText: string) {
    await this.textAgreementActivityTranslationVariable.type(activityText)
  }
  async fillAgreementActivityTranslation(activityText: string) {
    await this.textAgreementActivityTranslation.type(activityText)
  }
  async fillActivityAgreementKey(activityText: string) {
    await this.textKeyActivityAgreement.type(activityText)
  }

  async fillLabelActivityAgreementTranslation(activityText: string) {
    await this.textLabelActivityAgreementTranslation.type(activityText)
  }

  async fillTooltipAgreementTranslationKey(activityText: string) {
    await this.textTooltipAktivityAgreementKey.type(activityText)
  }
  async fillActivityAgreementTranslationLabelKey(activityText: string) {
    await this.textActivityAgreementTranslationLabelKey.type(activityText)
  }

  async fillHinweisTranslationVariable(neuerHinweis: string) {
    await this.neuerHinweis.click()
    await this.neuerHinweis.type(neuerHinweis)
    await this.page.mouse.click(900, 500, { button: 'left' })
  }
}
