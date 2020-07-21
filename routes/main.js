const express = require('express');
const extra = require('../config/extra.js')
const {Room} = require('../config/user.js')

const router = express.Router();

router.get("/",(req,res)=>{
		res.render("index",{logged:req.user ? true : false})
})

router.get("/dashboard",extra.loginRequired,async (req,res)=>{
		let rooms = await Room.find({admin:req.user})
		res.render("dashboard",{name:req.user.name,rooms,logged:req.user ? true : false})
})

module.exports = router