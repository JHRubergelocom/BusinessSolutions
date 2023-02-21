// start namespace cal
var EM_CALENDAR_BASE = "ARCPATH:¶Sitzungen¶Kalender¶"

// Unterhalb der Kalender-Basis können beliebige Ordner mit Kalendereinträge stehen.
// Der Ordnernamen enthält dabei den Kalendernamen und der Zusatztext die Liste mit
// den freien Tagen. Feiertage, die auf ein Wochenende fallen, dürfen nicht eingetragen
// werden, andernfalls werden sie doppelt abgezogen.
// Der Zusatztext enthält pro Zeile einen Feiertag in der Form:
// <Datum (ISO)>:<Faktor>:<Name>
//
// Das Datum wird in der Form YYYYMMDD eingetragen um Probleme mit unterschiedlichen
// Datumszonen zu vermeiden. Der Faktor kann einen Wert zwischen 0 und 1 einnehmen
// (z.B. für einen halben Tag am 24.12 - 0.5). Der Name dient nur zur besseren
// Übersicht, er wird nicht weiter ausgewertet.

var cal = new Object();
cal = {

// Ermittelt die Anzahl der Arbeitstage zwischen zwei Datumsangaben unter
// Berücksichtigung des Kalenders und der Wochenenden (Sa und So).
getWorkDays: function(calendarName, fromDate, toDate) {
  var dates = cal.getCalendar(calendarName);
  log.debug("Anzahl Feiertage: " + dates.length);
  var fd = cal.getDateFromIso(fromDate);
  var td = cal.getDateFromIso(toDate);
  var workDays = cal.getNumberOfWorkDays(fd, td);
  log.debug("Anzahl Wochentage: " + workDays);

  for (var i = 0; i < dates.length; i++) {
    if ((dates[i] >= fd) && (dates[i] <= td)) {
      workDays -= dates[i].factor;
      log.debug("remove date: " + dates[i] + " : " + dates[i].dayname);
    }
  }

  log.debug("Anzahl Arbeitstage: " + workDays);
  return workDays;
},

// Liefert ein Array mit dem Datumsangaben zu einem Kalender zurück
getCalendar: function(calendarName) {
  if (!calendarName) {
    calendarName = "Feiertage";
  }

  var calSord = ixConnect.ix().checkoutSord(EM_CALENDAR_BASE + calendarName, EditInfoC.mbSord, LockC.NO);
  if (calSord) {
    var desc = calSord.sord.desc;
    var lines = desc.split("\\n");
    var dates = new Array();
    for (var i = 0; i < lines.length; i++) {
      var items = lines[i].split(":");
      var iso = items[0];
      var factor = items[1];
      var name = items[2];
      var nextDate = cal.getDateFromIso(iso);
      var wday = nextDate.getDay();
      log.debug(wday + " : " + nextDate);
      if ((wday > 0) && (wday < 6)) {
        // keine Wochenend-Feiertage aufnehmen
        nextDate.factor = factor;
        nextDate.dayname = name;
        dates.push(nextDate);
      }
    }

    return dates;
  } else {
    return null;
  }
},

// Liefert ein Datumsobjekt zu einem ISO Datumsstring zurück (YYYYMMDD oder YYYY-MM-DD).
getDateFromIso: function(isoDateString) {
   if (isoDateString.charAt(4) == 45) {
     return new Date(isoDateString.substring(0,4), Number(isoDateString.substring(5,7)) - 1, isoDateString.substring(8,10));
   } else {
     return new Date(isoDateString.substring(0,4), Number(isoDateString.substring(4,6)) - 1, isoDateString.substring(6,8));
   }
},

// Ermittelt die Anzahl der Wochentage zwischen zwei Terminen.
getNumberOfWorkDays: function(fromDate, toDate) {
  var days1 = Math.floor(fromDate.getTime() / 86400000);
  var wday1 = fromDate.getDay();
  var days2 = Math.floor(toDate.getTime() / 86400000);
  var wday2 = toDate.getDay();

  if (days1 > days2) {
    var temp = days2;
    days2 = days1;
    days1 = temp;
    temp = wday2;
    wday2 = wday1;
    wday1 = temp;
  }

  var startOffset = (wday1 == 0) ? 1 : 0;
  var endOffset = (wday2 == 6) ? 1 : 0;
  var weekendDiff = 2 * Math.floor((days2 - days1 + wday1 - wday2) / 7);
  var diff = days2 - days1 + 1 - startOffset - endOffset - weekendDiff;


  return diff;
}
} // end of namespace cal
