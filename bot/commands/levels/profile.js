const Discord = require('discord.js');
const { errorHandler, getProfile } = require('../../utils')

module.exports = {
	name: 'profile',
	aliases: null,
	description: 'Responds to the user',
    hidden: false,
	perms: null,
	guild: true,
	catagory: "Levels",
	async execute(client, msg, args) {
		let user = await getProfile(msg.guild.id,msg.user.id)
		let embed = new Discord.RichEmbed()
			.setAuthor(msg.member.displayName, msg.author.displayAvatarURL)
			.addField("Experience", user.experience, true)
			.addField("Level", user.level, true)
			.setColor("RANDOM")
		msg.channel.send(embed)
	},
};