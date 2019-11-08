const {Menu, Page} = require("../../interactiveMenu")
const {errorHandeler} = require("../../utils.js")
const Discord = require("discord.js")

module.exports = {
	name: 'levels',
	aliases: null,
	description: 'Responds to the user',
    hidden: false,
    userPerms: ["MANAGE_GUILD"],
    runPerms: null,
	guild: true,
	catagory: "Levels",
	async execute(client, msg, args) {
		return await new Menu("Level Settings","These settings set things for the leveling system",[
			new Page("View Level Roles","Allows you to see what roles are gained at what levels",null,viewRoles),
			new Page("Add Level Role","Adds a level role\nPlease input a level for the role to be assgined to, this will replace any role already at that level","STRING",addRole)
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

async function viewRoles(client,msg){
	let roles = msg.guild.settings.levelRoles
	var returnMessage = ""
	roles.forEach(async (val, key) => {
		try{
		returnMessage += `Lvl ${key}: ${msg.guild.roles.get(val).name}`
		} catch (e) {
			msg.guild.settings.levelRoles.delete(key)
			await msg.guild.settings.save()
		}
	});
	return await msg.channel.send(returnMessage || "No roles set")
}

async function addRole(client, msg, num){
	if(isNaN(num) || num <= 0) return await msg.channel.send("That is not a valid level!")
	return new Page("Add Level Role","Adds a level role\nNow input a role to be assigned on that level","ROLE",async (cl,mesg,role)=>{
		if(!(role instanceof Discord.Role)) return await msg.channel.send("That is not a valid role!")
		msg.guild.settings.levelRoles.set(num,role.id)
		{return await msg.guild.settings.save(async (err,newdoc)=>{
			if(err) return errorHandeler(err,client,msg)
			await msg.channel.send("New Roles:")
			viewRoles(client,msg)
		})}
	}).run(msg,client)
	.then(async ()=>{})
}