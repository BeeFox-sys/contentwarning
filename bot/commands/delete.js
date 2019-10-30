const Discord = require('discord.js');
const utils = require('../utils.js');
const mongoose = require('mongoose');
const schemas = require('../schemas.js');
const message = mongoose.model('messages', schemas.message)

module.exports = {
	name: 'deletecw',
	aliases: ["delete"],
	description: 'Deletes a users trigger message. Reqires the message ID to delete.\nUsage: delete <message id> \nExample: delete 2973362791',
    hidden: false,
	perms: null,
	guild: false,
	async execute(client, msg, args) {
		if(args.length < 1){
			return msg.reply("You need to supply a mesage id",{disableEveryone:true})
		}
		id = args[0]
		if(!msg.user.messages.includes(id)) return await msg.reply("That message does not exist, or isn't a trigger message by you")
		cwMessageData = await message.findById(id).exec()
		cwMessage = await client.channels.get(cwMessageData.channel).fetchMessage(id)
		await cwMessage.delete()
		return await message.deleteOne({_id:id}, (err)=>{
			if (err) return console.error(err)
			return msg.channel.send(`Successfully deleted the message!`)
		})
		
	},
};