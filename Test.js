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
 
   
Nutzung von NetBeans

7 JPA ( NetBeans 8)

===================================================================================================================================================================    

lldo_prod  http://srvpelotc01vm.elo.local:9090/ix-lldo_prod/ix

playground http://playground.dev.elo/ix-Solutions/ix

rubergproductivity http://ruberg-productivity.dev.elo/ix-Solutions/ix



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

26.04.2023 TODO Unittests überprüfen (nach Änderungen 23.00 Stack aufbauen  und Tests durchlaufen lassen!)


QoL Feature für Entwickler: JIRA Issues+Branch via der ELO CLI erstellen

elo-sol create-issue 


common

elo-sol prepare -stack ruberg-common -workspace jan -version 20.00

BS Common BS-1942 Unittests überprüfen

https://eloticksy.elo.com/browse/BS-1942


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

BS HR Recruiting BSHRR-615 Unittests überprüfen

https://eloticksy.elo.com/browse/BSHRR-615


[function] sol.recruiting.ix.functions.GetRedirectRequest Tests Registered Functions RF_sol_recruiting_function_GetRedirectRequest should not throw if executed without Parameter
Failed: [ELOIX:5023][[TICKET:848...][The object with ID functionName=RF_GoHiring_Execute does not exist.]]   (In Version 23.00)



visitor

elo-sol prepare -stack ruberg-visitor -workspace de -version 20.00


teamroom

elo-sol prepare -stack ruberg-teamroom -workspace jan -version 20.00


meeting

elo-sol prepare -stack ruberg-meeting -workspace premium-groupware -version 20.00

BS Meeting BSMM-2846 Unittests überprüfen

https://eloticksy.elo.com/browse/BSMM-2846


[service] sol.meeting.ix.services.MeetingBoardPrecondition Tests Registered Functions RF_sol_meeting_services_MeetingBoardPrecondition check meeting board precondition
Expected true to equal false.
Error: Expected true to equal false.



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


elo-sol push -workspace default -ixUrl http://192.168.75.159:9090/ix-Demo/ix



http://192.168.52.128:9090/ix-Demo/ix

http://elodemo:9090/ix-Demo/ix


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

TODO 27.04.2023 (nächster Sprint)


BS Intern BSXX-446 Testautomatisierung mit Playwright

https://eloticksy.elo.com/browse/BSXX-446


Ideen für Erweiterungen automatisierte Tests

     Benutzer-Berechtigungen prüfen


===========================================================================================================================

===========================================================================================================================



Installationsanleitung von Playwright

1.) Java 17 installieren

https://www.oracle.com/java/technologies/downloads/#jdk17-windows


2.) Systemvariablen setzen

PLAYWRIGHT_JAVA_SRC 	C:\Users\ruberg\OneDrive - ELO Digital Office GmbH\Dokumente\Entwicklung\Playwright



===========================================================================================================================


Von gitlab holen

git@git.elo.dev:bs/testautomation.git   -> PlaywrightSession

git clone git@git.elo.dev:bs/testautomation.git PlaywrightSession


Nach github

git@github.com:JHRubergelocom/PlaywrightSession.git


=====================================================================================================================================================================

02.05.2023

BS Common BS-1943 Ordnerinhalt PDF Export stabiler machen

https://eloticksy.elo.com/browse/BS-1943


