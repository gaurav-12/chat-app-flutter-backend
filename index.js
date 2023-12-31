const { count } = require('console');

const app = require('express')();
const http = require('http').createServer(app);

app.get('/', (req, res) => {
    res.send("Node server is running...");
    console.log("Node server started...");
})

const socket = require('socket.io')(http);

let clientsCount = 0;

socket.on('connection', (userSocket) => {
    console.log('Connected now!');

    userSocket.on('send_message', (data, ackCallback) => {
        console.log("Received message...now broadcasting...");
        userSocket.broadcast.emit('receive_message', data);

        ackCallback({
            success: true,
            message: "Message successfully received and broadcasted"
        });
    });

    userSocket.on('new_member', (data, sendUsersCount) => {
        clientsCount++;

        sendUsersCount(clientsCount);
        userSocket.broadcast.emit('count_change', clientsCount);
        userSocket.broadcast.emit('new_member', data);
    });

    userSocket.on('count_change', (data, ackCallback) => {
        clientsCount--;
        userSocket.broadcast.emit('count_change', clientsCount);
        ackCallback({success: true});
    });
})

http.listen(process.env.PORT);