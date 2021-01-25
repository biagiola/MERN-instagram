const router = require('express').Router()
const useModel = require('../model/dbModel')
const mongoose = require('mongoose')

const path = require('path')
const multer = require('multer')
const Grid = require('gridfs-stream')
const GridFsStorage = require('multer-gridfs-storage')

const mongoURI = 'mongodb+srv://biagiola:holaquetal123@cluster0.7y2eu.mongodb.net/instagramclone?retryWrites=true&w=majority&ssl=true'


  const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: false,
    useUnifiedTopology: true,
    poolSize: 10, 
    bufferMaxEntries: 0,
    connectTimeoutMS: 30000, 
    socketTimeoutMS: 65000,
    keepAlive: true,
    ssl: true
  })
  console.log('connect connUser is ok')

  // image storage
  let gfs
  conn.once('open', () => {
    console.log('DB user Connected')

    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('images') 
  })

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

router.post('/saveData', (req, res) => {
  //console.log('testing req', req)
})

// upload post's image
router.post('/upload/image', upload.single('file'), (req, res) => {
  console.log('user/upload/image req.body', req.body)
  console.log('user/upload/image req.file', req.file)
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

module.exports = router;