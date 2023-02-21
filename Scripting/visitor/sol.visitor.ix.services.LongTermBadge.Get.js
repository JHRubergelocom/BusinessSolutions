
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.visitor.Utils.js
//@include lib_sol.visitor.ix.VisitorUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.LongTermBadge.Get" });

/**
 * Get long term badges
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.visitor.Utils
 * @requires sol.visitor.ix.VisitorUtils
 */
sol.define("sol.visitor.ix.services.LongTermBadge.Get", {
  extend: "sol.common.ix.ServiceBase",

  _optimize: {},

  utils: {
    withDefault: function (arr, objectsOrOtherwise) {
      return (arr || [])
        .map(function (obj) {
          return obj || objectsOrOtherwise;
        });
    },
    getParams: function (self, _params) {
      return sol.common.ObjectUtils.mergeObjects({}, self.utils.withDefault([self.config, self.params, _params], {})) || {};
    },
    checkRequired: function (self, params) {
      (self.requiredConfigOnProcess || []).forEach(function (requiredProperty) {
        if (params[requiredProperty] === null || params[requiredProperty] === undefined) {
          throw "[" + self.$className + "] Could not create object. Missing config property: " + requiredProperty + ". Please ensure all required properties are set: " + JSON.stringify(self.requiredConfigOnProcess);
        }
      });
    }
  },

  optimizedExecute: function (requestParameters) {
    var me = this;

    try {
      return sol.common.IxUtils.optimizedExecute(
        requestParameters.provider,
        requestParameters.params,
        (me._optimize = me._optimize || {}),
        requestParameters.optimize,
        requestParameters.output
      );
    } catch (error) {
      return null;
    }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    sol.ns("sol.visitor");
    me.config = config;
    me.params = sol.visitor.ix.VisitorUtils.loadConfig();
  },

  process: function (_params) {
    var me = this,
        params,
        template,
        search,
        searchResult;

    params = me.utils.getParams(me, params);
    me.utils.checkRequired(me, params);

    params.currentUser = me.getCurrentUser();

    template = me.getTemplate(params);
    search = me.render(template, params);
    searchResult = me.search(search);

    return searchResult;
  },

  getCurrentUser: function () {
    var me = this;

    return me.user;
  },

  getTemplate: function (params) {
    var me = this,
        template;

    template = me.getTemplateDirectly(params)
      || me.getTemplateFromPath(params)
      || me.getDefaultTemplate(params);
    if (!template) {
      throw new Error("Could not determine search template");
    }
    return template;
  },

  getTemplateDirectly: function (params) {
    return sol.common.ObjectUtils.type(params.searchTemplate, 'object')
      ? params.searchTemplate
      : null;
  },

  getTemplateFromPath: function (params) {
    var me = this;

    params.templates = me.prepareTemplatesFromPath(params);

    return params.searchTemplatePath || sol.common.ObjectUtils.type(params.searchTemplate, 'string')
      ? sol.common.ObjectUtils.getProp(params, params.searchTemplatePath || params.searchTemplate)
      : null;
  },

  prepareTemplatesFromPath: function (params) {
    var me = this,
        templates = sol.common.ObjectUtils.clone(params.templates || {});

    templates.currentuser = templates.currentuser || me.getTemplateOfCurrentUser();

    return templates;
  },

  getTemplateOfCurrentUser: function () {
    return {
      provider: "RF_sol_common_service_SordProvider",
      params: {
        masks: [
          "Long Term Badge"
        ],
        search: [
          {
            key: "VISITOR_USERNAME",
            value: [
              "{{currentUser.name}}"
            ]
          }
        ],
        output: [
          {
            source: {
              type: "SORD",
              key: "id"
            },
            target: {
              prop: "id"
            }
          },
          {
            source: {
              type: "SORD",
              key: "name"
            },
            target: {
              prop: "name"
            }
          },
          {
            source: {
              type: "GRP",
              key: "VISITOR_LOCATION"
            },
            target: {
              prop: "VISITOR_LOCATION"
            }
          },
          {
            source: {
              type: "GRP",
              key: "LONGTERM_BADGE_REFERENCE"
            },
            target: {
              prop: "LONGTERM_BADGE_REFERENCE"
            }
          }
        ],
        options: {}
      },
      optimize: "searchLongTermBadge",
      output: [
        "output"
      ]
    };
  },

  getDefaultTemplate: function () {
    return null;
  },

  render: function (template, templateData) {
    return sol.common.TemplateUtils.render(template, templateData, { emptyNonRendered: true });
  },

  search: function (search) {
    var me = this;
    return (me.optimizedExecute(search) || { sords: [] }).sords || [];
  }
});

/**
 * @member sol.visitor.ix.services.LongTermBadge.Get
 * @method RF_sol_visitor_service_LongTermBadge_Get
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_FunctionName
 */
function RF_sol_visitor_service_LongTermBadge_Get(ec, configAny) {
  var config,
      service,
      result;

  logger.enter("RF_sol_visitor_service_LongTermBadge_Get", configAny);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);
  config.ci = ec.ci;
  config.user = ec.user;

  service = sol.create("sol.visitor.ix.services.LongTermBadge.Get", config);
  result = service.process();

  logger.exit("RF_sol_visitor_service_LongTermBadge.Get", result);

  return sol.common.ix.RfUtils.stringify(result);
}

