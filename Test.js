ELObs!dev

===============================================================================================================================================================================================

Zugriff auf lldo_prod ELO Weiterbildung

http://srvpelotc01vm.elo.local:9090/ix-lldo_prod/plugin/de.elo.ix.plugin.proxy/web/#/archive/(956ABB5F-EA03-7178-6A25-489286979BC3)/


===============================================================================================================================================================================================

  Reg-Expression

  /(,\d{4}.(0?[1-9]|1[012]).(0?[1-9]|[12][0-9]|3[02]).\d{2}.\d{2}.\d{2},)/gm

===============================================================================================================================================================================================
Chaosablage dynamischer Folder

in "Zusatztest"  '!+WHERE objparent = 0' eintragen
                          
===============================================================================================================================================================================================


J-H.Ruberg@elo.com
 
No-Reply@elo.com

===============================================================================================================================================================================================
 
Inhouse Support https://eloticksy.elo.com/servicedesk/customer/portals

===============================================================================================================================================================================================
 
   
Nutzung von NetBeans

7 JPA ( NetBeans 8)

===================================================================================================================================================================    

lldo_prod  http://srvpelotc01vm.elo.local:9090/ix-lldo_prod/ix

playground http://playground.dev.elo/ix-Solutions/ix

rubergproductivity http://ruberg-productivity.dev.elo/ix-Solutions/ix

=====================================================================================================================================================================

Einstellungen Log-Level in ELO

logback.xml



=====================================================================================================================================================================

SSH-Verbindung zu Container herstellen

ssh root@ruberg-common.dev.elo -p 2214

=====================================================================================================================================================================

Codeverschleierung bei Anpassen Lizenzprüfung

Obfuscator, Verschleierung Code

https://javascriptobfuscator.com/Javascript-Obfuscator.aspx
 
Options:
 
Keep Linefeeds = false
Keep Indentations = false
Encode Strings = true
Move Strings = false
Replace Names = true


=====================================================================================================================================================================

ELOas Debugger

common

ELO Service
...
http://ruberg-pdfexport.dev.elo/ix-Solutions/ix

ARCPATH:¶Administration¶ELOas Base

C:\Users\Ruberg\AppData\Roaming\ELO Digital Office\rubergpdfexport\0\checkout

C:\Temp\Log.txt

0
 {"windows": true, "folderId": "5298", "objId": 5298, "parentId": 5872, "targetId": 5872,  "className": "sol.common_monitoring.as.MonitorTimedEvent", "classConfig": {}, "method":"checkInjection", "params":[]}
 10933
 5216
 15782
 
 

=====================================================================================================================================================================

17.02.2021


PDF Export Erweiterungen


in extra Feature Branch (analog Corona) arbeiten  (feature/BSXX..) arbeiten

https://eloticksy.elo.com/browse/BS-1114 "Epic-Branch" erstellen


BS Common BS-1114 Verbesserungen beim PDF Export

Issus in Epic z.B BS-1113 "Issue Branch" in BS-1114 "Epic-Branch" mergen (statt in master)



-Paginierung
-Email
-Weitere Dokumente


Testen mit

lib_sol.common.as.Office.lib



Vertragsmanagement->Verträge->Abonnement->C->Contelo Verlag->CD000004 Spogel Magazin


http://www.forum.elo.com/javadoc/as/12/de/elo/mover/main/pdf/PdfFileHelper.html

http://www.forum.elo.com/javadoc/as/20/de/elo/mover/main/pdf/PdfFileHelper.html




Text einfügen, Fußzeile, Kopfzeile (Seitennumerierung)

http://www.forum.elo.com/javadoc/as/20/de/elo/mover/main/pdf/PdfFileHelper.html#insertTextInPdf(java.lang.String,java.io.File,int,int,int,int,int,int,int,float,int)


    sol.create("sol.common.as.functions.OfficeConverter", {
      openFromRepo: {
        objId: "5216"
      },
      saveToRepo: {
        format: "pdf",
        parentId: "ARCPATH:/Test",
        name: "Excel1" }
    });



https://docs.oracle.com/javase/7/docs/api/java/io/File.html


https://commons.apache.org/proper/commons-io/javadocs/api-2.5/org/apache/commons/io/FileUtils.html#deleteQuietly(java.io.File)


https://pdfbox.apache.org/docs/2.0.8/javadocs/


https://docs.oracle.com/javase/8/docs/api/java/io/File.html


ruberg-pdfexport.dev.elo

static  de.elo.mover.main.helper.ConvertHelper.convertToPdf​(java.io.File sourceFile, java.io.File targetFile)   testen !!

\\multimedia2\ELO_Anwendungen\ELOas\ELOas 20.00 Miro\ELOAS 20.02.000 Build 000

Konvertierung von HTML-Dateien nach PDF untersuchen

RF_sol_common_service_ExecuteAsAction

{
            "action": "sol.unittest.as.services.Test",
            "config": {
              "objId": "1"
            }
 }




X:\JCRunner

    https://git.elo.dev/UI/elo-sans-pro/-/blob/master/ttf/ELOSansPro-Regular.ttf


=====================================================================================================================================================================

13.10.2022

