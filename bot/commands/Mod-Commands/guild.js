const {Menu, Page} = require("../../interactiveMenu")
const {errorHandeler} = require("../../utils.js")

module.exports = {
	name: 'server',
	aliases: ['guild'],
	description: 'Responds to the user',
    hidden: false,
    userPerms: ["MANAGE_GUILD"],
    runPerms: null,
	guild: true,
	catagory: "Automod",
	async execute(client, msg, args) {
		return await new Menu("Automod Server-level Settings","These settings will effect all channels, unless a channel level setting overrides it",[
			new Page("Anti-caps spam",`Allows you to set a percentage limit on how much of a message is capital letters. Currently ${msg.guild.settings.antiCaps*100}%\nPlease input a number between 0% and 100%, 100% is the same as disabling`,"STRING", capsPercent),
			new Menu("Blacklist Settings","Controls the blacklist settings",[
				new Page("Current Blacklist","Returns the current blacklist",null, showBlacklist),
				new Page("Add to Blacklist","Allows the user to add to the Blacklist\nPlease place each addition to the blacklist on a new line","STRING",addtoBlacklist),
				new Page("Remove from Blacklist","Allows the user to remove from the Blacklist\nPlease place each prase/word to remove from the blacklist on a new line","STRING",removefromBlacklist)
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
		})
	},
};

async function showBlacklist(client,msg){
	return await msg.channel.send(`**__Current Blacklist for ${msg.guild.name}:__**\n${msg.guild.settings.globalBlacklist.map(e => e.peram).join("\n")}`)
}

async function addtoBlacklist(client,msg,result){
	let toAdd = result.split("\n")
	var addedMessage = ""
	toAdd.forEach(async string => {
		let object = {regex:false,peram:string.toLowerCase()}
		if(msg.guild.settings.globalBlacklist.map(e => e.peram).includes(object.peram)){
			addedMessage += `${string} is already on the blacklist!\n`
			return 
		} else {
		msg.guild.settings.globalBlacklist.push(object)
		addedMessage += `${string} has been added to the blacklist!\n`
		}
	});
	return await msg.guild.settings.save(async (err, newDoc)=>{
		if (err) return errorHandeler(err,client,msg)
		return await msg.channel.send(addedMessage)
	});
}

async function removefromBlacklist(client,msg,result){
	let toRemove = result.split("\n")
	var removedMessage = ""
	toRemove.forEach(async string => {
		object = {regex:false,peram:string.toLowerCase()}
		if(!msg.guild.settings.globalBlacklist.map(e => e.peram).includes(object.peram)){
			return removedMessage += `${string} is not on the blacklist!\n`
		}
		let index = msg.guild.settings.globalBlacklist.map(e => e.peram).indexOf(object.peram)
		msg.guild.settings.globalBlacklist.splice(index,1)
		return removedMessage += `${string} has been removed from the global blacklist!\n`	
	});
	return await msg.guild.settings.save(async (err, newDoc)=>{
		if (err) return errorHandeler(err,client,msg)
		return await msg.channel.send(removedMessage)
	});
}

async function capsPercent(client,msg,result){
	let number = Number.parseFloat(result.replace("%","").match(/\d{1,3}/))
		if(Number.isNaN(number) || (number < 0 || number > 100)) return msg.channel.send("I wasnt able to turn that into a number! Please put percentage between 0% and 100%")
		number = number/100
		msg.guild.settings.antiCaps = number
		msg.guild.settings.save((err, newDoc)=>{
			if (err) return errorHandler(err,msg)
			return msg.channel.send(`Max caps per message set to ${newDoc.antiCaps*100}%`)
		})
}