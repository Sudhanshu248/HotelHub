const User = require("../models/user")


module.exports.renderSignup = (req ,res )=>{
    res.render("users/signup.ejs")
};


module.exports.Singup = async (req ,res)=> {
   try {
     let {username , email ,password} =req.body;
    const newUser = new User({email ,username});
    const userRegister=  await User.register(newUser , password);
    console.log(userRegister);
    req.login(userRegister , (err)=>{
   if(err){
    return next(err)
   }
   req.flash("success" , "Sign-up successfully! ");
   res.redirect("/listings")
    })
 
   } catch (error) {
    req.flash("error" , error.message);
    res.redirect("/signup")
   }
};


module.exports.renderLogin = (req ,res) => {
    res.render("users/login")
};


module.exports.login = async (req,res) => {
    req.flash("welcome back to wander lust !");
   let RegisterUrl = res.locals.registerUrl || "/listings"; 
    res.redirect(RegisterUrl)
}


module.exports.logout = (req ,res)=>{
    req.logOut((err)=>{
        if(err){
           return  next(err);
        }else{
            req.flash("success" , "You are logout successfully !")
            res.redirect("/listings")
        }
    })
    };