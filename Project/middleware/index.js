var Campground = require("../models/campground")
var Comment = require("../models/comment")


//All MiddleWare Goes Here
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,(err,foundCampground)=>{
			if(err){
				req.flash("error","Campground not found")
				res.redirect("back")
			}else{
				
				// Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
				if (!foundCampground) {
					req.flash("error", "Item not found.");
					return res.redirect("back");
				}
				
				//does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next()
				}else{
					req.flash("error","You don't have necessary Privileges")
					res.redirect("back")	
				}
			}
		})	
	}else{
		req.flash("error","You need to be Logged in to do that")
		res.redirect("back")
	}
}


middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id,(err,foundComment)=>{
			if(err){
				req.flash("error","You don't have necessary Privileges")
				res.redirect("back")
			}else{
				
				// Added this block, to check if foundComment exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
				if (!foundComment) {
					req.flash("error", "Comment not found.");
					return res.redirect("back");
				}
				
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next()
				}else{
					res.redirect("back")	
				}
			}
		})	
	}else{
		req.flash("error","You need to be logged in to do that")
		res.redirect("back")
	}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error","You need to be Logged in to do that")
	res.redirect("/login")
}

module.exports = middlewareObj