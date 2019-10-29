//注册，登录,注销
var express = require('express')
var request = require('request');
var querystring = require('querystring');
var router = express.Router()
// 获取md5模块
var md5 = require('blueimp-md5')
// 获取表格提交模块
var fromidable = require('formidable')
// 获取数据表
var User = require('../models/user.js')
var Topic = require('../models/topic.js')
var Friend = require('../models/friend.js')
var Comment = require('../models/comment.js')
var Chat = require('../models/chat.js')
var Topictype = require('../models/topictype.js')
// 获取mongo实例
var mongoose = require('mongoose')
// 获取文件读写模块
var fs = require('fs')
// 获取path模块
var path = require('path')
// 获取moment模块
var moment = require('moment')

//首页：登录，注册，登出，添加帖子，添加好友
//main.html
// 进入首页，加载帖子，加载回复
router.get('/', function (req, res) {
	var userSe = req.session.user
	if (userSe != null) {
		//通过users._id加载帖子
		Friend.find({
			friendid: userSe._id,
			isCheck: 0
		}).populate({
			path: 'users',
			select: 'isCheck,friendName,my'
		}).exec(function (err, check) {
			if (err) {
				console.log('Err==============>' + err)
			}
			Topic.find().sort(
				'commons'
			).limit(9).exec(function (err, titles) {
				if (err) {
					console.log(err)
				}
				JSON.stringify(titles)
				for (var i = 0; i < titles.length; i++) {
					var data = moment(titles[i].dataTime).format("YYYY-MM-DD")
					titles[i].dataTime = data
				}
				var topicid = new Array()
				for (var i = 0; i < titles.length; i++) {
					topicid[i] = titles[i]._id
				}
				Comment.find({
					topic: {
						$in: topicid
					}
				}, function (err, comment) {
					if (err) {
						console.log(err)
					}
					Topictype.find(function (err, type) {
						if (err) {
							console.log(err)
						}
						else {
							res.render('main.html', {
								titles: titles,
								user: userSe,
								comment: comment,
								check: check,
								type: type
							})
						}
					})
				})


			})

		})
	}
	if (userSe == null) {
		Topic.find().sort(
			'commons'
		).limit(5).exec(function (err, titles) {
			if (err) {
				console.log(err)
			}
			console.log(typeof (titles))
			// titles = titles.toJSON({getters:true})
			for (var i = 0; i < titles.length; i++) {
				moment(titles[i].dataTime).format('YYYY-MM-DD')
			}
			var topicid = new Array()
			for (var i = 0; i < titles.length; i++) {
				topicid[i] = titles[i]._id
			}
			Comment.find({
				topic: {
					$in: topicid
				}
			}, function (err, comment) {
				if (err) {
					console.log(err)
				}
				Topictype.find().sort().limit(5).exec(function (err, type) {
					if (err) {
						console.log(err)
					}
					else {
						res.render('main.html', {
							titles: titles,
							user: userSe,
							comment: comment,
							type: type
						})
					}
				})
			})


		})
	}

})

//登出
router.get('/logout', function (req, res) {
	req.session.user = null
	res.redirect('/')
})

//登录
router.post('/login', function (req, res) {
	var body = req.body
	User.findOne({
		nickname: body.nickname,
		password: md5(md5(body.password))
	}, function (err, user) {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: err.message
			})
		}

		if (!user) {
			return res.status(200).json({
				err_code: 1,
				message: '用户名或密码错误'
			})
		}
		req.session.user = user
		res.status(200).json({
			err_code: 0,
			message: 'ok'
		})

	})
})

var code

