var mongoose=require('mongoose')
var moment = require('moment')
mongoose.connect('mongodb://localhost/test',{useNewUrlParser:true})
var Schema=mongoose.Schema
var userSchema=new Schema({
	nickname:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	created_time:{
		type:Date,
		default:Date.now ,
		get: v => moment(v).format('YYYY-MM-DD')
	},
	last_modify_time:{
		type:Date,
		default:Date.now
	},
	pic:{
		type:String,
		default:'1.jpg'
	},
	aboutMe:{
		type:String,
		default:''
	},
	gender:{
		type:Number,
		//-1:保密 0：男 1：女
		enum:[-1,0,1],
		default:-1
	},
	birthday:{
		type:Date
	},
	status:{
		type:Number,
		//0:没有限制
		//1：不可以评论
		//2：一般用户
		enum:[0,1,2],
		default:2
	},
	phone:{
		type:Number,
		required:true
	}
	
})
module.exports=mongoose.model('User',userSchema)