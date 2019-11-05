const Discord = require('discord.js');
const mongoose = require('mongoose');
const schemas = require('../../schemas.js');
const message = mongoose.model('messages', schemas.message)
const { errorHandler } = require('../../utils')

module.exports = {
	name: 'anon-cw',
	aliases: ["anon","aadd"],
	description: 'Adds a cw anonymously. Reqires a light, moderate, or heavy option.\nUsage: add <light/moderate/heavy> <Trigger>\nExample: add mild Creepy crawlies',
    hidden: false,
	perms: null,
	guild: true,
	catagory: "Trigger List",
	async execute(client, msg, args) {
		await msg.delete()
		if(!msg.guild.settings.channel){
			return msg.channel.send("This server does not yet have a set CW channel, and as such your trigger could not be posted.",{disableEveryone:true,reply:false})
		}
		if(!msg.guild.settings.allowAnon){
			return msg.channel.send(`This server does not allow anonymous trigger submissions. Please use the ${msg.guild.settings.prefix}add command instead`,{disableEveryone:true,reply:false})
		}
		if(args.length < 2){
			return msg.channel.send("You need to supply both a trigger level (Light, Moderate, or Heavy) and a trigger!",{disableEveryone:true,reply:false})
		}
		let mode = args.shift().toLowerCase()
		if(mode != "light" && mode != "moderate" && mode != "heavy"){
			return msg.channel.send(mode+" is not a valid option! Please use light/moderate/heavy",{disableEveryone:true,reply:false})
		}
		let trigger = args.join(' ')
		if(msg.guild.settings.hideCW){
			trigger = "||"+trigger.replace(/\|\|/gi, "\u200B|\u200B|\u200B")+"||"
		}
		if(trigger.length > 2048){
			return await msg.channel.send("Triggers may not execed 2048 chracters",{reply:false})
		}
		let modeName = mode.replace(/(?:^|\s)\S/g, function(a) {return a.toUpperCase();});
		let embed = new Discord.RichEmbed()
			.setAuthor("Anonymous")
			.setDescription(trigger)
			.setColor(client.config.colours[mode])
			.setFooter(`${modeName} trigger`)
		let cwmsg = await client.channels.get(msg.guild.settings.channel).send(embed)
		let newMessage = new message({
			_id:cwmsg.id,
			channel:cwmsg.channel.id,
			anon:false,
			type:mode
		}).save(async (err, newDoc)=>{
			if (err) return errorHandler(err,msg)
			if(msg.guild.settings.alertChannel){
				embed = new Discord.RichEmbed()
					.setAuthor(msg.author.tag,msg.author.displayAvatarURL)
					.setColor(client.config.colours.moderate)
					.setDescription(`Added an anonymous trigger. [Jump to message](${cwmsg.url})`)
					.setFooter(`User ID: ${msg.author.id}`)
				await client.channels.get(msg.guild.settings.alertChannel).send(embed)
			}
			return msg.channel.send(`Successfully added to <#${msg.guild.settings.channel}>`,new Discord.RichEmbed().setDescription(`[Jump to message](${cwmsg.url})`))
		  })
	},
};