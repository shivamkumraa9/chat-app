const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    let auth = req.cookies.auth
    if(auth){
        try{
            token = jwt.verify(auth,"secret")
            req.user = token;
            req.logged_in = true;
            res.locals.logged_in = true;
            next()
            return
        }catch(err){}
    }
    req.logged_in = false;
    res.locals.logged_in = false;
    next()
}