BS Intern BSXX-318 Generischer Ansatz Testdatengenerierung Solutions entwickeln


https://eloticksy.elo.com/browse/BSXX-318


ruberg-testdaten in common.git aufsetzen!

Branch feature/BSXX-318 erstellen!


Generische Testdatengenerierung


sol.common.jc.ActionDefinitionUtils.js

lib_sol.common.jc.ActionHandler.js



  getConfigObject: function (cfgTemplate, data) {
    var str = Handlebars.compile(cfgTemplate)(data);
    return JSON.parse(str);
  },



sol.common.ix.services.ActionDefinitionCollector.js



executeSimpleAction

executeAdvancedAction


  /**
   * This handles the button execution. This is used by the old and the new way of registering buttons alike.
   * @param {Object} def A button definition
   */
  buttonHandler: function (def) {
    var me = this,
        objId = me.getSelection(def.button.access);

    switch (def.type) {
      case "ADVANCED_ACTION":
        sol.common.jc.ActionHelper.executeAdvancedAction(objId, def.action);
        break;
      case "SIMPLE_ACTION":
        sol.common.jc.ActionHelper.executeSimpleAction(objId, def.action);
        break;
      default:
        me.logger.error("No handler found for button definition", def.button.name);
    }
  },


"Einfache Aktion" IX

{
"type": "SIMPLE_ACTION",
"ribbon": {
"ribbonTab": {
"name": "TAB_VISITOR",
"text": "sol.visitor.client.ribbon.tabVisitor",
"iconName": "tab-sol-visitor",
"position": 96
},
"buttongroup": {
"name": "GRP_VISITOR_DOCUMENT",
"mode": "small",
"text": "sol.visitor.client.ribbon.bandDocument",
"position": 30
},
"button": {
"name": "BTN_SOL_VISITOR_CAPTUREVISITORPICTURE",
"text": "sol.visitor.client.ribbon.btnCaptureVisitorPicture",
"splitText": "sol.visitor.client.ribbon.btnCaptureVisitorPictureSplit",
"tooltipText": "sol.visitor.client.ribbon.btnCaptureVisitorPicture.tooltip",
"access": {
"document": true,
"folder": true,
"solTypes": [
"VISITOR",
"VISITOR_DOCUMENT",
"LONG_TERM_BADGE"
]
},
"web": {
"smallIcon": "sol-visitor-capturePicture16",
"bigIcon": "sol-visitor-capturePicture32",
"bigIconHighRes": "sol-visitor-capturePicture32-200",
"smallIconHighRes": "sol-visitor-capturePicture16-200"
},
"jc": {
"buttonId": "759"
},
"position": 20,
"iconName": "sol-common-takepicture"
},
"additionalButtonPositions": [
{
"ribbonTab": {
"name": "TAB_VISITOR",
"text": "sol.visitor.client.ribbon.tabVisitor",
"iconName": "tab-sol-visitor",
"position": 96,
"access": {
"solTypes": [
"VISITOR",
"VISITOR_GROUP",
"VISITOR_COMPANY",
"VISITOR_DOCUMENT",
"LONG_TERM_BADGE"
]
}
},
"buttongroup": {
"name": "GRP_SOL_VISITOR_NEW",
"text": "sol.common.client.ribbon.bandNew",
"position": 10
},
"button": {
"position": 20,
"pinned": true
}
}
]
},
"action": {
"fct": "RF_sol_visitor_action_CaptureVisitorPicture",
"cfgTemplate": "{\"visitorObjId\": \"{{objId}}\" }"
}
}



"Erweiterte Aktion" IX


{
"type": "ADVANCED_ACTION",
"ribbon": {
"ribbonTab": {
"name": "TAB_VISITOR",
"text": "sol.visitor.client.ribbon.tabVisitor",
"iconName": "tab-sol-visitor",
"position": 96
},
"buttongroup": {
"name": "GRP_VISITOR_CHECKIN",
"mode": "big",
"text": "sol.visitor.client.ribbon.bandReception",
"position": 20
},
"button": {
"name": "BTN_SOL_VISITOR_GROUP_REGISTER",
"text": "sol.visitor.client.ribbon.btnRegisterGroup",
"splitText": "sol.visitor.client.ribbon.btnRegisterGroupSplit",
"tooltipText": "sol.visitor.client.ribbon.btnRegisterGroup.tooltip",
"access": {
"document": false,
"folder": false
},
"web": {
"iconName": "tile-sol-visitor-registergroup",
"smallIcon": "sol-visitor-registerGroup16",
"bigIcon": "sol-visitor-registerGroup32",
"bigIconHighRes": "sol-visitor-registerGroup32-200",
"smallIconHighRes": "sol-visitor-registerGroup16-200"
},
"jc": {
"buttonId": "754"
},
"position": 20,
"asTile": true,
"iconName": "sol-visitor-registergroup"
},
"additionalButtonPositions": [
{
"ribbonTab": {
"name": "NEW"
},
"buttongroup": {
"name": "GRP_SOL_VISITOR",
"text": "sol.visitor.client.ribbon.bandVisitor",
"position": 24
},
"button": {
"position": 50
}
}
]
},
"action": {
"preconditions": {
"fct": "RF_sol_visitor_service_CheckVisitorGroupPreconditions"
},
"fct": "RF_sol_visitor_action_RegisterGroup",
"cfgTemplate": "{\"parentId\": \"{{objId}}\", \"visitorType\": \"{{type.name}}\", \"templateId\": \"{{type.objId}}\" }",
"locale": {
"errorDlgTitle": "sol.visitor.client.visitor.registerGroup.dialog.error.title",
"typesDlgTitle": "sol.visitor.client.visitor.registerGroup.dialog.title",
"typesDlgHeader": "sol.visitor.client.visitor.registerGroup.dialog.header",
"typesDlgText": "sol.visitor.client.visitor.registerGroup.dialog.text",
"typesDlgNoTypes": "sol.visitor.client.visitor.registerGroup.msg.notype"
},
"type": "IX"
}
}


