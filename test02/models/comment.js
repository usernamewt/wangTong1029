var mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/test',{useNewUrlParser:true})
var Schema=mongoose.Schema
var commentSchema=new Schema({
	// 评论内容
	pinglun:{
		type:String,
		required:true
	},
	//评论者id
	speakerid:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},
	//评论者
	speaker:{
		type:String
	},
	//自己的评论
	self:{
		type:String
	},
	// 是否是管理员，默认1不是
	isAdmin:{
		type:Number,
		default:1
	},
	//被评论帖子
	topic:{
		type:Schema.Types.ObjectId,
		ref:'Topic'
	},
	//被评论者id
	towhoid:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},
	//被评论者
	towho:{
		type:String
	}
	
})

module.exports=mongoose.model('Comment',commentSchema)
