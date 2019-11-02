const Discord = require('discord.js');
const utils = require('./utils.js')


module.exports.execute = async (client, msg) => {
    if(!msg.guild.settings.enableLevels || !msg.channel.settings.enableLevels) return
    data = await utils.getProfile(msg.guild.id,msg.author.id)
    maxXP = 3
    cooldown = 5
    prevlvl = data.level
    if(add_minutes(data.lastExp,cooldown) >= new Date()) return
    data.experience = data.experience+Math.floor(Math.random()*maxXP)+1
    data.level = Math.floor(0.48*Math.pow(data.experience, 10/23)),
    data.lastExp =  new Date()
    data.save()
    if(data.level > prevlvl){
        msg.channel.send(`Congrats <@!${msg.member.id}>, You have leveled up to level ${data.level}!`)
    }
}

var add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + minutes*60000);
}