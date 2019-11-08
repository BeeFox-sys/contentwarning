const mongoose = require('mongoose');
const config = require('../config.json')


module.exports = {
  guildSettings: new mongoose.Schema({
    _id: String,
    prefix: { type: String, default: config.defaultPrefix },
    channel: String,
    alertChannel: String,
    levelRoles: Map,
    hideCW: { type: Boolean, default:true},
    allowAnon: { type: Boolean, default:true},
    enableFilter: Boolean,
    blacklist: [{regex:Boolean,peram:String}],
    antiCaps: {type: Number, default: 1},
    enableLevels: {type:Boolean,default:true}
  }),
  channel: new mongoose.Schema({
    _id: String,
    antiCaps: {type:Number,default:-1},
    enableBlacklist: {type:Boolean,default:false},
    blacklist: [{regex:Boolean,peram:String}],
    enableLevels: {type:Boolean,default:true}
  }),
  user: new mongoose.Schema({
    _id: String,
    messages: [String],
  }),
  profile: new mongoose.Schema({
    _id: {
      guild: String,
      user: String
    },
    experience: Number,
    level: Number,
    lastExp: {type: Date, default: new Date(0)}
  }),
  message: new mongoose.Schema({
    _id: String,
    channel: String,
    anon: Boolean,
    type: String
  }),
  error: new mongoose.Schema({
    _id: String,
    message: String,
    stack: String
  })
}