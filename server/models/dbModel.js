const mongoose = require('mongoose')

const instance = mongoose.Schema({
  image: String,
  caption: String,
  user: String,
  comments: [],
  timestamp: String
})

module.exports = mongoose.model('posts', instance)