"Erweiterte Aktion" AS

{
"type": "ADVANCED_ACTION",
"ribbon": {
"ribbonTab": {
"name": "TAB_VISITOR",
"text": "sol.visitor.client.ribbon.tabVisitor",
"iconName": "tab-sol-visitor",
"position": 96
},
"buttongroup": {
"name": "GRP_VISITOR_CHECKIN",
"mode": "big",
"text": "sol.visitor.client.ribbon.bandReception",
"position": 20
},
"button": {
"name": "BTN_SOL_VISITOR_CREATEBADGE",
"text": "sol.visitor.client.ribbon.btnCreateVisitorBadge",
"splitText": "sol.visitor.client.ribbon.btnCreateVisitorBadgeSplit",
"tooltipText": "sol.visitor.client.ribbon.btnCreateVisitorBadge.tooltip",
"access": {
"document": true,
"folder": true,
"solTypes": [
"VISITOR",
"VISITOR_GROUP",
"VISITOR_COMPANY",
"VISITOR_DOCUMENT",
"LONG_TERM_BADGE"
]
},
"web": {
"smallIcon": "sol-visitor-createBadge16",
"bigIcon": "sol-visitor-createBadge32",
"bigIconHighRes": "sol-visitor-createBadge32-200",
"smallIconHighRes": "sol-visitor-createBadge16-200"
},
"jc": {
"buttonId": "743"
},
"position": 50,
"iconName": "sol-visitor-createvisitorbadge"
},
"additionalButtonPositions": [
{
"ribbonTab": {
"name": "TAB_VISITOR",
"text": "sol.visitor.client.ribbon.tabVisitor",
"iconName": "tab-sol-visitor",
"position": 96,
"access": {
"solTypes": [
"VISITOR",
"VISITOR_GROUP",
"VISITOR_COMPANY",
"VISITOR_DOCUMENT",
"LONG_TERM_BADGE"
]
}
},
"buttongroup": {
"name": "GRP_SOL_VISITOR_NEW",
"text": "sol.common.client.ribbon.bandNew",
"position": 10
},
"button": {
"position": 10,
"pinned": true
}
}
]
},
"action": {
"preconditions": {
"fct": "RF_sol_visitor_service_CheckVisitorBadgePreconditions"
},
"solution": "visitor",
"fct": "sol.visitor.as.actions.CreateVisitorBadge",
"type": "AS",
"cfgTemplate": "{\"parentId\": \"{{objId}}\", \"targetId\": \"{{objId}}\", \"templateId\": \"{{type.objId}}\" }",
"locale": {
"errorDlgTitle": "sol.visitor.client.visitor.createVisitorBadge.dialog.error.title",
"typesDlgTitle": "sol.visitor.client.visitor.createVisitorBadge.dialog.title",
"typesDlgHeader": "sol.visitor.client.visitor.createVisitorBadge.dialog.header",
"typesDlgText": "sol.visitor.client.visitor.createVisitorBadge.dialog.text",
"typesDlgNoTypes": "sol.visitor.client.visitor.createVisitorBadge.msg.notype"
}
}
}



"Konfigurierbare Aktion"

