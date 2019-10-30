const Discord = require('discord.js');
const utils = require('../utils.js')

module.exports = {
	name: 'about',
	aliases: ['invite'],
	description: 'Responds to the user',
    hidden: false,
	perms: null,
	guild: false,
	catagory: "Misc",
	async execute(client, msg, args) {
		return await msg.channel.send(client.config.about)
	},
};