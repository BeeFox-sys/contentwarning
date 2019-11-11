const mongoose = require("mongoose")
const schemas = require('./schemas.js');
const channels = mongoose.model('channels', schemas.channel)
const {SnowflakeUtil} = require("discord.js")
const {errorHandeler} = require("./utils")


module.exports = async function channelPurge(client){
    await channels.updateMany({"purge.max":{ $gt: 0 },"purge.current":{ $gt: 0 }}, {$inc: {"purge.current":-1}})
    toPurge = await channels.find({"purge.current":0}).exec()
    toPurge.forEach(async channelDoc => {
        let channel = await client.channels.get(channelDoc._id)
        let twoWeeks = new Date()
        twoWeeks.setDate(twoWeeks.getDate()-14)
        let snowflake = SnowflakeUtil.generate(twoWeeks)
        let messages;
        var loop = true;
        while(loop){
            try{
            messages = await channel.fetchMessages({limit:100,after:snowflake})
            if(messages.size == 0) break
            await channel.bulkDelete(messages)
            } catch (error) {
                if(error.message == "Missing Permissions"){
                    await channel.send("I tried to clear this channel, but I don't have permission! I will try again in an hour!")
                    break
                }
                errorHandeler(error, client)
            }
        }
        channelDoc.purge.current = channelDoc.purge.max
        await channelDoc.save(async (err)=>{
            if(err) errorHandeler(error, client)
            await channel.send("Cleared Automatically!")
        })
    })
}