const mongoose = require('mongoose');
const schemas = require('./schemas.js');
const guildSettings = mongoose.model('guildSettings', schemas.guildSettings)
const user = mongoose.model('users', schemas.user)

module.exports = {
    async getGuild(guild) {
        return new Promise(async (resolve) => {
          var doc = await guildSettings.findById(guild).exec()
          if(doc) return resolve(doc)
          var newSettings = await new guildSettings({
                  _id: guild
                })
          return await newSettings.save((err, newDoc)=>{
              if (err) return console.error(err)
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
    async getUser(id) {
        return new Promise(async (resolve) => {
          var doc = await user.findById(id).exec()
          if(doc) return resolve(doc)
          var newUser = await new user({
                  _id: id
                })
          return await newUser.save((err, newDoc)=>{
              if (err) return console.error(err)
              return resolve(newDoc);
            });
        })
    },
    async errorHandeler(error,msg){
        errorID = Number.parseInt(msg.id).toString(36).match(/(.{6})/g).join("-").toUpperCase()
        console.error(errorID, error.stack)
        msg.client.channels.get(msg.client.config.logChannel).send(`\`${errorID}\` ${msg.content}\n\`\`\`javascript\n${error.stack}\`\`\``)
            switch (error.code) {
                case 50013:
                    return await msg.channel.send(`Something went wrong! I'm missing some permissions!\nError ID: \`${errorID}\``)
            
                default:
                    return await msg.channel.send(`Something went wrong!\nError ID: \`${errorID}\``)
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