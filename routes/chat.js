const express = require('express');
const extra = require('../config/extra.js')
const router = express.Router();

const {Room} = require('../config/user.js')


const validate_room = (req,res,next) =>{
	let id = req.params.id;
	Room.findById(id).then((room)=>{
		if(room){
			req.room = room;
			next()
		}else{
			res.status(400);
			res.send('Not Allowed');

		}
	})
}


router.post("/create-room",extra.loginRequired,(req,res)=>{
	let {name} = req.body;
	if(name){
		let room = new Room({name,admin:req.user._id})
		room.save()
		return res.redirect("/dashboard")
	}
	req.flash("failure","Please provide the name")
	res.redirect("/dashboard")
})


router.get("/join/:id",extra.loginRequired,validate_room,(req,res)=>{
	res.render("chat_room",{username:req.user.name,room_id : req.params.id,room:req.room})
})


router.get("/delete/:id",extra.loginRequired,validate_room,async (req,res)=>{
	if(req.room.admin.toString() === req.user._id.toString()){
	    await req.room.remove()
	    return res.redirect("/dashboard")
	}
	res.status(400);
	res.send('Not Allowed');
})



module.exports = router