//注册
router.post('/register', function (req, res) {
	var body = req.body
	var password = req.body.password
	var parm = /^[a-zA-Z0-9_-]{8,17}$/
	if (!parm.exec(password)) {
		return res.status(200).json({
			err_code: 501,
			message: '密码格式错误'
		})
	}

	User.findOne({
		$or: [{
			nickname: body.nickname
		},
		{
			phone: body.phone
		}
		]
	}, function (err, data) {
		console.log(data)
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务端错误'
			})
		}
		if (data) {
			JSON.stringify(data)
			console.log(data)
			if (data.nickname == body.nickname) {
				return res.status(200).json({
					err_code: 1,
					message: '用户名已经存在'
				})
			}
			if (data.phone == body.phone) {
				console.log("Phone exist")
				return res.status(200).json({
					err_code: 2,
					message: "用户手机已被注册"
				})
			}
		}
		var code = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
		var queryData = querystring.stringify({
			"mobile": req.body.phone, // 接受短信的用户手机号码
			"tpl_id": "189814", // 您申请的短信模板ID，根据实际情况修改
			"tpl_value": `#code#=${code}`, // 您设置的模板变量，根据实际情况修改
			"key": "7fc361e51bd2ad5f793178d58fd0a7d3", // 应用APPKEY(应用详细页查询)
		})
		console.log('提交代码' + queryData)
		// 提交发送短信的url
		// var queryUrl = 'http://v.juhe.cn/sms/send?'+queryData;
		//提交返回事件
		// request(queryUrl, function (error, response, body) {
		// 	if (!error && response.statusCode == 200) {
		// 		console.log(JSON.parse(body)) // 解析并打印接口返回的JSON内容
		return res.status(201).json({
			err_code: 201,
			message: code
		})
		// 	} else {
		// 		console.log('请求异常');
		// 	}
		// })
		// return res.status(201).json({
		// 	err_code:201,
		// 	message:code
		// })
	})
})


//确认注册
router.post('/cheregister', function (req, res) {
	var codes = req.query.data
	var getcode = req.body.code
	console.log("请求路径的code" + codes)
	console.log("输入的code" + getcode)
	if (codes == getcode) {
		var body = req.body
		//对面进行md5重复加密
		//密码加密
		body.password = md5(md5(body.password))
		// 实现注册
		new User(body).save(function (err, user) {
			if (err) {
				console.log(err)
				return res.status(500).json({
					err_code: 500,
					message: '服务端错误'
				})
			}
			// 注册成功，使用Session记录用户登录状态
			console.log("注册成功")
			req.session.user = user
			return res.status(200).json({
				err_code: 0,
				message: 'ok'
			})
		})
	} else {
		console.log("验证码错误")
		return res.status(200).json({
			err_code: 10,
			message: "code_err"
		})
	}

})

//添加好友
router.post('/addnew', function (req, res) {
	var body = req.body

	User.findOne({
		nickname: body.friendName
	}, function (err, data) {
		console.log(data)
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务端错误'
			})
		}
		if (data.nickname == req.session.user.nickname) {
			return res.status(200).json({
				err_code: 5,
				message: '添加自己了'
			})
		}
		if (data == null) {
			return res.status(200).json({
				err_code: 3,
				message: '没有该用户哦'
			})
		}
		if (data != null) {
			console.log(data._id)
			body.friendid = data._id
			body.myid = req.session.user._id
			body.my = req.session.user.nickname
			console.log(body)
			Friend.find({
				'my': body.my,
				'friendName': body.friendName
			}, function (err, data) {
				console.log(data)
				if (err) {
					return res.status(500).json({
						err_code: 502,
						message: '查询失败'
					})
				}
				if (data[0] != null) {
					return res.status(200).json({
						err_code: 4,
						message: '重复添加好友'
					})
				}
				new Friend(body).save(function (err, friend) {
					if (err) {
						return res.status(500).json({
							err_code: 501,
							message: '保存失败'
						})
					} else {
						return res.status(200).json({
							err_code: 2,
							message: '正在等待对方请求'
						})
					}
				})

			})
		}

		if (data === null) {
			return res.status(200).json({
				err_code: 2,
				message: '该用户不存在'
			})
		}
	})

})

//接受好友申请
router.post('/accept', function (req, res) {
	var fri = req.query.my
	var user = req.session.user
	console.log(fri)
	Friend.find({
		'my': fri
	}, function (err, data) {
		if (err) {
			console.log(err)
		}
		console.log(data)
		Friend.update({
			'isCheck': 0
		}, {
			$set: {
				'isCheck': 1
			}
		}, function (err) {
			if (err) {
				console.log(err)
			}

			console.log('update')
			var i = data.length - 1
			var friends = new Friend({
				'my': user.nickname,
				'friendName': data[i].my,
				'myid': data[i].friendid,
				'friendid': data[i].myid,
				'isCheck': 1
			})
			console.log(friends)
			friends.save(function (err) {
				if (err) {
					console.log(err)
				} else {
					res.redirect('/')
				}
			})
		})
	})
})