{
"type": "ADVANCED_ACTION",
"ribbon": {
"ribbonTab": {
"name": "TAB_VISITOR",
"text": "sol.visitor.client.ribbon.tabVisitor",
"iconName": "tab-sol-visitor",
"position": 96
},
"buttongroup": {
"name": "GRP_VISITOR_LTB",
"mode": "big",
"text": "sol.visitor.client.ribbon.bandLongtermBadge",
"position": 25
},
"button": {
"name": "BTN_SOL_LONGTERM_BADGE_CREATE",
"text": "sol.visitor.client.ribbon.btnCreateLongtermBadge",
"splitText": "sol.visitor.client.ribbon.btnCreateLongtermBadgeSplit",
"tooltipText": "sol.visitor.client.ribbon.btnCreateLongtermBadge.tooltip",
"access": {
"document": false,
"folder": false
},
"web": {
"iconName": "tile-sol-visitor-createLongtermBadge",
"smallIcon": "sol-visitor-createLongtermBadge16",
"bigIcon": "sol-visitor-createLongtermBadge32",
"bigIconHighRes": "sol-visitor-createLongtermBadge32-200",
"smallIconHighRes": "sol-visitor-createLongtermBadge16-200"
},
"jc": {
"buttonId": "801"
},
"position": 10,
"asTile": true,
"iconName": "sol-visitor-createlongtermbadge"
},
"additionalButtonPositions": [
{
"ribbonTab": {
"name": "NEW"
},
"buttongroup": {
"name": "GRP_SOL_VISITOR",
"text": "sol.visitor.client.ribbon.bandVisitor",
"position": 24
},
"button": {
"position": 60
}
}
]
},
"action": {
"fct": "RF_sol_common_action_Standard",
"cfgTemplate": "{\"objId\":\"{{objId}}\",\"$new\":{\"target\":{\"mode\":\"DEFAULT\"},\"template\":{\"base\":\"ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/Long term badge types\",\"name\":\"{{type.name}}\"}},\"$name\":\"sol.visitor.CreateLongTermBadge\",\"$wf\":{\"template\":{\"name\":\"sol.visitor.longtermbadge.create\"},\"name\":\"{{translate 'sol.visitor.workflow.longtermbadge.create.name'}}\"},\"$metadata\":{\"owner\":{\"fromConnection\":true},\"solType\":\"LONG_TERM_BADGE\",\"objKeys\":[{\"key\":\"LONGTERM_BADGE_STATUS\",\"value\":\"ACTIVE\"}]},\"$events\":[{\"id\":\"DIALOG\",\"onWfStatus\":\"\"},{\"id\":\"REFRESH\",\"onWfStatus\":\"\"},{\"id\":\"GOTO\",\"onWfStatus\":\"CREATE\"}]}",
"locale": {
"errorDlgTitle": "sol.visitor.client.visitor.createLongtermBadge.dialog.error.title",
"typesDlgTitle": "sol.visitor.client.visitor.createLongtermBadge.dialog.title",
"typesDlgHeader": "sol.visitor.client.visitor.createLongtermBadge.dialog.header",
"typesDlgText": "sol.visitor.client.visitor.createLongtermBadge.dialog.text",
"typesDlgNoTypes": "sol.visitor.client.visitor.createLongtermBadge.msg.notype"
},
"type": "IX",
"selectType": {
"fct": "RF_sol_common_service_StandardTypes",
"cfgTemplate": "{ \"$types\": { \"path\": \"ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/Long term badge types\" } }"
}
},
"lic": "B1E0FF872CF557D46E4427CBED44029A",
"actionType": 3
}

=====================================================================================================================================================================

https://git.elo.dev/Weiler/notizen/-/wikis/Gen1/Tabellen-nachtr%C3%A4glich-installieren/Tabellen-nachtr%C3%A4glich-installieren

Tabellen nachträglich installieren

RF_sol_demo_service_ExecuteSqlScripts

{
  "scriptFolderRepoPath": "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/demo/SQL scripts"
}



=====================================================================================================================================================================

25.01.2024 TODO Unittests überprüfen (nach Änderungen 23.02 und 23-nightly Stack aufbauen bzw. auf playground  und Tests durchlaufen lassen!)

nochmal unter 23.02 testen!


QoL Feature für Entwickler: JIRA Issues+Branch via der ELO CLI erstellen

elo-sol create-issue 


common

elo-sol prepare -stack ruberg-common -workspace jan -version 20.00


contract

elo-sol prepare -stack ruberg-contract -workspace de -version 20.00


hr

elo-sol prepare -stack ruberg-hr -workspace de -version 20.00



invoice

elo-sol prepare -stack ruberg-invoice -workspace jan -version 20.00


knowledge

elo-sol prepare -stack ruberg-knowledge -workspace default -version 20.00


learning

elo-sol prepare -stack ruberg-learning -workspace default -version 20.00


https://eloticksy.elo.com/browse/BSL-611

BS Learning BSL-611 Unittests erweitern


productivity

elo-sol prepare -stack ruberg-productivity -workspace jan -version 20.00


pubsec

elo-sol prepare -stack ruberg-pubsec -workspace de -version 20.00


TODO 02.02.2024	

recruiting

elo-sol prepare -stack ruberg-recruiting -workspace de -version 20.00


visitor

elo-sol prepare -stack ruberg-visitor -workspace de -version 20.00


teamroom

elo-sol prepare -stack ruberg-teamroom -workspace jan -version 20.00


meeting

elo-sol prepare -stack ruberg-meeting -workspace premium-groupware -version 20.00



Masken updaten!

[action]


[dynkwl]	


[function]	


[libas]	

	
[libix]		


[lib]			


[service]	

=====================================================================================================================================================================

CLI-Tool für VM's

MJ623-4CH15-M81QC-0TAH4-2WU00

elo-sol push -workspace default -ixUrl http://192.168.75.159:9090/ix-Demo/ix

elo-sol push -workspace jan -ixUrl http://elodemo:9090/ix-Demo/ix

http://192.168.52.128:9090/ix-Demo/ix

http://elodemo:9090/ix-Demo/ix


=====================================================================================================================================================================

Lizenzen

https://git.elo.dev/bs/support/-/wikis/Stack/Lizenz-aktualisieren/Lizenz-aktualisieren


https://git.elo.dev/bs/support/-/wikis/Stack/Lizenz-aktualisieren/Lizenz-aktualisieren#lizenz-in-postgres-aktualisieren

