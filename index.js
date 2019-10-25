const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socket = require('socket.io');
const cors = require('cors');
const keys = require('./config/keys');
const message = require('./model/message');
const PORT = 3000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

var server = app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});

//connecting mongo DB
mongoose.connect(keys.mongoURI);
mongoose.connection.on('error', () => {
    console.log('error in database connection');
});

mongoose.connection.once('open', () => {
    console.log(`DB connection established`);
});

// Setting up Socket.io
let io = socket(server);

io.on("connection", (socket) => {
    console.log("Socket Connection Established with ID :" + socket.id);

    socket.on("chat", async function(chat) {
        chat.created = new Date();
        let response = await new message(chat).save();
        socket.emit("chat", chat);
    });
});

app.get('/chat', async (req, res) => {
    let result = await message.find()
    res.send(result);
});

app.get('/', (req, res) => {
    res.send('Hello word!');
});