// 首页图片，添加动态，查找好友，显示好友列表
// 确认帖子类型
var type = null
router.get('/chosetype', function (req, res) {
	var type = req.query.type
	console.log(type)
})
//添加动态
router.post('/newtopic', function (req, res) {
	var body = req.body
	
	var form = new fromidable.IncomingForm();
	form.uploadDir = path.normalize(__dirname + "/../upLoadpic");
	// parse方法的参数err:错误对象,fidles:提交的表单数据,files:提交的图片或者文件数据
	// 猜想：body数据传入此函数的时候被解析为fidles存储文本表单数据，files存储图片表单数据
	form.parse(req, function (err, fidles, files) {
		
		
		// if(err){
		// 	console.log(err)
		// 	res.redirect('/')
		// }
		var oldpath = files.topPic.path;
		var newpath = path.normalize(__dirname + "/../upLoadpic") + "/" + fidles.title + ".jpg";
		console.log(oldpath,newpath)
		if (oldpath === newpath) {
			fs.unlink('oldpath', function (err) {
				if (err) {
					console.log('err for delete pic')
				}
			})
		}
		fs.rename(oldpath, newpath, function (err) {
			if (err) {
				res.send("失败");
				return;
			}
			console.log('======>路径'+newpath)
			// 将fidles内的数据赋值给body
			body.topPic = fidles.title+'.jpg'
			body.type = fidles.typeid
			body.title = fidles.title
			body.container = fidles.container
			//跳转到切的业务
			body.picPath = req.session.user.pic
			if (req.session.user.pic == '1.jpg') {
				return res.status(200).json({
					err_code: 1,
					message: '请完善个人信息'
				})
			}
			body.user = req.session.user._id
			new Topic(body).save(function (err, topics) {
				console.log(body)
				if (err) {
					return res.status(500).json({
						err_code: 500,
						message: '服务端错误'
					})
				}
				res.status(200).json({
					err_code: 0,
					message: 'ok'
				})
			})
		});
	})
	
})


//个人信息修改页面:修改基本信息，修改头像
//个人信息.html
//进入个人信息修改页面
router.get('/selfinfo.html', function (req, res) {
	if (req.session.user == null) {
		res.render('个人信息.html', {
			user: req.session.user
		})
	}
	var password = req.session.user.password
	console.log(password)
	// var repass=convertMD5(convertMd5(password))MD5无法解密
	// console("解码后"+repass)
	Topic.find({'user':req.session.user._id},function(err,data){
		res.render('个人信息.html', {
			user: req.session.user,
			data:data
		})
	})
	

})

//更改头像
router.post('/dosetavatar', function (req, res) {
	var user = req.session.user
	var form = new fromidable.IncomingForm();
	console.log(form)
	form.uploadDir = path.normalize(__dirname + "/../avater");
	form.parse(req, function (err, fidles, files) {
		var oldpath = files.touxiang.path;
		var newpath = path.normalize(__dirname + "/../avater") + "/" + user.nickname + ".jpg";
		if (oldpath === newpath) {
			fs.unlink('oldpath', function (err) {
				if (err) {
					console.log('err for delete pic')
				}
			})
		}
		fs.rename(oldpath, newpath, function (err) {
			if (err) {
				res.send("失败");
				return;
			}
			req.session.avatar = req.session.user.nickname + '.jpg'
			console.log(req.session.user.pic)
			console.log(req.session.user.nickname)
			//跳转到切的业务
			User.updateMany({
				"nickname": req.session.user.nickname
			}, {
				$set: {
					"pic": req.session.avatar
				}
			}, function (err, results) {
				if (err) {
					console.log(err)
				}
				User.find({
					'nickname': req.session.user.nickname
				}, function (err, data) {
					if (err) {
						console.log(err)
					}
					req.session.user = null
					req.session.user = data[0]
					res.redirect('/')
				})
			});
		});
	})
})