=====================================================================================================================================================================


/html/body/div/div[1]/div[3]/div[5]/a


Xpath //legend[contains(text(), "Radio")]//following-sibling::label//following-sibling::input

XPath: /html/body/form/div/div[1]/ul/li[2]/a/acronym

Meeting-Board anlegen

Name	"Meetingboard1" "IX_GRP_MEETING_BOARD_NAME"

Kürzel  "MB1"			"IX_GRP_MEETING_BOARD_CODE"


<button name="NEXTNODE" elowfid="7" type="button">OK</button>

"//*[@id=\"ext-comp-1274-textEl\"]"


xpath Console

$x("//input[@id='bmradio']") 


CSS-Selector

$$("..")


Addline-Button

$x("//input[@addlineid='organizer']") "Allgemein"

$x("//*[@addlineid='organizer']") 



$x("//*[@class='dynamicswl']") 


http://ruberg-meeting.dev.elo/ix-Solutions/plugin/de.elo.ix.plugin.proxy/wf/wf/sol_meeting_board.jsp?wfid=239&nodeid=1&ticket=de.elo.ix.client.ticket_from_cookie&lang=de



"//*[@id="tile-1013"]"

		
=====================================================================================================================================================================

14.11.2022

Java Training

https://gitlab.javatraining.de/events/20221114-java-advanced-elo-stuttgart

openjdk amazon corretto, adoptium (kostenlose Verwendung möglich, oracle erfordert Lizenz!)

Java Versionen 8, 11 oder 17 werden verwendet.

Änderungen

var Statement
switch 

ab Java 9 Modul-System

Wichtige Tastenkürzel:

Alt Einfügen

Legacy Collections

Stack

Vector

HashTable

Properties



Ein Prozess hat mehrere Threads

Prozesse laufen in getrennten Speicherbereichen
Thread teilen sich Speicherbereichen

Class Semaphore
CountDownLatch

volatile Schlüsselwort wie in c 


Bibliotheken JSON

Jackson
Gson

=====================================================================================================================================================================


https://docs.github.com/de/authentication/connecting-to-github-with-ssh/working-with-ssh-key-passphrases


Passphrase hinzufügen oder ändern (in git bash)


$ ssh-keygen -p -f ~/.ssh/id_ed25519
> Enter old passphrase: [Type old passphrase]
> Key has comment 'your_email@example.com'
> Enter new passphrase (empty for no passphrase): [Type new passphrase]
> Enter same passphrase again: [Repeat the new passphrase]
> Your identification has been saved with the new passphrase.

=====================================================================================================================================================================



git@github.com:JHRubergelocom/BusinessSolutions.git


git@github.com:JHRubergelocom/SeleniumBasics.git


C:\Users\ruberg\.ssh\Testkey.ppk


"http://ruberg-meeting.dev.elo/ix-Solutions/plugin/de.elo.ix.plugin.proxy/web/"



http://ruberg-common.dev.elo/


Mehrere, nur den sichtbaren klicken !!

$x("//*[@name='JS_ADDLINE']")

=====================================================================================================================================================================

Testen moderne Web apps anschauen!

https://playwright.dev/


origin

git@github.com:JHRubergelocom/SeleniumSession.git

C:\Users\ruberg\.ssh\Testkey.ppk

"npx playwright codegen"  Codegenerator starten


===========================================================================================================================



Installationsanleitung von Testautomatisierung mit Playwright unter java

1.) Java 17 installieren

https://www.oracle.com/java/technologies/downloads/#jdk17-windows


2.) Systemvariablen setzen

PLAYWRIGHT_JAVA_SRC 	C:\Users\ruberg\OneDrive - ELO Digital Office GmbH\Dokumente\Entwicklung\Playwright

3.) ps1-Datei für Programmaufruf setzen

java "-Dfile.encoding=UTF-8" -jar PlaywrightSession.jar QBSHR-58 PlaywrightConfig.json JiraConnectionConfig.json


===========================================================================================================================


Von gitlab holen

git@git.elo.dev:bs/testautomation.git   -> PlaywrightSession

git clone git@git.elo.dev:bs/testautomation.git PlaywrightSession


Nach github

git@github.com:JHRubergelocom/PlaywrightSession.git


=====================================================================================================================================================================

05.06.23 (Stack ruberg-common)

TODO common für Erweiterungen pdfExport in Meeting (Sitzungsmappe)

helper weekdayname hinzufügen:


// TODO weekdayName
Handlebars.registerHelper("weekdayName", function (options) {
  var weekDayName = "",
      isoDate, zoneId, javaDate, dow,
      textStyleString, textStyle, localeString;

  isoDate = options.hash.isoDate || moment().format("YYYYMMDD");
  if (/^\d{8}/.test(isoDate)) {
    zoneId = java.time.ZoneId.of("Europe/Paris");
    javaDate = java.time.ZonedDateTime.of(java.time.LocalDate.of(java.lang.Integer.parseInt(isoDate.substring(0, 4)), java.lang.Integer.parseInt(isoDate.substring(4, 6)), java.lang.Integer.parseInt(isoDate.substring(6, 8))), java.time.LocalTime.of(0, 0), zoneId);
    textStyleString = options.hash.textStyle || "FULL";
    textStyle = java.time.format.TextStyle[textStyleString.toUpperCase()];
    localeString = options.hash.locale || "en";
    dow = javaDate.getDayOfWeek();
    weekDayName = dow.getDisplayName(textStyle, new java.util.Locale(localeString));
  }

  return new Handlebars.SafeString(weekDayName);
});
// TODO weekdayName

