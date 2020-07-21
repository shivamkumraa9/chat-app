const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const http = require('http');
const socketio = require('socket.io')
const path = require('path');


const models = require('./config/user')

const app = express();


const server = http.createServer(app);
const io = socketio(server)


const User = models.User;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

mongoose.connect(process.env.DB_CRED,{ useNewUrlParser: true ,useUnifiedTopology: true})
				.then(()=> console.log("DB Conneted"))
				.catch((err)=> console.log(err))

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended:true}));

app.use(session({
	secret:"fdjsf43284rfnjkf29489elqrth5rfn",
	resave: true,
    saveUninitialized: true
}))

app.use(flash());

app.use(passport.initialize())
app.use(passport.session())


app.use('/',require('./routes/main.js'));
app.use('/users',require('./routes/auth.js'));
app.use('/chat',require('./routes/chat.js'));

require("./config/socket_handler.js")(io)

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>console.log(`Listening on the port ${PORT}`))