const mongoose = require('mongoose');
const config = require('../config.json')


module.exports = {
  guildSettings: new mongoose.Schema({
    _id: String,
    prefix: { type: String, default: config.defaultPrefix },
    channel: String,
    hideCW: { type: Boolean, default:true},
    allowAnon: { type: Boolean, default:true},
    enableFilter: Boolean,
    globalBlacklist: [{regex:Boolean,peram:String}]
  }),
  channel: new mongoose.Schema({
    _id: String,
    enableGlobal: {type:Boolean,default:true},
    localBlacklist: [{regex:Boolean,peram:String}],
    localWhitelist: [Boolean]
  }),
  user: new mongoose.Schema({
    _id: String,
    messages: [String],
    light: String,
    moderate: String,
    heavy: String
  }),
  message: new mongoose.Schema({
    _id: String,
    channel: String,
    anon: Boolean,
    type: String
  })
}