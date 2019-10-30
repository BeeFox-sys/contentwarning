const Discord = require('discord.js');
const utils = require('../utils.js')

module.exports = {
	name: 'help',
	aliases: undefined,
	description: 'Lists all commands, if given a command name, will give the description of the command and any aliases',
	hidden: false,
	perms: null,
	guild: false,
	async execute(client, msg, args) {
		try{
		if(args.length > 0){
			const command = await client.commands.filter(command => !command.hidden).get(args[0].toLowerCase())
			|| await client.commands.filter(command => !command.hidden).find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
			if(command){
				return await msg.channel.send(`**${command.name}**${command.aliases ? " *"+command.aliases.join(", ")+"*" : ""}:\n${command.description}`)
			}
		}
		commands = ""
		client.commands
		.filter(command => !command.hidden)
		.tap(command => commands += `\n${(msg.guild) ? msg.guild.settings.prefix : ""}**${command.name}**`);
		return await msg.channel.send(`A list of commands:${commands}`)
		}
		catch(error){
			throw error
		}
	},
};