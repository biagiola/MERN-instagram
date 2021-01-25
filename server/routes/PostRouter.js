const router = require('express').Router()
const modelPosts = require('../model/dbModel')
const mongoose = require('mongoose')

const path = require('path')
const multer = require('multer')
const Grid = require('gridfs-stream')
const GridFsStorage = require('multer-gridfs-storage')

const mongoURI = 'mongodb+srv://biagiola:holaquetal123@cluster0.7y2eu.mongodb.net/instagramclone?retryWrites=true&w=majority'

try {
  const conn = mongoose.createConnection(mongoURI, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: false,
    poolSize: 10, 
    bufferMaxEntries: 0,
    connectTimeoutMS: 40000, 
    socketTimeoutMS: 75000,
    keepAlive: true,
  })
  console.log('connect connPost is ok')

  // image storage
  let gfs
  conn.once('open', () => {
    console.log('DB post Connected')

    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('images') 
  })
} catch (error) {
  console.log('connect connPost is not ok', error)
}

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `image-${Date.now()}${path.extname(file.originalname)}`
    
      const fileInfo = {
        filename: filename,
        bucketName: 'images'
      }

      resolve(fileInfo)
    })
  }
})

const upload = multer({storage})

// get all the posts
router.get('/retrieve', (req, res) => {
  modelPosts.find()
    .then( data => {
      data.sort((b,a) => {
        return a.timestamp - b.timestamp
      }),
      res.json(data)
    })
    .catch( err => res.status(500).json('Error: ' + err))
})

// add post
router.post('/upload/post', (req, res) => {
  const dbPost = req.body
  console.log('post/add dbPost', dbPost)
  modelPosts.create(dbPost, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      console.log('add post data:', data)
      res.status(201).send(data)
    }
  })
})

// upload post's image
router.post('/upload/image', upload.single('file'), (req, res) => {
  res.status(201).send(req.file)
})

// get single image
router.get('/retrieve/image/single', (req, res) => {
  gfs.files.findOne({ filename: req.query.name }, (err, file) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (!file || file.length === 0) {
        res.status(400).json({ err: 'file not found' })
      } else {
        const readstream = gfs.createReadStream(file.filename)
        readstream.pipe(res)
      }
    }
  })
})

// delete post
router.delete('/delete/:id', (req, res) => {
  console.log(req.params.id)
  modelPosts.findByIdAndDelete(req.params.id)
    .then( () => res.json({'value': true, 'id': req.params.id})) 
    .catch( err => res.status(400).json('Error: ', err))
})

// update post
router.post('/update/:id', (req, res) => {
  console.log('update', req.params.id)
  console.log('req.body', req.body)

  const { user, email, imgName, text, avatar, like, timestamp } = req.body.postUpdated
  modelPosts.findById( req.params.id )
    .then( mongoPost => {
      mongoPost.user = user
      mongoPost.email = email
      mongoPost.imgName = imgName
      mongoPost.text = text
      mongoPost.avatar = avatar
      mongoPost.like = like
      //mongoPost.timestamp = timestamp

      mongoPost.save()
        .then( () => res.json('Article updated!'))
        .catch( err => res.status(400).json( 'Error: ' + err))
    })
    .catch( err => res.status(400).json('Error: ' + err) ) 
})

module.exports = router;