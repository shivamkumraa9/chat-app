const extras = {}

extras.loginRequired = (req,res,next) => {
	if(req.isAuthenticated()){
		next()
	}else{
	req.flash("failure","Please log in to continue")
	res.redirect("/users/login")
	}
}

extras.mustLoggedout = (req,res,next) => {
	if(req.isAuthenticated()){
		req.logout()
		req.flash("failure","You have been logged out")
	}
	next()
}

module.exports = extras