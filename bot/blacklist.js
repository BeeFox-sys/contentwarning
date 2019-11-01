const Discord = require('discord.js');

module.exports.execute = async (client, msg) => {
    msg.guild.settings.globalBlacklist.forEach(async element => {
        e = element.peram
        if(msg.content.includes(e)){
            await msg.delete()
            try{
                if(msg.guild.settings.alertChannel){
                    embed = new Discord.RichEmbed()
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
    if(msg.guild.settings.antiCaps < 1 && msg.content.match(/[A-Z]/g)){
        msgpercent = msg.content.match(/[A-Z]/g).length/msg.content.match(/[\S+]/g).length
        if(msgpercent < msg.guild.settings.antiCaps) return
        msg.delete()
        await msg.author.send(`Your message was deleted because it contained more then ${msg.guild.settings.antiCaps*100}% capital letters. Your message was ${msgpercent*100}% capitals\n>>> ${msg.content}`)
        if(msg.guild.settings.alertChannel){
            embed = new Discord.RichEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL)
                .setColor(client.config.colours.heavy)
                .setDescription(`Message deleted due to exceding max caps percent (${msgpercent*100}% is more then max of ${msg.guild.settings.antiCaps*100}%).\n>>> ${msg.content}`)
                .setFooter(`User ID: ${msg.author.id}`)
            await client.channels.get(msg.guild.settings.alertChannel).send(embed)
        }
    }
}