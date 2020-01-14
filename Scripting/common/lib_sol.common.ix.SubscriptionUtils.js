
//@include lib_Class.js

/**
 * Subscription utilities
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 */
sol.define("sol.common.ix.SubscriptionUtils", {
  singleton: true,

  /**
   * Retrieve the feed guid of an element
   * @param {String} objId
   * @return {String}
   */
  getFeedGuid: function (objId) {
    var fai, fr, feed;

    fai = FindActionsInfo();
    fai.objId = objId;
    fr = ixConnect.feedService.findFirstActions(fai, 1, ActionC.mbMin);

    feed = (fr && fr.actions && fr.actions.length > 0) ? fr.feeds.get(fr.actions[0].feedGuid) : null;

    return (feed) ? feed.guid : null;
  },

  /**
   * Checks, if the user has subscribed to an elements feed.
   * @param {String} objId
   * @return {Boolean}
   */
  hasSubscription: function (objId) {
    var fai, fr, feed;

    fai = FindActionsInfo();
    fai.objId = objId;
    fai.findSubscriptions = true;
    fr = ixConnect.feedService.findFirstActions(fai, 1, ActionC.mbMin);

    return fr && fr.subscriptions && (fr.subscriptions.size() > 0);
  },

  /**
   * Subscribe to a feed.
   * @param {String} feedGuid
   */
  subscribe: function (feedGuid) {
    var subscription;
    subscription = ixConnect.ix().createSubscription(feedGuid);
    ixConnect.ix().checkinSubscription(subscription, SubscriptionC.mbAll);
  },

  /**
   * Subscribe to an elements feed.
   * @param {String} objId
   */
  subscribeToElement: function (objId) {
    var me = this;
    me.subscribe(me.getFeedGuid(objId));
  },

  /**
   * Unsubscribe from a feed.
   * @param {String} feedGuid
   */
  unsubscribe: function (feedGuid) {
    var subscription;
    subscription = ixConnect.ix().createSubscription(feedGuid);
    ixConnect.ix().deleteSubscription(subscription);
  },

  /**
   * Unsubscribe from an elements feed.
   * @param {String} objId
   */
  unsubscribeFromElement: function (objId) {
    var me = this;
    me.unsubscribe(me.getFeedGuid(objId));
  }

});
