const session = require('express-session');
const express = require('express');
const http = require('http');
const uuid = require('uuid');
const bodyParser = require('body-parser')

const WebSocket = require('ws');

const app = express();
const users = require('./lib/users')
const entities = require('./lib/entities')

//
// Load config info
//
const config = require('./lib/config.json')

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  saveUninitialized: false,
  secret: '$eCuRiTy',
  resave: false
});

//
// Serve static files from the 'public' folder.
//
app.use(express.static('public'));
app.use(sessionParser);
app.use(bodyParser.json())

app.post('/login', function (req, res) {
  //
  // "Log in" user and set userId to session.
  //
  let user = require('./lib/users').getUser(req.body.username)
  if (user !== null) {
    if (user.password === req.body.password) {
      req.session.userId = user.uuid
      res.send({ ok: true, message: `Login successful.`})
      return
    }
  }
  res.send({ ok: false, message: `Login failed.`})
});

app.post('/register', function (req, res) {
  if (users.getUser(req.body.username) !== null) {
    res.send({ ok: false, message: `User ${req.body.username} already exists. Please use another username.`})
    return
  }

  const id = uuid.v4();
  let User = require('./lib/user').user
  let user = new User(id, req.body.username, req.body.password)
  users.addUser(user)
  res.send({ok: true, message: `User ${user.username} created.`})
  let data = require('./lib/data')
  data.save(false, false, true)
})

app.delete('/logout', function (request, response) {
  const ws = users.getUserWs(request.session.userId);
  console.log('Destroying session');
  request.session.destroy(function () {
    if (ws) ws.close();
    response.send({ result: 'OK', message: 'Session destroyed' });
  });
});

//
// Create an HTTP server.
//
const server = http.createServer(app);

// Initiate MUD Entity lists and handlers
const welcome = require('./lib/welcome')

const Handler = require('./lib/handler')
const Player = require('./lib/player')

const addPlayer = require('./lib/entities').addPlayer
const removePlayer = require('./lib/entities').removePlayer

//
// Handle Event Registrations
//
var handler = new Handler()

const Look = require('./lib/commands/look')
const CreateRoom = require('./lib/commands/createroom')
const ListRooms = require('./lib/commands/listrooms')
const LinkExit = require('./lib/commands/linkexit');
const Tp = require('./lib/commands/tp');
const DescribeRoom = require('./lib/commands/describeroom');
const DescribeMe = require('./lib/commands/describeme');
const Me = require('./lib/commands/me');
const Save = require('./lib/commands/save');
const Reload = require('./lib/commands/load');
const ListPlayers = require('./lib/commands/listplayers');
const Impersonate = require('./lib/commands/impersonate');
const CreateEntity = require('./lib/commands/createentity');
const NameMe = require('./lib/commands/NameMe')
const DescribeEntity = require('./lib/commands/describeentity');
const CreateMobile = require('./lib/commands/createmobile');
const MobileAddComponent = require('./lib/commands/mobileaddcomponent');
const EntityAddComponent = require('./lib/commands/entityaddcomponent');
const RemoveEntity = require('./lib/commands/removeentity');
const RoomAddComponent = require('./lib/commands/roomaddcomponent');
const NameRoom = require('./lib/commands/nameroom');

handler.AddHandler(new Look('Look'))
handler.AddHandler(new LinkExit('Link Exit'))
handler.AddHandler(new Tp('Tp'))
handler.AddHandler(new ListRooms('Room List'))
handler.AddHandler(new CreateRoom('Room Create'))
handler.AddHandler(new DescribeRoom('Room Describe'))
handler.AddHandler(new RoomAddComponent('Room Add Component'))
handler.AddHandler(new NameRoom('Room Name'))
handler.AddHandler(new Save('Save'))
handler.AddHandler(new Reload('Reload'))
handler.AddHandler(new ListPlayers('List Players'))
handler.AddHandler(new Impersonate('Impersonate'))
handler.AddHandler(new LinkExit('Link Exit'))
handler.AddHandler(new CreateEntity('Entity Create'))
handler.AddHandler(new DescribeEntity('Entity Describe'))
handler.AddHandler(new CreateMobile('Mobile Create'))
handler.AddHandler(new MobileAddComponent('Mobile Add Component'))
handler.AddHandler(new EntityAddComponent('Entity Add Component'))
handler.AddHandler(new RemoveEntity('Entity Remove'))
handler.AddHandler(new DescribeMe('Me Describe'))
handler.AddHandler(new NameMe('Me Name'))
handler.AddHandler(new Me('Me'))

// Load data files if there are any.
function loadData () {
  console.log('Loading data files...')
  return new Promise((resolve, reject) => {
    require('./lib/data').load().then(() => {
      console.log('Data load complete!')
      resolve()
    }).catch(() => {
      console.log('Data load failed.')
      reject()
    })
  })
}

//
// Create a WebSocket server completely detached from the HTTP server.
//
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

server.on('upgrade', function (request, socket, head) {
  sessionParser(request, {}, () => {
    if (!request.session.userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    });
  });
});

wss.on('connection', function (ws, request) {
  const userId = request.session.userId;
  users.setUserWs(userId, ws)
  const players = require('./lib/entities')
  let newPlayer = false
  let player = players.getPlayer(userId)
  if (player === null) {
    player = new Player({ uuid: userId, name: 'Spirit', description: 'A formless spirit.' })
    newPlayer = true
    addPlayer(player)
  } 
    
  // Send the welcome message when the user connects.
  welcome.send(ws)

  if (!newPlayer) {
    ws.send(`Welcome back ${player.name}!`)
  }

  ws.on('message', function (message) {
    //
    // Handle input from the user client.
    //
    if (!handler.Parse(ws, userId, message.toString())) {
      if (!handler.DefaultHandler(ws, userId, message.toString())) {
        ws.send(`Invalid command '${message.toString()}'`)
      }
    }
  });

  ws.on('close', function () {
    users.deleteUserWs(userId)
    removePlayer(userId)
  });
});

//
// Load data and then start the server.
//
loadData().catch(() => console.log(`Couldn't find a data folder to load. Proceeding with empty data.`))
  .finally(() =>
    server.listen(8080, function () {
      console.log('Listening on http://localhost:8080');
      let saveData = require('./lib/data').save
      
      setInterval(() => saveData(true, true, true).then(() => console.log('Autosave complete.')), config.autosaveTimeout)
      
      setInterval(() => {
        let mobs = entities.mobiles()
        for (let m in mobs) {
          mobs[m].Update()
        }
      }, config.mobilesTimeout)

    }))