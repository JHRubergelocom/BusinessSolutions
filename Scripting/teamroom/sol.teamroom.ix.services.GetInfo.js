importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.Injection.js
//@include lib_sol.teamroom.mixins.Configuration.js
//@include lib_sol.teamroom.Utils.js

/**
 *
 * @author ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 * @requires sol.teamroom.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.teamroom.ix.services.GetInfo", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.teamroom.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _params: { jsonFromProp: "paramStr", forTemplating: false, template: true },
    _connection: { config: "teamroom", prop: "entities.connection", template: true },
    _config: { config: "teamroom", prop: "entities.room.services.getinfo", template: true }
  },

  /**
   * Get feed items of one level
   */
  getTeamroomFeed: function (id) {
    return sol.teamroom.Utils.select(
      "select f.objguid, a.actionguid, a.parentguid, a.updatedateiso, a.userguid, a.actiontext "
      + "from documentfeed f, feedaction a where f.objguid in ( "
      + "  select objguid from objekte where objid in ( "
      + "    select objectid from relation where parentid = " + id
      + "  ) and objstatus = 0"
      + ") and f.feedguid = a.feedguid and a.actiontype = 2 "
      + "order by a.parentguid, f.objguid, a.updatedateiso",
      "Get feed items of " + id
    );
  },

  getTeamroomRelation: function (id) {
    return sol.teamroom.Utils.select(
      "select o1.objid, o1.objparent, o2.objguid, r.reltstamp, o1.objstatus "
      + "from objekte o1, objekte o2, relation r "
      + "where o1.objid = r.objectid and o1.objparent = r.parentid "
      + "and o2.objid = o1.objparent and o1.objguid = '" + id + "'",
      "Get relation of " + id
    );
  },

  getTeamroomChildren: function (id) {
    return sol.teamroom.Utils.select(
      "select r.objectid, r.reltstamp, o.objshort, o.objguid, o.objtstamp, "
      + "o.objtstampsync, o.objtype, o.objstatus, o.objinfo "
      + "from relation r, objekte o where o.objstatus = 0 and o.objid = r.objectid and r.relmain = 1 "
      + "and r.parentid = " + id,
      "Get children of " + id
    );
  },

  process: function () {
    var me = this,
        id = me._params.objId,
        mode = me._params.mode,
        token = me._params.token;

    if (token !== me._connection.API_TOKEN) {
      me.logger.warn("Invalid '" + mode + "' token: " + token);
      throw "Invalid '" + mode + "' token: " + token;
    }

    if (mode == "feed") {
      return me.getTeamroomFeed(id);
    } else if (mode == "relation") {
      return me.getTeamroomRelation(id);
    } else if (mode == "children") {
      return me.getTeamroomChildren(id);
    } else {
      throw "Mode not supported";
    }
  }
});

/**
 * @member sol.teamroom.ix.services.GetInfo
 * @method RF_sol_teamroom_service_GetInfo
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_teamroom_service_GetInfo(iXSEContext, args) {
  var logger = sol.create("sol.Logger", { scope: "sol.teamroom.ix.services.GetInfo" }),
      rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      result;

  rfParams.paramStr = sol.common.JsonUtils.stringifyQuick(rfParams);

  result = sol.create("sol.teamroom.ix.services.GetInfo", rfParams).process();

  logger.info("Result GetInfo:" + sol.common.JsonUtils.stringifyQuick(result));
  logger.exit("sol.teamroom.ix.services.GetInfo");
  return result;
}

function serviceAdapter(ec, args, mode) {
  return RF_sol_teamroom_service_GetInfo(ec, sol.common.JsonUtils.stringifyQuick({
    objId: sol.teamroom.Utils.verifySqlParam(args[0]),
    token: args[1],
    mode: mode
  }));
}

function RF_Teamroom_Feed(ec, args) {
  return serviceAdapter(ec, args, "feed");
}

function RF_Teamroom_Relation(ec, args) {
  return serviceAdapter(ec, args, "relation");
}

function RF_Teamroom_Children(ec, args) {
  return serviceAdapter(ec, args, "children");
}