const Discord = require('discord.js');
const utils = require('../utils.js')

module.exports = {
	name: 'settings',
	aliases: undefined,
	description: 'Opens the settings menu. Only users with the `Mangage Server` permission can use this command.',
	hidden: false,
	perms: ["MANAGE_GUILD"],
	guild: true,
	catagory: "Mod Commands",
	async execute(client, msg, args) {
		try{
			mainMenu(client, msg, args)
		} catch (error) {
			throw error
		}
	},
};

async function mainMenu(client, msg, args){
	msg.channel.send(
`**Settings Menu**
Please select an option below by sending a message with the number or name
\`\`\`markdown
1: Prefix
2: CW Channel
3: Force Spoiler CW
4: Allow Anonymous CW

0: Cancel
\`\`\``	
	)
	await msg.channel.awaitMessages(message=>message.member.id===msg.member.id, { time: 60000, max: 1, errors: ['time'] })
			.then(async response => {
				switch (response.first().content.toLowerCase()) {
					case "0":
					case "cancel":
						return await msg.channel.send("Canceled Operation");

					case "1":
					case "prefix":
						return prefixMenu(client, msg, args)

					case "2":
					case "cw channel":
						return cwChannel(client, msg, args)

					case "3":
					case "force spoiler cw":
						return hideCw(client, msg, args)

					case "4":
					case "allow anonymous cw":
						return anonCw(client, msg, args)
					
					default:
						await msg.channel.send("That's not an option");
						return mainMenu(client, msg, args);
				}
			})
			.catch(error=>{
				if(error.size == 0) return msg.channel.send("Operation Timed Out") 
				utils.errorHandeler(error,msg)
			})
}

async function prefixMenu(client, msg, args){
	msg.channel.send("Please input a new prefix, or `cancel` to leave it as is")
	await msg.channel.awaitMessages(message=>message.member.id===msg.member.id, { time: 60000, max: 1, errors: ['time'] })
			.then(async response => {
				switch (response.first().content.toLowerCase()) {
					case "cancel":
						return await msg.channel.send("Canceled Operation");
					
					default:
						msg.guild.settings.prefix = response.first().content
						await msg.guild.settings.save(async (err, newDoc)=>{
							if (err) return utils.errorHandeler(error)
							return await msg.channel.send(`New prefix set to \`${newDoc.prefix}\`\nUse ${newDoc.prefix}help for a list of commands`)
						  });
				}
			})
			.catch(error=>{
				if(error.size == 0) return msg.channel.send("Operation Timed Out") 
				utils.errorHandeler(error,msg)
			})
}

async function cwChannel(client, msg, args){
	msg.channel.send("Please input a new channel for cw's, `clear` to remove it, or `cancel` to leave it as is")
	await msg.channel.awaitMessages(message=>message.member.id===msg.member.id, { time: 60000, max: 1, errors: ['time'] })
			.then(async response => {
				switch (response.first().content.toLowerCase()) {
					case "cancel":
						return await msg.channel.send("Canceled Operation");

					case "clear":
						msg.guild.settings.channel = null
						return await msg.guild.settings.save(async (err, newDoc)=>{
							if (err) return utils.errorHandeler(error)
							return await msg.channel.send(`Channel Cleared. **WARNING** most of the bots fetures will not be accessable. Users will still be able to edit their CWs however`)
							});
				
					default:
						channel = await response.first().mentions.channels.first()
						
						if(channel == undefined){
							return await msg.channel.send("Sorry! That isn't a valid channel. Please mention a channel!")
						}
						msg.guild.settings.channel = channel.id
						await msg.guild.settings.save(async (err, newDoc)=>{
							if (err) return utils.errorHandeler(error)
							return await msg.channel.send(`New cw channel set to <#${newDoc.channel}>`)
						  });
				}
			})
			.catch(error=>{
				if(error.size == 0) return msg.channel.send("Operation Timed Out") 
				utils.errorHandeler(error,msg)
			})
}

async function hideCw(client, msg, args){
	message = await msg.channel.send("Please select an option. ✅ will hide all added cw's in a ||spoiler|| tag. ❌ will allow the user to use ||spoiler|| tags to hide it if they want to. Default is ✅")
	await message.react("✅")
	await message.react("❌")
	await message.awaitReactions((reaction, user)=>{return (user.id==msg.author.id&&(reaction.emoji.name == "✅"||reaction.emoji.name == "❌"))}, { time: 60000, max: 1, errors: ['time'] })
			.then(async response => {
				switch (response.first().emoji.name) {
					case "✅":
						msg.guild.settings.hideCW = true
						return await msg.guild.settings.save(async (err, newDoc)=>{
							if (err) return utils.errorHandeler(error)
							return await msg.channel.send(`Enabled force hiding of CWs`)
							});

					case "❌":
						msg.guild.settings.hideCW = false
						return await msg.guild.settings.save(async (err, newDoc)=>{
							if (err) return utils.errorHandeler(error)
							return await msg.channel.send(`Disabled force hiding of CWs`)
							});
				
					default:
						break;
				}
			})
			.catch(error=>{
				if(error.size == 0) return msg.channel.send("Operation Timed Out") 
				utils.errorHandeler(error,msg)
			})
}

async function anonCw(client, msg, args){
	message = await msg.channel.send("Please select an option. ✅ will allow anonymous CWs to be submitted. ❌ will disallow them. Default is ✅")
	await message.react("✅")
	await message.react("❌")
	await message.awaitReactions((reaction, user)=>{return(user.id===msg.author.id&&(reaction.emoji.name == "✅"||reaction.emoji.name == "❌"))}, { time: 60000, max: 1, errors: ['time'] })
			.then(async response => {
				switch (response.first().emoji.name) {
					case "✅":
						msg.guild.settings.allowAnon = true
						return await msg.guild.settings.save(async (err, newDoc)=>{
							if (err) return utils.errorHandeler(error)
							return await msg.channel.send(`Enabled anonymous CWs`)
							});

					case "❌":
						msg.guild.settings.allowAnon = false
						return await msg.guild.settings.save(async (err, newDoc)=>{
							if (err) return utils.errorHandeler(error)
							return await msg.channel.send(`Disabled anonymous CWs`)
							});
				
					default:
						break;
				}
			})
			.catch(error=>{
				if(error.size == 0) return msg.channel.send("Operation Timed Out") 
				utils.errorHandeler(error,msg)
			})
}

