
const mongoose = require('mongoose');
const schemas = require('../../schemas.js');
const message = mongoose.model('messages', schemas.message)
const { errorHandler } = require('../../utils')

module.exports = {
	name: 'delete-cw',
	aliases: ["delete"],
	description: 'Deletes a users trigger message. Reqires the message ID to delete.\nUsage: delete <message id> \nExample: delete 2973362791',
    hidden: false,
	perms: null,
	guild: false,
	catagory: "Trigger List",
	async execute(client, msg, args) {
		if(args.length < 1){
			return msg.reply("You need to supply a mesage id",{disableEveryone:true})
		}
		let id = args[0]
		if(!msg.user.messages.includes(id)) return await msg.reply("That message does not exist, or isn't a trigger message by you")
		let cwMessageData = await message.findById(id).exec()
		let cwMessage = await client.channels.get(cwMessageData.channel).fetchMessage(id)
		await cwMessage.delete()
		return await message.deleteOne({_id:id}, (err)=>{
			if (err) return errorHandler(err,msg)
			return msg.channel.send(`Successfully deleted the message!`)
		})
		
	},
};