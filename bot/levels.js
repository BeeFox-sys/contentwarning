const Discord = require('discord.js');
const utils = require('./utils.js')


module.exports.execute = async (client, msg) => {
    if(!msg.guild.settings.enableLevels || !msg.channel.settings.enableLevels) return
    let data = await utils.getProfile(msg.guild.id,msg.author.id)
    let maxXP = 3
    let cooldown = 5
    let prevlvl = data.level
    if(add_minutes(data.lastExp,cooldown) >= new Date()) return
    data.experience = data.experience+Math.floor(Math.random()*maxXP)+1
    data.level = Math.floor(0.48*Math.pow(data.experience, 10/23)),
    data.lastExp =  new Date()
    data.save()
    if(data.level > prevlvl){
        msg.channel.send(`Congrats <@!${msg.member.id}>, You have leveled up to level ${data.level}!`)
    }
    if(msg.guild.settings.levelRoles){
        if(msg.guild.settings.levelRoles.has(data.level.toString())){
        if(!msg.member.roles.has(
            msg.guild.settings.levelRoles.get(data.level.toString())
        )){
            if(!msg.guild.me.permissions.has("MANAGE_ROLES"))return msg.channel.send("I need to be able to manage roles to reward users!")
            msg.member.addRole(msg.guild.settings.levelRoles.get(data.level.toString()))
                .catch(async (error)=>{
                    msg.guild.settings.levelRoles.delete(data.level.toString())
                    await msg.guild.settings.save()
                })
        }}}
}

var add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + minutes*60000);
}