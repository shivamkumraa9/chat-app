const cookie = require('cookie')
const jwt = require("jsonwebtoken");

module.exports = (socket,next) =>{
    let c = socket.handshake.headers.cookie;
    let auth = cookie.parse(c).auth
    if(auth){
        try{
            token = jwt.verify(auth,"secret")
            socket.custom_user = token
            next()
        }catch(err){}
    }
}