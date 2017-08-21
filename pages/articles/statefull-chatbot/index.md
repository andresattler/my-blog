---
nr: 4
date: 21.08.17
title: How to build a simple state-full Facebook Messenger bot
---

# How to build a simple state-full Facebook Messenger bot

Since there are not many tutorials out there to learn how to develop an chat bot which keeps track of the process of an conversation, I'm showing you in this tutorial how to build a basic state-full chat bot using Node.js and MongoDB from scratch.

## Overview

In this tutorial we will:
* Set up the chat bot locally
* Create a Facebook App and Page
* Deploy the chat bot on Heroku
* Create a Database on Mlab
* Test the Chat bot and adding test-users

## Dependencies

To create this chat bot and follow this tutorial you need to have [Node.js](https://nodejs.org/) installed locally.

We will host this Chat bot on Heroku so you will need the [heroku-cli](https://devcenter.heroku.com/articles/heroku-cli) and [Git](https://git-scm.com/) to push code to the server.

In this tutorial I will use [Yarn](https://yarnpkg.com) for package management.
If you want to stick to npm just change the commands appropriately.

## Basic setup

Create an empty folder and open your terminal inside.
There we initialize Yarn with:

```sh
yarn init -y
```

Then we install some dependencies.

```sh
yarn add express mongoose request body-parser
```
We will use express.js for creating an server, mongoose.js will be used to access the MongoDB database and request is needed to send messages back to Facebook and the client which the chat bot is talking. Body-parser is a middle ware that helps our express server to understand json requests.

Further on we want to use the latest ES2016 features so we will add babel as development dependence.

```sh
yarn add -D babel-cli babel-preset-latest rimraf
```
The rimraf dependence. will be used to clean the build folder before every build.
Now we create an new 'src' folder, an index.js file inside src and a lib folder for the transpiled files.

```sh
mkdir src
touch src/index.js
mkdir lib
```

In index.js we set up the basic express server.

```js
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(process.env.PORT || 8000)
```
We need to create a .babelrc file where we configure the babel preset latest.

```json
{
  "presets": [
    "latest"
  ],
}
```
And then we can add following scripts to the package.json file.

```json
[...]
"scripts": {
    "start": "node lib",
    "build": "rimraf lib && babel src -d lib"
  },
[...]
```

## Deployment on Heroku

First you need an free account on [Heroku](https://heroku.com/)
Then if your logged in in through the heroku-cli type

```sh
heroku create
```
to create an new app on heroku.

Now you can deploy the  code by committing and pushing with git.

```sh
git add .
git commit -m 'initial commit'
git push heroku master
```
If you now open the URL shown in the console at the end of the last push command in the Browser, you will see a nice Hello World :).

## Create a Facebook Messenger app

Go to [the Facebook developer page](https://developers.facebook.com/apps) and create an new App by hitting the Add new App button on the dashboard.

![creating an Facebook App](../../assets/chatbot1.png)

Then we are setting up a Messenger App.

![setting up a Messenger App](../../assets/chatbot2.png)

Next you need to create a Facebook page to which users can message to and select your page in the token generation section.

## Linking it all together

You choose as a verification token and set it as environment variable in heroku by typing this into your console:

```sh
heroku config:set VERIFY_TOKEN=<ENTER YOUR TOKEN HERE>
```

We edit the index.js file to verify our server to Facebook.

```js
import express from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
// verification
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.status(200).send(req.query['hub.challenge'])
  } else {
    res.sendStatus(403)
  }
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(process.env.PORT)
```

Then we build the app and push it to heroku.

```sh
yarn build
git add .
git commit -m 'added verification'
git push heroku master
```

Now we are setting up a webhook to verify your server.
For that we will go to the webhook section on your Facebook dashboard of your Messenger app and click on 'Setup Webhooks'.

![Setting up a Webhook](../../assets/chatbot3.png)

There you enter your URL with an '/webhook' ending and the verification token you chose earlier.
Make sure you tick the message checkbox to subscribe to messages.

## A simple stateless chat bot

To receive messages set our express server up to react to POST request.

In index.js we add:

```js
app.post('/webhook', (req, res) => {
 const data = req.body
 if (data.object === 'page') {
   data.entry.forEach((entry) => {
     entry.messaging.forEach((event) => {
       if (event.message) {
         talk(event)
       } else {
         console.log('Webhook received unknown event: ', event)
       }
     })
   })
   res.sendStatus(200)
 }n
})
```

We will put all the responding logic into a separate file called talk.js, which we need to create in the same folder and need to import into index.js by adding:

```js
import talk from './talk'
```

In talk js we will handle incoming messages and as an example we will firstly just write an hello world answering chat bot.

First we need to create a second environment variable to respond to messages via your Facebook page. For this you need to go back to your Facebook dashboard and copy a page access token from the Token Generation section.

Then we configure the new environment variable by typing this into the terminal:

```sh
heroku config:set FB_PAGE_ACCESS_TOKEN=<YOUR FB PAGE ACCESS TOKEN>
```

When this is done we can setup the talk.js file.

```js
import request from 'request'

function talk(event) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: {
        id: event.sender.id,
      },
      message: {
        text: 'hello world!',
      },
    },
  }, (error, response) => {
    if (error) {
      console.error('Error sending messages: ', error)
    } else if (response.body.error) {
      console.error('Error: ', response.body.error)
    }
  })
}

export default talk
```
Now if your write to your Facebook page you will get the answer 'hello world!'.

## Setting up MongoDB

OK that is boring. So lets add state by saving the progress of an conversation to a database.

In this tutorial we use [Mlab](https://mlab.com/) a MogoDB as a service platform.
You can create there a free account.

If your logged in there you can create a database and you get an MongoDB URI.

Of course we will create a new environment variable with the MongoDB URI you've got from MLab.
```sh
heroku config:set MONGO_DB_URI=<YOUR MogoDB URI>
```
In index.js we will connect to the databases by using mongoose.

```js
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import talk from './talk'

mongoose.connect(process.env.MONGO_DB_URI)

// ... rest of index.js
```
## Creating a basic conversation and saving the progress

Now lets move everything in the talk function to an separate file called send-message.js.

```js
import request from 'request'

function sendMessage(sender, text) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: {
        id: event.sender.id,
      },
      message: {
        text,
      },
    },
  }, (error, response) => {
    if (error) {
      console.error('Error sending messages: ', error)
    } else if (response.body.error) {
      console.error('Error: ', response.body.error)
    }
  })
}

export default sendMessage
```

In talk.js we import mogoose as well and create an simple schema that describes how we want to save users to the database and we implement the new sendMessage function.

```js
import request from 'request'
import mongoose from 'mongoose'

import sendMessage from 'send-message'

const User = mongoose.model('User', {
  _id: String,
  state: Number,
})

function talk(event) {
  const sender = event.sender.id
  const messages = [
    'hello world',
    'how are you?',
    'cool',
    'I can answer in multiple ways',
    'improve me!',
    'The END!'
  ]
  User.findById(sender, (err, userObj) => {
    if (userObj) {
      if (userObj.state < messages.length) {
        const nextState = userObj.state + 1
        User.update({ _id: sender }, { state: nextState }).exec()
        sendMessage(sender, messages[userObj.state])
      } else{
        User.findByIdAndRemove(sender).exec()
      }
    } else {
      const user = new User({
        _id: sender,
        state: 1,
      })
      user.save()
      sendMessage(sender, messages[0])
    }
  })
}

export default talk
```

This is just a very basic implementation of a state-full chat bot.
If a user sends a message to the page and is not in the database, he will receive the first message of the messages array and will be added to the database. If the sender is already in the database his state will be increased and he gets the message corresponding to his state. If he reached the end of the messages he will be removed from the Database and can start from the beginning.

Now you just need to build and push to heroku.
```sh
yarn build
git add .
git commit -m 'added state'
git push heroku master.
```

Yeah we did it! You can now try it out!

This is just the beginning now its up to you to build something great!
