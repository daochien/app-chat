const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socket = require('socket.io');
const cors = require('cors');
const keys = require('./config/keys');
const message = require('./models/message');
const PORT = 3000;

const room = require('./routes/room');
const chat = require('./routes/chat');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(cors());
app.use('/api/room', room);
app.use('/api/chat', chat);



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

    socket.on('disconnect', function() {
        console.log('User disconnected');
    });
    
    socket.on('save-message', function (data) {
        
        io.emit('new-message', { message: data });
    });

});

app.get('/chat', async (req, res) => {
    let result = await message.find()
    res.send(result);
});

app.get('/', (req, res) => {
    res.send('Hello word!');
});