Invoice 5245





  /**
   * Export folder as pdf or zip filde.
   * @param {String} folderId
   * @param {String} baseDstDirPath
   * @param {Object} config
   * @return {Object} result of folder export
   */
  pdfExport: function (folderId, baseDstDirPath, config) {
    var me = this,
        result, i, j, sord, dstDir, pathParts, dstDirPath, sords, dstDirPathFile, folderSord, addPathPart, partPath,
        subDirPath, subDirPathFile, zipFile, zipDir, parentId, folderName, mergedOutputStream, pdfName, ext,
        pdfInputStreams, pdfInputStream, pdfContents, dstFile, os;

    me.logger.enter("pdfExport");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start pdfExport with folderId: '{0}', baseDstDirPath: '{1}', config: '{2}'", folderId, baseDstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    me.language = ixConnect.loginResult.clientInfo.language;
    if (config.language) {
      me.language = config.language;
    }

    pdfContents = [];

    if (!folderId) {
      me.logger.debug("pdfExport 'Folder ID is empty'");
      throw "Folder ID is empty";
    }

    if (!baseDstDirPath) {
      me.logger.debug("pdfExport 'Destination directory path is empty'");
      throw "Destination directory path is empty";
    }

    result = {};
    dstDir = new java.io.File(baseDstDirPath);
    sol.common.FileUtils.delete(baseDstDirPath, { quietly: true });
    sol.common.FileUtils.makeDirectories(dstDir);
    sol.common.FileUtils.deleteFiles({ dirPath: baseDstDirPath });


    folderSord = ixConnect.ix().checkoutSord(folderId, new SordZ(SordC.mbAll), LockC.NO);
    pdfName = sol.common.FileUtils.sanitizeFilename(folderSord.name) + ".cover";
    me.createCoverSheetSord(folderSord, baseDstDirPath, pdfName, config, pdfContents);

    folderName = sol.common.FileUtils.sanitizeFilename(folderSord.name);
    dstDirPath = baseDstDirPath + java.io.File.separator + folderName;
    dstDirPathFile = new File(dstDirPath);
    if (!dstDirPathFile.exists()) {
      try {
        dstDirPathFile.mkdirs();
      } catch (e) {
        me.logger.debug("error creating destination directory", e);
      }
    }

    sords = sol.common.RepoUtils.findChildren(folderId, { recursive: true, level: -1, includeDocuments: true, includeFolders: true, includeReferences: true });

    for (i = 0; i < sords.length; i++) {
      sord = sords[i];
      pathParts = [dstDirPathFile];
      addPathPart = false;

      for (j = 0; j < sord.refPaths[0].path.length; j++) {
        partPath = sol.common.FileUtils.sanitizeFilename(sord.refPaths[0].path[j].name);
        if (addPathPart == true) {
          pathParts.push(partPath);
        }
        if (partPath == sol.common.FileUtils.sanitizeFilename(folderSord.name)) {
          addPathPart = true;
        }
      }
      if (sol.common.SordUtils.isFolder(sord)) {

        subDirPath = pathParts.join(File.separator);
        subDirPathFile = new File(subDirPath);
        if (!subDirPathFile.exists()) {
          try {
            subDirPathFile.mkdirs();
          } catch (e) {
            me.logger.debug("error creating destination directory", e);
          }
        }
        pdfName = sol.common.FileUtils.sanitizeFilename(sord.name) + ".cover";
        me.createCoverSheetSord(sord, subDirPath, pdfName, config, pdfContents);
        partPath = sol.common.FileUtils.sanitizeFilename(sord.name);
        if (addPathPart == true) {
          pathParts.push(partPath);
        }
      }
      subDirPath = pathParts.join(File.separator);
      subDirPathFile = new File(subDirPath);
      if (!subDirPathFile.exists()) {
        try {
          subDirPathFile.mkdirs();
        } catch (e) {
          me.logger.debug("error creating destination directory", e);
        }
      }
      if (!sol.common.SordUtils.isFolder(sord)) {
        try {
          ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
          if (ext) {
            pdfName = sol.common.FileUtils.sanitizeFilename(sord.name) + ".cover." + ext;
          } else {
            pdfName = sol.common.FileUtils.sanitizeFilename(sord.name) + ".cover";
          }
          me.createCoverSheetSord(sord, subDirPath, pdfName, config, pdfContents);
          me.createPdfDocument(sord, subDirPath, config, pdfContents);
        } catch (e) {
          me.logger.debug("error downloadDocument ", e);
          me.logger.debug(["error downloadDocument id = '{0}' name = '{1}'", sord.id, sord.name]);
        }
      }
    }

    if (config.pdfExport === true) {
      mergedOutputStream = new ByteArrayOutputStream();

      if (me.logger.debugEnabled) {
        me.logger.debug("pdfContents before sort");
        pdfContents.forEach(function (pdfContent) {
          me.logger.debug(["refpath = '{0}', contentName = '{1}', pdfPages = '{2}', contentType = '{3}', contentMask = '{4}', contentHint = '{5}'", pdfContent.refPath, pdfContent.contentName, pdfContent.pdfPages, pdfContent.contentType, pdfContent.contentMask, pdfContent.contentHint]);
        });
      }

      pdfContents.sort(function (a, b) {
        var refPathA = a.refPath.toUpperCase(),
            refPathB = b.refPath.toUpperCase();

        if (refPathA < refPathB) {
          return -1;
        }
        if (refPathA > refPathB) {
          return 1;
        }
        return 0;
      });


      if (me.logger.debugEnabled) {
        me.logger.debug("pdfContents after sort");
        pdfContents.forEach(function (pdfContent) {
          me.logger.debug(["refpath = '{0}', contentName = '{1}', pdfPages = '{2}', contentType = '{3}', contentMask = '{4}', contentHint = '{5}'", pdfContent.refPath, pdfContent.contentName, pdfContent.pdfPages, pdfContent.contentType, pdfContent.contentMask, pdfContent.contentHint]);
        });
      }
      pdfInputStreams = [];
      pdfInputStream = me.createContent(folderName, dstDirPath, config, pdfContents);
      if (pdfInputStream) {
        pdfInputStreams.push(pdfInputStream);
      }
      pdfContents.forEach(function (pdfContent) {
        if (pdfContent.pdfInputStream) {
          pdfInputStreams.push(pdfContent.pdfInputStream);
        }
      });
      sol.common.as.PdfUtils.mergePdfStreams(pdfInputStreams, mergedOutputStream);
      parentId = me.getExportFolder(config);

      try {
        if (config.pdfA === true) {
          dstFile = me.writePdfOutputStreamToFile(mergedOutputStream, dstDirPath, "All.pdf");
          me.convertPDFtoPDFA(dstFile);
          mergedOutputStream = me.writeFileToPdfOutputStream(dstFile);
          sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
        }

        if (config.pagination === true) {
          dstFile = me.writePdfOutputStreamToFile(mergedOutputStream, dstDirPath, "All.pdf");
          me.setPagination(dstFile);
          mergedOutputStream = me.writeFileToPdfOutputStream(dstFile);
          sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
        }

        if (config.watermark.image.show === true) {
          dstFile = me.writePdfOutputStreamToFile(mergedOutputStream, dstDirPath, "All.pdf");
          me.setWatermarkImage(dstFile, dstDirPath, config.watermark.image.path);
          mergedOutputStream = me.writeFileToPdfOutputStream(dstFile);
          sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
        }

        os = String(java.lang.System.getProperty("os.name").toLowerCase());

        if (sol.common.StringUtils.contains(os, "win")) {
          if (config.watermark.text.show === true) {
            dstFile = me.writePdfOutputStreamToFile(mergedOutputStream, dstDirPath, "All.pdf");
            me.setWatermarkText(dstFile, config.watermark.text.content);
            mergedOutputStream = me.writeFileToPdfOutputStream(dstFile);
            sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
          }
        }
      } catch (ex) {
        me.logger.error(["error pdfExport with folderId: '{0}', baseDstDirPath: '{1}', config: '{2}'", folderId, baseDstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })], ex);
      }

      result.objId = sol.common.RepoUtils.saveToRepo({ parentId: parentId, name: folderName, outputStream: mergedOutputStream, extension: "pdf" });
    } else {
      zipFile = new File(baseDstDirPath + ".zip");
      zipDir = new File(baseDstDirPath);
      sol.common.ZipUtils.zipFolder(zipDir, zipFile);
      parentId = me.getExportFolder(config);
      result.objId = sol.common.RepoUtils.saveToRepo({ name: folderName, file: zipFile, parentId: parentId });
      sol.common.FileUtils.delete(zipFile, { quietly: true });
    }

    if (me.logger.debugEnabled) {
      me.logger.debug(["Finish pdfExport with result: '{0}'", sol.common.JsonUtils.stringifyAll(result, { tabStop: 2 })]);
    }
    me.logger.exit("pdfExport");

    return result;
  }





      if (me.logger.debugEnabled) {
        me.logger.debug("pdfContents before sort");
        pdfContents.forEach(function (pdfContent) {
          me.logger.debug(["refpath = '{0}', contentName = '{1}', pdfPages = '{2}', contentType = '{3}', contentMask = '{4}', contentHint = '{5}'", pdfContent.refPath, pdfContent.contentName, pdfContent.pdfPages, pdfContent.contentType, pdfContent.contentMask, pdfContent.contentHint]);
        });
      }

      pdfContents.sort(function (a, b) {
        var refPathA = a.refPath.toUpperCase(),
            refPathB = b.refPath.toUpperCase();

        if (refPathA < refPathB) {
          return -1;
        }
        if (refPathA > refPathB) {
          return 1;
        }
        return 0;
      });


      if (me.logger.debugEnabled) {
        me.logger.debug("pdfContents after sort");
        pdfContents.forEach(function (pdfContent) {
          me.logger.debug(["refpath = '{0}', contentName = '{1}', pdfPages = '{2}', contentType = '{3}', contentMask = '{4}', contentHint = '{5}'", pdfContent.refPath, pdfContent.contentName, pdfContent.pdfPages, pdfContent.contentType, pdfContent.contentMask, pdfContent.contentHint]);
        });
      }








    pdfOutputStream = me.writeFileToPdfOutputStream(dstFile);


    if (pdfOutputStream) {
      pdfInputStream = me.convertOutputStreamToInputStream(pdfOutputStream);
    } else {
      pdfInputStream = null;
    }



        pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);




      if (!dstFile.exists()) {
        dstFile.createNewFile();
      }




