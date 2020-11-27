const express = require('express');
const extra = require('../config/extra.js')
const {Room} = require('../config/user.js')

const router = express.Router();

router.get("/",(req,res)=>{
		res.render("index")
})

router.get("/dashboard",extra.loginRequired,async (req,res)=>{
		let rooms = await Room.find({admin:req.user})
		res.render("dashboard",{name:req.user.name,rooms})
})

module.exports = router