//好友动态页面,展示好友列表，展示好友动态，通过好友姓名筛选动态列表
//好友动态.html
//进入好友动态页面
router.get('/friend.html', function (req, res) {
	var userSe = req.session.user
	if (userSe != null) {
		Friend.find({
			friendid: userSe._id,
			isCheck: 1
		}).populate({
			path: 'users',
			select: 'friendName,my,myid'
		}).lean().exec(function (err, friend) {
			if (err) {
				console.log('Err==============>' + err)
			}
			JSON.stringify(friend)
			var friends = new Array()
			for (var i = 0; i < friend.length; i++) {
				friends[i] = friend[i].myid
			}
			if (friend != null) {
				Topic.find({
					user: {
						$in: friends
					}
				}).populate({
					path: 'users',
					select: 'title,container'
				}).exec(function (err, titles) {
					if (err) {
						console.log(err)
					}
					JSON.stringify(titles)
					var topicid = new Array()
					for (var i = 0; i < titles.length; i++) {
						topicid[i] = titles[i]._id
					}
					Comment.find({
						topic: {
							$in: topicid
						}
					}, function (err, comment) {
						if (err) {
							console.log(err)
						}
						res.render('好友动态.html', {
							titles: titles,
							user: userSe,
							friend: friend,
							comment: comment
						})
					})
				})
			}
			if (friend[0] == null) {
				res.render('好友动态.html', {
					user: userSe,
					friend: null
				})
				return null
			}


		})
		// Topic.find({user:userSe._id}).populate(
		// 	{path:'friends',select:'title,container'}
		// ).exec(function(err,titles){
		// 	if(err){
		// 		console.log(err)
		// 	}
		// 	console.log(titles)
		// 	res.render('好友动态.html',{user:req.session.user,titles:titles})
		// }) 
	} else {
		res.render('好友动态.html', {
			user: null,
			friend: null,
			comment: null
		})
	}

})

