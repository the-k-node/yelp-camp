var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware")


//INDEX - shows all campgrounds
router.get("/",(req,res)=>{
	//Get all campgrounds from db and render
	Campground.find({},(err,allCampgrounds)=>{
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/index",{campgrounds: allCampgrounds})
		}				
	})
})

//CREATE - add new campground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
	//get data from from and add to campgrounds array
	var name = req.body.name
	var price = req.body.price
	var image = req.body.image
	var desc = req.body.description
	
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	
	//Create a new campground and save to db
	var newCampground = {name: name,price: price, image:image, author:author, description: desc}
	
	Campground.create(newCampground,(err,newlyCreated)=>{
		if(err){
			console.log(err)
		}else{
			//redirect back to campgrounds page
			res.redirect("campgrounds")
		}
	})
})

//NEW - page to add new campground
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	res.render("campgrounds/new")
})

//SHOW - shows more info about each campground
router.get("/:id",(req,res)=>{
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec((err,foundCampground)=>{
		if(!err){
			console.log(foundCampground)
			//render with that campground
			res.render("campgrounds/show",{campground: foundCampground})
		}else{
			console.log(err)
		}
	})
	
})

//EDIT Campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
		Campground.findById(req.params.id,(err,foundCampground)=>{
			res.render("campgrounds/edit",{campground: foundCampground})
		})
})

//UPDATE Campground Route
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
		if(err){
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
	//redirect to show page
})


// Delete/destroy Campground
router.delete("/:id",middleware.checkCampgroundOwnership,async(req, res) => {
  try {
    let foundCampground = await Campground.findById(req.params.id);
    await foundCampground.remove();
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error.message);
    res.redirect("/campgrounds");
  }
});

module.exports = router;