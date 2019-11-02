const { errorHandler } = require('../../utils')

module.exports = {
	name: 'blacklist',
	aliases: ["bl"],
	description: 'Adds/removes a blacklist to the guild blacklist, or shows a list of current blacklisted words\nUsage: global-blacklist add/remove [string]\nUsage: global-blacklist\nExample: global-blacklist add butt',
    hidden: false,
	perms: ["MANAGE_GUILD"],
	guild: true,
	catagory: "Automod",
	async execute(client, msg, args) {
		if(args.length < 2){
			return await msg.channel.send("Current Global Blacklist:\n"+msg.guild.settings.globalBlacklist.map(e => e.peram).join("\n"))
		}
		switch (args.shift().toLowerCase()) {
			case "add":
				object = {regex:false,peram:args.join(" ").toLowerCase()}
				if(msg.guild.settings.globalBlacklist.map(e => e.peram).includes(object.peram)){
					msg.channel.send("That is already on the blacklist!")
				}
				msg.guild.settings.globalBlacklist.push(object)
				return await msg.guild.settings.save((err, newDoc)=>{
					if (err) return errorHandler(err,msg)
					return msg.channel.send(`||${object.peram}|| has been added to the global blacklist!`)
				  });

			case "remove":
				object = {regex:false,peram:args.join(" ").toLowerCase()}
				if(!msg.guild.settings.globalBlacklist.map(e => e.peram).includes(object.peram)){
					return msg.channel.send("That is not on the blacklist!")
				}
				index = msg.guild.settings.globalBlacklist.map(e => e.peram).indexOf(object.peram)
				msg.guild.settings.globalBlacklist.splice(index,1)
				return await msg.guild.settings.save((err, newDoc)=>{
					if (err) return errorHandler(err,msg)
					return msg.channel.send(`${object.peram} has been removed from the global blacklist!`)
					});			
		
			default:
				msg.channel.send("Please specify add or remove")
				break;
		}
	},
};