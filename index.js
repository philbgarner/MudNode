import session from 'express-session'
import express from 'express'

import http from 'http'
import { v4 } from 'uuid'
import bodyParser from 'body-parser'
import { WebSocketServer } from 'ws'

import { entities, data, config, users, rooms, grammar,
  Handler, Look, CreateRoom, ListRooms, LinkExit, Tp, DescribeRoom, DescribeMe,
  Me, Save, Reload, ListPlayers, Impersonate, CreateEntity, CreateMobile,
  MobileAddComponent, EntityAddComponent, RemoveEntity, RoomAddComponent,
  NameRoom, RoomComponentProps, DigRoom, DescribeEntity, NameMe,
  Room, User, Player
} from './lib/mudnode.js'

import { api } from './api.js'

const app = express();
//
// Load config info
//
const configData = config.loadConfig()

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

// Mount the API router.
app.use('/api', api)

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

  const id = v4();
  let user = new User(id, req.body.username, req.body.password)
  users.addUser(user)
  res.send({ok: true, message: `User ${user.username} created.`})
  data.save({ saveusers: true })
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

const addPlayer = entities.addPlayer
const removePlayer = entities.removePlayer

//
// Handle Event Registrations
//
var handler = new Handler()

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
const wss = new WebSocketServer({ clientTracking: false, noServer: true });

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
  let player = entities.getPlayer(userId)
  if (player === null) {
    player = new Player({ uuid: userId, name: 'Spirit', description: 'A formless spirit.' })
    newPlayer = true
    addPlayer(player)
  } 
    
  // Send the welcome message when the user connects.
  ws.send("\n\r=============================================================================")
  ws.send("Welcome to ws-mud!")
  ws.send("This is an experiment in making a web sockets, browser based node implementation of a M.U.D. system.")
  ws.send("TODO: Move this to an external config so it's easily updatable, make a command to modify in-game.")
  ws.send("\n\r")

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

// let mixedArea = new MixedForestArea({ template: 'MixedForest', descriptionTemplate: '[*Default Room]' })
// grammar.set('Default Room', ['Default room description, change the descriptionTemplate parameter.', 'Default two.', 'Default three.'])
// let startArea
// mixedArea.GenerateRooms('MixedForest', { x: 0, y: 0, z: 0 }, 3).then((area) => {
//   startArea = area
//   let hamletArea = new HamletArea({ template: 'HamletStreet', descriptionTemplate: '[*Default Room]' })
//   return hamletArea.GenerateRooms('HamletStreet', { x: 5, y: 0, z: 5 }, 3)
// }).then((area) => {
//   let roadArea = new RoadArea({ template: 'HamletStreet', descriptionTemplate: '[*Default Room]' })
//   roadArea.startLocation = startArea.FurthestPoint('East')
//   roadArea.endLocation = area.FurthestPoint('West')
//   return roadArea.GenerateRooms()
// }).then((area) => console.log('Areas generated.'))

//
// Load data and then start the server.
//
loadData().catch(() => console.log(`Couldn't find a data folder to load. Proceeding with empty data.`))
  .finally(() =>
    server.listen(8080, function () {
      console.log('Listening on http://localhost:8080');
      let saveData = data.save
      
      setInterval(() => saveData().then(() => console.log('Autosave complete.')), configData.autosaveTimeout)

      setInterval(() => {
        let rs = rooms.getRooms()
        for (let r in rs) {
          rs[r].Update()
        }
      }, configData.roomsTimeout)

      setInterval(() => {
        let mobs = entities.mobiles()
        for (let m in mobs) {
          mobs[m].Update()
        }
      }, configData.mobilesTimeout)

    }))