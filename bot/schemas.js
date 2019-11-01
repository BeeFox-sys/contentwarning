const mongoose = require('mongoose');
const config = require('../config.json')


module.exports = {
  guildSettings: new mongoose.Schema({
    _id: String,
    prefix: { type: String, default: config.defaultPrefix },
    channel: String,
    alertChannel: String,
    hideCW: { type: Boolean, default:true},
    allowAnon: { type: Boolean, default:true},
    enableFilter: Boolean,
    globalBlacklist: [{regex:Boolean,peram:String}],
    antiCaps: {type: Number, default: 1},
    enableLevels: {type:Boolean,default:true}
  }),
  channel: new mongoose.Schema({
    _id: String,
    enableGlobal: {type:Boolean,default:true},
    localBlacklist: [{regex:Boolean,peram:String}],
    localWhitelist: [Boolean],
    enableLevels: {type:Boolean,default:true}
  }),
  user: new mongoose.Schema({
    _id: String,
    messages: [String],
    guilds: {
      type: Map,
      of: {
        experience: Number,
        level: Number,
        lastExp: {type: Date, default: new Date(0)}
      }
    }
  }),
  message: new mongoose.Schema({
    _id: String,
    channel: String,
    anon: Boolean,
    type: String
  })
}