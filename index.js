const app = require('express')();
const http = require('http').createServer(app);

app.get('/', (req, res) => {
    res.send("Node server is running...");
    console.log("Node server started...");
})

const socket = require('socket.io')(http);

socket.on('connection', (userSocket) => {
    console.log('Connected now!');

    userSocket.on('send_message', (data) => {
        console.log("Received message...now broadcasting...");
        userSocket.broadcast.emit('receive_message', data);
    })
})

http.listen(process.env.PORT);