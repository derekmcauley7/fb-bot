
'use strict'

const token = process.env.FB_PAGE_ACCESS_TOKEN
const vtoken = process.env.FB_VERIFY_ACCESS_TOKEN

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

// setting port
app.set('port', (process.env.PORT || 5000))

// Checking what comes into the application 
app.use(bodyParser.urlencoded({extended: false}))

// Use Json from body-parser 
app.use(bodyParser.json())

// Index route. Request and response 
app.get('/', function (req, res) {
    res.send('Hello, I am a Wonderful Websites chat bot')
})

// Facebook Webhook
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === token) {
        res.send(req.query['hub.challenge'])
    }
    res.send(token)
})

// Server log and port
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'Generic') {
            sendGenericMessage(sender)
            continue
        }
          else if (text.includes("website") ||  text.includes('Website')) {
              sendTextMessage(sender, "This is a bot in your message you said Website. " + "You can request a free mock up website here https://wonderfulwebsites.ie/mockup.html" )
          }
          
          else if (text.includes('price' || 'cost')){
              sendTextMessage(sender, "This is a bot built by wonderful websites " + "The price of a website depsnds on what is required, you can request a free mock up website here https://wonderfulwebsites.ie/mockup.html" )
          }
        sendTextMessage(sender, "Thank you, for your Message: " + text.substring(0, 200))
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback: "+text.substring(0, 200), vtoken)
        continue
      }
    }
    res.sendStatus(200)
  })


function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:vtoken},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}
