const express = require('express')
const bodyParser = require('body-parser')
const router = require('./network/routes')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000
const socket_port = 8000
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
router(app)

app.use('/',express.static('./public'))
io.on('connection', (socket) => {
    console.log('a user connected');
});
http.listen(socket_port, () => {
    console.log('Socket Listeing at' + socket_port);
});
app.listen(port, ()=>console.log(`app listening at http://localhost:${port}`))