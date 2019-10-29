var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true})
var Schema = mongoose.Schema
var topicTypeSchema = new Schema({
	topictype:{
		type:String,
		required:true,
		default:'日常'
	},
	typeId:{
		type:Schema.Types.ObjectId,
		ref:'Topic'
	}
})
module.exports = mongoose.model('Topictype',topicTypeSchema)



