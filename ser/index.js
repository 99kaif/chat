const expr = require('express')
const app = expr();
const path = require('path');
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "./../static/login.html"));
});
var new_user_name = null;
app.get("/chat", (req, res) => {
    new_user_name = req.query.name;
    res.sendFile(path.join(__dirname, "./../static/chat.html"));
})
const http = require('http').createServer(app)
const staticpath = path.join(__dirname+"/../static")
const io = require("socket.io")(http,{
    cors:{
        origin:'*'
    }
})

const user_limit = 10; // to limit the number of concurrent users
var cur_user = 0;

app.use(expr.static(staticpath))

const users = {}
http.listen(5000,function(){
io.on('connection',socket =>{
    socket.on('new-usr-joined', () =>{
	if (cur_user > user_limit) {
		socket.close(0);
		return;
	}
	cur_user = cur_user + 1;
        users[socket.id] = new_user_name;
        socket.broadcast.emit('user-joined',new_user_name)
    })

    socket.on('send',massage =>{
        socket.broadcast.emit('receive',{massage:massage,name:users[socket.id]})
    })

    // close the connection if we get 'end' signal from the client
    socket.on('end', function() {
	socket.disconnect(0);
    })
})
})
