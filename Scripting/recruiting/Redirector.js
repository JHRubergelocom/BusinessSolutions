/* global api, Promise, axios*/
(function () {
  'use strict';

  function executeRF (name, params) {
    var any = new de.elo.ix.client.Any();
    any.type = api.CONST.ANY.TYPE_STRING;
    any.stringValue = JSON.stringify(params);

    return new Promise(function (resolve, reject) {
      try {
        api.IX.ix().executeRegisteredFunction(name, any, function onRFExecuted (anyResult, bexecption) {

          if (!anyResult) {
            return reject(bexecption);
          }

          var jsonResult = "{}";
          var result = "";
          try {
            result = JSON.parse(anyResult.stringValue);
          } catch (ex) {
            return reject({functionName: name, exception: ex, parserException: true});
          }

          return resolve({functionName: name, result: result});
        });
      } catch (ex) {
        console.error('Error calling registered function: ' + name);
        console.error(ex);
        reject(ex);
      }
    });
  }

  function authenticateGoHiring (params) {
    var config = params.config || {};

    if (config.proxy && !config.proxy.auth) {
      config.proxy.auth = {
        username: config.proxy.username,
        password: config.proxy.password
      };
      delete config.proxy.username;
      delete config.proxy.password;
    }

    return new Promise(function (resolve, reject) {
      if (!params ||
        !params.url ||
        !params.body ||
        !params.headers ||
        !params.headers.authorization ||
        !params.headers.issued) {
        console.error('Programming error. RF returned invalid response object. Missing authentication object or one of its keys (url, body, headers...).');
        reject();
      }
      /*
            var xhr = new XMLHttpRequest();
            xhr.open('POST', params.url, true);
            var headers = Object.keys(params.headers);
            for (var i=0; i < headers.length; ++i) {
              xhr.setRequestHeader(headers[i], params.headers[headers[i]]);
            }
            xhr.withCredentials = true;
      
            xhr.onload = function(res) {
              if (xhr.status >= 200 && xhr.status < 300) {
                console.debug(xhr.response);
                window.location = xhr.getResponseHeader('location');
              } else {
                reject(xhr);
              }
            };
            xhr.send(params.body);
      */
      axios.post(params.url, params.body, {
        headers: params.headers,
        timeout: (params.config || {}).connectionTimeout || 1000 * 20,
        proxy: config.proxy,
        withCredentials: true
      }).then(function (response) {
        console.debug(response);
        resolve(response);
      }).catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response error');
          console.error(error.response.data);

          if (error.response.data.errors) {
            for (var i = 0; i < error.response.data.errors.length; ++i) {
              console.error(error.response.data.errors[i]);
            }
          }

          console.error(error.response.status);
          console.error(error.response.headers);
        } else if (error.request) {
          console.error('No Response');
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error(error.request);
        } else {
          console.error('Generic error');
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message);
        }
        reject(error);
      });

    });
  }

  //https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  
  api.namespace('sol.recruitingintegration.gohiring.Redirector');

  api.webapps.WebApp.onLoad = function () {
    // ?guid=asdfdasf
    
    var guid = getParameterByName('guid');
    
    executeRF('RF_sol_recruiting_function_GetRedirectRequest', { guid: guid }).then(function (data) {
      var result = data.result;
      
      if (result.error) {
        api.webapps.WebApp.showToast('Error', result.error, api.webapps.WebApp.TOAST_TYPE.ERROR);
        return;
      }
      
      authenticateGoHiring(result).then(function (response) {
        window.location = result.newLocation || response.headers.location;
      }, function (ex) {
        api.webapps.WebApp.showToast('Redirection Error', ex.toString(), api.webapps.WebApp.TOAST_TYPE.ERROR);
        debugger;
      });
    }, function () {
      api.webapps.WebApp.showToast('Executing RF Error', 'See console output.', api.webapps.WebApp.TOAST_TYPE.ERROR);
      debugger;
    });
  };
}());
