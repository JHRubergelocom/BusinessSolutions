import { test, expect } from '@playwright/test'
import { Aktionen } from '../../page_objects/Aktionen'
import { ClickButtonAction } from '../../page_objects/ClickButtonAction'
import { FillTextAction } from '../../page_objects/FillTextAction'
import { Checkboxen } from '../../page_objects/Checkboxen'
import { beforeEach_ } from '../../page_objects/BeforEach_'
import {
  addNewActivity,
  makroReplaceActivity,
  makroWeiterAbschliessenSpeichern,
} from '../../page_objects/Makros'
import { PopUpFensterAktionen } from '../../page_objects/PopUpFensterAktionen'
import { FlowsAktivitaeten } from '../../page_objects/FlowsAktivitaeten'

// Dieser Test schlägt fehl, wenn bereits ein Service angelegt wurde.
//Test
test('1.4', async ({ page }) => {
  let aktionen: Aktionen
  let clickButtonAction: ClickButtonAction
  let fillTextAction: FillTextAction
  let popUpFensterAktionen: PopUpFensterAktionen
  let flowsAktivitaeten: FlowsAktivitaeten

  let checkboxen: Checkboxen

  aktionen = new Aktionen(page)
  clickButtonAction = new ClickButtonAction(page)
  fillTextAction = new FillTextAction(page)
  checkboxen = new Checkboxen(page)
  popUpFensterAktionen = new PopUpFensterAktionen(page)
  flowsAktivitaeten = new FlowsAktivitaeten(page)

  await beforeEach_(page)

  await addNewActivity(page) // bereiter neue Aktivität vor bei leerer Aktivity

  //--------------Agreement-------------------------
  await flowsAktivitaeten.addActivityAgreement()

  //--------------------
  await page.pause()
  await fillTextAction.fillAgreementActivityTranslationVariable('agreement') //OK
  await fillTextAction.fillAgreementActivityTranslation('Agreement')
  //await clickButtonAction.clickButtonAddActivityVariable()
  await fillTextAction.fillActivityAgreementKey('Key') //OK

  //
  await fillTextAction.fillActivityAgreementTranslationLabelKey(
    'label.label.txt'
  )
  await fillTextAction.fillLabelActivityAgreementTranslation('Label') //OK

  await fillTextAction.fillTooltipAgreementTranslationKey('Tooltip')
  await clickButtonAction.clickButtonWeiter()
  await clickButtonAction.clickButtonAbschliesen()
  await clickButtonAction.clickButtonSpeichern()

  // await makroWeiterAbschliessenSpeichern(page)
  //await makroWeiterAbschliessenSpeichern(page)
  //--------------User-------------------------------
  await makroReplaceActivity(page) // löscht eine Aktivität und bereitet neue vor
  await flowsAktivitaeten.addActivityUser()
  await makroWeiterAbschliessenSpeichern(page)

  //--------------EinfachesFormular------------------
  await makroReplaceActivity(page)
  await flowsAktivitaeten.addAktivityEinfachesFormular()
  await clickButtonAction.clickButtonHinzufuegen()
  await fillTextAction.fillTextTitelEinfachesFormular('Testtitel')
  await fillTextAction.fillTextNameEinfachesFormular('Testname')
  await fillTextAction.fillTextPlatzhalter('Testplatzhalter')
  await fillTextAction.fillTextMinWert('1')
  await fillTextAction.fillTextMaxWert('100')
  await checkboxen.checkboxDeaktiviert()
  await clickButtonAction.clickButtonUebernehmen()
  //await makroWeiterAbschliessenSpeichern(page)
  await clickButtonAction.clickButtonWeiter()
  await clickButtonAction.clickButtonAbschliesen()
  await clickButtonAction.clickButtonSpeichern()

  //--------------Zusammenfassung---------------------
  await makroReplaceActivity(page)
  await flowsAktivitaeten.addActivityZusammenfassung()
  await clickButtonAction.clickButtonAbschliesen()
  await clickButtonAction.clickButtonSpeichern()
})
