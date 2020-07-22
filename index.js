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
        count++;

        sendUsersCount(count);
        
        data['count'] = count;
        userSocket.broadcast.emit('new_member', data);
    });
})

http.listen(process.env.PORT);