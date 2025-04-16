if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env)

const express  = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utiles/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const User =require("./models/user.js")

const reviewRoute = require("./routes/reviews.js");
const listingRoute = require("./routes/listings.js");
const userRoute = require("./routes/user.js");

const Listing = require("./models/listing");
const wrapAsync = require("./utiles/wrapAsync.js");
const {listingSchema , reviewSchema} = require("./schema.js")
const Review = require("./models/review.js");


//Set views folder for using template 
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname ,"/public")));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsmate);



// Setup mongoose
let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dburl = process.env.URL;

main()
.then((res)=>{
    console.log("connection successfully!")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(dburl);
}

/* session*/
const store = MongoStore.create({
    mongoUrl : dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default
})

store.on("error", ()=>{
    console.log("ERROR in MONGO Session Store", er)
})

const sessionMiddle = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.use(session(sessionMiddle));
app.use(flash());

/*Passport Middleware*/
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*flash Variable Declare*/ 
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});




/* 
app.get("/demouser" , async(req ,res ,next)=>{
  let fakeuser = new User({
    email:"Ashu@gmail.com",
    username:"jack",
  });

 let registerUser = await User.register(fakeuser,"hello")
  res.send(registerUser)
})
  */


/*SET All Routes*/
app.use("/listings" , listingRoute);
app.use("/listings/:id/review" , reviewRoute);
app.use("/" , userRoute);

/*
app.get("/" , (req ,res)=>{
    res.send("page was loading !")
});
*/

app.all("*" , (req ,res ,next)=>{
    next(new ExpressError(404 , "Page not Found!"));
});


// Error handling
app.use((err ,req ,res ,next)=>{
let { statuscode=500 , message="Something Went Wrong"} = err;
res.status(statuscode).render("listings/error.ejs" , {message});
});


app.listen(8080 , ()=>{
    console.log("port is listening! ")
});