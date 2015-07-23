/**
 * Sign Controller
 * Created by yuansc on 15/7/23.
 */

var Tools = require('../lib/tools');
var logger = require('winston');
var _  = require('lodash');
var config = require('../config.json');
var wechatSign = require('../lib/sign');
var SignController = module.exports = {};

/**
 * Sign Controller
 * @param req
 * @param res
 * @param next
 */
SignController.sign = function (req, res, next) {
// 如果host或者url为undefine

  if (_.isEmpty(req.query.host) || _.isEmpty(req.query.url)) {
    res.send({err: 'no host or/and url'});
    return next();
  }
  if(_.isEmpty(config[req.query.host])) {
    res.send({err:'host is invalid'})
    return next();
  }
  Tools.signGetTicket(req, res, function (ticket) {
    var url = req.query.url;
    var _config = config[req.query.host];
    if (_config) {
      var result = wechatSign(ticket, url);
      result.appId = _config.appId;
      res.send(result);
      return next();
    } else {
      res.send({err: 'can not find config'});
      return next();
    }
  });
};