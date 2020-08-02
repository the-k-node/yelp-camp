var mongoose = require('mongoose'),
	passwordLocalMongoose = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
	username: String,
	password: String
})
UserSchema.plugin(passwordLocalMongoose)
module.exports = mongoose.model("User",UserSchema)