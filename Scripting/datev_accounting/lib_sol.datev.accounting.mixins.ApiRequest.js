//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.Template.js


/**
 *  @author MHe, ELO Digital Office GmbH
 *  @version 1.0
 *
 */
sol.define("sol.datev.accounting.mixins.ApiRequest", {
  mixin: true,

  mixins: ["sol.common.mixins.Inject"],

  /**
     * TODO: rename
     * @param url
     * @param params
     * @return {*}
     */
  getResourceByUrl: function (url, config) {
    var me = this;
    config = config || {};

    me.logger.info(["unresolved url {0}", url])
    if (config.template) {
      url = this.resolveUrl(url, config.template);
    }
    me.logger.info(["resolved url {0}", url])

    var apiConfig = {
      url: url,
      method: "GET",
      params: config.params
    };

    apiConfig.resolve = !!config.params;

    var resp = sol.common.HttpUtils.sendRequest(apiConfig);

    if (resp && resp.responseOk) {
      resp.content = resp.content && JSON.parse(resp.content);
    }

    return resp;
  },

  resolveUrl: function (url, object) {
    var data = object || {};
    return sol.common.TemplateUtils.render(url, data);
  },

  postResourceByUrl: function (url, config) {
    var me = this;

    config = config || {};

    if (config.template) {
      url = this.resolveTemplates(url);
    }


    var apiConfig = {
          url: url,
          method: "post",
          contentType: "application/json;charset=UTF-8",
          params: config.params,
          dataObj: config.dataObj,
          encodeData: config.encodeData
        },

        resp = sol.common.HttpUtils.sendRequest(apiConfig);

    return resp;
  }
});
