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

function makeid(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

var dataReturnList = []

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
  var newJson = req.body
  var id = makeid(10)
  newJson['id'] = id
  io.sockets.emit('dataRequest', JSON.stringify(newJson))
  var i = 0
  finder = setInterval(function(){
    try {
      data = JSON.parse(dataReturnList[i])
      console.log(dataReturnList)
      if (data['id'] == id) {
        dataReturnList.splice(i, i)
        res.send(data)
        clearInterval(finder)
      }
      i++
      if (i > dataReturnList.lenght) {
        i = 0
      }
    } catch(err) {
      clearInterval(finder)
    }
  }, 100)
})

io.on('connection', function(socket) {  
  socket.on('dataReturn', function(data){
    dataReturnList.push(data)
  })
})

server.listen(3000, () => {
  console.log('temDB has started. Port: 3000')
})
