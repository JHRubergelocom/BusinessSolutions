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

23.03.2022 TODO Unittests überprüfen (nach Änderungen 23.00 Stack aufbauen (vorher ELOas JavaScript Library "C:\Users\ruberg\OneDrive - ELO Digital Office GmbH\Dokumente\Entwicklung\ELOas\ELOasJavaScriptLibrary211DE.eloinst" installieren) und Tests durchlaufen lassen!)


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


https://eloticksy.elo.com/browse/BSK-1024

BS Knowledge BSK-1024 Unittests überprüfen


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


Dynamic Keyword Lists matching Unittest
sol.meeting.ix.dynkwl.MeetingContactWorkflowMapImport 	false

https://eloticksy.elo.com/browse/BSMM-2824

BS Meeting BSMM-2824 Unittests überprüfen (nächster Sprint!)



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


TODO 30.03.2023


feature/BSXX-432


https://eloticksy.elo.com/browse/BSXX-432

BS Intern BSXX-432 Testautomatisierung mit Playwright



Ideen für Erweiterungen automatisierte Tests

    Benutzer-Berechtigungen prüfen
    Testfälle HR Personalakte erstellen


Testfälle HR Personalakte

Login:

Gruppe sol.hr.roles.Creators

Bodo Kraft


"Felder ausfüllen:
- Anstellungsart (Register Personal)      IX_GRP_HR_PERSONNEL_WORKSCHEDULE "KWL" "F - Vollzeit", "P-Teilzeit"
// - Schlüsselnummer (Register Personal) ?	  IX_GRP_HR_PERSONNEL_PERSONNELNO "Text" "PX0000055"	
- Firmenfahrzeug (Register Personal)	  IX_GRP_HR_PERSONNEL_LICENSEPLATE "S-AA 1234"
- Geburtsdatum (Register Persönlich, Tag und Monat auf heutiges Datum setzen)
					IX_GRP_HR_PERSONNEL_BIRTHDAY "25.03.1960"					  
speichern"



Eintrittsprozess starten

Personal - > Eintrittsprozess starten           "startonboarding"


TODO: WF "Eintrittsprozess starten" durch Vorgesetzten, Hr, weiterleiten!

User "Gerd Baum" WF Mitarbeitereintritt mit (Benutzereingabe "Stammdaten vervollständigen" ) OK weiterleiten!

1.) Aufgaben von "Gerd Baum" bestimmen -> WF mit "OK" weiterleiten!

WF "sol.hr.personnel.StartOnboarding"

"Complete data entry" sol.hr.personnel.wf.user.startonboarding.employeeentrysuperior   KnotenID 30 -> "OK"  sol.common.wf.node.ok

2.) "Stammdaten vervollständigen"  mit Freigeben weiterleiten

"Data entry completed" sol.hr.personnel.wf.user.startonboarding.employeeentrypersonnel KnotenID 15 -> "Approval" sol.common.wf.node.approve


toNodesName


        // Remove Workflows
        List<WFDiagram> finishedWorkflows = getFinishedWorkflows(ixConn);
        WfUtils.removeFinishedWorkflows(ixConn, finishedWorkflows);








        // Forward Workflow
        final List<String> toNodesName = new ArrayList<>();
        toNodesName.add("sol.common.wf.node.ok");
        toNodesName.add("sol.common.wf.node.approve");

        final ELOForwardWorkflow eloForwardWorkflow = new ELOForwardWorkflow(toNodesName);





            // Delete Data
            List<String> arcPaths = dataConfig.getEloDeleteData().getArcPaths();
            if(arcPaths.size() > 0) {
                ws.deleteData(dataConfig);
            }



    private void deleteData(DataConfig dataConfig) throws Exception {
        // Ix Connect
        IXConnection ixConn = ELOIxConnection.getIxConnection(dataConfig.getLoginData(), true);
        System.out.println("IxConn: " + ixConn);

        // Delete arcpath
        for (String arcPath: dataConfig.getEloDeleteData().getArcPaths()) {
            RepoUtils.DeleteSord(ixConn, arcPath);
        }

        ixConn.close();
    }







    @Test
    public void testForwardWorkflow() {

        // Fill LoginData
        final ELOControl textUserName = new ELOControl("Name", "Gerd Baum", ELOControlType.TEXT);
        final ELOControl textPassword = new ELOControl("Passwort", "elo", ELOControlType.TEXT);
        final ELOControl buttonLogin = new ELOControl("Anmelden", "Login", ELOControlType.BUTTON);
        final String stack = "ruberg-hr.dev.elo";
        final LoginData loginData = new LoginData(textUserName, textPassword, buttonLogin,stack);

        // Ix Connect
        IXConnection ixConn;
        try {
            ixConn = ELOIxConnection.getIxConnection(loginData, false);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        System.out.println("IxConn: " + ixConn);
        System.out.println( "ixConn.getLoginResult().getUser(): " + ixConn.getLoginResult().getUser());

        // Get Active Workflow
        WFDiagram activeWorkflow = getActiveWorkflow(ixConn);

        // Get Active User Node
        WFNode activeUserNode = getActiveUserNode(activeWorkflow);

        // Get Successor Nodes
        // List<WFNode> successorNodes = getSuccessorNodes(activeWorkflow, activeUserNode, "sol.common.wf.node.ok");
        List<WFNode> successorNodes = getSuccessorNodes(activeWorkflow, activeUserNode, "sol.common.wf.node.approve");

        // Forward Workflow
        WfUtils.forwardWorkflow(ixConn, activeWorkflow, activeUserNode, successorNodes);

        ixConn.close();
    }




<script>
    EM_WRITE_CHANGED = false;
    var reminder = sol.create("sol.hr.as.PersonnelFileReminder");
    reminder.process();
  </script>



      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.PersonnelFileReminder",
              classConfig: {},
              method: "process",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });





Gruppe HR Bodo Kraft


AS-Regel starten "sol.hr.PersonnelFileReminder"


RF_sol_common_service_ExecuteAsAction
{
            "action": "sol.hr.PersonnelFileReminder",
            "config": {}
}

{
  "url": "http://ruberg-hr.dev.elo:80/as-Solutions/as?cmd=get&name=sol.hr.PersonnelFileReminder&param2=%7B%7D&param3=%7B%22language%22%3A%22de%22%2C%22timeZone%22%3A%22Europe%2FBerlin%22%7D&ticket=7347EF2...",
  "responseOk": true,
  "responseCode": 200,
  "content": "Process: Solutions\n"
}



Der erste Arbeitstag

WF "sol.hr.personnel.firstdayofwork.reminder"





        try {
            connFact = new IXConnFactory(getIxUrl(loginData), "IXConnection", "1.0");
        } catch (Exception ex) {
            System.err.println("ELO ELOIxConnection Falsche Verbindungsdaten zu ELO \n: " + ex.getMessage());
            System.err.println("IllegalStateException message: " +  ex.getMessage());
            throw new Exception("ELOIxConnection");

        }

