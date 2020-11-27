const extras = {}

extras.loginRequired = (req,res,next) => {
	if(req.logged_in){
		next()
	}else{
	res.redirect("/users/login")
	}
}

module.exports = extras