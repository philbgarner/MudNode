import express from 'express'
import { entities, data, rooms, Room, grammar, templates, components, RoomTemplate, MobileTemplate } from './lib/mudnode.js'
import { getRoomByLocation } from './lib/rooms.js'
const router = express.Router()

const secureUrl = (req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        //res.status(401).send('Unauthorized: You are not logged in, or you do not have permission to do this.')
        next()
    }
}

router.post('/process', secureUrl, (req, res) => {
    if (req.body.template && typeof req.body.template === 'string') {
      let context = req.body.context
      res.send(grammar.process(req.body.template, context))
      return
    }
    res.send(500)
  })
  
  router.post('/parse', secureUrl, (req, res) => {
    if (req.body.template && typeof req.body.template === 'string') {
      let context = req.body.context
      let template = req.body.template
      res.send(grammar.processTokenMap(grammar.parseTokens(template, context), context))
      return
    }
    res.send(500)
  })
  
  router.post('/dictionary', secureUrl, (req, res) => {
    if (req.body.dictionary) {
      grammar.setDictionary(req.body.dictionary)
      data.save()
      res.status(200).send()
      return
    }
    res.send(grammar.dictionary)
  })
  
  router.post('/room/components/add', secureUrl, (req, res) => {
    if (!req.body.uuid) {
      res.status(500).send(`{ "message": "Error: Must send room uuid." }`)
      return
    }
    let rm = rooms.getRoom(req.body.uuid)
    if (rm) {
      if (req.body.componentName && components.getComponentList(req.body.componentName)) {
        if (rm) {  
          let cmp = components.getComponentList(req.body.componentName)
          rm.components.push(new cmp({ parent: rm.uuid }))
          rm = rooms.setRoom(rm)
          data.save()
          res.send(JSON.stringify(rm))
        } else {
          res.status(500).send(`{ "message": "Error: Failed to set room ${req.body.uuid}." }`)
        }
      }
    }
  })

  router.post('/room', secureUrl, (req, res) => {
    if (req.body.templateid && templates.getRoomTemplate(req.body.templateid)) {
      if (!getRoomByLocation(req.body.location)) {
        let template = new RoomTemplate(req.body)
        res.send(JSON.stringify(template.GenerateRoom()))
      } else {
        res.status(500).send(`{ "message": "Error: Room at location (${room.location.x}, ${room.location.y}, ${room.location.z}) already exists." }`)
      }
    } else {
      if (req.body.uuid && rooms.getRoom(req.body.uuid)) {
        let rm = rooms.setRoom({ uuid: req.body.uuid, name: req.body.name, description: req.body.description,
          exits: req.body.exits, colour: req.body.colour, props: req.body.props, components: req.body.components })
        if (rm) {
          data.save()
          res.send(JSON.stringify(rm))
        } else {
          res.status(500).send(`{ "message": "Error: Failed to set room ${req.body.uuid}." }`)
        }
      }
      else {
        let room = new Room({ location: req.body.location })
        if (rooms.addRoom(room)) {
          data.save()
          res.send(JSON.stringify(room))
        } else {
          res.status(500).send(`{ "message": "Error: Room at location (${room.location.x}, ${room.location.y}, ${room.location.z}) already exists." }`)
        }
      }
    }
  })

  router.post('/mobiles', secureUrl, (req, res) => {
    if (req.body.mobiles) {
      entities.setMobiles(req.body.mobiles)
      data.save()
      res.status(200).send()
      return
    }
    res.send(JSON.stringify(entities.getMobiles()))
  })

  router.post('/mobiles/templates', secureUrl, (req, res) => {
    if (req.body.mobiles) {
      entities.setMobiles(req.body.mobiles)
      data.save()
      res.status(200).send()
      return
    }
    res.send(JSON.stringify(templates.getMobileTemplates()))
  })

  router.post('/mobiles/template', secureUrl, (req, res) => {
    let template = new MobileTemplate({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
      race: req.body.race,
      size: req.body.size,
      age: req.body.age,
      props: req.body.props,
      components: req.body.components,
    })
    if (req.body.id && !templates.getMobileTemplate(req.body.id)) {
      if (templates.addMobileTemplate(template)) {
        data.save()
        res.send(JSON.stringify(template))
      } else {
        res.status(500).send(`{ "message": "Error: Template with id '${req.body.id}' not found.}`)
      }
    } else if (req.body.id) {
      if (templates.setMobileTemplate(template)) {
        data.save()
        res.send(JSON.stringify(template))
      } else {
        res.status(500).send(`{ "message": "Error: Failed to update mobile template '${req.body.id}'.}`)
      }      
    }
  })

  router.post('/components', secureUrl, (req, res) => {
    let cmp = components.getComponentList()
    let list = []
    for (let c in cmp) {
      list.push(cmp[c].name)
    }
    res.send(JSON.stringify(list))
  })
  
  router.post('/rooms', secureUrl, (req, res) => {
    if (req.body.rooms) {
      rooms.setRooms(req.body.rooms)
      data.save()
      res.status(200).send()
      return
    }
    res.send(JSON.stringify(rooms.getRooms()))
  })
  
  router.post('/rooms/templates', secureUrl, (req, res) => {
    if (req.body.templates) {
      templates.setRoomTemplates(req.body.templates)
      data.save()
      res.status(200).send()
      return
    }
    res.send(JSON.stringify(templates.getRoomTemplates()))
  })

  router.delete('/rooms/template', secureUrl, (req, res) => {
    if (req.body.id && templates.getRoomTemplate(req.body.id)) {
      res.sendStatus(templates.removeRoomTemplate(req.body.id) ? 200 : 500)
      return
    } else {
      res.status(500).send(`{ "message": "Error: Could not delete template with id '${req.body.id}': not found.}`)
      return
    }
  })

  router.post('/rooms/template', secureUrl, (req, res) => {
    if (req.body.id && templates.getRoomTemplate(req.body.id)) {
      let tm = templates.setRoomTemplate({
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        colour: req.body.colour,
        props: req.body.props,
        components: req.body.components,
        mobiles: req.body.mobiles,
        entities: req.body.entities
      })
      if (tm) {
        data.save()
        res.send(JSON.stringify(tm))
      } else {
        res.status(500).send(`{ "mesage": "Error: Failed to set template ${req.body.id}." }`)
      }
    } else {
      let template = new RoomTemplate({
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        colour: req.body.colour,
        props: req.body.props,
        components: req.body.components,
        mobiles: req.body.mobiles,
        entities: req.body.entities
      })
      if (templates.addRoomTemplate(template)) {
        data.save()
        res.send(JSON.stringify(template))
      } else {
        res.status(500).send(`{ "message": "Error: Template with id '${req.body.id}' not found.}`)
      }
    }
  })

  router.post('/rooms/template/components/add', secureUrl, (req, res) => {
    if (!req.body.id) {
      res.status(500).send(`{ "message": "Error: Must send room template id." }`)
      return
    }
    let tm = templates.getRoomTemplate(req.body.id)
    if (tm) {
      if (req.body.componentName && components.getComponentList(req.body.componentName)) {
        if (tm) {  
          let cmp = components.getComponentList(req.body.componentName)
          tm.components.push(new cmp({ parent: tm.id }))
          tm = templates.setRoomTemplate(tm)
          data.save()
          res.send(JSON.stringify(tm))
        } else {
          res.status(500).send(`{ "message": "Error: Failed to set room template ${req.body.id}." }`)
        }
      }
    }
  })

  router.post('/mobiles/template/components/add', secureUrl, (req, res) => {
    if (!req.body.id) {
      res.status(500).send(`{ "message": "Error: Must send mobile template id." }`)
      return
    }
    let mb = templates.getMobileTemplate(req.body.id)
    if (mb) {
      if (req.body.componentName && components.getComponentList(req.body.componentName)) {
        if (mb) {  
          let cmp = components.getComponentList(req.body.componentName)
          mb.components.push(new cmp({ parent: mb.id }))
          mb = templates.setMobileTemplate(mb)
          data.save()
          res.send(JSON.stringify(mb))
        } else {
          res.status(500).send(`{ "message": "Error: Failed to set mobile template ${req.body.id}." }`)
        }
      }
    }
  })

  export { router as api }