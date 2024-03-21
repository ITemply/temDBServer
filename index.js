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

app.post('/requestSend', function(req, res){
  console.log('Sending [POST]: requestSend')
  console.log(req.body)
  io.sockets.emit('dataRequest', JSON.stringify(req.body))
  res.send('Request Sent, Check Database for Results/Updates')
})

io.on('connection', function(socket) {  
  socket.on('sendingBack', function(data){
    console.log('Sending back: ' + data)
  })

  socket.on('sendPayload', function(data){
    io.emit('dataRequest', JSON.stringify(data))
  })
})

server.listen(3000, () => {
  console.log('temDB has started. Port: 3000')
})
