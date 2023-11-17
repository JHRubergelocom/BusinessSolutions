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

19.09.2023 TODO Unittests überprüfen (nach Änderungen 23.02 Stack aufbauen  und Tests durchlaufen lassen!)

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


productivity

elo-sol prepare -stack ruberg-productivity -workspace jan -version 20.00


pubsec

elo-sol prepare -stack ruberg-pubsec -workspace de -version 20.00


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


25.05.2023

BS Meeting BSMM-2856 Überarbeitung Sitzungsmappe

https://eloticksy.elo.com/browse/BSMM-2856


sol.meeting_premium.document.speaker=Vorgetragen von


{{translate "sol.meeting_premium.document.fileHeader" settings.mapKeys.CURRENT_LANGUAGE}}


				<fo:block font-size="16pt">{{meeting.objKeys.MEETING_LOCATION}} {{#if meeting.objKeys.MEETING_ROOM}}({{meeting.objKeys.MEETING_ROOM}}){{/if}}</fo:block>


				<fo:block font-size="12pt" text-align="center" margin-top="3pt">{{../meeting.objKeys.MEETING_LOCATION}}, {{../meeting.objKeys.MEETING_ROOM}}</fo:block>




				<fo:block font-size="12pt" margin-top="0pt" margin-left="0pt">{{translate "sol.meeting_premium.document.speaker" ../../settings.mapKeys.CURRENT_LANGUAGE}}: &#160;&#160;&#160;&#160;&#160;{{#if objKeys.MEETING_ITEM_SPEAKER}}{{objKeys.MEETING_ITEM_SPEAKER}}{{else}}<fo:inline font-style="italic">{{translate "sol.meeting_premium.document.notDefined" ../../settings.mapKeys.CURRENT_LANGUAGE}}</fo:inline>{{/if}}</fo:block>

				<fo:block font-size="12pt" color="#004072" margin-top="3pt">{{translate "sol.meeting_premium.document.speaker" ../../settings.mapKeys.CURRENT_LANGUAGE}}: {{#if objKeys.MEETING_ITEM_SPEAKER}}{{objKeys.MEETING_ITEM_SPEAKER}}{{else}}<fo:inline font-style="italic">{{translate "sol.meeting_premium.document.notDefined" ../../settings.mapKeys.CURRENT_LANGUAGE}}</fo:inline>{{/if}}</fo:block>


Hauptstandort
Besprechungsraum 1



									<fo:basic-link internal-destination="{{id}}">
										{{name}}
										<fo:inline>
											<fo:leader leader-pattern="dots"/>
										</fo:inline>
										<fo:page-number-citation ref-id="{{id}}"/>
									</fo:basic-link>



		

<fo:leader leader-alignment="reference-area" leader-pattern="dots" leader-length="60mm"/>



Anregung Marcel, Anzeige der Seitenzahl in der TOP Übersicht 

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




{{
	OpenFormular(Neu|Personal|Neuer Mitarbeiter);
	... optional Felder ausfüllen ...
	TestShouldFail();	
	QuitButton(Speichern);
}}



{{
	OpenFormular(Neu|Personal|Neuer Mitarbeiter);
	InputField(Vorname|Hans);
	InputField(Nachname|Hansen);
	InputField(Personalverantwortlicher|HR);
	CheckFieldEqual(Vorname|Hans);
	CheckFieldEqual(Nachname|Hansen);
	CheckFieldExist(Personalnummer)
}}

{{
	QuitButton(Speichern)
}}




{{
  Login(Ute Schenk|elo);
  SelectEntry(Hans|Hansen);
  OpenFormular(Personal|Personal|Nachricht);
  InputField(Empfänger|test-business-solutions@elo.local);
  InputField(Absender|test-business-solutions@elo.local);
  InputField(Betreff|Geschäftsnachricht);
  InputField(|Inhalt Geschäftsnachricht);  
  SelectAttachment(Anhang hinzufügen|Solutions/PDF Export/bob ipsum PDF);
  QuitButton(Speichern);
  SelectEntry(Hans|Hansen);
  SelectSubEntry(Korrespondenz/Geschäftsnachricht);
  SelectViewerForm()
}}







TODO Weitere Tests ab 11.09.2023

https://eloticksy.elo.com/browse/QBSHR-78


{{
  Login(Ute Schenk|elo);
  SelectFolder(Solutions/Personalmanagement/Personalakten/K/Kraft, Bodo);
  OpenFormular(Personal|Personal|Nachricht);
  InputField(Vorlage|Clips_v1);
  InputField(Empfänger|test-business-solutions@elo.local);
  CheckFieldEqual(Absender|personal@contelo.com);
  QuitButton(Speichern);
}}



{{Login({test-param}Benutzer{test-param}|elo)}}

SelectFolder(FolderPath);

SelectFolder(Solutions/Personalmanagement/Personalakten/K/Kraft, Bodo)


Nachrichten Vorlage "Clips_v1" erstellen (siehe https://eloticksy.elo.com/browse/QBSHR-76)

<!--StartFragment--><ul>
<li>Abteilung: {{sord.objKeys.HR_PERSONNEL_DEPARTMENT}}</li><li>Austrittsdatum: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_DATEOFLEAVING}}</li><li>Bereich: {{sord.objKeys.HR_PERSONNEL_DIVISION}}</li><li>Bundesland: {{sord.mapKeys.HR_PERSONNEL_STATE}}</li><li>Eintrittsdatum: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_DATEOFJOINING}}</li><li>Ende der Probezeit: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_ENDOFPROBATIONARY}}</li><li>Fachlich Versantworlticher: {{sord.objKeys.HR_PERSONNEL_MENTOR}}</li><li>Land: {{sord.objKeys.HR_PERSONNEL_COUNTRY}}</li><li>Letzter Arbeitstag: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_LASTDAYOFWORK}}</li><li>Nachname: {{sord.objKeys.HR_PERSONNEL_LASTNAME}}</li><li> Personalnummer: {{sord.objKeys.HR_PERSONNEL_PERSONNELNO}}</li><li> Postleitzahl: {{sord.objKeys.HR_PERSONNEL_POSTALCODE}}</li><li>Standort: {{sord.objKeys.HR_PERSONNEL_LOCATION}}</li><li>Stellenbezeichnung: {{sord.objKeys.HR_PERSONNEL_JOBTITLE}}</li><li> Straße: {{sord.mapKeys.HR_PERSONNEL_STREETADDRESS}}</li><li>Team: {{sord.objKeys.HR_PERSONNEL_TEAM}}</li><li>Titel: {{sord.objKeys.HR_PERSONNEL_TITLE}}</li><li>Vorgesetzter: {{sord.objKeys.HR_PERSONNEL_SUPERIOR}}</li><li>Vorname: {{sord.objKeys.HR_PERSONNEL_FIRSTNAME}}</li><li> Wohnort: {{sord.objKeys.HR_PERSONNEL_CITY}}</li>
</ul>
<!--EndFragment-->


Datenstruktur Vorbedingungen Konzept

preconditions {
	groups: {group, ... }	
	users: {{user1, group1}, ... }
	templates: {
		template1, 
		....		
	}
}

