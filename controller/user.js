const User = require("../models/user");


module.exports.renderSignupform=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async(req,res)=>{
    let {username,email,password,confirmPassword}=req.body;
    if(password!==confirmPassword){
        req.flash("error","Passwords do not match");
        return res.redirect("/signup");  //here we are returning so that the function does not execute further
    }
    let newUser=new User({username,email});
    user=User.register(newUser,password,(err,user)=>{
        if(err){
            req.flash("error",err.message);
            return res.redirect("/signup");
        }
        req.login(user,(err)=>{
            if(err){
                req.flash("error",err.message);
                return res.redirect("/signup");
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
        
    })
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    res.redirect(res.locals.redirecturl );
  }
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Successfully logged out");
        res.redirect("/listings");
    })
   
}