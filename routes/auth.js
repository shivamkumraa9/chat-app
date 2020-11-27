const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const models = require('../config/user.js');

const User = models.User

router.get("/login",(req,res)=>{
	res.render("login",{emailValue:''})
})


router.get("/register",(req,res)=>{
	res.render("register",{emailValue:'',nameValue:''})
})

router.get("/logout",(req,res)=>{
	res.clearCookie("auth")
	res.redirect("/users/login")
})


router.post("/login",async (req,res) =>{
	let {email,password} = req.body;
	if (!(email && password)){
		res.locals.message = {type:"failure",msg:"All fields are required"}
		return res.render("login",{emailValue:email})
	}
	let user = await User.findOne({email:email})
	if (user){
		result = await bcrypt.compare(password,user.password)
		if(result){
			let token = jwt.sign({ name: user.name,_id:user._id }, 'secret');
			res.cookie('auth', token, {httpOnly:true})
			return res.redirect("/dashboard")
		}
	}
	res.locals.message = {type:"failure",msg:"Invalid/Email password"}
	res.render("login",{emailValue:email})	
});




router.post("/register",async(req,res)=>{
	let {name,email,password1,password2} = req.body;
	if (!(name && email && password1 && password2)){
		res.locals.message = {type:"failure",msg:"All fields are required"}
		return res.render("register")
	}

	if(password1 !== password2){
		res.locals.message = {type:"failure",msg:"Passwords did not matched"}
		return res.render("register")
	}

	if (password1.length < 6){
		res.locals.message = {type:"failure",msg:"Password should have the minimum length of 6"}
		return res.render("register")
	}

	let user = await User.findOne({email:email})
	if(user){
		res.locals.message = {type:"failure",msg:"email already exists"}
		return res.render("register")						
	}
	let hash = await bcrypt.hash(password1,10)
	let newuser = new User({name,email,password:hash});
	newuser.save();
	res.redirect("/users/login")				
})

module.exports = router