template: { 
	arcPath: "Personalmanagement/Nachrichtenvorlagen/Clips_v1"
	createAction: {
		eloControls: [
		    Name: Clips_v1,	"IX_NAME"
			Von: Personalabteilung <personal@contelo.com>,  "IX_MAP_HR_PERSONNEL_SENDER"
			Betreff: Test mit allen Clips "IX_GRP_COMMUNICATION_SUBJECT"
			Nachricht: <!--StartFragment--><ul>
<li>Abteilung: {{sord.objKeys.HR_PERSONNEL_DEPARTMENT}}</li><li>Austrittsdatum: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_DATEOFLEAVING}}</li><li>Bereich: {{sord.objKeys.HR_PERSONNEL_DIVISION}}</li><li>Bundesland: {{sord.mapKeys.HR_PERSONNEL_STATE}}</li><li>Eintrittsdatum: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_DATEOFJOINING}}</li><li>Ende der Probezeit: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_ENDOFPROBATIONARY}}</li><li>Fachlich Versantworlticher: {{sord.objKeys.HR_PERSONNEL_MENTOR}}</li><li>Land: {{sord.objKeys.HR_PERSONNEL_COUNTRY}}</li><li>Letzter Arbeitstag: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_LASTDAYOFWORK}}</li><li>Nachname: {{sord.objKeys.HR_PERSONNEL_LASTNAME}}</li><li> Personalnummer: {{sord.objKeys.HR_PERSONNEL_PERSONNELNO}}</li><li> Postleitzahl: {{sord.objKeys.HR_PERSONNEL_POSTALCODE}}</li><li>Standort: {{sord.objKeys.HR_PERSONNEL_LOCATION}}</li><li>Stellenbezeichnung: {{sord.objKeys.HR_PERSONNEL_JOBTITLE}}</li><li> Straße: {{sord.mapKeys.HR_PERSONNEL_STREETADDRESS}}</li><li>Team: {{sord.objKeys.HR_PERSONNEL_TEAM}}</li><li>Titel: {{sord.objKeys.HR_PERSONNEL_TITLE}}</li><li>Vorgesetzter: {{sord.objKeys.HR_PERSONNEL_SUPERIOR}}</li><li>Vorname: {{sord.objKeys.HR_PERSONNEL_FIRSTNAME}}</li><li> Wohnort: {{sord.objKeys.HR_PERSONNEL_CITY}}</li>
</ul>
<!--EndFragment-->
			"IX_DESC"
			
			
		],
		actionDefinition: [
		   name: "sol.hr.personnel.EmployeeCorrespondenceTemplate"
		]
		
	}	
}



TODO 18.09.2023


Benutzer,Personalakte,Vorlage,Abteilung,Bereich,Bundesland,Eintrittsdatum,Ende der Probezeit,Fachlich Verantwortlicher,Land,Nachname,Personalnummer,Postleitzahl,Standort,Stellenbezeichnung,Straße,Vorgesetzter,Vorname,Wohnort,Ordner
Administrator,"Solutions // Personalmanagement // Personalakten // B // Baum, Gerd",Clips_v1,Finanzen & Organisation,Zentrale Verwaltung,Baden-Württemberg,01.05.2007,31.10.2007,Gerd Baum,DE - Deutschland,Baum,D0000004,70469,Zentrale,Kaufmännischer Leiter,Klettenweg 8a,Bodo Kraft,Gerd,Stuttgart,"Solutions // Personalmanagement // Personalakten // B // Baum, Gerd // Korrespondenz"
hr_test_creators,"Solutions // Personalmanagement // Personalakten // C // Cooper, Daniel",Clips_v1,Head of Business Development US,Company Management,Massachusetts,01.04.2009,31.07.2023,leer,US - Vereinigte Staaten von Amerika,Cooper,D0000006,02108,Boston HQ,leer,58 Beacon Street,Daniel Cooper,Daniel,Boston,"Solutions // Personalmanagement // Personalakten // C // Cooper, Daniel // Korrespondenz"
hr_test_doc_creators,"Solutions // Personalmanagement // Personalakten // E // Eichner, Jan",Clips_v1,Assistenz CEO,Geschäftsführung,Baden-Württemberg,01.08.2015,31.01.2016,leer,DE - Deutschland,Eichner,D0000022,70191,Zentrale,Assistent,Stresemannstraße 14,Bodo Kraft,Jan,Stuttgart,"Solutions // Personalmanagement // Personalakten // E // Eichner, Jan // Korrespondenz"
hr_test_editors,"Solutions // Personalmanagement // Personalakten // F // Funk, Verona",Clips_v1,Rechnungswesen,Zentrale Verwaltung,Baden-Württemberg,01.12.2015,31.05.2016,leer,DE - Deutschland,Funk,D0000054,70567,Zentrale,Finanzbuchhaltung,Schottstraße 84b,Gerd Baum,Verona,Stuttgart,"Solutions // Personalmanagement // Personalakten // F // Funk, Verona // Korrespondenz"
rh_test_org_creators,"Solutions // Personalmanagement // Personalakten // K // Keil, Fritz",Clips_v1,Produktmanagement,Produktion,Baden-Württemberg,01.07.2014,31.12.2014,leer,DE - Deutschland,Keil,D0000078,70174,Zentrale,Leiter Produkte,Leiblweg 36,Bodo Kraft,Fritz,Stuttgart,"Solutions // Personalmanagement // Personalakten // K // Keil, Fritz // Korrespondenz"
hr_test_org_viewers,"Solutions // Personalmanagement // Personalakten // R // Renz, Sandra",Clips_v1,Customer Service,Zentrale Verwaltung,Baden-Württemberg,03.02.2022,31.08.2022,leer,DE - Deutschland,Renz,D0000122,70000,Zentrale,Customer Service,Weg 2,Gerd Baum,Sandra,Stuttgart,"Solutions // Personalmanagement // Personalakten // R // Renz, Sandra // Korrespondenz"
hr_test_managers,"Solutions // Personalmanagement // Personalakten // R // Reuter, Thomas",Clips_v1,Recht & Verwaltung,Zentrale Verwaltung,Baden-Württemberg,01.05.2020,31.10.2020,leer,DE - Deutschland,Reuter,D0000026,70565,Zentrale,Unternehmensjurist,Endersbacher Str. 10,Bodo Kraft,Thomas,Stuttgart,"Solutions // Personalmanagement // Personalakten // R // Reuter, Thomas // Korrespondenz"
hr_test_everyone,"Solutions // Personalmanagement // Personalakten // K // Kraft, Bodo",Clips_v1,leer,Geschäftsführung,Baden-Württemberg,05.01.1998,31.07.2023,leer,DE - Deutschland,Kraft,D0000001,70376,Zentrale,CEO,Thomastraße 17,Gerd Baum,Bodo,Stuttgart,"Solutions // Personalmanagement // Personalakten // K // Kraft, Bodo // Korrespondenz"



Datenstrukturen Vorbedingungen (Templates, User) entwickeln!



Das Feld "Redactor box" hat folgenden Daten:

