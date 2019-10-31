const Discord = require('discord.js');
const utils = require('../utils.js')

module.exports = {
	name: 'help',
	aliases: undefined,
	description: 'Lists all commands, if given a command name, will give the description of the command and any aliases',
	hidden: false,
	perms: null,
	guild: false,
	catagory: "Misc",
	async execute(client, msg, args) {
		try{
		if(args.length > 0){
			const command = await client.commands.filter(command => !command.hidden).get(args[0].toLowerCase())
			|| await client.commands.filter(command => !command.hidden).find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
			if(command){
				return await msg.channel.send(`**${command.name}**${command.aliases ? " *"+command.aliases.join(", ")+"*" : ""}:\n${command.description}`)
			}
		}
		//Change command order by editing here
		commands = {
			"Trigger List":null,
			"Levels":null,
			"Calming":null,
			"Misc":null,
			"Automod":null,
			"Mod Commands":null,
		}
		if(msg.channel.type == "text" && !msg.guild.settings.channel) delete commands["Trigger List"]
		if(msg.channel.type == "text" && !msg.guild.settings.enableLevels) delete commands["Levels"]
		if(msg.channel.type == "text" && !msg.member.hasPermissions("MANAGE_GUILD")) {
			delete commands["Automod"]
			delete commands["Mod Commands"]
		}
	

		client.commands
		.filter(command => !command.hidden)
		.filter(command => !(command.guild && msg.channel.type != "text"))
		.tap(command => {
			if(!commands.hasOwnProperty(command.catagory)) return 
			if(!commands[command.catagory])commands[command.catagory]=""
			commands[command.catagory] += `\n${(msg.guild) ? msg.guild.settings.prefix : ""}**${command.name}**`
		});
		helpMessage = ""
		for (const catagory in commands) {
			if (commands.hasOwnProperty(catagory)) {
				const element = commands[catagory];
				if(element != null) {
				helpMessage += `\n__${catagory}__${commands[catagory]}`
				}
			}
		}
		helpMessage += `\n\nYou can use ${(msg.guild) ? msg.guild.settings.prefix : ""}help [command] to see more detailed information on a command`
		return await msg.channel.send(helpMessage)
		}
		catch(error){
			throw error
		}
	},
};