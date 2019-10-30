const Discord = require('discord.js');
const utils = require('../utils.js')

module.exports = {
	name: 'ping',
	aliases: ["pong"],
	description: 'Responds to the user',
    hidden: false,
	perms: null,
	guild: false,
	async execute(client, msg, args) {
		return await msg.channel.send("Pong! "+client.ping+"ms")
	},
};