Text: Clip inhalt
 * Abteilung: {test-param}Abteilung{test-param} 
 * Austrittsdatum: {color:#de350b}aktuelles Datum{color}
 * Bereich: {test-param}Bereich{test-param} 
 * Bundesland: {test-param}Bundesland{test-param} 
 * Eintrittsdatum: {test-param}Eintrittsdatum{test-param} 
 * Ende der Probezeit: {test-param}Ende der Probezeit{test-param} 
 * Fachlich Verantwortlicher: {test-param}Fachlich Verantwortlicher{test-param} 
 * Land: {test-param}Land{test-param} 
 * Letzter Arbeitstag: {color:#de350b}aktuelles Datum{color}
 * Nachname: {test-param}Nachname{test-param} 
 * Personalnummer: {test-param}Personalnummer{test-param} 
 * Postleitzahl: {test-param}Postleitzahl{test-param} 
 * Standort: {test-param}Standort{test-param} 
 * Stellenbezeichnung: {test-param}Stellenbezeichnung{test-param} 
 * Straße: {test-param}Straße{test-param} 
 * Team: leer
 * Titel: leer
 * Vorgesetzter: {test-param}Vorgesetzter{test-param} 
 * Vorname: {test-param}Vorname{test-param} 
 * Wohnort: {test-param}Wohnort{test-param}
 
 
 
<!--StartFragment-->
<ul>
<li>Abteilung: {{sord.objKeys.HR_PERSONNEL_DEPARTMENT}}</li>
<li>Austrittsdatum: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_DATEOFLEAVING}}</li>
<li>Bereich: {{sord.objKeys.HR_PERSONNEL_DIVISION}}</li>
<li>Bundesland: {{sord.mapKeys.HR_PERSONNEL_STATE}}</li>
<li>Eintrittsdatum: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_DATEOFJOINING}}</li>
<li>Ende der Probezeit: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_ENDOFPROBATIONARY}}</li>
<li>Fachlich Versantworlticher: {{sord.objKeys.HR_PERSONNEL_MENTOR}}</li>
<li>Land: {{sord.objKeys.HR_PERSONNEL_COUNTRY}}</li><li>Letzter Arbeitstag: {{formatDate 'DD.MM.YYYY' sord.objKeys.HR_PERSONNEL_LASTDAYOFWORK}}</li>
<li>Nachname: {{sord.objKeys.HR_PERSONNEL_LASTNAME}}</li>
<li>Personalnummer: {{sord.objKeys.HR_PERSONNEL_PERSONNELNO}}</li>
<li>Postleitzahl: {{sord.objKeys.HR_PERSONNEL_POSTALCODE}}</li>
<li>Standort: {{sord.objKeys.HR_PERSONNEL_LOCATION}}</li>
<li>Stellenbezeichnung: {{sord.objKeys.HR_PERSONNEL_JOBTITLE}}</li>
<li> Straße: {{sord.mapKeys.HR_PERSONNEL_STREETADDRESS}}</li>
<li>Team: {{sord.objKeys.HR_PERSONNEL_TEAM}}</li>
<li>Titel: {{sord.objKeys.HR_PERSONNEL_TITLE}}</li>
<li>Vorgesetzter: {{sord.objKeys.HR_PERSONNEL_SUPERIOR}}</li>
<li>Vorname: {{sord.objKeys.HR_PERSONNEL_FIRSTNAME}}</li>
<li>Wohnort: {{sord.objKeys.HR_PERSONNEL_CITY}}</li>
</ul>
<!--EndFragment-->
 


{{CheckFieldEqual(Nachricht|<!--StartFragment-->
<ul>
<li>Abteilung: {test-param}Abteilung{test-param}</li>
<li>Austrittsdatum: nowDate</li>
<li>Bereich: {test-param}Bereich{test-param}</li>
<li>Bundesland: {test-param}Bundesland{test-param}</li>
<li>Eintrittsdatum: {test-param}Eintrittsdatum{test-param}</li>
<li>Ende der Probezeit: {test-param}Ende der Probezeit{test-param}</li>
<li>Fachlich Versantworlticher: {test-param}Fachlich Verantwortlicher{test-param}</li>
<li>Land: {test-param}Land{test-param}</li><li>Letzter Arbeitstag: nowDate</li>
<li>Nachname: {test-param}Nachname{test-param}</li>
<li>Personalnummer: {test-param}Personalnummer{test-param}</li>
<li>Postleitzahl: {test-param}Postleitzahl{test-param}</li>
<li>Standort: {test-param}Standort{test-param}</li>
<li>Stellenbezeichnung: {test-param}Stellenbezeichnung{test-param}</li>
<li>Straße: {test-param}Straße{test-param}</li>
<li>Team: </li>
<li>Titel: </li>
<li>Vorgesetzter: {test-param}Vorgesetzter{test-param}</li>
<li>Vorname: {test-param}Vorname{test-param}</li>
<li>Wohnort: {test-param}Wohnort{test-param}</li>
</ul>
<!--EndFragment-->
)}}



Austrittsdatum: 11.09.2023


test-business-solutions@elo.local

test-business-solutions@elo.local

https://eloticksy.elo.com/browse/QBSHR-77

https://eloticksy.elo.com/browse/QBSHR-75

https://eloticksy.elo.com/browse/QBSHR-64

https://eloticksy.elo.com/browse/QBSHR-11


Weitere Ideen:



Actiondefinitions aus Unittests auch in Playwright testen (pro Solution alle Menüpunkte durchgehen!)


actions.ChangeSuperiorFile 				"Vorgesetzten ändern"	            OK
actions.CreateChartElement 				"Organisation erweitern"			OK
actions.CreateChartRootElement 			"Neue Organisation"					OK
actions.CreateDocument 					"Dokument erstellen"				OK
actions.CreateEmployeeBadge 			"Ausweis erstellen"					OK
actions.CreateEmployeeRequest 			"Personaldaten ändern" 				OK
actions.InquirePersonnelFileAccess		"Personalakte einsehen"				OK
actions.CreateFile 						"Neuer Mitarbeiter"					OK
actions.EmployeeCorrespondence 			"Nachricht senden"					OK
actions.EmployeeCorrespondenceTemplate 	"Nachrichtenvorlage erstellen"		OK
actions.StartOffboarding 				"Austrittsprozess starten"			OK
actions.StartOnboarding 				"Eintrittsprozess starten" 			OK
actions.UpdateDocument 					"Dokument aktualisieren"			OK



Visitor Besucher voranmelden

Neu -> Besucher -> Besucher voranmelden

Thema

<input type="text" size="30" value="" name="IX_GRP_VISITOR_VISITPURPOSE" title="" eloverify="notemptyforward" accesskey="" aria-labelledby="LBL_IX_GRP_VISITOR_VISITPURPOSE" aria-required="true" class="focusedOcrInput" autovalidval="">

Beginn

<input type="text" size="20" id="INP576043" eloverify="date notemptyforward" name="IX_GRP_VISITOR_STARTDATE" title="" accesskey="" aria-labelledby="LBL_IX_GRP_VISITOR_STARTDATE" aria-required="true" class="focusedOcrInput" autovalidval="">

Niederlassung


<input size="30" name="IX_GRP_VISITOR_LOCATION" value="" title="" eloverify="notemptyforward" accesskey="" restricttoswl="" type="text" readonly="" aria-labelledby="LBL_IX_GRP_VISITOR_LOCATION" aria-required="true" tabindex="-1" autovalidval="">

Verantwortlicher

<input size="30" name="IX_GRP_VISITOR_RESPONSIBLEEMPLOYEE" value="" title="" eloverify="notemptyforward" accesskey="" elocompl="ELOUSERNAMES-" restricttoswl="" type="text" id="autocompleteid10001" autocomplete="off" aria-labelledby="LBL_IX_GRP_VISITOR_RESPONSIBLEEMPLOYEE" aria-required="true" class="focusedOcrInput" autovalidval="Ute Schenk">


Vorname



Nachname

=====================================================================================================================================================================

Playground neu starten

https://srvpelotc01vm.elo.local/ix-lldo_prod/plugin/de.elo.ix.plugin.proxy/wf/apps/app/sol.knowledge.apps.KnowledgeBoard/?lang=de&useSSO=true&timezone=Europe%2FBerlin&#/post/(E03BCFB3-68E8-A7EB-3013-19405538E8C2)




=====================================================================================================================================================================


SelectUserGroup(Teilnehmer hinzufügen|Gerd Baum)##


20.11.2023

TODO Playwright Tests recruiting
TODO Refactoring Interface IDialog





https://eloticksy.elo.com/browse/BSXX-523


Playwright Testcases BS Gen 1.0

BS 1.0 Welt

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


