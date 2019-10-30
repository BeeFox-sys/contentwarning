const Discord = require('discord.js');

module.exports.execute = async (client, msg) => {
    msg.guild.settings.globalBlacklist.forEach(async element => {
        e = element.peram
        if(msg.content.includes(e)){
            await msg.delete()
            try{
                if(msg.guild.settings.alertChannel){
                    embed = new Discord.RichEmbed()
                        .setAuthor(msg.author.username+"#"+msg.author.discriminator,msg.author.displayAvatarURL)
                        .setColor(client.config.colours.heavy)
                        .setDescription(`Message deleted due to use of a banned word.\nWord: ${e}\n>>> ${msg.content.replace(new RegExp(e,"gi"),"**$&**")}`)
                    await client.channels.get(msg.guild.settings.alertChannel).send(embed)
                }
                await msg.author.send(`Your message was deleted because it contained the string **${e}**\n>>> ${msg.content.replace(new RegExp(e,"gi"),"**$&**")}`)
            } catch (error){
                console.error(error)
            }
        }

    });
}