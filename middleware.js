const Listing = require("./models/listing");
const ExpressError = require("./utiles/expressError.js");
const Review = require("./models/review.js");
const {listingSchema , reviewSchema } = require("./schema.js");


module.exports.isloggedIn = (req ,res ,next)=>{
 if(!req.isAuthenticated()){
   req.session.registerUrl = req.originalUrl;
 req.flash("error" , "First login in wanderlust");
 return res.redirect("/login");
 }

 next();
};

module.exports.saveRegisterUrl = (req ,res ,next)=>{
    if(req.session.registerUrl){
        res.locals.registerUrl = req.session.registerUrl;
    }
    next();
};

module.exports.isReviewAuthor = async(req ,res ,next)=>{
let {id , reviewId} = req.params;
let review = await Review.findById(reviewId);
console.log(res.locals.currUser._id)
if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error" , "You are not the author of this review");
   return res.redirect(`/listings/${id}`)
    }

    next();

};

module.exports.isOwner = async(req ,res ,next)=>{
let {id} = req.params;
let listing = await Listing.findById(id);
if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error" , "You are not the owner of this post");
    res.redirect(`/listings/${id}`)
    }

    next();

};

module.exports.validatelisting = (req ,res ,next) =>{
   
    console.log(req.body);
  // Destructure to access the listing object

    // if (!req.body) {
    //     throw new ExpressError(400, "Listing data is required.");
    // }

    let {error}  = listingSchema.validate(req.body);
    if(error){
      
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
};


module.exports.validateReview = (req ,res ,next) =>{
    
    let {error}  = reviewSchema.validate(req.body);
    console.log(req.body.review);
    console.log(req.body);

    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
}