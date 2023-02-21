// JavaScript Dokument

var zugf = {
  // Liste der XML Pfade zur Übertragung in Indexzeilen. Die Indexzeilen werden über den Gruppennamen ausgewählt.
  // Es gibt zwei Sonderzeilen: "name" - diese Daten werden in die Kurzbezeichnung übertragen und "docdate" - diese
  // Daten werden in das XDateISO (Dokumentendatum) übertragen.
  indexMapping : [
    {name: "docdate", path: "/CrossIndustryDocument/HeaderExchangedDocument/IssueDateTime/DateTimeString/text()"},
    {name: "name", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeAgreement/SellerTradeParty/Name/text()"},
    {name: "ERENAME", path: "/CrossIndustryDocument/HeaderExchangedDocument/Name/text()"},
    {name: "EREKRNAME", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeAgreement/SellerTradeParty/Name/text()"},
    {name: "EREKRZIP", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeAgreement/SellerTradeParty/PostalTradeAddress/PostcodeCode/text()"},
    {name: "EREKRSTREET", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeAgreement/SellerTradeParty/PostalTradeAddress/LineOne/text()"},
    {name: "EREKRCITY", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeAgreement/SellerTradeParty/PostalTradeAddress/CityName/text()"},
    {name: "EREINVNR", path: "/CrossIndustryDocument/HeaderExchangedDocument/ID/text()"},
    {name: "EREDATE", path: "/CrossIndustryDocument/HeaderExchangedDocument/IssueDateTime/DateTimeString/text()"},
    {name: "EREDELIVERY", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeDelivery/ActualDeliverySupplyChainEvent/OccurrenceDateTime/DateTimeString/text()"},
    {name: "ERESKONTOPER", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeSettlement/SpecifiedTradePaymentTerms/ApplicableTradePaymentDiscountTerms/CalculationPercent/text()", normalize : true},
    {name: "ERESKONTODAYS", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeSettlement/SpecifiedTradePaymentTerms/ApplicableTradePaymentDiscountTerms/BasisPeriodMeasure/text()", normalize : true},
    {name: "ERENETTO", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeSettlement/SpecifiedTradeSettlementMonetarySummation/TaxBasisTotalAmount/text()", normalize : true},
    {name: "EREUMST", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeSettlement/SpecifiedTradeSettlementMonetarySummation/TaxTotalAmount/text()", normalize : true},
    {name: "EREBRUTTO", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeSettlement/SpecifiedTradeSettlementMonetarySummation/GrandTotalAmount/text()", normalize : true}
  ],
  
  // Liste der XML Pfade zur Übertragung in Map Felder ("Weitere Infos") des Sord Objekts.
  mapMapping : [
    {name: "CURRENCY", path: "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/ApplicableSupplyChainTradeSettlement/InvoiceCurrencyCode/text()"}
  ],
  
  // Der nachfolgende Bereich definiert die Artikelpositionen, davon gibt es beliebig viele.
  // über ein Eintrag itemsPaths wird der Start einer Artikelposition definiert. Das itemMapping
  // definiert dann die einzelnen Spalten der Position. Die Positionsdaten werden immer in 
  // durchnummerierte Map Felder abgelegt.
  itemsPath : "/CrossIndustryDocument/SpecifiedSupplyChainTradeTransaction/IncludedSupplyChainTradeLineItem",

  itemMapping : [
    {name: "AMOUNT", path: "./SpecifiedSupplyChainTradeSettlement/SpecifiedTradeSettlementMonetarySummation/LineTotalAmount/text()", normalize: true},
    {name: "UST", path: "./SpecifiedSupplyChainTradeSettlement/ApplicableTradeTax/ApplicablePercent/text()", normalize: true},
    {name: "COUNT", path: "./SpecifiedSupplyChainTradeDelivery/BilledQuantity/text()", normalize: true},
    {name: "UNITPRICE", path: "./SpecifiedSupplyChainTradeAgreement/NetPriceProductTradePrice/ChargeAmount/text()", normalize: true},
    {name: "BEZ", path: "./SpecifiedTradeProduct/Name/text()"}
  ],
  
  item : null,
  map  : null,
  
  /**
  * Führt eine Verarbeitung der Rechnungsdaten durch
  * 1. Prüft, ob es sich um eine Zugferd Rechnung handelt.
  * 2. Liest die Zugferd Daten in die Verschlagwortung ein.
  * 3. Speichert die eingelesenen Daten (optional)
  *
  * @param sord ELO Verschlagwortungsobjekt zum Dokument
  * @param withSave Eingelesene Verschlagwortung speichern
  * @return Ergebnis der Operation true/false
  */
  process : function(sord, withSave) {
    this.item = sord;
    this.map = new Array();
    
    this.xmlFile = this.extract(sord.id)
    
    try {
      if (this.xmlFile) {
        var zfDoc = new Packages.de.elo.mover.main.XPathReader(this.xmlFile);
        log.info("Document read");
        
        this.storeIndex(zfDoc);
        (new File(this.xmlFile))["delete"]();
        
        if (withSave) {    
          this.storeData();
        }
        
        return true;
      }
    } catch(e) {
      log.warn("Zugferd error: " + e);
    }
    
    return false;
  },
  
  /**
  * Liest die Datei zum Dokument ein und trennt die XML Datei
  * ab. Das lokale PDF Dokument wird anschließend gelöscht und
  * der Dateipfad zur XML Datei zurückgegeben. Es ist Aufgabe
  * der aufrufenden Funktion die XML Datei nach Abschluss der
  * Aktion zu löschen.
  *
  * Im Fehlerfall wird null zurückgegeben.
  *
  * @param sordId ELO Object-Id des PDF Dokuments
  * @return Dateipfad der XML Datei mit den Zugferd Daten oder null
  */
  extract : function(sordId) {
    var pdfFile = fu.getTempFile(sordId);
    var xmlFileName = pdfFile.path + ".xml";
    
    try {
      var res = Packages.de.elo.mover.main.Utils.splitZugferd(pdfFile.path, xmlFileName);
      log.info("Result of Split: " + res);
      pdfFile["delete"]();
      return xmlFileName;
    } catch(e) {
      log.warn("Error splitting zugferd file: " + pdfFile.path);
      return null;
    }
  },
  
  /**
  * Liefert ein Array mit den zuletzt eingelesenen
  * Map Daten des Dokuments.
  *
  * @return Map Array
  */
  getMap : function() {
    return this.map;
  },

  /**
  * Wird beim Einlesen von Zahlen aufgerufen und kann optional
  * das Format an die jeweiligen lokalen Einstellungen anpassen.
  * Hier können Tausendertrennzeichen eingefügt oder Nachkommastellen
  * mit einem Komma statt Punkt abgetrennt werden.
  * 
  * @param value Eingelesene Zahl
  * @return formatierte Zahl zum Speichern in der Verschlagwortung
  */  
  normalize : function( value ) {
    var tmp = value.replace(".", ",");
    return tmp;
  },
  
  /**
  * Speichert die aktuellen Verschlagwortungs- und Map Daten
  */
  storeData : function() {
    ixConnect.ix().checkinSord(this.item, SordC.mbAll, LockC.NO);
    ixConnect.ix().checkinMap( MapDomainC.DOMAIN_SORD, this.item.id, this.item.id, this.map, LockC.NO );
  },
  
  /**
  * private Funktionen, nicht zur externen Verwendung
  */
  setValue : function(lineName, value) {
    if (lineName == "docdate") {
      this.item.XDateIso = value;
    } else if (lineName == "name") {
      this.item.name = value;
    } else {
      var keys = this.item.objKeys;
      
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.name == lineName) {
          key.data = [value];
        }
      }
    }
  },
  
  storeIndex : function(zfDoc) {
    this.map = new Array();
    
    this.fillupIndex(zfDoc, this.indexMapping);
    this.fillupMap(zfDoc, this.mapMapping);
    this.fillupItems(zfDoc, this.itemsPath, this.itemMapping);
  },
  
  fillupItems : function(zfDoc, itemsPath, mapping) {
    var count = zfDoc.selectItems(itemsPath);
    log.info("Item count: " + count);

    for (var line = 0; ;) {
      if (!zfDoc.nextItem()) {
        break;
      }
  
      for (var i = 0; i < mapping.length; i++) {
        var item = mapping[i];
        var value = zfDoc.getItemText(item.path);
        if ((i == 0) && (value == "")) {
          // wenn der erste Wert nicht vorhanden ist, dann den ganzen Block ignorieren.
          break;
        }
        if (i == 0) {
          line++;
        }
        
        if (item.normalize) {
          value = this.normalize(value);
        }
        
        var keyValue = new KeyValue( item.name + line, value);
        this.map.push(keyValue);
      }
    }
  },
  
  fillupIndex : function(zfDoc, mapping) {
    for (var i = 0; i < mapping.length; i++) {
      var item = mapping[i];
      var value = zfDoc.getNodeText(item.path);
      if (item.normalize) {
        value = this.normalize(value);
      }
      
      this.setValue(item.name, value);
    }
  },
  
  fillupMap : function(zfDoc, mapping) {
    for (var i = 0; i < mapping.length; i++) {
      var item = mapping[i];
      var value = zfDoc.getNodeText(item.path);
      if (item.normalize) {
        value = this.normalize(value);
      }
      
      var keyValue = new KeyValue( item.name, value);
      this.map.push(keyValue);
    }
  }
  
}

