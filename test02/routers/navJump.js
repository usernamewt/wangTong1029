var express=require('express')
var router=express.Router()
router.get('/info.html',function(req,res){
	res.render('公告.html')
})
router.get('/selfInfo.html',function(req,res){
	res.render('个人信息.html')
	user:req.session.user
})
router.get('/my.html',function(req,res){
	res.render('我的动态.html')
	user:req.session.user
})
router.get('/add.html',function(req,rse){
	res.render('添加动态.html')
	user:req.session.user
})
router.get('/friend.html',function(req,res){
	res.render('好友动态.html')
	user:req.session.user
})

module.exports=router