TODO pdf jeweils aus 20 Dateien zusammenbauen, dann zum Schluß alle Dateien in eine Datei packen!





ggf. rekursiv



  /**
   * Merges PDF streams
   * @param {Array} inputStreams PDF input streams
   * @param {java.io.OutputStream} outputStream
   */
  mergePdfStreams: function (inputStreams, outputStream) {
    var me = this,
        pdfBoxVersion, pdfMerger;

    if (!inputStreams) {
      throw "Input streams are empty";
    }

    pdfBoxVersion = (new Packages.org.apache.pdfbox.pdmodel.PDDocument()).class.package.implementationVersion;
    me.logger.debug(["PDF box version: {0}", pdfBoxVersion]);

    if (pdfBoxVersion > "2.0.0") {
      pdfMerger = new Packages.org.apache.pdfbox.multipdf.PDFMergerUtility();
    } else {
      pdfMerger = new Packages.org.apache.pdfbox.util.PDFMergerUtility();
    }

    inputStreams.forEach(function (inputStream) {
      pdfMerger.addSource(inputStream);
    });

    pdfMerger.destinationStream = outputStream;
    pdfMerger.mergeDocuments(Packages.org.apache.pdfbox.io.MemoryUsageSetting.setupTempFileOnly());

    inputStreams.forEach(function (inputStream) {
      inputStream.close();
    });
  }
});


