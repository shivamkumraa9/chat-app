const {User,Room,Socket} = require('./user.js');

module.exports = (io)=>{

io.on("connection",socket=>{

	socket.on("Join Room",({username,room})=>{
		User.findOne({name:username}).then((user)=>{
			if(user){
				Room.findById(room).then(
					async (room)=>{
					if(room){
						await Socket.findOne({room_id:room._id,username:user.name}).then(
							(sock)=>{
							if(sock){
								let oldsock = io.sockets.connected[sock.socket_id]
								sock.remove()
								oldsock.emit("Error")
								oldsock.disconnect()
							}})

						s = Socket({socket_id:socket.id,room_id:room._id,username:username})
						s.save()
						Room.updateOne({_id:room._id.toString()},{$push:{sockets:s._id}})
						.catch((err)=>console.log(err))
						socket.join(room._id.toString())
						socket.emit("Special",`${username}, Welcome to the chat`)
						socket.broadcast.to(room._id.toString()).emit("Special",`${username} has joined the chat`)
					}else{
						socket.disconnect()
					}
				})
			}else{
				socket.disconnect()
			}
		})

	})

	socket.on("Message",(message)=>{
		Socket.findOne({socket_id:socket.id}).then((sock)=>{
			if(sock){
				socket.broadcast.to(sock.room_id).emit("Message",message)
			}
		})				
	})

	socket.on("Members",(message)=>{
		Socket.findOne({socket_id:socket.id}).then((sock)=>{
			if(sock){
					Socket.find({room_id:sock.room_id}).then((socks)=>{
					let names = []
					for (let i = 0; i < socks.length; i++){
						names.push(socks[i].username)
					}
					socket.emit("Members",names)
				})
			}
		})
	})

	socket.on("disconnect",()=>{
		Socket.findOne({socket_id:socket.id}).then((sock)=>{
			if(sock){
				io.to(sock.room_id).emit("Special",`${sock.username} has Disconneted`)
				sock.remove()
			}
		})		
	})

})

}