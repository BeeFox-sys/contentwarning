const {errorHandeler} = require('../../utils.js')
const {Menu, Page} = require("../../interactiveMenu")

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
			let [cwc,log] = await Promise.all([
				client.channels.get(msg.guild.settings.channel),client.channels.get(msg.guild.settings.alertChannel)
			]) 
			let menu = new Menu("Settings","Type your response number or name", [
				new Page("Prefix",
						`Changes Prefix, currently \`${msg.guild.settings.prefix}\`\nType a new prefix`,
						"STRING",
						prefixMenu),
				new Menu("CW Settings","Settings for the cw and trigger capabilities of the bot",[
					new Page("CW Channel",
						`The channel where triggers can be cataloged. Currently: ${cwc ? "#"+cwc.name : "None"}\nTag a channel to set it as the new channel.\nType cancel to cancel and clear to clear the channel.`,"CHANNEL", cwChannel),
					new Page("Force Spoiler Triggers",
							`When submitting a trigger with this enabled, the trigger will be hidden in ||Spoiler tags||. Currently ${msg.guild.settings.hideCW ? "enabled" : "disabled"}.\nEnable forced spoilers?`, "BOOLEAN", hideCw),
					new Page("Anonymous Triggers",
							`Allows the ${msg.guild.settings.prefix}annon-cw to be used to sumbit anonymous triggers. Currently ${msg.guild.settings.allowAnon ? "enabled" : "disabled"}.\nEnable anonymous triggers?`, "BOOLEAN", annonCW)
				]),
				new Page("Log Channel",
						`The channel where automod stuff is put. Currently: ${log ? "#"+log.name : "None"}\nTag a channel to set it as the new channel.\nType cancel to cancel and clear to clear the channel.`,"CHANNEL", logChannel),
				new Page("Leveling System",
						`Enable the Comfort Cloud levling system. Currently ${msg.guild.settings.allowAnon ? "enabled" : "disabled"}.\nEnable anonymous triggers?`, "BOOLEAN", levels)
				
				])
			return await menu.run(msg,client)
				.catch(async error=>{
					switch(error){
						case "Canceled":
							return await msg.channel.send("Canceled")
						case "Timed Out":
								return await msg.channel.send("Timed Out")
						case "Invalid Option":
								return await msg.channel.send("Invalid Option")
						default:
							return await errorHandeler(error,client,msg)
					}
				})
		} catch (error) {
			throw error
		}
	},
};

async function prefixMenu(client, msg, response){
	switch (response.toLowerCase()) {
		case "cancel":
			return await msg.channel.send("Canceled Operation");
		
		default:
			msg.guild.settings.prefix = response
			await msg.guild.settings.save(async (err, newDoc)=>{
				if (err) return errorHandeler(error)
				return await msg.channel.send(`New prefix set to \`${newDoc.prefix}\``)
				});
	}
}

async function cwChannel(client, msg, response){
	if(typeof response == "string"){
		if(response.toLowerCase()=="cancel") return await msg.channel.send("Canceled Operation");
		if(response.toLowerCase()=="clear"){
			msg.guild.settings.channel = null
			return await msg.guild.settings.save(async (err, newDoc)=>{
				if (err) return errorHandeler(error)
				return await msg.channel.send(`CW Channel Cleared`)
				});
		}
	} else {
		msg.guild.settings.channel = response.id
		await msg.guild.settings.save(async (err, newDoc)=>{
			if (err) return errorHandeler(error)
			return await msg.channel.send(`New cw channel set to <#${newDoc.channel}>`)
			});
	}
}

async function logChannel(client, msg, response){
	if(typeof response == "string"){
		if(response.toLowerCase()=="cancel") return await msg.channel.send("Canceled Operation");
		if(response.toLowerCase()=="clear"){
			msg.guild.settings.alertChannel = null
			return await msg.guild.settings.save(async (err, newDoc)=>{
				if (err) return errorHandeler(error)
				return await msg.channel.send(`Log Channel Cleared`)
				});
		}
	} else {
		msg.guild.settings.alertChannel = response.id
		await msg.guild.settings.save(async (err, newDoc)=>{
			if (err) return errorHandeler(error)
			return await msg.channel.send(`New Log channel set to <#${newDoc.channel}>`)
		});
	}
}


async function hideCw(client, msg, response){
	msg.guild.settings.hideCW = response
	return await msg.guild.settings.save(async (err, newDoc)=>{
		if (err) return errorHandeler(error)
		return await msg.channel.send(`${newDoc.hideCW ? "Enabled" : "Disabled"} force hiding of CWs`)
		});
}

async function annonCW(client, msg, response){
	msg.guild.settings.allowAnon = response
	return await msg.guild.settings.save(async (err, newDoc)=>{
		if (err) return errorHandeler(error)
		return await msg.channel.send(`${newDoc.allowAnon ? "Enabled" : "Disabled"} anonymous triggers`)
		});
}

async function levels(client, msg, response){
	msg.guild.settings.enableLevels = response
	return await msg.guild.settings.save(async (err, newDoc)=>{
		if (err) return errorHandeler(error)
		return await msg.channel.send(`${newDoc.enableLevels ? "Enabled" : "Disabled"} leveling system`)
		});
}

