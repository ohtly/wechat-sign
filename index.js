/**
 * Created by yuansc on 15/7/22.
 */
var restify = require('restify');
var logger = require('winston');
var SignController = require('./controller/sign');
var server = restify.createServer({name: 'wechat-sign'});


server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.dateParser());


server.use(function (req, res, next) {
  logger.info({id: req.id(), body: req.body, query: req.query});
  next();
});

server.get('/', function (req, res, next) {
  res.send("Server is Running");
  return next();
});
server.get('/sign', SignController.sign);

server.listen(8888, function () {
  logger.info('%s listening at %s', server.name, server.url);
});