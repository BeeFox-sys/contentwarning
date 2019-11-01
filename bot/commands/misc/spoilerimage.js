const Discord = require('discord.js');

module.exports = {
	name: 'spoilerimage',
	aliases: ["img","spoiler"],
	description: 'Reposts an image form the user in a spoiler',
    hidden: false,
	perms: null,
	guild: false,
	catagory: "Misc",
	async execute(client, msg, args) {
		if(msg.attachments.size < 1){
			return 
		}
		attachments = []
		msg.attachments.forEach(attachment => {
			atc = new Discord.Attachment(attachment.url, "SPOILER_"+attachment.filename)
			attachments.push(atc)
		});
		await msg.channel.send(`<@!${msg.author.id}>: ${args.join(" ")}`,{files:attachments, disableEveryone:!(msg.member.hasPermission("MENTION_EVERYONE"))})
		await msg.delete()
	},
};