// Einbauen in Unittests common

RF_sol_unittest_service_ExecuteLib

{
	"className": "sol.common.Template",
	"classConfig": { "source": "{{weekdayName isoDate='20230525' textStyle='FULL' locale='de'}}" },
	"method": "apply",
	"params": []
}


=====================================================================================================================================================================

TODO 26.09.2023


BS Intern BSXX-515 Testautomatisierung mit Playwright

https://eloticksy.elo.com/browse/BSXX-515


Ideen für Erweiterungen automatisierte Tests

* Automatisierte Prüfungen von Vorbedingungen
* Actiondefinitions aus Unittests auch in Playwright testen (pro Solution alle Menüpunkte durchgehen!)



Playwright Testcases QS BS HR Personnel File Xray REST API


Ideen für Erweiterungen automatisierte Tests

    Einarbeiten XRay und Zusammenspiel mit Playwright untersuchen
    Untersuchen REST/API Java für Im/Export Xray -> Java Testautomatisierung

	
	 
	 

Playwright mit XRay kombinieren Idee untersuchen !!


https://www.atlassian.com/de/devops/testing-tutorials/jira-xray-integration-manage-test-cases


https://docs.getxray.app/display/XRAY/Testing+web+applications+using+Playwright#


https://academy.getxray.app/


https://eloticksy.elo.com/browse/QBSHR-56  "aut. Eintrittsprozess: Stammdaten kontrollieren"



Design Excel/CSV Importer



Untersuchen REST/API Java für Im/Export Xray -> Java Testautomatisierung


https://eloticksy.elo.com/secure/Dashboard.jspa     baseURL          



curl -H "Authorization: Basic ZnJlZDpmcmVk" -X GET -H "Content-Type: application/json" http://localhost:8080/rest/api/2/issue/createmeta


https://eloticksy.elo.com/rest/api/2/search?jql=



https://eloticksy.elo.com/rest/api/2/search?jql=assignee=Jan-Hendrik%20Ruberg

https://eloticksy.elo.com/rest/api/2/search?jql=assignee=Jan-Hendrik%20Ruberg

https://eloticksy.elo.com/rest/api/2/issue/QBSHR-51


http://eloticksy.elo.com/rest/raven/1.0/api/testset/QBSHR-51/test


http://eloticksy.elo.com/rest/raven/1.0/api/test?keys=QBSHR-51


https://eloticksy.elo.com/browse/QBSHR-51


https://eloticksy.elo.com/browse/QBSHR-51


Passwort verschlüsseln in Anwendung


Untersuchen POST mit Playwright



TODO

Testlauf in jira zurückschreiben!



https://docs.getxray.app/display/XRAY/Import+Execution+Results#ImportExecutionResults-XrayJSONformat



https://eloticksy.elo.com/rest/raven/1.0/api/test/QBSHR-50/testexecutions

https://eloticksy.elo.com/rest/raven/1.0/api/test/QBSHR-50/testruns


https://eloticksy.elo.com/rest/raven/1.0/api/test/QBSHR-50/testexecutions


https://eloticksy.elo.com/rest/api/2/issue/111818



Design Jira integration

JiraConnectionConfig analog PlaywrightConfig

{
	baseURL: "https://eloticksy.elo.com"
	username: "J-H.Ruberg@elo.com"
	password: "XXX"
}



JiraSession analog WebclientSession designen


https://eloprojects.atlassian.net/browse/DAT-1035

https://eloprojects.atlassian.net/browse/DAT-948


http://eloticksy.elo.com/rest/raven/1.0/api/test?keys=QBSHR-51

http://eloprojects.atlassian.net/rest/raven/1.0/api/test?keys=DAT-948


https://eloprojects.atlassian.net/rest/api/2/issue/DAT-948


{
  "baseURL": "https://eloticksy.elo.com",
  "username": "J-H.Ruberg@elo.com",
  "password": "XXX"
}

Testdaten in Jira Xray Test integrieren

Jira Xray Datensätze Parameter erstellen und Daten importieren!



TODO Testergebnis nach Jira zurückschreiben (Update TestExecution)

JiraConnectionConfig.json um testExecutionKey erweitern (für "QBSHR-66")




https://eloticksy.elo.com/rest/raven/1.0/api/testexec/QBSHR-66/test


https://eloticksy.elo.com/rest/raven/1.0/execution/result?testExecKey=QBSHR-66&testKey=QBSHR-58


https://eloticksy.elo.com/rest/raven/1.0/api/testruns?testExecKey=QBSHR-66



https://eloticksy.elo.com/rest/raven/1.0/api/testplan/QBSHR-69/testexecution



Testplan QBSHR-69




Untersuchen Daten Testausführung mit Parameter !!



