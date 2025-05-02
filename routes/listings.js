const express = require("express");
const router = express.Router();
const wrapAsync = require("../utiles/wrapAsync.js");
const { isloggedIn, isOwner , validatelisting } = require("../middleware.js");
const ListingController = require("../controllers/listing.js")

const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({storage });

router
.route("/")
.get( wrapAsync(ListingController.renderIndex))
.post( 
isloggedIn,
upload.single('listing[image]'),
validatelisting,
wrapAsync(ListingController.CreateListing));


// .post( upload.single('listing[image]') , (req ,res )=>{
//     res.send(req.file);
// });


router.get("/new" , isloggedIn ,ListingController.renderNewListing);

router.route("/:id")
.get( wrapAsync(ListingController.renderShowListing))
.put(isloggedIn , isOwner,upload.single('listing[image]'),validatelisting ,wrapAsync(ListingController.UpdateListing))
.delete(isloggedIn, isOwner ,wrapAsync( ListingController.DestroyListing))
.post(isloggedIn , wrapAsync(ListingController.BookNow));


router.get("/:id/edit",isloggedIn , isOwner, wrapAsync( ListingController.renderEditListing));
router
.get("/:id/book" , isloggedIn , ListingController.renderBooking)
.post("/:id/book" , isloggedIn , ListingController.BookNow);
module.exports = router;