analog funktion mergePdfFiles in PdfUtils bauen


  /**
   * Get inputstream of content pdf.
   * @private
   * @param {String} folderName
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @param {Object[]} pdfContents
   * @return {java.io.InputStream} Inputstream of content pdf
   */
  createContent: function (folderName, dstDirPath, config, pdfContents) {
	  
    var me = this,
        templateId, fopRenderer, result, data, pdfInputStream, sumPages, dstFile, pdfOutputStream;

    me.logger.enter("createContent");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start createContent with folderName: '{0}', dstDirPath: '{1}', config: '{2}'", folderName, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    templateId = me.getTemplateContents(config);
    data = {};
    data.header = { name: folderName };
    data.overview = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.overview");
    data.content = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.content");
    data.noContentFound = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.noContentFound");
    data.contents = [];

    sumPages = me.getOffsetSumPages(folderName, dstDirPath, config, pdfContents);

    pdfContents.forEach(function (pdfContent) {
      sumPages += pdfContent.pdfPages;
      data.contents.push({ name: pdfContent.contentName, pageno: sumPages, type: pdfContent.contentType, mask: pdfContent.contentMask, hint: pdfContent.contentHint });
    });

    data.contents = me.adjustContent(data.contents);
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render("Content", data);

    dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, "All.pdf");
    me.setHyperlinks(dstFile, data.contents);
    pdfOutputStream = me.writeFileToPdfOutputStream(dstFile);
    sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });

    if (pdfOutputStream) {
      pdfInputStream = me.convertOutputStreamToInputStream(pdfOutputStream);
    } else {
      pdfInputStream = null;
    }

    me.logger.debug(["Finish createContent with pdfInputStream: '{0}'", pdfInputStream]);
    me.logger.exit("createContent");

    return pdfInputStream;
  },
  
  
  
  Ablauf pdfContents im pdfExport







  pushContent: function (sord, pdfContents, pdfInputStream, refPath, contentName, pdfPages, hint) {
    var me = this,
        contentType, contentMask, dm;

    contentType = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.document");
    if (sol.common.SordUtils.isFolder(sord)) {
      contentType = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.folder");
    }
    dm = sol.common.SordUtils.getDocMask(sord.maskName, me.language);
    contentMask = dm.name;
    if (dm.nameTranslationKey) {
      if (String(dm.nameTranslationKey).trim() !== "") {
        contentMask = sol.common.TranslateTerms.getTerm(me.language, dm.nameTranslationKey);
      }
    }

    pdfContents.push({
      pdfInputStream: pdfInputStream,
      refPath: refPath,
      contentName: contentName,
      pdfPages: pdfPages,
      contentType: contentType,
      contentMask: contentMask,
      contentHint: hint
    });
  },


  /**
   * Create PDF from sord
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} templateId
   * @param {String} dstDirPath
   * @param {String} ext
   * @param {String} pdfName
   * @param {Object} config Pdf export configuration
   * @param {Boolean} config.pdfExport Flag to export folder structure in one pdf document or in zip file
   * @param {Boolean} config.pdfA Flag to convert pdf document to pdf/a standard
   * @param {Object[]} pdfContents
   */
  createPdfFromSord: function (sord, templateId, dstDirPath, ext, pdfName, config, pdfContents) {
    var me = this,
        data, fopRenderer, result, pdfInputStream, refPath, pdfPages,
        dstFile, isCover, dm, timeZone, utcOffset, date;

    me.logger.enter("createPdfFromSord");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start createPdfFromSord with sord: '{0}', templateId: '{1}', dstDirPath: '{2}', ext: '{3}', pdfName: '{4}', config: '{5}'", sord, templateId, dstDirPath, ext, pdfName, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    timeZone = config.timeZone;
    utcOffset = sol.common.SordUtils.getTimeZoneOffset(timeZone);

    if (ext) {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord, ext: ext };
    } else {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord };
    }
    if (sol.common.SordUtils.isFolder(sord)) {
      data.folder = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.folder");
    }

    data.maskName = sord.maskName;
    dm = sol.common.SordUtils.getDocMask(sord.maskName, me.language);
    if (dm.nameTranslationKey) {
      if (String(dm.nameTranslationKey).trim() !== "") {
        data.maskName = sol.common.TranslateTerms.getTerm(me.language, dm.nameTranslationKey);
      }
    }

    if (String(data.maskName) === "E-mail") {
      data.from = data.sord.objKeys.ELOOUTL1;
      data.to = data.sord.objKeys.ELOOUTL2;
      data.cc = data.sord.objKeys.ELOOUTL4;
    }

    if (config.metadata) {
      if (config.metadata.sordKeys === true) {
        data.sordKeysLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.sordKeysLabel");
        data.maskNameLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.maskNameLabel");
        data.nameLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.nameLabel");
        data.descLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.descLabel");
        data.IDateIsoLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.IDateIsoLabel");
        if (data.sord.IDateIso) {
          if (String(data.sord.IDateIso).trim() !== "") {
            date = sol.common.DateUtils.transformIsoDate(data.sord.IDateIso, { asUtc: true, utcOffset: utcOffset });
            date = sol.common.DateUtils.isoToDate(date);
            date = sol.common.DateUtils.format(date, "YYYY.MM.DD HH:mm");
            data.sord.IDateIso = date;
          }
        }
        data.XDateIsoLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.XDateIsoLabel");
        if (data.sord.XDateIso) {
          if (String(data.sord.XDateIso).trim() !== "") {
            date = sol.common.DateUtils.transformIsoDate(data.sord.XDateIso, { asUtc: true, utcOffset: utcOffset });
            date = sol.common.DateUtils.isoToDate(date);
            date = sol.common.DateUtils.format(date, "YYYY.MM.DD HH:mm");
            data.sord.XDateIso = date;
          }
        }
        data.ownerNameLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.ownerNameLabel");
        data.sordKeys = true;
      }
      if (config.metadata.objKeys === true) {
        data.objKeysLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.objKeysLabel");
        if (data.sord.objKeys) {
          data.sord.objKeysArray = me.convertJsonToJsonKeyValuePairs(data.sord.objKeys);
          if (config.filter) {
            if (config.filter.objKeys) {
              if (config.filter.objKeys.excludeMaskTabs) {
                if (config.filter.objKeys.excludeMaskTabs.length) {
                  if (config.filter.objKeys.excludeMaskTabs.length > 0) {
                    data.sord.objKeysArray = me.filterExcludeMaskTabs(data.sord.objKeysArray, sord.maskName, config.filter.objKeys.excludeMaskTabs);
                  }
                }
              }
              if (config.filter.objKeys.excludeKeys) {
                if (config.filter.objKeys.excludeKeys.length) {
                  if (config.filter.objKeys.excludeKeys.length > 0) {
                    data.sord.objKeysArray = me.filterExcludeKeys(data.sord.objKeysArray, config.filter.objKeys.excludeKeys);
                  }
                }
              }
              if (config.filter.objKeys.includeKeys) {
                if (config.filter.objKeys.includeKeys.length) {
                  if (config.filter.objKeys.includeKeys.length > 0) {
                    data.sord.objKeysArray = me.filterIncludeKeys(data.sord.objKeysArray, config.filter.objKeys.includeKeys);
                  }
                }
              }
            }
          }
          me.translateIndexfields(data.sord.objKeysArray, sord.maskName, timeZone);
          data.objKeys = true;
        }
      }
      if (config.metadata.mapKeys === true) {
        data.mapKeysLabel = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.mapKeysLabel");
        if (data.sord.mapKeys) {
          data.sord.mapKeysArray = me.convertJsonToJsonKeyValuePairs(data.sord.mapKeys);
          data.mapKeys = true;
        }
      }
    }

    if (config.marginNotes === true) {
      data.marginNotes = me.getMarginNotes(sord, config);
      data.showMarginNotes = true;
      data.headerMarginNotes = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.headerMarginNotes");
      data.headerGeneralMarginNote = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.headerGeneralMarginNote");
      data.headerPersonalMarginNote = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.headerPersonalMarginNote");
      data.headerPermanentMarginNote = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.headerPermanentMarginNote");
    }

    if (config.feedInfo === true) {
      data.actions = me.getActions(sord.id, config);
      data.showFeedInfo = true;
      data.userFeeds = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.userFeeds");
      data.noUserFeeds = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.noUserFeeds");
    }

    if (config.pdfExport === true) {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
      if (data.mapKeys) {
        data.sord.mapKeysArray.forEach(function (mapKey) {
          if (mapKey.key.length > me.CONST.SPLITLENGTH) {
            mapKey.key = me.splitString(mapKey.key, me.CONST.SPLITLENGTH);
          }
        });
      }
      result = fopRenderer.render(pdfName, data);
      pdfInputStream = me.convertOutputStreamToInputStream(result.outputStream);
      isCover = null;
      if (pdfName.indexOf(".cover") > -1) {
        isCover = true;
      }
      refPath = me.getRefPath(sord, isCover);
      dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);

      try {
        pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
      } catch (ex) {
        pdfPages = 0;
        me.logger.error(["error createPdfFromSord with sord: '{0}', templateId: '{1}', dstDirPath: '{2}', ext: '{3}', pdfName: '{4}', config: '{5}'", sord, templateId, dstDirPath, ext, pdfName, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })], ex);
      }
      me.pushContent(sord, pdfContents, pdfInputStream, refPath, pdfName, pdfPages, "");
    } else {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
      if (data.mapKeys) {
        data.sord.mapKeysArray.forEach(function (mapKey) {
          if (mapKey.key.length > me.CONST.SPLITLENGTH) {
            mapKey.key = me.splitString(mapKey.key, me.CONST.SPLITLENGTH);
          }
        });
      }
      result = fopRenderer.render(pdfName, data);
      dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);

    }

    if (config.pdfA === true) {
      me.convertPDFtoPDFA(dstFile);
    }
    me.logger.debug(["Finish createPdfFromSord"]);
    me.logger.exit("createPdfFromSord");
  },

  /**
   * Create coversheet from sord
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @param {String} pdfName
   * @param {Object} config Pdf export configuration
   * @param {Object[]} pdfContents
   */
  createCoverSheetSord: function (sord, dstDirPath, pdfName, config, pdfContents) {
    var me = this,
        templateId;

    me.logger.enter("createCoverSheetSord");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start createCoverSheetSord with sord: '{0}', dstDirPath: '{1}', pdfName: '{2}', config: '{3}'", sord, dstDirPath, pdfName, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    templateId = me.getTemplateCoverSheetSord(sord, config);
    me.createPdfFromSord(sord, templateId, dstDirPath, "pdf", pdfName, config, pdfContents);

    me.logger.debug(["Finish createCoverSheetSord"]);
    me.logger.exit("createCoverSheetSord");
  },

  /**
   * Create error conversion pdf
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} ext
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @param {Object[]} pdfContents
   */
  createErrorConversionPdf: function (sord, ext, dstDirPath, config, pdfContents) {
    var me = this,
        templateId, pdfName, data, fopRenderer, result, pdfInputStream,
        refPath, contentName, dstFile, pdfPages, hint;

    me.logger.enter("createErrorConversionPdf");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start createErrorConversionPdf with sord: '{0}', ext: '{1}', dstDirPath: '{2}', config: '{3}'", sord, ext, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    templateId = me.getTemplateErrorConversionPdf(config);
    if (ext) {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord, ext: ext };
    } else {
      data = { sord: sol.common.SordUtils.getTemplateSord(sord).sord };
    }
    data.msg = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.error.msg");
    data.hint = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.conversionFailed");
    pdfName = me.getPdfName(sord, ext);

    if (config.pdfExport === true) {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
      pdfInputStream = me.convertOutputStreamToInputStream(result.outputStream);
      refPath = me.getRefPath(sord);

      if (ext) {
        contentName = sord.name + "." + ext;
      } else {
        contentName = sord.name;
      }
      dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);
      try {
        pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
      } catch (ex) {
        pdfPages = 0;
        me.logger.error(["error createErrorConversionPdf with sord: '{0}', ext: '{1}', dstDirPath: '{2}', config: '{3}'", sord, ext, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })], ex);
      }
      hint = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.conversionFailed");
      me.pushContent(sord, pdfContents, pdfInputStream, refPath, contentName, pdfPages, hint);

      sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });

    } else {
      fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
      result = fopRenderer.render(pdfName, data);
      dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);
    }
    me.logger.debug(["Finish createErrorConversionPdf"]);
    me.logger.exit("createErrorConversionPdf");
  },




  /**
   * Converts a document to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @param {Boolean} config.pdfExport Flag to export folder structure in one pdf document or in zip file
   * @param {Boolean} config.pdfA Flag to convert pdf document to pdf/a standard
   * @param {Object[]} pdfContents
   */
  createPdfDocument: function (sord, dstDirPath, config, pdfContents) {
    var me = this,
        pdfInputStream, ext, refPath, contentName, pdfPages, dstFile, pdfName;

    me.logger.enter("createPdfDocument");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start createPdfDocument with sord: '{0}'dstDirPath: '{1}', config: '{2}'", sord, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    pdfInputStream = me.convertToPdf(sord, dstDirPath, config);
    ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;

    if (pdfInputStream != null) {
      pdfName = me.getPdfName(sord, ext);
      dstFile = me.writePdfInputStreamToFile(pdfInputStream, dstDirPath, pdfName);

      if (config.pdfA === true) {
        me.convertPDFtoPDFA(dstFile);
      }

      if (config.annotationNotes === true) {
        me.setAnnotationNotes(dstFile, sord);
      }

      pdfInputStream = new ByteArrayInputStream(Packages.org.apache.commons.io.FileUtils.readFileToByteArray(dstFile));

      if (config.pdfExport === true) {
        refPath = me.getRefPath(sord);
        if (ext) {
          contentName = sord.name + "." + ext;
        } else {
          contentName = sord.name;
        }
        pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
        me.pushContent(sord, pdfContents, pdfInputStream, refPath, contentName, pdfPages, "");
        sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
      }
    } else {
      me.createErrorConversionPdf(sord, ext, dstDirPath, config, pdfContents);
    }
    me.logger.debug(["Finish createPdfDocument"]);
    me.logger.exit("createPdfDocument");
  },




  /**
   * Get number of pages for content pdf.
   * @private
   * @param {String} folderName
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @param {Object[]} pdfContents
   * @return {Number} number of pages
   */
  getOffsetSumPages: function (folderName, dstDirPath, config, pdfContents) {
    var me = this,
        templateId, data, fopRenderer, result, dstFile, pdfPages, fop, contentInBytes;

    me.logger.enter("getOffsetSumPages");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start getOffsetSumPages with folderName: '{0}', dstDirPath: '{1}', config: '{2}'", folderName, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    pdfPages = 0;
    templateId = me.getTemplateContents(config);
    data = {};
    data.header = { name: folderName };
    data.overview = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.overview");
    data.content = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.content");
    data.noContentFound = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.noContentFound");
    data.contents = [];

    pdfContents.forEach(function (pdfContent) {
      data.contents.push({ name: pdfContent.contentName, pageno: pdfContent.pdfPages, type: pdfContent.contentType, mask: pdfContent.contentMask, hint: pdfContent.contentHint });
    });

    data.contents = me.adjustContent(data.contents);
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render("Content", data);
    dstFile = new java.io.File(dstDirPath + java.io.File.separator + "All.pdf");

    try {
      if (!dstFile.exists()) {
        dstFile.createNewFile();
      }
      fop = new FileOutputStream(dstFile);
      contentInBytes = result.outputStream.toByteArray();
      fop.write(contentInBytes);
      fop.flush();
      fop.close();

      pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
      sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });
    } catch (ex) {
      pdfPages = 0;
      me.logger.error(["error getOffsetSumPages with folderName: '{0}', dstDirPath: '{1}', config: '{2}'", folderName, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })], ex);
    }

    me.logger.debug(["Finish getOffsetSumPages with pdfPages: '{0}'", pdfPages]);
    me.logger.exit("getOffsetSumPages");

    return pdfPages;
  },




  /**
   * Get inputstream of content pdf.
   * @private
   * @param {String} folderName
   * @param {String} dstDirPath
   * @param {Object} config Pdf export configuration
   * @param {Object[]} pdfContents
   * @return {java.io.InputStream} Inputstream of content pdf
   */
  createContent: function (folderName, dstDirPath, config, pdfContents) {
    var me = this,
        templateId, fopRenderer, result, data, pdfInputStream, sumPages, dstFile, pdfOutputStream;

    me.logger.enter("createContent");
    if (me.logger.debugEnabled) {
      me.logger.debug(["Start createContent with folderName: '{0}', dstDirPath: '{1}', config: '{2}'", folderName, dstDirPath, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);
    }

    templateId = me.getTemplateContents(config);
    data = {};
    data.header = { name: folderName };
    data.overview = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.overview");
    data.content = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.content");
    data.noContentFound = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.contents.noContentFound");
    data.contents = [];

    sumPages = me.getOffsetSumPages(folderName, dstDirPath, config, pdfContents);

    pdfContents.forEach(function (pdfContent) {
      sumPages += pdfContent.pdfPages;
      data.contents.push({ name: pdfContent.contentName, pageno: sumPages, type: pdfContent.contentType, mask: pdfContent.contentMask, hint: pdfContent.contentHint });
    });

    data.contents = me.adjustContent(data.contents);
    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
    result = fopRenderer.render("Content", data);

    dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, "All.pdf");
    me.setHyperlinks(dstFile, data.contents);
    pdfOutputStream = me.writeFileToPdfOutputStream(dstFile);
    sol.common.FileUtils.deleteFiles({ dirPath: dstFile.getPath() });

    if (pdfOutputStream) {
      pdfInputStream = me.convertOutputStreamToInputStream(pdfOutputStream);
    } else {
      pdfInputStream = null;
    }

    me.logger.debug(["Finish createContent with pdfInputStream: '{0}'", pdfInputStream]);
    me.logger.exit("createContent");

    return pdfInputStream;
  },
  
  
  
  pdfExport: function (folderId, baseDstDirPath, config) {

		    pdfContents = [];


    me.createCoverSheetSord(folderSord, baseDstDirPath, pdfName, config, pdfContents);

    me.createPdfDocument(sord, subDirPath, config, pdfContents);

	  
  },
  
  
  
  
  neue option pdfExportLarge in PdfExport.config


