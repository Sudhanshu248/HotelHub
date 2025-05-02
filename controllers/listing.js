const Listing = require("../models/listing");

module.exports.renderBooking = async(req ,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    req.flash("success" , "Booking Successfully");
    res.render("listings/book.ejs" , {listing});
}

module.exports.BookNow = async(req ,res)=>{
    let {id} = req.params;
   let listing = await Listing.findById(id);
   listing.booking.push(req.user._id);
   await listing.save();
    req.flash("success" , "Booking Successfully");
  
    res.redirect(`/listings/${id}`);
}

module.exports.renderIndex =async(req , res)=>{
    const allListing =  await Listing.find({});
     res.render("listings/index.ejs" , {allListing});
  }; 


module.exports.renderNewListing =  (req ,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs")
};

module.exports.renderShowListing = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews" , populate:{ path:  "author",}}).populate("owner");
   if(!listing){
   req.flash("error" , "Listing you requested is does not existed");
    res.redirect("/listings");
}

    res.render("listings/show.ejs", {listing});
};

module.exports.CreateListing = async(req ,res ,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url , filename};
    await newlisting.save();
    req.flash("success", "New Listings Created")
    res.redirect("/listings")
};

module.exports.renderEditListing = async(req ,res)=>{
    let {id} = req.params;
    
    let listing = await Listing.findById(id)

    if (!listing) {
        req.flash("error", "listing your requested does not exists! ");
        res.redirect("/listings");
    }

    let originalImage = listing.image.url ;

    originalImage = originalImage.replace("/upload" , "/upload/e_blur:300");

    res.render("listings/edit.ejs", {listing , originalImage})
};


module.exports.UpdateListing = async(req,res)=>{
    let { id } = req.params;
    let newlisting = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newlisting.image = { url, filename };
        newlisting.save();
    }
    req.flash("success", " Listing Updated")
    res.redirect(`/listings/${id}`);
};

module.exports.DestroyListing = async(req ,res)=>{
    let {id} = req.params;
    let newlisting =await Listing.findByIdAndDelete(id);
    console.log(newlisting);
    req.flash("success" , "Listing Deleted");
   return res.redirect("/listings");
};


// Update Listings Using Throw expressError
 /*if(!req.body.listing){
        throw new ExpressError(400 , "Send Some Valid Data!")
        } */

    /*  let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`); */