const express = require('express')
const app = express()
var server = require('http').Server(app) //.Server(app) 
//var server = require('http').createServer(app);  
const cors = require("cors")
const bodyParser = require('body-parser') 
const Grid = require('gridfs-stream')
const mongoose = require("mongoose")

const PORT = 9000

Grid.mongo = mongoose.mongo

//middlewares
app.use(bodyParser.json())
app.use(cors())
app.use(express.json()) // recieve json data from axios
//app.use(express.static('client'))
mongoose.set('useFindAndModify', false)

// cors settings
const whitelist = ['http://localhost:3000', 'http://localhost:9000'  /*, 'https://facebookclonedemo.herokuapp.com' */]
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
//app.use(cors())

// static files for react app
/* const path = require('path')
if (process.env.NODE_ENV === 'production') { 
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
 } */


// DB config
const mongoURI = 'mongodb+srv://biagiola:holaquetal123@cluster0.7y2eu.mongodb.net/instagramclone?retryWrites=true&w=majority&ssl=true'
// process.env.MONGODB_URI is our heroku config variable

try {
  mongoose.connect(mongoURI, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10, 
    bufferMaxEntries: 0,
    connectTimeoutMS: 30000, 
    socketTimeoutMS: 65000,
    keepAlive: true,
    ssl: true
    //reconnectTries: 10
  })  
  console.log('connect Server is ok' )
} catch (error) {
  console.log('connect Server is not ok', error)
}

/* try {
  const conn = mongoose.createConnection(mongoURI, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10, 
    bufferMaxEntries: 0,
    connectTimeoutMS: 30000, 
    socketTimeoutMS: 65000,
    keepAlive: true,
    ssl: true
  })
  console.log('connect conn is ok')

  // image storage
  let gfs
  conn.once('open', () => {
    console.log('DB server Connected')

    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('images') 
  })
} catch (error) {
  console.log('connect conn is not ok', error)
} */

// Routes
const PostRouter = require('./routes/PostRouter')
app.use('/posts', PostRouter)
const UserRouter = require('./routes/UserRouter')
app.use('/user', UserRouter)
//const PostCommentRouter = require('./routes/PostComments');
//app.use('/comments', PostCommentRouter);


// listen
server.listen(PORT, () => console.log(`listening on localhost:${PORT}`))