5245 "Invoice"


4139 "Test data/PdfExport"
  
  
  
  Bei pdfExportLarge content.refPath anpassen oder 
  
  
  
  
  files[i].getAbsolutePath()
  
  
  
  , dstFile.getAbsolutePath()
  

erweitern um pdfInputFilePath

  pushContent: function (sord, pdfContents, pdfInputStream, refPath, contentName, pdfPages, hint) {
    var me = this,
        contentType, contentMask, dm;

    contentType = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.document");
    if (sol.common.SordUtils.isFolder(sord)) {
      contentType = sol.common.TranslateTerms.getTerm(me.language, "sol.common_document.as.Utils.pdfExport.folder");
    }
    dm = sol.common.SordUtils.getDocMask(sord.maskName, me.language);
    contentMask = dm.name;
    if (dm.nameTranslationKey) {
      if (String(dm.nameTranslationKey).trim() !== "") {
        contentMask = sol.common.TranslateTerms.getTerm(me.language, dm.nameTranslationKey);
      }
    }

    pdfContents.push({
      pdfInputStream: pdfInputStream,
      refPath: refPath,
      contentName: contentName,
      pdfPages: pdfPages,
      contentType: contentType,
      contentMask: contentMask,
      contentHint: hint
    });
  },




if (config.pdfExport === true)
	







      // TODO pdfExportLarge
      if (config.pdfExportLarge === true) {
        isCover = null;
        if (pdfName.indexOf(".cover") > -1) {
          isCover = true;
        }
        refPath = me.getRefPath(sord, isCover);
      }
      // TODO pdfExportLarge

      dstFile = me.writePdfOutputStreamToFile(result.outputStream, dstDirPath, pdfName);

      // TODO pdfExportLarge
      try {
        pdfPages = Packages.de.elo.mover.main.pdf.PdfFileHelper.getNumberOfPages(dstFile);
      } catch (ex) {
        pdfPages = 0;
        me.logger.error(["error createPdfFromSord with sord: '{0}', templateId: '{1}', dstDirPath: '{2}', ext: '{3}', pdfName: '{4}', config: '{5}'", sord, templateId, dstDirPath, ext, pdfName, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })], ex);
      }
      me.pushContent(sord, pdfContents, "", refPath, pdfName, pdfPages, "", dstFile.getAbsolutePath());
      // TODO pdfExportLarge
