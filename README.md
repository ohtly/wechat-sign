# wechat-sign

## 简介

微信认证微服务：

实现的是微信的其中一个功能，nodejs获取微信ticket:

http://mp.weixin.qq.com/wiki/11/0e4b294685f817b95cbed85ba5e82b8f.html

并使用ticket生成浏览器端javascript所需的微信认证信息。只有通过认证，微信js-sdk的功能才可正常调用。

## 使用

下载：

git clone https://github.com/ohtly/wechat-sign.git

然后，进入wechat-sign目录，创建config.json文件（格式参考config.json.template）：

```
{
	"mysite.com":{
		"appId":"APP_ID",
		"appSecret":"APP_SECRET"
	}
}
```

微信公众号，会有appId和appSecret，填写进来。`mysite.com`是为了支持多个微信公众号。

之后，安装所需软件库：

```
$ npm install
```

最后，可以运行了：

```
$ npm start
```

在客户端访问，链接类似这样：http://your_hosts/sign?host=mysite.com&url=http://helloworld.com

其中`helloworld.com`必须在微信公众号中设置为允许的域名。

返回类似这样的信息：

```
{"jsapi_ticket":"sM4AOVdWfPE4DxkXGEs8VJq9p3JaVtQQl1hJOq3ELj1ZxfzDoLbge7L0MEG6uKDbbTbrGi0F9jwdwMPFUKcdRQ","nonceStr":"3m10zpvm15uk5mi","timestamp":"1437537053","url":"http://helloworld.com","signature":"c7b1095def277c2852f18q1c4bb77cbd9a51291b","appId":"wx8f4b48944sd9kdu1"}
```



