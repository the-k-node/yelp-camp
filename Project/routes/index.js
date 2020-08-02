var express = require("express")
var router = express.Router()
var passport = require("passport")
var User = require("../models/user")

//root route
router.get("/",(req,res)=>{
	res.render("landing")
})

//Register
router.get("/register",(req,res)=>{
	res.render("register")
})

//handles signup logic
router.post("/register",(req,res)=>{
	var newUser = new User({username: req.body.username})
	User.register(newUser,req.body.password,(err,user)=>{
		if(err){
			req.flash("error",err.message)
			return res.render("register")
		}
		passport.authenticate("local")(req,res,()=>{
			req.flash("success","Hi! Welcome to Yelpcamp "+user.username)
			res.redirect("/campgrounds")
		})
	})
})

//Login Routes
router.get("/login",(req,res)=>{
	res.render("login")
})
//login logic
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds", 
	failureRedirect: "/login"
	}),(req,res)=>{
})

//Logout Routes
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Logged you out")
	res.redirect("/campgrounds")
})

module.exports = router