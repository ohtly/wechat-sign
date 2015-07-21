var sign=require('../lib/sign');//微信提供的签名方法
var config=require('../config.json');//配置文件
var express = require('express');
var request = require('request');

var redisHost  = process.env.REDIS_PORT_6379_TCP_ADDR;
var redis = require("redis"),
    client = redis.createClient(6379, redisHost);

var expireTime=3600*2-200; //ticket失效时间是7200，缓存时间小于它

client.on("error", function (err) {
    console.log("Redis Error " + err);
});    


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	// 如果host或者url为undefine
	if(!req.param('host') || !req.param('url')){
		res.send({err:'no host or/and url'});
		return;
	}

	// host或者url参数为空
	if(req.param('host')=='' || req.param('url')==''){
		res.send({err:'host or/and url is empty'});
		return;
	}	

	getTicket(req,res,function(ticket){
		var url=req.param('url');
    	var _config=config[req.param('host')];

    	if(_config){
    		var result=sign(ticket,url);		
			result.appId=_config.appId;
			res.send(result);	
    	}else{
    		res.send({err:'can not find config'});
    	}
		
    });

});

module.exports = router;

function getTicket(req,res,callback){
	var ticketKey='ticket.'+req.param('host');
	client.get(ticketKey,function(err,ticket){
		if(err){
			res.send(err);
			return;
		}
		if(ticket){
			callback(ticket);
		}else{
			generateTicket(req,res,function(ticket){
				client.set(ticketKey, ticket, function(err){
					if(err){
						res.send(err);
						return;
					}
					callback(ticket);
				});
				client.expire(ticketKey, expireTime);
			});
		}
	});
}

// 通过微信官网，生成ticket
function generateTicket(req,res,callback){
	var _config=config[req.param('host')];
	request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+_config.appId+'&secret='+_config.appSecret, function (error, response, body) {
		// console.log('根据appId和appSecret获取accessToken ..');
		if(error || response.statusCode != 200){
			res.send(error);
			return;
		}
		var access_token=JSON.parse(body).access_token;
		// console.log('access_token: '+access_token);
		
		request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+access_token+'&type=jsapi', function (error, response, body) {
			// console.log('根据accessToken获取..');
			if (error || response.statusCode != 200) {
				res.send(error);
				return;
			}
		  
		  	var ticket=JSON.parse(body).ticket;
		  	// console.log('ticket: '+ticket);
		  	callback(ticket);
		});
	});  
}

