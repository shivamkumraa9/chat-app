const express = require('express');
const extra = require('../config/extra.js')
const router = express.Router();

const {User,Room} = require('../config/user.js')


const check_rooms = (req,res,next) =>{
	if(req.user.rooms.length >= 5){
		req.flash("failure","max 5 rooms can be created.")
		res.redirect("/dashboard")
	}else{
		next()
	}
}


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


router.post("/create-room",extra.loginRequired,check_rooms,(req,res)=>{
	let {name} = req.body;
	if(name){
		let room = new Room({name,admin:req.user._id})
		room.save()
		User.updateOne({email:req.user.email},{$push:{rooms:room._id}})
		.catch((err)=>console.log(err))
		req.flash("success","room created")
		res.redirect("/dashboard")
	}else{
	req.flash("failure","Please provide the name")
	res.redirect("/dashboard")
	}
})


router.get("/join/:id",extra.loginRequired,validate_room,(req,res)=>{
	res.render("chat_room",{username:req.user.name,room_id : req.params.id,room:req.room,logged:req.user ? true : false})
})


router.get("/delete/:id",extra.loginRequired,validate_room,(req,res)=>{
	if(req.room.admin.toString() === req.user._id.toString()){
		User.updateOne({email:req.user.email}, { $pullAll: {rooms: [req.room._id] } } )
	    .catch((err)=>console.log(err))
	    req.room.remove()
	    req.flash("success","Room deleted")
	    res.redirect("/dashboard")
	}else{
		res.status(400);
		res.send('Not Allowed');
	}	
})



module.exports = router