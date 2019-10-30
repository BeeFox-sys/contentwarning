const mongoose = require('mongoose');
const config = require('../config.json')


module.exports = {
  guildSettings: new mongoose.Schema({
    _id: String,
    prefix: { type: String, default: config.defaultPrefix },
    channel: String,
    hideCW: { type: Boolean, default:true},
    allowAnon: { type: Boolean, default:true}
  }),
  user: new mongoose.Schema({
    _id: String,
    messages: [String]
  }),
  message: new mongoose.Schema({
    _id: String,
    channel: String,
    anon: Boolean,
    type: String
  })
}