const {Room} = require('./user.js');

const iAlreadyExists = (io,socket) =>{
	let count = 0;
	try{
		sockets = io.sockets.adapter.rooms[socket.custom_user.room].sockets
		Object.keys(sockets).forEach((item, index)=>{
			if(io.sockets.connected[item].custom_user._id === socket.custom_user._id){
				count ++;
				if(count === 2){
					return
				}
			}
		})
	}catch(err){}
	return count
}

module.exports = (io)=>{

io.on("connection",socket=>{
	socket.on("Join Room",async (room)=>{
		let db_room = await Room.findById(room)
		if(db_room){
			socket.join(db_room._id.toString())
			socket.custom_user.room = db_room._id.toString()
			socket.emit("Special",`${socket.custom_user.name}, Welcome to the chat`)
			if(iAlreadyExists(io,socket) !== 2){
				socket.broadcast.to(db_room._id.toString()).emit("Special",`${socket.custom_user.name} has joined the chat`)
			}
		}else{
			socket.disconnect()
		}
	})


	socket.on("Message",(message)=>{
		socket.broadcast.to(socket.custom_user.room).emit("Message",message)
	})


	socket.on("Members",(message)=>{
		let ids = []
		let names = []
		try{
			sockets = io.sockets.adapter.rooms[socket.custom_user.room].sockets
			Object.keys(sockets).forEach((item, index)=>{
				if(!(ids.includes(io.sockets.connected[item].custom_user._id ))){
					ids.push(io.sockets.connected[item].custom_user._id)
					names.push(io.sockets.connected[item].custom_user.name)
				}
			})
		}catch(err){}
		socket.emit("Members",names)
	})


	socket.on("disconnect",()=>{
		let found = false
		try{
			sockets = io.sockets.adapter.rooms[socket.custom_user.room].sockets
			Object.keys(sockets).forEach((item, index)=>{
				if(io.sockets.connected[item].custom_user._id === socket.custom_user._id){
					found = true
					return
				}
			})
		}catch(err){}
		if(!found){
			io.to(socket.custom_user.room).emit("Special",`${socket.custom_user.name} has Disconneted`)
		}
	})
})
}