var mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/test',{useNewUrlParser:true})
var Schema=mongoose.Schema
var moment = require('moment')
var topicSchema=new Schema({
	type:{
		type:String,
		required:true,
		default:'日常'
	},
	title:{
		type:String,
		required:true
	},
	container:{
		type:String,
		required:true
	},
	// 用户头像
	picPath:{
		type:String,
		default:'../public/img/1.jpg'
	},
	//被点赞的次数
	isFaver:{
		type:Number,
		// 轮播图topic默认0
		default:0
	},
	user:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},
	dataTime:{
		type:Date,
		default:Date.now,
		get: v => moment(v).format('YYYY-MM-DD')
	},
	//被浏览次数
	readed:{
		type:Number,
		default:0
	},
	//评论数
	commons:{
		type:Number,
		default:0
	},
	// 帖子图片，单张
	topPic:{
		type:String,
		default:null,
		required:false
	}
})
module.exports=mongoose.model('Topic',topicSchema)