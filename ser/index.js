const expr = require('express')
const app = expr()
const http = require('http').createServer(app)
const path = require('path')
const staticpath = path.join(__dirname+"/../")
const io = require("socket.io")(http,{
    cors:{
        origin:'*'
    }
})
app.use(expr.static(staticpath))

const users = {}
http.listen(5000,function(){
io.on('connection',socket =>{
    socket.on('new-usr-joined',name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joind',name)
    })

    socket.on('send',massage =>{
        socket.broadcast.emit('receive',{massage:massage,name:users[socket.id]})
    })
})
})