const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
	name : {type : String,unique:true},
	email : {type:String,unique:true},
	password : String,
	rooms : [{type:mongoose.Schema.Types.ObjectId,ref:'Room'}]
})

const RoomSchema = new mongoose.Schema({
	name : {type:String},
	admin : {type:mongoose.Schema.Types.ObjectId,ref:'User'},
})

const SocketSchema = new mongoose.Schema({
	socket_id : String,
	room_id : {type:mongoose.Schema.Types.ObjectId,ref:'Room'},
	username : String
})

const User = mongoose.model('User',UserSchema);
const Room = mongoose.model('Room',RoomSchema);
const Socket = mongoose.model('Socket',SocketSchema);

module.exports = {User,Room,Socket};