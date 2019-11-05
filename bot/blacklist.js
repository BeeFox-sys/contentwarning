const Discord = require('discord.js');

module.exports.execute = async (client, msg) => {
    if(await msg.member.permissions.has(["MANAGE_MESSAGES"])) return
    let blacklist;
    if(msg.channel.settings.enableBlacklist){
        blacklist = msg.channel.settings.blacklist
    } else {
        blacklist = msg.guild.settings.blacklist
    }
    blacklist.forEach(async element => {
        let e = element.peram
        if(msg.content.includes(e)){
            await msg.delete()
            try{
                if(msg.guild.settings.alertChannel){
                    let embed = new Discord.RichEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL)
                        .setColor(client.config.colours.heavy)
                        .setDescription(`Message deleted due to use of a banned word or phrase.\nWord/Phrase: ${e}\n>>> ${msg.content.replace(new RegExp(e,"gi"),"**$&**")}`)
                        .setFooter(`User ID: ${msg.author.id}`)
                    await client.channels.get(msg.guild.settings.alertChannel).send(embed)
                }
                await msg.author.send(`Your message was deleted because it contained the string **${e}**\n>>> ${msg.content.replace(new RegExp(e,"gi"),"**$&**")}`)
            } catch (error){
                console.error(error)
            }
        }

    });
    //Anti Caps
    let antiCaps = msg.channel.settings.antiCaps<0 ? msg.guild.settings.antiCaps : msg.channel.settings.antiCaps
    if(antiCaps < 1 && msg.content.match(/[A-Z]/g)){
        let msgpercent = msg.content.match(/[A-Z]/g).length/msg.content.match(/[\S+]/g).length
        if(msgpercent < antiCaps) return
        msg.delete()
        await msg.author.send(`Your message was deleted because it contained more then ${antiCaps*100}% capital letters. Your message was ${msgpercent*100}% capitals\n>>> ${msg.content}`)
        if(msg.guild.settings.alertChannel){
            let embed = new Discord.RichEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL)
                .setColor(client.config.colours.heavy)
                .setDescription(`Message deleted due to exceding max caps percent (${msgpercent*100}% is more then max of ${antiCaps*100}%).\n>>> ${msg.content}`)
                .setFooter(`User ID: ${msg.author.id}`)
            await client.channels.get(msg.guild.settings.alertChannel).send(embed)
        }
    }
}