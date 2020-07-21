const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");

const models = require('../config/user.js');
const extra = require('../config/extra.js');

const mongoose = require('mongoose');

const User = models.User

router.get("/login",extra.mustLoggedout,(req,res)=>{
	res.render("login",{emailValue:'',logged:req.user ? true : false})
})


router.get("/register",extra.mustLoggedout,(req,res)=>{
	res.render("register",{emailValue:'',nameValue:'',logged:req.user ? true : false})
})

router.get("/logout",(req,res)=>{
	req.logout();
	res.redirect("/users/login")
})




router.post("/login",extra.mustLoggedout,(req,res,next) =>{
	let {email,password} = req.body;
	if (!(email && password)){
		req.flash("failure","All fields are required")
		res.render("login",{emailValue:email,logged:req.user ? true : false})
	}else{
		User.findOne({email:email}).then(user =>{
			if (user){
				bcrypt.compare(password,user.password,(err,result)=>{
					if(result){
						req.login(user,(err)=>{
							if(err){return err}
							else{
								return res.redirect("/dashboard")
							}
						})

					}else{
						req.flash("failure","Invalid/Email password")
						res.render("login",{emailValue:email,logged:req.user ? true : false})
					}
				})
			}else{
				req.flash("failure","Invalid/Email password")
				res.render("login",{emailValue:email,logged:req.user ? true : false})
			}
		})
		
	}
});



router.post("/register",extra.mustLoggedout,(req,res)=>{
	let {name,email,password1,password2} = req.body;
	// check if all fields are present
	if (!(name && email && password1 && password2)){
		req.flash("failure","All fields are required");
		return res.render("register",{emailValue:email,nameValue:name,logged:req.user ? true : false})
	}

	if(password1 !== password2){
		req.flash("failure","Passwords did not matched")
		return res.render("register",{emailValue:email,nameValue:name,logged:req.user ? true : false})
	}

	if (password1.length < 6){
		req.flash("failure","Password should have the minimum length of 6")
		 return res.render("register",{emailValue:email,nameValue:name,logged:req.user ? true : false})
	}


	User.findOne({name:name}).then(user =>{
		if (user){
			req.flash("failure","name already exists")
			return res.render("register",{emailValue:email,nameValue:name,logged:req.user ? true : false})
		}else{
			User.findOne({email:email}).then(user1 => {
				if(user1){
					req.flash("failure","email already exists")
					return res.render("register",{emailValue:email,nameValue:name,logged:req.user ? true : false})						
				}else{
						bcrypt.hash(password1,10,(err,hash)=>{
							if (err){
								throw err;
							}else{
								let user = new User({name,email,password:hash});
								user.save();
								req.flash("success","Your account has been created!")
								return res.redirect("/users/login")
							}
						})					
				}

			})


		}
	})
})

module.exports = router