https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testExecIssueKey=QBSHR-58




Probieren Xray Test API 2 Datasets exportieren


1.) Einlesen Test 


		js.getJiraXrayTest(..)
        APIResponse response = request.get("/rest/raven/1.0/api/test", RequestOptions.create().setQueryParam("keys", xrayTest));
		
2.) Einlesen Dataset von Test (CSV-Datei mit Parameter)


curl -X 'GET' \
  'https://sandbox.xpand-it.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR-58' \
  -H 'accept: text/csv'




3.) Update 

		js.updateJiraXrayTestExecution(..)
        APIResponse response = request.post("/rest/raven/1.0/import/execution", RequestOptions.create().setData(testExecutionObject));


https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR-58



curl --user J-H.Ruberg@elo.com:XXX  -X GET https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR-58 -H accept: text/csv

curl -u J-H.Ruberg@elo.com:XXX  -X GET https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR-58 -H 'accept: text/csv'


https://eloticksy.elo.com/browse/QBSHR-65


Gedanken machen für Abbilden Test in Jira:

- Trennen von Testdaten von allgemeinen ELO interna (Stackname, interne Felddefinitionen, in JiraConnectionConfig übernehmen!)	
	
- Allegemein überlegen wie technische Masken-/Felddefinitionen für solution (hr) in JiraConnectionConfig hinterlegt werden können

- Entwickeln Transformationssyntax Jiratest nach Playwright



Test geklont von QBSHR-65

https://eloticksy.elo.com/browse/QBSHR-80





JiraConnectionConfig um technische Infos elo Playwright erweitern


CheckSubFolder{{ Organigramm|Ordner_Organigramm }}


In Testreport Jira Dataset-Parameter anzeigen und Data Funktion (z.B.: CheckFolder {{ .. }})

Testreport als Email an Tester senden!


Funktion zum Anlegen von Testusern implementieren erledigt!



Neue Ideen Jira -> Playwright



Syntax für jira-Testschritt Datenfeld


Prosa
{{
  Login(Benutzer|Passwort);
  CheckFolder(Ordner|Sichtbarkeit);
  .... n Bausteine
  CheckSubFolder(Ordner|Sichtbarkeit)
}}
Prosa


ELOControl Anzeigenamen als MapKey verwenden(für Jira-Test) erweitern!


Original "QBSHR-65" überprüfen mit Syntax für jira-Testschritt Datenfeld, okay


Datenstrukter ELOAction/ELOTask (IActionTask) erweitern, welcher Button am Ende geklickt wird (formulaSaveButton/formulaCancelButton)



TODO Weitere Tests ab 11.09.2023

https://eloticksy.elo.com/browse/QBSHR-78



test-business-solutions@elo.local

test-business-solutions@elo.local

https://eloticksy.elo.com/browse/QBSHR-77

https://eloticksy.elo.com/browse/QBSHR-75

https://eloticksy.elo.com/browse/QBSHR-64

https://eloticksy.elo.com/browse/QBSHR-11


=====================================================================================================================================================================

Playground neu starten

https://srvpelotc01vm.elo.local/ix-lldo_prod/plugin/de.elo.ix.plugin.proxy/wf/apps/app/sol.knowledge.apps.KnowledgeBoard/?lang=de&useSSO=true&timezone=Europe%2FBerlin&#/post/(E03BCFB3-68E8-A7EB-3013-19405538E8C2)




=====================================================================================================================================================================

Dokus Business Solutions

https://supportweb.elo.com/de-de/business-solutions.html


Dokus Testautomatisierung


https://elo0-my.sharepoint.com/:o:/g/personal/d_wohlfrom_elo_com/EiOaADgutbNKivPOW3AK7rQBSoxcoFQaCHKzoA8zS5SsCg?email=J.Ruberg%40elo.com&e=5%3aF6iruh&fromShare=true&at=9  



=====================================================================================================================================================================

23.11.2023



<a class="x-btn elo-ribbonTabBarBtn x-unselectable x-btn-default-toolbar-small x-noicon x-btn-noicon x-btn-default-toolbar-small-noicon" hidefocus="on" unselectable="on" tabindex="0" id="button-1271" style=""><span id="button-1271-btnWrap" role="presentation" class="x-btn-wrap" unselectable="on"><span id="button-1271-btnEl" class="x-btn-button" role="presentation"><span id="button-1271-btnInnerEl" class="x-btn-inner x-btn-inner-center" unselectable="on" __playwright_target__="after@call@188">Meeting</span><span role="presentation" id="button-1271-btnIconEl" class="x-btn-icon-el  " unselectable="on" style=""></span></span></span></a>



<a class="x-btn elo-togglebtn right x-unselectable x-box-item x-btn-default-small x-noicon x-btn-noicon x-btn-default-small-noicon x-pressed x-btn-pressed x-btn-default-small-pressed" hidefocus="on" unselectable="on" tabindex="0" id="button-2009" style="right: auto; left: 0px; top: 0px; margin: 0px;"><span id="button-2009-btnWrap" role="presentation" class="x-btn-wrap" unselectable="on"><span id="button-2009-btnEl" class="x-btn-button" role="presentation"><span id="button-2009-btnInnerEl" class="x-btn-inner x-btn-inner-center" unselectable="on" __playwright_target__="after@call@213">Meeting</span><span role="presentation" id="button-2009-btnIconEl" class="x-btn-icon-el  " unselectable="on" style=""></span></span></span></a>



