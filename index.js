import session from 'express-session'
import express from 'express'

import http from 'http'
import uuid from 'uuid'
import bodyParser from 'body-parser'
import WebSocket from 'ws'

const app = express();

import users from './lib/users'
import entities from './lib/entities'
import rooms from './lib/rooms'
import data from './lib/data'

import User from './lib/user'
import Handler from './lib/handler'
import Player from './lib/player'

//
// Load config info
//
import config from './lib/config.json'

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
  let user = users.getUser(req.body.username)
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
  let user = new User(id, req.body.username, req.body.password)
  users.addUser(user)
  res.send({ok: true, message: `User ${user.username} created.`})
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
import welcome from './lib/welcome'

const addPlayer = entities.addPlayer
const removePlayer = entities.removePlayer

//
// Handle Event Registrations
//
var handler = new Handler()

import Look from './lib/commands/look'
import CreateRoom from './lib/commands/createroom'
import ListRooms from './lib/commands/listrooms'
import LinkExit from './lib/commands/linkexit'
import Tp from './lib/commands/tp'
import DescribeRoom from './lib/commands/describeroom'
import DescribeMe from './lib/commands/describeme'
import Me from './lib/commands/me'
import Save from './lib/commands/save'
import Reload from './lib/commands/load'
import ListPlayers from './lib/commands/listplayers'
import Impersonate from './lib/commands/impersonate'
import CreateEntity from './lib/commands/createentity'
import NameMe from './lib/commands/NameMe'
import DescribeEntity from './lib/commands/describeentity'
import CreateMobile from './lib/commands/createmobile'
import MobileAddComponent from './lib/commands/mobileaddcomponent'
import EntityAddComponent from './lib/commands/entityaddcomponent'
import RemoveEntity from './lib/commands/removeentity'
import RoomAddComponent from './lib/commands/roomaddcomponent'
import NameRoom from './lib/commands/nameroom'
import RoomComponentProps from './lib/commands/roomcomponentprops'
import DigRoom from './lib/commands/digroom'

handler.AddHandler(new Look('Look'))
handler.AddHandler(new LinkExit('Link Exit'))
handler.AddHandler(new Tp('Tp'))
handler.AddHandler(new ListRooms('Room List'))
handler.AddHandler(new CreateRoom('Room Create'))
handler.AddHandler(new DescribeRoom('Room Describe'))
handler.AddHandler(new RoomAddComponent('Room Add Component'))
handler.AddHandler(new RoomComponentProps('Room Component Props'))
handler.AddHandler(new NameRoom('Room Name'))
handler.AddHandler(new DigRoom('Room Dig'))
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
    data.load().then(() => {
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
  let newPlayer = false
  let player = entities.players.getPlayer(userId)
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

// Template Test
import MixedForestArea from './lib/templates/areas/MixedForestArea'
import HamletArea from './lib/templates/areas/HamletArea'
let mixedArea = new MixedForestArea({ template: 'MixedForest' })
let area1
let area2
mixedArea.GenerateRooms('MixedForest', { x: 0, y: 0, z: 0 }, 2).then((area1) => {
  let hamletArea = new HamletArea({ template: 'HamletStreet' })
  return hamletArea.GenerateRooms('HamletStreet', { x: 8, y: 0, z: 8 }, 3)
})//.then((area) => area1.RoadTo(area))

//
// Load data and then start the server.
//
loadData().catch(() => console.log(`Couldn't find a data folder to load. Proceeding with empty data.`))
  .finally(() =>
    server.listen(8080, function () {
      console.log('Listening on http://localhost:8080');
      let saveData = data.save
      
      setInterval(() => saveData(true, true, true, true, true).then(() => console.log('Autosave complete.')), config.autosaveTimeout)

      setInterval(() => {
        let rs = rooms.rooms()
        for (let r in rs) {
          rs[r].Update()
        }
      }, config.roomsTimeout)

      setInterval(() => {
        let mobs = entities.mobiles()
        for (let m in mobs) {
          mobs[m].Update()
        }
      }, config.mobilesTimeout)

    }))