var express=require('express')
var path=require('path')
var bodyParser=require('body-parser')
var router=require('./routers/session')
var session=require('express-session')
var request = require('request');
var querystring = require('querystring');
var app=express()
app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/upLoadpic/',express.static(path.join(__dirname,'./upLoadpic/')))
app.use('/avater',express.static(path.join(__dirname,'./avater')))
app.use('/views/',express.static(path.join(__dirname,'./views/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))
app.engine('html',require('express-art-template'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(session({
	secret:'keyboard cat',
	resave:false,
	saveUninitialized:true
}))
app.use(router)
app.listen(80,function(){
	console.log('server running.....')
})