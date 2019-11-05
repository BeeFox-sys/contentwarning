const mongoose = require('mongoose');
const schemas = require('./schemas.js');
const guildSettings = mongoose.model('guildSettings', schemas.guildSettings)
const channel = mongoose.model('channels', schemas.channel)
const user = mongoose.model('users', schemas.user)
const profile = mongoose.model('profiles', schemas.profile)
const Discord = require("discord.js")


module.exports = {
    async getGuild(guild) {
        return new Promise(async (resolve) => {
          var doc = await guildSettings.findById(guild).exec()
          if(doc) return resolve(doc)
          var newSettings = await new guildSettings({
                  _id: guild
                })
          return await newSettings.save((err, newDoc)=>{
              if (err) return errorHandler(err,msg)
              return resolve(newDoc);
            });
        })
    },
    async deleteGuild(guild){
        return new Promise(async (resolve, reject) => {
            try{
            guildSettings.deleteOne({_id:guild})
            resolve()
            } catch (e){
                reject(e)
            }
        })
    },
    async getChannel(id) {
        return new Promise(async (resolve) => {
          var doc = await channel.findById(id).exec()
          if(doc) return resolve(doc)
          var newChannel = await new channel({
                  _id: id
                })
          return await newChannel.save((err, newDoc)=>{
              if (err) return errorHandler(err,msg)
              return resolve(newDoc);
            });
        })
    },
    async deleteChannel(id){
        return new Promise(async (resolve, reject) => {
            try{
            channel.deleteOne({_id:id})
            resolve()
            } catch (e){
                reject(e)
            }
        })
    },
    async getUser(id) {
        return new Promise(async (resolve) => {
          var doc = await user.findById(id).exec()
          if(doc) return resolve(doc)
          var newUser = await new user({
                  _id: id
                })
          return await newUser.save((err, newDoc)=>{
              if (err) return errorHandler(err,msg)
              return resolve(newDoc);
            });
        })
    },
    async getProfile(guild,user) {
        return new Promise(async (resolve) => {
          var doc = await profile.findById({guild:guild,user:user}).exec()
          if(doc) return resolve(doc)
          var newProfile = await new profile({
                _id: {guild:guild,user:user},
                experience: 0,
                lastExp: new Date(0)
            })
          return await newProfile.save((err, newDoc)=>{
              if (err) return errorHandler(err,msg)
              return resolve(newDoc);
            });
        })
    },
    async errorHandeler(error,client,msg){
            try{
                errorID = Number.parseInt(Discord.SnowflakeUtil.generate(new Date())).toString(36).match(/(.{6})/g).join("-").toUpperCase()
                console.error(errorID, error.stack)
                if(msg == null) msg = ""
                if(client.config.logChannel) client.channels.get(client.config.logChannel).send(`\`${errorID}\` ${msg.content || msg}\n\`\`\`javascript\n${error.stack}\`\`\``)
                await new errors({
                    _id: errorID,
                    stack: error.stack,
                    message: msg.content || msg || null
                }).save()
                if(typeof msg != "object") return
                //   console.log(error.message)
                switch (error.message) {
                    case "DiscordAPIError: Missing Permissions":
                        return await msg.channel.send(`Something went wrong! I'm missing some permissions!\nError ID: \`${errorID}\``)
                
                    default:
                        return await msg.channel.send(`Something went wrong!\nError ID: \`${errorID}\``)
                }
            } catch (error){
                // module.exports.errorHandeler(error,client,msg)
                console.error(error)
            }
        },
    permsToText(perms){
        hrPerms = []
        perms.forEach(perm => {
            perm = perm.toLowerCase()
            perm = perm.replace("_"," ")
            perm = perm.charAt(0).toUpperCase() + perm.slice(1)
            hrPerms.push(perm)
        });
        console.log(hrPerms)
        return hrPerms
    }
}