{
  "baseURL": "https://eloticksy.elo.com",
  "username": "J-H.Ruberg@elo.com",
  "password": "XXX",
  "testExecutionKey": "QBSHR-66",
  "eloStack": "playground.dev.elo",
  "eloTile": {
    "repositoryTile": "Solutions",
    "taskTile": "Aufgaben"
  },
  "usedEloSolution": "hr",
  "eloSolutions": {
    "contact": {
      "eloControls": {
        "Abteilung": {
          "selector": "IX_GRP_CONTACT_DIVISION",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Adresszusatz": {
          "selector": "IX_MAP_ADDRESS_ADDITION1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Anrede": {
          "selector": "IX_GRP_CONTACT_FORM_OF_ADDRESS",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "BIC": {
          "selector": "IX_GRP_FINANCE_BIC",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Beruf": {
          "selector": "IX_GRP_CONTACT_OCCUPATION",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Beschreibung": {
          "selector": "IX_MAP_ADDRESS_TYPE_DESC1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Bundesland": {
          "selector": "IX_MAP_ADDRESS_STATE1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "E-Mail": {
          "selector": "IX_MAP_CONTACT_EMAIL1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "ELO Benutzer": {
          "selector": "IX_GRP_CONTACT_USERNAME",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Fax": {
          "selector": "IX_MAP_CONTACT_FAX1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Firmencode": {
          "selector": "IX_GRP_COMPANY_REFERENCE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Firmenname": {
          "selector": "IX_GRP_COMPANY_NAME",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Handelsregister": {
          "selector": "IX_GRP_FINANCE_REGISTER_NUMBER",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "IBAN": {
          "selector": "IX_GRP_FINANCE_IBAN",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "ID": {
          "selector": "IX_GRP_CONTACTLIST_REFERENCE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Kontaktdaten": {
          "selector": "IX_MAP_ADDRESS_TYPE1",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Land": {
          "selector": "IX_GRP_ADDRESS_COUNTRY",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Mobiltelefon": {
          "selector": "IX_MAP_CONTACT_MOBILE_PHONE1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Nachname": {
          "selector": "IX_GRP_CONTACT_LASTNAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Name": {
          "selector": "IX_GRP_CONTACTLIST_NAME",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Namenzusatz": {
          "selector": "IX_GRP_CONTACT_NAME_SUFFIX",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Ort": {
          "selector": "IX_MAP_ADDRESS_CITY1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "PLZ": {
          "selector": "IX_MAP_ADDRESS_ZIP_CODE1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Position": {
          "selector": "IX_GRP_CONTACT_POSITION",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Steuernummer": {
          "selector": "IX_GRP_FINANCE_TAX_NO",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Straße": {
          "selector": "IX_MAP_ADDRESS_STREET1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Telefon": {
          "selector": "IX_MAP_CONTACT_TELEPHONE1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Titel": {
          "selector": "IX_GRP_CONTACT_TITLE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "UST-IdNr": {
          "selector": "IX_GRP_FINANCE_VAT_ID_NO",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Vorname": {
          "selector": "IX_GRP_CONTACT_FIRSTNAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Webseit": {
          "selector": "IX_GRP_COMPANY_WEBSITE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "beschriebung": {
          "selector": "IX_DESC",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        }
      },
      "eloPrecondition": {
        "eloUsers": [],
        "eloTemplates": []
      }
    },
    "contract": {
      "eloControls": {
        "Ablageort": {
          "selector": "IX_GRP_CONTRACT_FILING_LOCATION",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Abteilung": {
          "selector": "IX_GRP_CONTRACT_DEPARTMENT",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Adresszusatz": {
          "selector": "IX_MAP_ADDRESS_ADDITION",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "BIC": {
          "selector": "IX_MAP_CONTRACT_FINANCE_BIC",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Beschreibung": {
          "selector": "IX_MAP_CONTRACT_CASHFLOW_DESC1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Betrag": {
          "selector": "IX_MAP_CONTRACT_CASHFLOW_SINGLE1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Bezeichnung": {
          "selector": "IX_GRP_CONTRACT_NAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Bis": {
          "selector": "IX_MAP_CONTRACT_CASHFLOW_TO1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Buchungskreis": {
          "selector": "IX_GRP_COMPANY_CODE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Bundesland": {
          "selector": "IX_MAP_ADDRESS_STATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Datum": {
          "selector": "IX_MAP_CONTRACT_CASHFLOW_DATE1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "E-MAIL": {
          "selector": "IX_MAP_PARTNER_EMAIL",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Einkauf/Vertrieb": {
          "selector": "IX_GRP_CONTRACT_PROCUREMENT",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Externe Vertragsnummer": {
          "selector": "IX_GRP_EXTERNAL_CONTRACT_NO",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Firmenname": {
          "selector": "IX_GRP_PARTNER_NAME",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Firmenreferenz": {
          "selector": "IX_GRP_PARTNER_NO",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Gekündigt am": {
          "selector": "IX_GRP_TERMINATION_DATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Gesamtsumme ": {
          "selector": "IX_GRP_CONTRACT_CASHFLOW_SUM",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Handelsregister": {
          "selector": "IX_MAP_CONTRACT_FINANCE_REGISTER_NUMBER",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Hinterlassen Sie Arbeitsanweisungen,": {
          "selector": "WF_MAP_TERM_INITIATOR_COMMENT",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Hinterlassen Sie Arbeitsanweisungen, ": {
          "selector": "WF_MAP_APP_INITIATOR_COMMENT",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "IBAN": {
          "selector": "IX_MAP_CONTRACT_FINANCE_IBAN",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Kommentar": {
          "selector": "WF_MAP_CONCLUSION_COMMENT",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Kontaktreferenz": {
          "selector": "IX_MAP_CONTRACT_CONTACT_REFERENCE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Kostenstelle Nr. ": {
          "selector": "IX_GRP_COST_CENTER_NO",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Kostenträger Nr.": {
          "selector": "IX_GRP_COST_OBJECT_NO",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Kündigungsfrist Dauer": {
          "selector": "IX_MAP_NOTICE_PERIOD",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Kündigungsfrist Einheit": {
          "selector": "IX_MAP_NOTICE_PERIOD_UNIT",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Land": {
          "selector": "IX_MAP_ADDRESS_COUNTRY",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Laufzeit Dauer": {
          "selector": "IX_MAP_CONTRACT_DURATION",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Laufzeit Einheit": {
          "selector": "IX_MAP_CONTRACT_DURATION_UNIT",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Mandant": {
          "selector": "IX_GRP_COMPANY_NAME",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Mindestvertragslaufzeit Dauer": {
          "selector": "IX_MAP_CONTRACT_DURATION",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Mindestvertragslaufzeit Einheit": {
          "selector": "IX_MAP_CONTRACT_DURATION_UNIT",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Nachname": {
          "selector": "IX_GRP_CONTACT_LASTTNAME",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Name": {
          "selector": "IX_GRP_PROJECT_NAME",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Nummer": {
          "selector": "IX_GRP_PROJECT_NO",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Nächste Kündigungsfrist": {
          "selector": "IX_GRP_NEXT_POSSIBLE_TERMINATION",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Nächstes Wiedervorlagedatum": {
          "selector": "IX_GRP_NEXT_REMINDER_DATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "PLZ": {
          "selector": "IX_MAP_ADDRESS_ZIP_CODE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Periode": {
          "selector": "IX_MAP_CONTRACT_CASHFLOW_RECURRING_UNIT1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Prüfungsschritte": {
          "selector": "WF_MAP_USER1",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Risikoklassifizierung": {
          "selector": "IX_GRP_CONTRACT_RISK_CLASSIFICATION",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Sonderkündigungsrecht": {
          "selector": "IX_MAP_SPECIAL_TERMINATION_RIGHT",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Status": {
          "selector": "IX_GRP_CONTRACT_STATUS",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Steuernummer": {
          "selector": "IX_MAP_CONTRACT_FINANCE_TAX_NO",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Steuerschuldner": {
          "selector": "IX_MAP_CONTRACT_TAXDEBTOR",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Straße": {
          "selector": "IX_MAP_ADDRESS_STREET",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Summe ": {
          "selector": "IX_MAP_CONTRACT_CASHFLOW_AMOUNT1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Telefon": {
          "selector": "IX_MAP_PARTNER_PHONE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "UST-IdNr": {
          "selector": "IX_MAP_CONTRACT_FINANCE_VAT_ID_NO",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Umsatzsteuerpflichtig Ja": {
          "selector": "IX_GRP_CONTRACT_SUBJECTTOVAT",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Umsatzsteuerpflichtig Nein": {
          "selector": "IX_GRP_CONTRACT_SUBJECTTOVAT",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Verantwortlicher": {
          "selector": "IX_GRP_CONTRACT_RESPONSIBLE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Verhältnis": {
          "selector": "IX_GRP_CONTRACT_RELATION",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Verlängerungsdauer Dauer": {
          "selector": "IX_MAP_EXTENSION_INTERVAL",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Verlängerungsdauer Einheit": {
          "selector": "IX_MAP_EXTENSION_INTERVAL",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Vertragsbeginn": {
          "selector": "IX_GRP_CONTRACT_START",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Vertragsdatum": {
          "selector": "WF_MAP_USER1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Vertragsende": {
          "selector": "IX_GRP_CONTRACT_END",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Vertragsklauseln": {
          "selector": "IX_MAP_CLAUSE_NAME1",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Vorname": {
          "selector": "IX_GRP_CONTACT_FIRSTNAME",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Vorsteuerabzug Ja": {
          "selector": "IX_GRP_CONTRACT_PRETAXDEDUCTION",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Vorsteuerabzug Nein": {
          "selector": "IX_GRP_CONTRACT_PRETAXDEDUCTION",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Vorsteuerabzug Qutal": {
          "selector": "IX_GRP_CONTRACT_PRETAXDEDUCTION",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Weitere Leistungen": {
          "selector": "IX_MAP_CONTRACT_ADDITIONALSERVICES",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Wiedervorlagefrist Dauer": {
          "selector": "IX_MAP_REMINDER_PERIOD",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Wiedervorlagefrist Einheit": {
          "selector": "IX_MAP_REMINDER_PERIOD_UNIT",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Währung": {
          "selector": "IX_GRP_CONTRACT_CURRENCY_CODE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Zahlungsart": {
          "selector": "IX_GRP_CONTRACT_PAYMENT_TYPE",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Zahlungsrichtung": {
          "selector": "IX_GRP_CONTRACT_PAYMENT_DIRECTION",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "automatisch verlängern": {
          "selector": "IX_MAP_EXTENSION_FLAG",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "befristet": {
          "selector": "IX_MAP_DURATION_TYPE",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "in Kontaktliste": {
          "selector": "IX_MAP_CONTRACT_CONTACTLIST_REFERENCE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "ohne Laufzeit": {
          "selector": "IX_MAP_DURATION_TYPE",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "ort": {
          "selector": "IX_MAP_ADDRESS_CITY",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "unbefristet": {
          "selector": "IX_MAP_DURATION_TYPE",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        }
      },
      "eloPrecondition": {
        "eloUsers": [],
        "eloTemplates": []
      }
    },
    "hr": {
      "eloControls": {
        "Absender": {
          "selector": "IX_MAP_HR_PERSONNEL_SENDER",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Abteilung": {
          "selector": "IX_GRP_HR_PERSONNEL_DEPARTMENT",
          "value": "",
          "type": "TEXT",
          "operator": "EXIST"
        },
        "Arbeitszeitregelung": {
          "selector": "IX_GRP_HR_PERSONNEL_WORKSCHEDULE",
          "value": "",
          "type": "KWL",
          "operator": "EXIST"
        },
        "Austrittsdatum": {
          "selector": "IX_GRP_HR_PERSONNEL_DATEOFLEAVING",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Begründung": {
          "selector": "IX_MAP_HR_REASON_FOR_INQUIRY",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Bereich": {
          "selector": "IX_GRP_HR_PERSONNEL_DIVISION",
          "value": "",
          "type": "TEXT",
          "operator": "EXIST"
        },
        "Betreff": {
          "selector": "IX_GRP_COMMUNICATION_SUBJECT",
          "value": "",
          "type": "TEXT",
          "operator": "EQUAL"
        },
        "Bundesland": {
          "selector": "IX_MAP_HR_PERSONNEL_STATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "E-Mail geschäftlich": {
          "selector": "IX_MAP_HR_PERSONNEL_BUSINESSEMAIL",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "E-Mail privat": {
          "selector": "IX_MAP_HR_PERSONNEL_PRIVATEEMAIL",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "ELO Benutzername": {
          "selector": "IX_GRP_HR_PERSONNEL_ELOUSERID",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Eintrittsdatum": {
          "selector": "IX_GRP_HR_PERSONNEL_DATEOFJOINING",
          "value": "",
          "type": "TEXT",
          "operator": "EXIST"
        },
        "Empfänger": {
          "selector": "IX_MAP_CORRESPONDENT_RECIPIENT_NAME_1",
          "value": "",
          "type": "TEXT",
          "operator": "EQUAL"
        },
        "Fachlich Verantwortlicher": {
          "selector": "IX_MAP_HR_PERSONNEL_MENTOR",
          "value": "",
          "type": "DYNKWL",
          "operator": "EXIST"
        },
        "Familienstand": {
          "selector": "IX_MAP_HR_PERSONNEL_CIVILSTATUS",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Frühestmögliches Datum": {
          "selector": "IX_MAP_HR_PERSONNEL_NEXTPOSSIBLEDISMISSAL",
          "value": "",
          "type": "TEXT",
          "operator": "EXIST"
        },
        "Geburtsdatum": {
          "selector": "IX_GRP_HR_PERSONNEL_BIRTHDAY",
          "value": "",
          "type": "TEXT",
          "operator": "EXIST"
        },
        "Geburtsname": {
          "selector": "IX_MAP_HR_PERSONNEL_BIRTHNAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Geburtsort": {
          "selector": "IX_MAP_HR_PERSONNEL_BIRTHPLACE",
          "value": "",
          "type": "TEXT",
          "operator": "EXIST"
        },
        "Geldinstitut": {
          "selector": "IX_MAP_HR_PERSONNEL_BANK",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Geldinstitut Land": {
          "selector": "IX_MAP_HR_PERSONNEL_BANK_COUNTRY",
          "value": "",
          "type": "DYNKWL",
          "operator": "EXIST"
        },
        "Geschlecht": {
          "selector": "IX_GRP_HR_PERSONNEL_GENDER",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "IBAN": {
          "selector": "IX_MAP_HR_PERSONNEL_IBAN",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Kfz-Kennzeichen": {
          "selector": "IX_GRP_HR_PERSONNEL_LICENSEPLATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Kommentar": {
          "selector": "IX_BLOB_HR_PERSONNEL_TERMINATIONCOMMENT",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Konfession": {
          "selector": "IX_MAP_HR_PERSONNEL_RELIGIOUSDENOMINATION",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Korrespondenzsprache": {
          "selector": "IX_GRP_HR_PERSONNEL_FIRSTLANGUAGE",
          "value": "",
          "type": "DYNKWL",
          "operator": "EXIST"
        },
        "Krankenversicherungsnummer": {
          "selector": "IX_MAP_HR_PERSONNEL_HEALTHINSURANCENUMBER",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "KurzbezeichnungPersonal": {
          "selector": "IX_NAME",
          "value": "",
          "type": "TEXT",
          "operator": "EQUAL"
        },
        "Kündigung zum": {
          "selector": "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE_TP",
          "value": "",
          "type": "KWL",
          "operator": "EQUAL"
        },
        "Kündigungsdatum": {
          "selector": "IX_MAP_HR_PERSONNEL_DATEOFNOTICE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Kündigungsfrist": {
          "selector": "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE",
          "value": "",
          "type": "TEXT",
          "operator": "EQUAL"
        },
        "Kündigungsfrist Einheit": {
          "selector": "IX_MAP_HR_PERSONNEL_PERIODOFNOTICE_UNIT",
          "value": "",
          "type": "KWL",
          "operator": "EQUAL"
        },
        "Land": {
          "selector": "IX_GRP_HR_PERSONNEL_COUNTRY",
          "value": "",
          "type": "DYNKWL",
          "operator": "EQUAL"
        },
        "Mobil geschäftlich": {
          "selector": "IX_MAP_HR_PERSONNEL_BUSINESSMOBILENUMBER",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Mobil privat": {
          "selector": "IX_MAP_HR_PERSONNEL_PRIVATEMOBILENUMBER",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Nachname": {
          "selector": "IX_GRP_HR_PERSONNEL_LASTNAME",
          "value": "",
          "type": "TEXT",
          "operator": "EQUAL"
        },
        "Nachricht": {
          "selector": "IX_DESC",
          "value": "",
          "type": "REDACTOR",
          "operator": "EQUAL"
        },
        "Namenszusatz": {
          "selector": "IX_MAP_HR_PERSONNEL_NAMEAFFIX",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Nationalität": {
          "selector": "IX_MAP_HR_PERSONNEL_NATIONALITY",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Neuer Vorgesetzter": {
          "selector": "WF_MAP_HR_PERSONNEL_SUPERIORNEW",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Organisation": {
          "selector": "IX_GRP_HR_PERSONNEL_COMPANY",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Personalnummer": {
          "selector": "IX_GRP_HR_PERSONNEL_PERSONNELNO",
          "value": "",
          "type": "TEXT",
          "operator": "EXIST"
        },
        "Personalverantwortlicher": {
          "selector": "IX_GRP_HR_PERSONNEL_RESPONSIBLE",
          "value": "",
          "type": "DYNKWL",
          "operator": "EQUAL"
        },
        "Physikalischer Ablageort": {
          "selector": "IX_MAP_HR_PERSONNEL_PHYSICALFILINGLOCATION",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Postleitzahl": {
          "selector": "IX_GRP_HR_PERSONNEL_POSTALCODE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Probezeit": {
          "selector": "IX_MAP_HR_PERSONNEL_PROBATIONARYPERIODDURATION",
          "value": "",
          "type": "TEXT",
          "operator": "EQUAL"
        },
        "Probezeit Einheit": {
          "selector": "IX_MAP_HR_PERSONNEL_PROBATIONARYPERIODDURATION_UNIT",
          "value": "",
          "type": "KWL",
          "operator": "EQUAL"
        },
        "Probezeit Kündigung zum": {
          "selector": "IX_MAP_HR_PERSONNEL_PERIODOFNOTICEPROBATIONARY_TP",
          "value": "",
          "type": "KWL",
          "operator": "EQUAL"
        },
        "Probezeit Kündigungsfrist": {
          "selector": "IX_MAP_HR_PERSONNEL_PERIODOFNOTICEPROBATIONARY",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Sicherheitsstufe": {
          "selector": "IX_GRP_HR_PERSONNEL_SECURITYCLEARANCE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Sozialversicherungsnummer": {
          "selector": "IX_MAP_HR_PERSONNEL_SOCIALSECURITYNUMBER",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Standort": {
          "selector": "IX_GRP_HR_PERSONNEL_LOCATION",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Status": {
          "selector": "IX_GRP_HR_PERSONNEL_PERSONNELSTATUS",
          "value": "",
          "type": "KWL",
          "operator": "EQUAL"
        },
        "Stellenbezeichnung": {
          "selector": "IX_GRP_HR_PERSONNEL_JOBTITLE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Steuer-ID": {
          "selector": "IX_MAP_HR_PERSONNEL_TIN",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Straße": {
          "selector": "IX_MAP_HR_PERSONNEL_STREETADDRESS",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Team": {
          "selector": "IX_GRP_HR_PERSONNEL_TEAM",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Telefon geschäftlich": {
          "selector": "IX_MAP_HR_PERSONNEL_BUSINESSPHONENUMBER",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Telefon privat": {
          "selector": "IX_MAP_HR_PERSONNEL_PRIVATEPHONENUMBER",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Titel": {
          "selector": "IX_MAP_HR_PERSONNEL_TITLE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Urlaubstage pro Jahr": {
          "selector": "IX_MAP_HR_PERSONNEL_VACATIONQUOTA",
          "value": "",
          "type": "TEXT",
          "operator": "EXIST"
        },
        "Vorgesetzter": {
          "selector": "IX_GRP_HR_PERSONNEL_SUPERIOR",
          "value": "",
          "type": "DYNKWL",
          "operator": "EXIST"
        },
        "Vorlage": {
          "selector": "IX_MAP_NOTIFY_TEMPLATE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Vorname": {
          "selector": "IX_GRP_HR_PERSONNEL_FIRSTNAME",
          "value": "",
          "type": "TEXT",
          "operator": "EQUAL"
        },
        "Wohnort": {
          "selector": "IX_GRP_HR_PERSONNEL_CITY",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Währung": {
          "selector": "IX_MAP_HR_PERSONNEL_CURRENCY",
          "value": "",
          "type": "DYNKWL",
          "operator": "EXIST"
        },
        "Zahlungsanweisungen": {
          "selector": "IX_MAP_HR_PERSONNEL_PAYMENTINSTRUCTIONS",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Zahlungsempfänger": {
          "selector": "IX_MAP_HR_PERSONNEL_PAYMENTRECIPIENT",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Änderung aktiv ab": {
          "selector": "IX_GRP_HR_PERSONNEL_FULFILLDATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        }
      },
      "eloPrecondition": {
        "eloUsers": [
          {
            "user": "hr_test_creators",
            "groups": [
              "sol.hr.roles.Creators",
              "HR",
              "sol.hr.roles.Creators",
              "sol.hr.roles.Managers"
            ]
          },
          {
            "user": "hr_test_doc_creators",
            "groups": [
              "sol.hr.roles.DocumentCreators",
              "HR",
              "sol.hr.roles.Creators",
              "sol.hr.roles.Managers"
            ]
          },
          {
            "user": "hr_test_editors",
            "groups": [
              "sol.hr.roles.Editors",
              "HR",
              "sol.hr.roles.Creators",
              "sol.hr.roles.Managers"
            ]
          },
          {
            "user": "rh_test_org_creators",
            "groups": [
              "sol.hr.roles.OrgchartCreators",
              "HR",
              "sol.hr.roles.Creators",
              "sol.hr.roles.Managers"
            ]
          },
          {
            "user": "hr_test_org_viewers",
            "groups": [
              "sol.hr.roles.OrgchartViewers",
              "HR",
              "sol.hr.roles.Creators",
              "sol.hr.roles.Managers"
            ]
          },
          {
            "user": "hr_test_managers",
            "groups": [
              "sol.hr.roles.Managers",
              "HR",
              "sol.hr.roles.Creators",
              "sol.hr.roles.Managers"
            ]
          },
          {
            "user": "hr_test_everyone",
            "groups": [
              "Everyone",
              "HR",
              "sol.hr.roles.Creators",
              "sol.hr.roles.Managers"
            ]
          },
          {
            "user": "Hans Hansen",
            "groups": [
              "Everyone",
              "HR",
              "sol.hr.roles.Creators",
              "sol.hr.roles.Managers"
            ]
          }
        ],
        "eloTemplates": [
          {
            "arcPathTemplate": "ARCPATH:/Personalmanagement/Nachrichtenvorlagen/Clips_v1",
            "arcPathActionDef": "ARCPATH:/Administration/Business Solutions/hr/Action definitions/sol.hr.personnel.EmployeeCorrespondenceTemplate",
            "sordName": "Clips_v1",
            "sordDesc": "\u003c!--StartFragment--\u003e\u003cul\u003e\u003cli\u003eAbteilung: {{sord.objKeys.HR_PERSONNEL_DEPARTMENT}}\u003c/li\u003e\u003cli\u003eAustrittsdatum: {{formatDate \u0027DD.MM.YYYY\u0027 sord.objKeys.HR_PERSONNEL_DATEOFLEAVING}}\u003c/li\u003e\u003cli\u003eBereich: {{sord.objKeys.HR_PERSONNEL_DIVISION}}\u003c/li\u003e\u003cli\u003eBundesland: {{sord.mapKeys.HR_PERSONNEL_STATE}}\u003c/li\u003e\u003cli\u003eEintrittsdatum: {{formatDate \u0027DD.MM.YYYY\u0027 sord.objKeys.HR_PERSONNEL_DATEOFJOINING}}\u003c/li\u003e\u003cli\u003eEnde der Probezeit: {{formatDate \u0027DD.MM.YYYY\u0027 sord.objKeys.HR_PERSONNEL_ENDOFPROBATIONARY}}\u003c/li\u003e\u003cli\u003eFachlich Versantworlticher: {{sord.mapKeys.HR_PERSONNEL_MENTOR}}\u003c/li\u003e\u003cli\u003eLand: {{sord.objKeys.HR_PERSONNEL_COUNTRY}}\u003c/li\u003e\u003cli\u003eLetzter Arbeitstag: {{formatDate \u0027DD.MM.YYYY\u0027 sord.objKeys.HR_PERSONNEL_LASTDAYOFWORK}}\u003c/li\u003e\u003cli\u003eNachname: {{sord.objKeys.HR_PERSONNEL_LASTNAME}}\u003c/li\u003e\u003cli\u003ePersonalnummer: {{sord.objKeys.HR_PERSONNEL_PERSONNELNO}}\u003c/li\u003e\u003cli\u003ePostleitzahl: {{sord.objKeys.HR_PERSONNEL_POSTALCODE}}\u003c/li\u003e\u003cli\u003eStandort: {{sord.objKeys.HR_PERSONNEL_LOCATION}}\u003c/li\u003e\u003cli\u003eStellenbezeichnung: {{sord.objKeys.HR_PERSONNEL_JOBTITLE}}\u003c/li\u003e\u003cli\u003eStraße: {{sord.mapKeys.HR_PERSONNEL_STREETADDRESS}}\u003c/li\u003e\u003cli\u003eTeam: {{sord.objKeys.HR_PERSONNEL_TEAM}}\u003c/li\u003e\u003cli\u003eTitel: {{sord.objKeys.HR_PERSONNEL_TITLE}}\u003c/li\u003e\u003cli\u003eVorgesetzter: {{sord.objKeys.HR_PERSONNEL_SUPERIOR}}\u003c/li\u003e\u003cli\u003eVorname: {{sord.objKeys.HR_PERSONNEL_FIRSTNAME}}\u003c/li\u003e\u003cli\u003eWohnort: {{sord.objKeys.HR_PERSONNEL_CITY}}\u003c/li\u003e\u003c/ul\u003e\u003c!--EndFragment--\u003e",
            "objKeys": [
              {
                "data": [
                  "personal@contelo.com"
                ],
                "id": 0,
                "name": "COMMUNICATION_SENDER",
                "objId": 0,
                "changedMembers": 12
              },
              {
                "data": [
                  "Test mit allen Clips"
                ],
                "id": 0,
                "name": "COMMUNICATION_SUBJECT",
                "objId": 0,
                "changedMembers": 12
              }
            ],
            "mapValues": [
              {
                "key": "HR_PERSONNEL_SENDER",
                "value": "Personalabteilung \u003cpersonal@contelo.com\u003e",
                "changedMembers": 0
              }
            ],
            "wfMapValues": [],
            "finishButton": "sol.common.wf.node.ok"
          }
        ]
      }
    },
    "invoice": {
      "eloControls": {},
      "eloPrecondition": {
        "eloUsers": [],
        "eloTemplates": []
      }
    },
    "knowledge": {
      "eloControls": {
        "Beitrag abonnieren": {
          "selector": "IX_MAP_SETTING_HIDE_POSTSUBSCRIPTION_IN_POST",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Beiträge pro Seite": {
          "selector": "IX_MAP_SETTING_POST_PER_PAGE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Beliebte Themen": {
          "selector": "IX_MAP_SETTING_HIDE_TOPICLIST",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Bereich abonnieren": {
          "selector": "IX_MAP_SETTING_HIDE_SPACENAVIGATION_IN_POST",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Bereichsnavigation": {
          "selector": "IX_MAP_SETTING_HIDE_TOPICLIST_IN_POST",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Bewertungen": {
          "selector": "IX_MAP_SETTING_HIDE_RATING",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Boardtyp": {
          "selector": "IX_GRP_KNOWLEDGE_BOARD_TYPE",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Enthaltene Kategorien": {
          "selector": "IX_MAP_SETTING_CATEGORY_LIST_ITEM_1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Enthaltene Themen": {
          "selector": "IX_MAP_SETTING_HIDE_POSTINDICATORS_IN_POST",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Kategorie": {
          "selector": "IX_GRP_KNOWLEDGE_CATEGORY",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Kennzahlen": {
          "selector": "IX_MAP_SETTING_HIDE_POSTINFO_IN_POST",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Kennzahlen zu Beiträgen": {
          "selector": "IX_MAP_SETTING_HIDE_POSTLIST_COUNTS",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Kommentare": {
          "selector": "IX_MAP_SETTING_HIDE_COMMENTS",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Name": {
          "selector": "IX_NAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Standard Beitragstyp": {
          "selector": "IX_GRP_KNOWLEDGE_DEFAULT_POSTTYPE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Suche nach Benutzern": {
          "selector": "IX_MAP_SETTING_HIDE_USERLIST",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Verwendete Sprachen": {
          "selector": "IX_MAP_SETTING_HIDE_LANGUAGELIST",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Zusatzinformationen": {
          "selector": "IX_MAP_SETTING_HIDE_POSTINFO_IN_POST",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        }
      },
      "eloPrecondition": {
        "eloUsers": [],
        "eloTemplates": []
      }
    },
    "learning": {
      "eloControls": {
        "Art": {
          "selector": "WF_MAP_SESSION_TEMPLATE1",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Bezeichnung": {
          "selector": "IX_GRP_COURSE_NAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Bezeichnung Tabele": {
          "selector": "WF_MAP_SESSION_NAME1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Datum": {
          "selector": "WF_MAP_SESSION_START_DATE1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Kategorie": {
          "selector": "IX_GRP_COURSE_CATEGORY",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Kursnummer": {
          "selector": "IX_GRP_COURSE_REFERENCE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Kurzsbeschriebung": {
          "selector": "IX_GRP_COURSE_DESCRIPTION",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Max. Teilnehmeranzahl": {
          "selector": "WF_MAP_SESSION_MAX_PARTICIPANTS1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Sprache": {
          "selector": "IX_GRP_COURSE_LANGUAGE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Status": {
          "selector": "IX_GRP_COURSE_STATUS",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Suchvorlage": {
          "selector": "WF_MAP_SEARCH_TEMPLATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Teilnehmer ausschreiben": {
          "selector": "WF_MAP_COURSE_ENROLLMENT_ATTENDED1",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Teilnehmerstatus": {
          "selector": "WF_MAP_COURSE_ENROLLMENT_STATUS1",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Terminbeschreibung": {
          "selector": "IX_GRP_COURSE_RELEASE_DATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Terminende": {
          "selector": "WF_MAP_SESSION_END_TIME1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Terminstart": {
          "selector": "WF_MAP_SESSION_START_TIME1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Trainer": {
          "selector": "IX_GRP_COURSE_INSTRUCTOR",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Veröffentlichungsdatum": {
          "selector": "IX_GRP_COURSE_RELEASE_DATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Vorlage": {
          "selector": "WF_MAP_NOTIFY_TEMPLATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Zertifikatsvorlage": {
          "selector": "IX_GRP_COURSE_CERTIFICATE_TEMPLATE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        }
      },
      "eloPrecondition": {
        "eloUsers": [],
        "eloTemplates": []
      }
    },
    "recruiting": {
      "eloControls": {
        "Abteilung": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_DEPARTMENT",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Antragsteller": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_REQUESTER",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Antrittsdatum": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_START_DATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Anzahl offene Stellen": {
          "selector": "IX_MAP_APP_INITIATOR_COMMENT",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Arbeitszeitmodell": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_WORKSCHEDULE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Art der Beschäftigung": {
          "selector": "WF_MAP_RECRUITING_FILE_TEMPLATE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Ausschreibungsnummer": {
          "selector": "IX_GRP_RECRUITING_POSTING_NO",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Begründung": {
          "selector": "IX_MAP_APP_INITIATOR_COMMENT",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Bereich": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_DIVISION",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Berufsbezeichnung": {
          "selector": "LBL_IX_GRP_RECRUITING_CANDIDATE_JOBTITLE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Beschreibung": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_NAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Beschriebung andere": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_DESC",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Betreff": {
          "selector": "IX_GRP_RECRUITING_COMMUNICATION_SUBJECT",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Bewerbernummer": {
          "selector": "IX_GRP_RECRUITING_CANDIDATE_NO",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Bewertungskriterien": {
          "selector": "WF_MAP_RATING_QUESTION1",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Bezeichnung": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_NAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "E-Mail": {
          "selector": "IX_GRP_RECRUITING_CANDIDATE_PRIVATEEMAIL",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Einsekkender Manager": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_HIRINGMANAGER",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Einstellender Manager": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_HIRINGMANAGER",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Empfänger (E-Mail)": {
          "selector": "IX_MAP_RECRUITING_COMMUNICATION_RECIPIENT",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Enddatum (falls befristet)": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_END_DATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Fällig zum": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_DUE_DATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Geburtsdatum": {
          "selector": "IX_GRP_RECRUITING_CANDIDATE_BIRTHDAY",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Gehaltsobergrenze (Betrag)": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_SALARY_UPPER",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Geschlecht": {
          "selector": "IX_GRP_RECRUITING_CANDIDATE_GENDER",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Kategorie": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_CATEGORY",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Korrespondenzsprache": {
          "selector": "IX_GRP_RECRUITING_CANDIDATE_LANGUAGE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Mobil": {
          "selector": "IX_MAP_RECRUITING_CANDIDATE_PRIVATEMOBILE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Nachname": {
          "selector": "IX_GRP_RECRUITING_CANDIDATE_LASTNAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Namenszusatz": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_CATEGORY",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Neuer Status der Stelle": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_STATUS",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Organisation": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_COMPANY",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Person auswählen": {
          "selector": "WF_MAP_USER1",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Phase": {
          "selector": "IX_GRP_RECRUITING_CANDIDATE_PHASE",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Poolnummer": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_NO",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Publizierte Bezeichnung": {
          "selector": "IX_GRP_RECRUITING_POSTING_NAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Qualifikationen": {
          "selector": "",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Recruiter": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_RECRUITER",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Standort": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_LOCATION",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Status": {
          "selector": "IX_GRP_RECRUITING_CANDIDATE_STATUS",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Stellenbezeichnung": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_NAME",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Stellennummer": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_NO",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Stellentyp": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_TYPE",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Team": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_TEAM",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Telefon": {
          "selector": "IX_MAP_RECRUITING_CANDIDATE_PRIVATEPHONE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Titel": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_NAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Versanddatum": {
          "selector": "IX_GRP_RECRUITING_COMMUNICATION_DATEOFDISPATCH",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Veröffentlichungsdatum": {
          "selector": "IX_GRP_RECRUITING_POSTING_PUBLISH_DATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Vorname": {
          "selector": "IX_GRP_RECRUITING_CANDIDATE_FIRSTNAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Weitere Informationen": {
          "selector": "",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Zielgehalt (Betrag)": {
          "selector": "IX_GRP_RECRUITING_REQUISITION_SALARY_LOWER",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        }
      },
      "eloPrecondition": {
        "eloUsers": [],
        "eloTemplates": []
      }
    },
    "visitor": {
      "eloControls": {
        "Abreise Datum": {
          "selector": "IX_GRP_VISITOR_DEPARTUREDATE",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Abreise Zeit": {
          "selector": "IX_GRP_VISITOR_DEPARTURETIME",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Ankunft": {
          "selector": "VISITOR_ARRIVALTIME1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Ankunfts Datum": {
          "selector": "IX_GRP_VISITOR_ARRIVALDATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Ankunfts Zeit": {
          "selector": "IX_GRP_VISITOR_ARRIVALTIME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Anreise mit": {
          "selector": "IX_MAP_VISITOR_TRAVELVEHICLE",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Aufenthalsort": {
          "selector": "IX_GRP_VISITOR_WHEREABOUTS",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Beginn Zeit": {
          "selector": "IX_GRP_VISITOR_STARTTIME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Beginn datum": {
          "selector": "IX_GRP_VISITOR_STARTDATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Besucher": {
          "selector": "VISITOR_FIRSTNAME1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Besucherzahl": {
          "selector": "IX_MAP_NUMBER_OF_VISITORS",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Dokument": {
          "selector": "IX_MAP_VISITOR_DOCUMENTS",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "E-Mail": {
          "selector": "VISITOR_MAIL1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "ELO Benutzername": {
          "selector": "IX_GRP_VISITOR_USERNAME",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Einladungsvorlage": {
          "selector": "IX_MAP_INVITATION_TEMPLATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Ende Datum": {
          "selector": "IX_GRP_VISITOR_ENDDATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Ende Zeit": {
          "selector": "IX_GRP_VISITOR_ENDTIME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Firma": {
          "selector": "IX_GRP_VISITOR_STARTDATE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Grund für Stornierung": {
          "selector": "IX_GRP_VISITOR_CANCEL_REASON",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Gruppenname": {
          "selector": "IX_GRP_VISITOR_GROUP_NAME",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Gültig ab": {
          "selector": "IX_GRP_LONGTERM_BADGE_VALID_FROM",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Gültig bis": {
          "selector": "IX_GRP_LONGTERM_BADGE_VALID_UNTIL",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Ja": {
          "selector": "IX_GRP_VISITOR_PICKUPCHECK",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Kategorie": {
          "selector": "IX_GRP_VISITOR_CATEGORY",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Kennezichen": {
          "selector": "VISITOR_LICENSETAG1",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Kontaktreferenz": {
          "selector": "IX_GRP_VISITOR_VISITPURPOSE",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Nachname": {
          "selector": "VISITOR_LASTNAME1",
          "value": "",
          "type": "DYNKWL",
          "operator": "NONE"
        },
        "Nein": {
          "selector": "IX_GRP_VISITOR_PICKUPCHECK",
          "value": "",
          "type": "RADIO",
          "operator": "NONE"
        },
        "Niederlassung": {
          "selector": "IX_GRP_VISITOR_LOCATION",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Senden an": {
          "selector": "IX_MAP_VISITOR_DOCUSER",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Telefon": {
          "selector": "VISITOR_PHONE1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Telefonnummer": {
          "selector": "IX_GRP_VISITOR_PHONE",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        },
        "Thema": {
          "selector": "IX_GRP_VISITOR_VISITPURPOSE",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Thema mit": {
          "selector": "IX_GRP_VISITOR_VISITPURPOSE",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Verantwortlicher": {
          "selector": "IX_GRP_VISITOR_RESPONSIBLEEMPLOYEE",
          "value": "",
          "type": "KWL",
          "operator": "NONE"
        },
        "Vorname": {
          "selector": "VISITOR_FIRSTNAME1",
          "value": "",
          "type": "TEXT",
          "operator": "NONE"
        }
      },
      "eloPrecondition": {
        "eloUsers": [],
        "eloTemplates": []
      }
    }
  }
}


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