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
		user = getProfile(msg.guild.id,msg.user.id)
		embed = new Discord.RichEmbed()
			.setAuthor(msg.member.displayName, msg.author.displayAvatarURL)
			.addField("Experience", msg.user.guilds.get(msg.guild.id).experience, true)
			.addField("Level", msg.user.guilds.get(msg.guild.id).level, true)
			.setColor("RANDOM")
		msg.channel.send(embed)
	},
};