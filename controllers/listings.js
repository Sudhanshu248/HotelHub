const Listing = require("../models/listing");
const cloudinary = require("cloudinary").v2;

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showEachListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Requested Listing doesn't exist! ");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createNewListing = async (req, res, next) => {

  try {

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      newListing.image = { url, filename };
    }

    // newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.editSingleListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested Listing doesn't exist! ");
    res.redirect("/listings");
  }
  let originalImgUrl = listing.image.url;
  originalImgUrl = originalImgUrl.replace("/upload", "/upload/h_200,w_300");
  res.render("listings/edit.ejs", { listing, originalImgUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Requested Listing doesn't exist!");
    return res.redirect("/listings");
  }

  // Check if a new file is uploaded
  if (req.file) {
    // Delete the old image from Cloudinary if it exists
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    // Update the listing with the new image
    const { path: url, filename } = req.file;
    listing.image = { url, filename };
  }

  // Update other listing fields
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  await listing.save();

  req.flash("success", "Listing has been updated.");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};
