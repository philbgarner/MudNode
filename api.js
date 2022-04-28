import express from 'express'

import { data, rooms, Room, grammar, templates, RoomTemplate } from './lib/mudnode.js'
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
  
  router.post('/room', secureUrl, (req, res) => {
    if (req.body.templateid && templates.getTemplate(req.body.templateid)) {
      if (!getRoomByLocation(req.body.location)) {
        let template = new RoomTemplate(req.body)
        res.send(JSON.stringify(template.GenerateRoom()))
      } else {
        res.status(500).send(`{ "message": "Error: Room at location (${room.location.x}, ${room.location.y}, ${room.location.z}) already exists." }`)
      }
    } else {
      if (req.body.uuid && rooms.getRoom(req.body.uuid)) {
        let rm = rooms.setRoom({ uuid: req.body.uuid, name: req.body.name, description: req.body.description, exits: req.body.exits, colour: req.body.colour, props: req.body.props })
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
      templates.setTemplates(req.body.templates)
      data.save()
      res.status(200).send()
      return
    }
    res.send(JSON.stringify(templates.getTemplates()))
  })

  router.delete('/rooms/template', secureUrl, (req, res) => {
    if (req.body.id && templates.getTemplate(req.body.id)) {
      res.sendStatus(templates.removeTemplate(req.body.id) ? 200 : 500)
      return
    } else {
      res.status(500).send(`{ "message": "Error: Could not delete template with id '${req.body.id}': not found.}`)
      return
    }
  })

  router.post('/rooms/template', secureUrl, (req, res) => {
    if (req.body.id && templates.getTemplate(req.body.id)) {
      let tm = templates.setTemplate({
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
      if (templates.addTemplate(template)) {
        data.save()
        res.send(JSON.stringify(template))
      } else {
        res.status(500).send(`{ "message": "Error: Template with id '${req.body.id}' not found.}`)
      }
    }
  })

  export { router as api }