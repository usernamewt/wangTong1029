var mongoose=require("mongoose")
mongoose.connect('mongodb://localhost/test',{useNewUrlParser:true})
var Schema=mongoose.Schema
var chatSchema=new Schema({
	chreatedate:{
		type:Date,
		default:Date.now()
	},
	user:{
		type:String
	},
	container:{
		type:String
	}
	
})
module.exports=mongoose.model('Chat',chatSchema)