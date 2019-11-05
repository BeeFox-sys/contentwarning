const Discord = require('discord.js');
const mongoose = require('mongoose');
const schemas = require('../../schemas.js');
const message = mongoose.model('messages', schemas.message)
const { errorHandler } = require('../../utils')

module.exports = {
	name: 'add-cw',
	aliases: ["add"],
	description: 'Adds a cw for the user. Reqires a light, moderate, or heavy option, and a message describing the trigger.\nUsage: add <light/moderate/heavy> <Trigger>\nExample: add mild Creepy crawlies',
    hidden: false,
	userPerms: null,
	guild: true,
	catagory: "Trigger List",
	async execute(client, msg, args) {
		await msg.delete()
		if(!msg.guild.settings.channel){
			return msg.reply("This server does not yet have a set CW channel, and as such your trigger could not be posted.",{disableEveryone:true})
		}
		if(args.length < 2){
			return msg.reply("You need to supply both a trigger level (Light, Moderate, or Heavy) and a trigger!",{disableEveryone:true})
		}
		let mode = args.shift().toLowerCase()
		if(mode != "light" && mode != "moderate" && mode != "heavy"){
			return msg.reply(mode+" is not a valid option! Please use light/moderate/heavy",{disableEveryone:true})
		}
		let trigger = args.join(' ')
		if(trigger.length > 2000){
			return await msg.reply("Triggers may not execed 2000 chracters")
		}
		if(msg.guild.settings.hideCW){
			trigger = "||"+trigger.replace(/\|\|/gi, "\u200B|\u200B|\u200B")+"||"
		}
		
		let modeName = mode.replace(/(?:^|\s)\S/g, function(a) {return a.toUpperCase();});
		let embed = new Discord.RichEmbed()
			.setAuthor(msg.member.displayName,msg.author.displayAvatarURL)
			.setDescription(trigger)
			.setColor(client.config.colours[mode])
			.setFooter(`${modeName} trigger | ${msg.author.username}#${msg.author.discriminator}`)
		let cwmsg = await client.channels.get(msg.guild.settings.channel).send(embed)
		let newMessage = new message({
			_id:cwmsg.id,
			channel:cwmsg.channel.id,
			anon:false,
			type:mode
		}).save((err, newDoc)=>{
			if (err) return errorHandler(err,msg)
			msg.user.messages.push(newDoc)
			msg.user.save((err, newDoc)=>{
				if (err) return errorHandler(err,msg)
				return msg.channel.send(`Successfully added to <#${msg.guild.settings.channel}>`,new Discord.RichEmbed().setDescription(`[Jump to message](${cwmsg.url})`))
			  })
		  })
	},
};