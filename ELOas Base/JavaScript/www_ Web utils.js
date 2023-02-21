// start namespace www

/**
 * @class www
 * @singleton
 */
var www = new Object();
www = {

/**
 * Liefert den Inhalt als Text aus der angegebenen URL zurück.
 * 
 * @param {String} url URL
 * @returns {String} URL Inhalt
 */
get: function(url) {
    var client = new Packages.org.apache.http.impl.client.DefaultHttpClient();
    var method = new Packages.org.apache.http.client.methods.HttpGet(url);

    var response = client.execute(method);
    var content = Packages.org.apache.http.util.EntityUtils.toString( response.entity );
    
    return content;
},

/**
 * Liefert einen HTML-Text mit den ersetzten Sonderzeichen aus dem angegebenen Text zurück.
 * 
 * @param {String} text
 * @returns {String} Text mit ersetzten Sonderzeichen
 */
toHtml: function(text) {
  text = String(text).replace("&", "&amp;");
  text = text.replace("<", "&lt;");
  text = text.replace(">", "&gt;");
  
  return text;
}

}; // end of namespace www