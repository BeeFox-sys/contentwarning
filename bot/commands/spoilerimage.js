const Discord = require('discord.js');
const utils = require('../utils.js')

module.exports = {
	name: 'spoilerimage',
	aliases: ["img","spoiler"],
	description: 'Reposts an image form the user in a spoiler',
    hidden: false,
	perms: null,
	guild: false,
	async execute(client, msg, args) {
		if(msg.attachments.size < 1){
			return await msg.channel.send("You need to include an attachment!")
		}
		msg.delete()
		attachments = []
		msg.attachments.forEach(attachment => {
			atc = new Discord.Attachment(attachment.url, "SPOILER_"+attachment.filename)
			attachments.push(atc)
		});
		msg.channel.send(`<@!${msg.author.id}>: ${args.join(" ")}`,{files:attachments, disableEveryone:!(msg.member.hasPermission("MENTION_EVERYONE"))})
	},
};