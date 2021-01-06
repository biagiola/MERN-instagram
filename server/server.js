const express = require('express') 
const app = express()
var server = require('http').Server(app)  //var server = require('http').createServer(app);  

const cors = require('cors') 

const Grid = require('gridfs-stream') 
const bodyParser = require('body-parser') 

const mongoose = require('mongoose') 

const port = 9000

Grid.mongo = mongoose.mongo

// middlewares
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('client'))
app.use(express.json()) // recieve json data from axios
mongoose.set('useFindAndModify', false);
// db confi
const mongoURI = 'mongodb+srv://biagiola:RRfanRG1SnGvrJ5B@cluster0.7se3x.mongodb.net/facebookclone?retryWrites=true&w=majority'
mongoose.connect(mongoURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const conn = mongoose.createConnection(mongoURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
 
// image storage
let gfs
conn.once('open', () => {
  console.log('DB Connected')

  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('images') 
})

// Routes
const PostRouter = require('./routes/Posts');
const PostCommentRouter = require('./routes/PostComments');
app.use('/posts', PostRouter);
app.use('/comments', PostCommentRouter);


// listen
server.listen(port, () => console.log(`listening on localhost:${port}`))

module.exports = {connection: conn}
