var express=require('express')
var router=express.Router()
var User=require('./models/user.js')
var md5=require('blueimp-md5')

router.get('/info.html',function(req,res){
	res.render('公告.html')
})


router.get('/',function(req,res){
	res.render('main.html',{
		user:req.session.user
	})
})

router.get('/logout',function(req,res){
	req.session.user=null
	res.redirect('/')
})

router.post('/login',function(req,res){
	var body=req.body
	User.findOne({
		nickname:body.nickname,
		password:md5(md5(body.password))
	},function(err,user){
		if(err){
			return res.status(500).json({
				err_code:500,
				message:err.message
			})
		}
		
		if(!user){
			return res.status(200).json({
				err_code:1,
				message:'用户名或密码错误'
			})
		}
		req.session.user=user
		res.status(200).json({
			err_code:0,
			message:'ok'
		})
		
	})
})

//没写get请求
router.post('/register',function(req,res){
	// console.log(req.body)
	var body=req.body
	User.findOne({
			nickname:body.nickname
	},function(err,data){
		if(err){
			return res.status(500).json({
				err_code:500,
				message:'服务端错误'
			})
		}
		if(data){
			return res.status(200).json({
				err_code:1,
				message:'用户名已经存在'
			})
		}
		//对面进行md5重复加密
		body.password=md5(md5(body.password))
		new User(body).save(function(err,user){
			if(err){
				console.log(err)
				return res.status(500).json({
					err_code:500,
					message:'服务端错误'
				})
			}
			// 注册成功，使用Session记录用户登录状态
			req.session.user=user
			res.status(200).json({
				err_code:0,
				message:'ok'
			})
		})
		
		
	})
	
	
})

module.exports=router