=====================================================================================================================================================================



https://eloticksy.elo.com/browse/BSXX-523


Playwright Testcases BS Gen 1.0

BS 1.0 Welt


TODO ab 25.01.2024



Invoice


common_document -> sol.common_document.PdfExport

checklist -> sol.checklist.CreateChecklist


development -> sol.dev.function.ClearGlobalConfigCache
			-> sol.dev.function.Deploy
			-> sol.dev.function.Undeploy
			-> sol.dev.ix.actions.CreatePackage
			
notify		-> sol.notify.ix.actions.Configure

privacy		-> sol.privacy.gdpr.processingactivity.approve
			-> sol.privacy.gdpr.processingactivity.create
			-> sol.privacy.gdpr.processingactivity.CreateDocument
			-> sol.privacy.gdpr.processingactivity.delegate



https://miro.com/app/board/uXjVNee-qXo=/?share_link_id=839844681266




Zugriff-Token Playwright statt User Passwort  -> 	Anpassen JiraSession.getToken


NjIyODU2ODgwMjIyOp57m8T/HukvBOC2PJyieW31bPw6


https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html

Using Personal Access Tokens | Atlassian Support | Atlassian Documentation





curl -H "Authorization: Bearer <yourToken>" https://{baseUrlOfYourInstance}/rest/api/content


String command = "curl -u " + username + ":" + password  + " -X GET https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testIssueKey=" + xrayTest + " -H accept: text/csv";


curl -H "Accept: application/json" -H "Authorization: Bearer MDkzNjIyMTEwNjQzOqb+ApTGm3af+z3eGdcyDm7xHv6R" https://jiraserver.example.com/rest/raven/1.0/api/test/CALC-1880/step



curl -H "Accept: application/json" -H "Authorization: Bearer MDkzNjIyMTEwNjQzOqb+ApTGm3af+z3eGdcyDm7xHv6R" https://jiraserver.example.com/rest/raven/1.0/api/test/CALC-1880/step



curl -X 'GET' \
  'https://sandbox.xpand-it.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR65' \
  -H 'accept: text/csv'




curl -u J-H.Ruberg@elo.com:]u -X GET https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR-50 -H accept: text/csv


curl -u :MTY4NTYxMzk3MzI1OrkSUN9jwOFojc/wksP0UvEq5Wam -X GET https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR-50 -H accept: text/csv




curl -u J-H.Ruberg@elo.com:]u -X GET https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR-50 -H accept: text/csv

curl -u J-H.Ruberg@elo.com:XXX -X GET https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR-65 -H accept: text/csv



curl -H accept: text/csv -H Authorization: Bearer MTY4NTYxMzk3MzI1OrkSUN9jwOFojc/wksP0UvEq5Wam -X GET https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR-65



curl -H accept: text/csv -H Authorization: Bearer NjIyODU2ODgwMjIyOp57m8T/HukvBOC2PJyieW31bPw6 -X GET https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR-65



curl -u J-H.Ruberg@elo.com:NjIyODU2ODgwMjIyOp57m8T/HukvBOC2PJyieW31bPw6 -X GET https://eloticksy.elo.com/rest/raven/2.0/api/dataset/export?testIssueKey=QBSHR-65 -H accept: text/csv


NjIyODU2ODgwMjIyOp57m8T/HukvBOC2PJyieW31bPw6








=======================================================


Eigene E-Mail-Adresse




Kompletter hr Test laufen lassen ()Test suite mit alles Skripten !!

Bei Contract Freigabe testen !!


IX_MAP_HR_PERSONNEL_SENDER

=======================================================





DISTRIB_DESCRIPTION="Ubuntu 20.04.5 LTS"

Ubuntu VM einrichten


=====================================================================================================================================================================




Playwrighttraining 28.09.2023

Terminal in VS-Code Projekt-Ordner öffnen

Schneller Setup mit

npm init playwright

Testablauf

npx playwright test

npx playwright show-report


//*[@id="planGrid_planChoice_2"]

/html/body/div[1]/div/div/div/div[2]/div/div[1]/div[2]/div[1]/div/label[3]/input


#//*[@id="appMountPoint"]/div/div/div/div[2]/div/div[2]/button


#alert1


#angebot

npx playwright codegen

import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.google.de/');
  await page.getByRole('button', { name: 'Alle akzeptieren' }).click();
  await page.getByLabel('Suche', { exact: true }).click();
  await page.getByLabel('Suche', { exact: true }).fill('Testautomatisierung');
  await page.getByLabel('Google Suche').first().click();
  await page.getByRole('link', { name: 'Alles über Testautomatisierung - #1 in Testautomatisierung andagon https://www.andagon.com' }).click();
});


Allure Report

npm i -D allure-commandline
npx allure generate --clean allure-results
npx allure open .\allure-report

mkdir build/allure-results/history
cp allure-report/history/* build/allure-results/history

allure generate --clean build/allure-results
allure open