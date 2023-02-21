//Import the IndexServer API classes.
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.mover.main);
importPackage(Packages.de.elo.mover.main.pdf);
importPackage(Packages.de.elo.mover.main.tiff);
importPackage(Packages.de.elo.mover.main.utils);
importPackage(Packages.de.elo.mover.utils);
importPackage(Packages.java.lang);
importPackage(Packages.java.sql);
importPackage(Packages.java.io);
importPackage(Packages.org.apache.commons.io);
importPackage(Packages.javax.mail);
importPackage(Packages.javax.mail.internet);
importPackage(Packages.java.util);
importPackage(Packages.org.apache.commons.lang);
importPackage(Packages.org.apache.commons.httpclient);
importPackage(Packages.org.apache.commons.httpclient.methods);
importPackage(Packages.org.json);

var EM_VERSION_NO = "10.02.000 Build 004"


var NAME;
var ARCDATE;
var DOCDATE;
var OBJCOLOR;
var OBJDESC;
var OBJTYPE;
var ARCHIVINGMODE;
var ACL;
var BACKUP_ACL;

var EM_ACT_SORD;

var EM_PARENT_ID;
var EM_PARENT_ACL;

var EM_NEW_DESTINATION = new Array();
var EM_FIND_RESULT = null;
var EM_START_INDEX = 0;
var EM_MASK_LOADED = -1;
var EM_WRITE_CHANGED = false;
var EM_TW_MAINPARENT = true;
var EM_WITH_LOCK = false;
var EM_ALLOWALLMASKS = false;
var EM_FIND_INFO = null;

var EM_TEMP;
var EM_ERROR;

// Parameter fuer manuell getriggerte Ausfuehrung
var EM_PARAM1;
var EM_PARAM2;
var EM_PARAM3;
var EM_PARAM4;
var EM_PARAM5;
var EM_PARAM6;
var EM_PARAM7;
var EM_PARAM8;
var EM_PARAM9;
var EM_PARAM10;
var EM_USERID;

// Tree walk parameter
var EM_TREE_STATE;
var EM_PARENT_SORD;
var EM_ROOT_SORD;
var EM_INDEX_LOADED;
var EM_TREE_LEVEL;
var EM_SAVE_TREE_ROOT;
var EM_TREE_EVAL_CHILDREN;
var EM_TREE_ABORT_WALK;
var EM_TREE_MAX_LEVEL;

// Workflow
var EM_TASKLIST;
var EM_WF_NEXT;
var EM_WF_NODE;
var EM_WF_STATUS;
var EM_WF_FILTER_NAME;
var EM_WF_WITH_DELETED = false;
var EM_WF_USER_DELAY_DATE = "";

var EM_WF_EXPORT_ROOT = "c:\\temp\\wfexport";

// Mail
var MAIL_SESSION;
var MAIL_SMTP_HOST;
var MAIL_INBOX;
var MAIL_STORE;
var MAIL_MESSAGE;
var MAIL_POINTER;
var MAIL_MESSAGES;
var MAIL_DELETE_ARCHIVED;
var MAIL_ALLOW_DELETE;
var MAIL_CONNECT_NAME;

// 
function EM_Events() {
}

var EM_EventsI = new EM_Events();

//EM_Events.prototype.tferUserWrite = function(destination, source, translator)
//EM_Events.prototype.tferUserFillup = function(destination, source, translator)
//EM_Events.prototype.tferSordWrite = function(destination, sord, userTranslator, guidProvider)
//EM_Events.prototype.tferSordFillup = function(sord, source, userTranslator)
//EM_Events.prototype.tferWorkflowWrite = function(destination, wfDiagram, translator)
//EM_Events.prototype.tferWorkflowFillup = function(wfDiagram, source, translator)
//EM_Events.prototype.tferMapWrite = function(destination, mapData)
//EM_Events.prototype.tferMapFillup = function(mapData, source)


// JDBC Database connections
//
// driver: Java class name of the JDBC driver, see driver documentation
// url: Connection URL to the database, see driver documentation
// user, password: Database login credentials, if needed
// initdone: internal field, always initialize with false
// classloaded: internal field, always initialize with false
// dbcn: internal field, always initialize with null

var EM_connections = [
{
driver: 'org.postgresql.Driver',
url: 'jdbc:postgresql://localhost/elo',
user: '',
password: '',
initdone: false,
classloaded: false,
dbcn: null
},
{
driver: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
url: 'jdbc:sqlserver://srvtdev03:1433',
user: 'elodb',
password: '87-190-158-17-188-234-240-95',
initdone: false,
classloaded: false,
dbcn: null
},
{
driver: 'oracle.jdbc.OracleDriver',
url: 'jdbc:oracle:thin:@srvoracle:1521:eloorcl',
user: 'elodb',
password: 'elodb',
initdone: false,
classloaded: false,
dbcn: null
},
{
driver: 'com.ibm.db2.jcc.DB2Driver',
url: 'jjdbc:db2://srvt02:50000/elotestu',
user: 'elodb',
password: 'elodb',
initdone: false,
classloaded: false,
dbcn: null
}
];