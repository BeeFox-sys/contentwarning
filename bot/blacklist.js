
module.exports.execute = async (client, msg) => {
    msg.guild.settings.globalBlacklist.forEach(async element => {
        e = element.peram
        if(msg.content.includes(e)){
            await msg.delete()
            try{
                await msg.author.send(`Your message was deleted because it contained the string **${e}**\n>>> ${msg.content.replace(new RegExp(e,"gi"),"**$&**")}`)
            } catch (error){
                console.error(error)
            }
        }

    });
}