module.exports = (fn)=>{                  //to handle async errors in routes
    return (req,res,next) =>{
        fn(req,res,next).catch(next);
    }
}