//好友帖子的回复按钮，只回复楼主
router.post('/talk', function (req, res) {
	var user = req.session.user
	var body = req.body
	var id = req.query._id
	id = id.replace(/\"/g, "")
	console.log(id)
	Topic.findById(id, function (err, topi) {
		if (err) {
			console.log(err)
		}
		var com = req.query.comments
		console.log(com)
		if (com != null) {
			var id = req.query._id
			id = id.replace(/\"/g, "")
			com = com.replace(/\"/g, "")
			Comment.find({
				'_id': com
			}, function (err, comments) {
				if (err) {
					console.log(err);
				}
				var comments = new Comment({
					'pinglun': body.pinglun,
					'topic': id,
					'speaker': req.session.user.nickname,
					'towho': comments[0].speaker,
				})
				comments.save(function (err) {
					if (err) {
						console.log(err)
					}
					Topic.update({
						'_id': id
					}, {
						$set: {
							'commons': topi.commons + 1
						}
					}, function (err, data) {
						if (err) {
							console.log(err)
						}
						res.redirect('friend.html')
					})

				})
			})

		} else {
			var id = req.query._id
			console.log(id)
			id = id.replace(/\"/g, "")
			var comments = new Comment({
				'pinglun': body.pinglun,
				'topic': topi._id,
				'speaker': req.session.user.nickname,
			})
			comments.save(function (err) {
				if (err) {
					console.log(err)
				}
				Topic.update({
					'_id': id
				}, {
					$set: {
						'commons': topi.commons + 1
					}
				}, function (err, data) {
					if (err) {
						console.log(err)
					}
					res.redirect('friend.html')
				})
			})
		}

	})

})

//详细页，展示搜索的用户详细
router.get('/detail', function (req, res) {
	var userSe = req.session.user
	var name = req.query.name
	console.log(name)
	User.findOne({
		nickname: name,
	}, function (err, friend) {
		if (err) {
			console.log(err)
		}
		console.log(friend._id)
		// res.render('详细.html',{user:userSe,friend:friend})
		Topic.find({
			'user': friend._id
		}, function (err, titles) {
			if (err) {
				console.log(err)
			}
			JSON.stringify(titles)
			var topicid = new Array()
			for (var i = 0; i < titles.length; i++) {
				topicid[i] = titles[i]._id
			}
			Comment.find({
				topic: {
					$in: topicid
				}
			}, function (err, comment) {
				if (err) {
					console.log(err)
				}
				res.render('详细.html', {
					titles: titles,
					user: userSe,
					friend: friend,
					comment: comment
				})
			})
		})

	})
})

//公告页，展示公告，管理员添加公告
//公告.html
//进入公告页
router.get('/info.html', function (req, res) {
	res.render('公告.html', {
		user: req.session.user
	})
})

//进入聊天室 
router.get('/chatroom.html', function (req, res) {
	Chat.find(function (err, data) {
		if (err) {
			console.log(err)
		} else {
			console.log(data)
			res.render("聊天室.html", {
				user: req.session.user,
				chats: data
			})
		}
	})

})

//保存聊天数据
router.post('/chats', function (req, res) {
	var body = req.body
	var user = req.session.user.nickname
	req.body.user = user
	console.log(body)
	new Chat(body).save(function (err, data) {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: "提交失败"
			})
		} else {
			return res.status(200).json({
				err_code: 200,
				message: "提交成功"
			})
		}
	})
})

router.get('/out', function (req, res) {
	res.redirect('/')
})


//修改用户名或密码
router.post('/updatapass', function (req, res) {
	var account = req.body
	console.log(account)
	User.findByIdAndUpdate(account._id, {
		password: account.password,
		nickname: account.nickname
	}, function (err, data) {
		if (err) {
			console.log("err")
			return res.status(400).json({
				msg: "server err",
				err_code: 0
			})
		}
		return res.status(200).json({
			msg: "ok",
			err_code: 1
		})
	})
})

router.get('/typeSearch', function (req, res) {
	var user = req.session.user
	var type = req.query.type
	Topic.find({ 'type': type }, function (err, data) {
		if (err) {
			console.log('get type err')
		}
		res.render('分类.html', {
			topics: data,
			user: user
		})
	})
})

router.get('/admin.html', function (req, res) {
	var user = req.session.user
	if (user.status === 0) {
		User.find(function (err, users) {
			if (err) {
				console.log('user查不出来')
			}
			Topic.find(function (err, topics) {
				if (err) {
					console.log('topic查不出来')
				}
				Topictype.find(function (err, types) {
					if (err) {
						console.log('type查不出来');
					}
					res.render('admin.html', {
						user: user,
						users: users,
						topics: topics,
						types: types
					})
				})
			})
		})

	}
})

router.post('/typeadd', function (req, res) {
	var type = req.body
	new Topictype(type).save(function (err, data) {
		if (err) {
			console.log(err)
		}
		return res.status(200).json({
			err_code: 1,
			message: '成功'
		})
		res.redirect('/admin.html')
	})
})

router.get('/delType',function(req,res){
	var typename = req.query.type
	Topictype.deleteOne({'topictype':typename},function(err,data){
		if(err){
			console.log(err)
		}
		res.redirect('/admin.html')
	})
})

router.get('/dianzan',function(req,res){
	var id = req.query.topic
	id = id.replace(/\"/g, "")
	// Topic.find({'_id':id},function(err,data){
	// 	if(err){
	// 		console.log(err)
	// 	}
	// 	else{
	// 		console.log('get')
	// 		console.log(data[0])
	// 		res.redirect('friend.html')
	// 	}
	// })
	Topic.update({
		'_id': id
	}, {
		$inc:{'isFaver':+1}
	}, function (err, data) {
		if (err) {
			console.log(err)
		}
		res.redirect('friend.html')
	})
	console.log(id)
})

router.get('/dianzan_main',function(req,res){
	var id = req.query.topic
	id = id.replace(/\"/g, "")
	Topic.update({
		'_id': id
	}, {
		$inc:{'isFaver':+1}
	}, function (err, data) {
		if (err) {
			console.log(err)
		}
		res.redirect('/')
	})
	console.log(id)
})

// 禁言
router.get('/stopTalking',function(req,res){
	var user = req.query.nickname
	User.updateOne({'status':1},function(err,data){
		if(err){
			console.log(err)
		}
		res.redirect('/admin.html')
	})
})

// 取消禁言
router.get('/goTalking',function(req,res){
	User.updateOne({'status':2},function(err,data){
		if(err){
			console.log(err)
		}
		res.redirect('/admin.html')
	})
})

// 删除用户
router.get('/deluser',function(req,res){
	User.deleteOne({'nickname':req.query.nickname},function(err,data){
		if(err){
			console.log(err)
		}
		res.redirect('/admin.html')
	})
})


module.exports = router




