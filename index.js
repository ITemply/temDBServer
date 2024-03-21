const express = require('express')
const path = require('node:path')
const bodyParser = require('body-parser');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const dotenv = require('dotenv');
dotenv.config()

app.set('views', path.join(__dirname, 'public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  console.log('Sending [GET]: Index')
  res.render('index')
})

app.get('/databaseView', function(req, res){
  res.render('databaseView')
})

app.get('/requestSender', function(req, res){
  res.send('Depricated')
})

app.post('/requestSend', function(req, res){
  console.log('Sending [POST]: requestSend')
  io.sockets.emit('dataRequest', JSON.stringify(req.body))
  res.send('Request Sent, Check Database for Results/Updates\n\n' + JSON.stringify(req.body))
})

io.on('connection', function(socket) {  
  socket.on('sendPayload', function(data){
    io.emit('dataRequest', JSON.stringify(data))
  })
})

server.listen(3000, () => {
  console.log('temDB has started. Port: 3000')
})
