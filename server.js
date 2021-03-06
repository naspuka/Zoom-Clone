const express = require('express');
const { v4 : uuidv4 } = require('uuid');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer =  ExpressPeerServer(server, {
    debug: true
})
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);
app.get('/', (req, res)=>{
    res.redirect(`/${ uuidv4() }`)
});

app.get('/:room', (req,res) =>{
    res.render('room', { roomId: req.params.room})
})


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log('A user just joined the room');
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    })
})


server.listen(3031);