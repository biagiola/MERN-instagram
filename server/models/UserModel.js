const mongoose = require('mongoose')

const instance = mongoogse.Schema({
  user: String,
  imgAvatar: String
})

module.exports = mongoose.model('user', instance)