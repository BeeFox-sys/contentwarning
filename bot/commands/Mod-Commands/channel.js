const {Menu, Page} = require("../../interactiveMenu")
const {errorHandeler} = require("../../utils.js")

module.exports = {
	name: 'channel',
	aliases: null,
	description: 'Controls the channel overrides for the automod',
    hidden: false,
    userPerms: ["MANAGE_CHANNELS"],
    runPerms: null,
	guild: true,
	catagory: "Automod",
	async execute(client, msg, args) {
		return await new Menu("Automod Channel-level Settings","These settings will onny effect the channel this is used in.",[
			new Page("Anti-caps spam",`Allows you to set a percentage limit on how much of a message is capital letters. Currently ${msg.channel.settings.antiCaps>0 ? msg.channel.settings.antiCaps*100+"%":"Server Override"}\nPlease input a number between 0% and 100%, or \`disable\` to use server setting`,"STRING", capsPercent),
			new Menu("Blacklist Settings","Controls the blacklist settings\nIf blacklist is enabled, it will completely override the server blacklist",[
				new Page("Enable Balcklist",`Enables/Disables the channel overrides for the blacklist. Currently ${msg.channel.settings.enableBlacklist ? "Enabled" : "Disabled"}`,"BOOLEAN", enableBlacklist),
				new Page("Current Blacklist","Returns the current blacklist",null, showBlacklist),
				new Page("Add to Blacklist","Allows the user to add to the Blacklist\nPlease place each addition to the blacklist on a new line","STRING",addtoBlacklist),
				new Page("Remove from Blacklist","Allows the user to remove from the Blacklist\nPlease place each prase/word to remove from the blacklist on a new line","STRING",removefromBlacklist),
				new Page("Clear Blacklist","Removes all entries from the blacklist",null, clearBlacklist),
				new Page("Copy from Server Blacklist","Sets the current blacklist to the server blacklist",null, copyBlacklist),
			])
		])
		.run(msg,client)
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
		});
	},
};

async function showBlacklist(client,msg){
	return await msg.channel.send(`**__Current Blacklist for ${msg.channel}:__**\n${msg.channel.settings.blacklist.map(e => e.peram).join("\n")}`)
}

async function copyBlacklist(client,msg){
	msg.channel.settings.blacklist = msg.guild.settings.blacklist
	return await msg.channel.settings.save(async (err, newDoc)=>{
		if (err) return errorHandeler(error,client,msg)
		return await msg.channel.send(`Copied server blacklist to channel`)
	});
}

async function clearBlacklist(client,msg){
	msg.channel.settings.blacklist = []
	return await msg.channel.settings.save(async (err, newDoc)=>{
		if (err) return errorHandeler(error,client,msg)
		return await msg.channel.send(`Cleared channel blacklist`)
	});
}

async function enableBlacklist(client,msg, result){
	msg.channel.settings.enableBlacklist = result
	return await msg.channel.settings.save(async (err, newDoc)=>{
		if (err) return errorHandeler(error,client,msg)
		return await msg.channel.send(`${newDoc.enableBlacklist ? "Enabled" : "Disabled"} channel blacklist`)
	});
}

async function addtoBlacklist(client,msg,result){
	let toAdd = result.split("\n")
	var addedMessage = ""
	toAdd.forEach(async string => {
		let object = {regex:false,peram:string.toLowerCase()}
		if(msg.channel.settings.blacklist.map(e => e.peram).includes(object.peram)){
			addedMessage += `${string} is already on the blacklist!\n`
			return 
		} else {
		msg.channel.settings.blacklist.push(object)
		addedMessage += `${string} has been added to the blacklist!\n`
		}
	});
	return await msg.channel.settings.save(async (err, newDoc)=>{
		if (err) return errorHandeler(err,client,msg)
		return await msg.channel.send(addedMessage)
	});
}

async function removefromBlacklist(client,msg,result){
	let toRemove = result.split("\n")
	var removedMessage = ""
	toRemove.forEach(async string => {
		object = {regex:false,peram:string.toLowerCase()}
		if(!msg.channel.settings.blacklist.map(e => e.peram).includes(object.peram)){
			return removedMessage += `${string} is not on the blacklist!\n`
		}
		let index = msg.channel.settings.blacklist.map(e => e.peram).indexOf(object.peram)
		msg.channel.settings.blacklist.splice(index,1)
		return removedMessage += `${string} has been removed from the global blacklist!\n`	
	});
	return await msg.channel.settings.save(async (err, newDoc)=>{
		if (err) return errorHandeler(err,client,msg)
		return await msg.channel.send(removedMessage)
	});
}

async function capsPercent(client,msg,result){
	if(result.toLowerCase() == "disable"){
		msg.channel.settings.antiCaps = -1
		return msg.channel.settings.save((err, newDoc)=>{
			if (err) return errorHandeler(err,client,msg)
			return msg.channel.send(`Disabled max caps; Using server setting.`)
		})
	}
	let number = Number.parseFloat(result.replace("%","").match(/\d{1,3}/))
		if(Number.isNaN(number) || (number < 0 || number > 100)) return msg.channel.send("I wasnt able to turn that into a number! Please put percentage between 0% and 100%")
		number = number/100
		msg.channel.settings.antiCaps = number
		msg.channel.settings.save((err, newDoc)=>{
			if (err) return errorHandeler(err,client,msg)
			return msg.channel.send(`Max caps per message set to ${newDoc.antiCaps*100}%`)
		})
}