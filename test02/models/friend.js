var mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/test',{useNewUrlParser:true})
var Schema=mongoose.Schema
var friendSchema=new Schema({
	//我的昵称
	my:{
		type:String,
		required:true
	},
	myid:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},
	//好友昵称
	friendName:{
		type:String,
		required:true
	},
	//好友_id
	friendid:{
		type:Schema.Types.ObjectId,
		ref:'User',
		default:null
	},
	// 是否同意，默认否
	isCheck:{
		type:Number,
		default:0
	}
})
module.exports=mongoose.model('Friend',friendSchema)