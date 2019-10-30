const Discord = require('discord.js');
const utils = require('../utils.js');
const mongoose = require('mongoose');
const schemas = require('../schemas.js');
const message = mongoose.model('messages', schemas.message)

module.exports = {
	name: 'editcw',
	aliases: ["edit"],
	description: 'Edits a users trigger message. Reqires the message ID to edit, a light, moderate, or heavy option, and a edited message.\nUsage: edit <message id> <light/moderate/heavy> <Trigger>\nExample: edit 12345679872538 heavy Creepy Crawlies with teeth',
    hidden: false,
	perms: null,
	guild: false,
	async execute(client, msg, args) {
		if(msg.channel.type == 'text') await msg.delete()
		if(args.length < 3){
			return msg.reply("You need to supply a mesage id, a trigger level (Light, Moderate, or Heavy) and a trigger!",{disableEveryone:true})
		}
		id = args.shift()
		if(!msg.user.messages.includes(id))await msg.reply("That message does not exist, or isn't a trigger message by you")
		cwMessageData = await message.findById(id).exec()
		cwMessage = await client.channels.get(cwMessageData.channel).fetchMessage(id)
		mode = args.shift().toLowerCase()
		if(mode != "light" && mode != "moderate" && mode != "heavy"){
			return msg.reply(mode+" is not a valid option! Please use light/moderate/heavy",{disableEveryone:true})
		}
		trigger = args.join(' ').replace(/\|\|/gi, "\u200B|\u200B|\u200B")
		if(trigger.length > 2048){
			return await msg.reply("Triggers may not execed 2048 chracters")
		}
		modeName = mode.replace(/(?:^|\s)\S/g, function(a) {return a.toUpperCase();});
		embed = new Discord.RichEmbed()
			.setAuthor(cwMessage.embeds[0].author.name,msg.author.displayAvatarURL)
			.setDescription(`||${trigger}||`)
			.setColor(client.config.colours[mode])
			.setFooter(`${modeName} trigger | ${msg.author.username}#${msg.author.discriminator}(${msg.author.id})`)
		await cwMessage.edit(embed)
		return msg.channel.send(`Successfully edited the message!`,new Discord.RichEmbed().setDescription(`[Jump to message](${cwMessage.url})`))
	},
};