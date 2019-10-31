const Discord = require('discord.js');

module.exports.execute = async (client, msg) => {
    if(!msg.guild.settings.enableLevels || !msg.channel.settings.enableLevels) return
    if(!msg.user.guilds) msg.user.guilds = new Map()
    if(msg.user.guilds.get(msg.guild.id) == undefined){
        msg.user.guilds.set(msg.guild.id, {
            experience: 0,
            level: 0,
            lastExp: new Date(0)
        })
    }
    data = msg.user.guilds.get(msg.guild.id)
    if(add_minutes(data.lastExp,5) >= new Date()) return
    exp = data.experience+Math.floor(Math.random()*3)+1
    msg.user.guilds.set(msg.guild.id, {
        experience: exp,
        level: Math.floor(Math.log10((exp/100)+1)*20),
        lastExp: new Date()
    })
    msg.user.save()
    if(data.level < msg.user.guilds.get(msg.guild.id).level){
        msg.channel.send(`Congrats <@!${msg.member.id}>, You have leveled up to level ${msg.user.guilds.get(msg.guild.id).level}!`)
    }
}

var add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + minutes*60000);
}