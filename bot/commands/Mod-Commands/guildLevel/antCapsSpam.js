const { errorHandler } = require('../../../utils')

module.exports = {
	name: 'caps-protection',
	aliases: ["cp"],
	description: 'Changes the maximum % of caps allowed in the message. 100% disables caps protection\nUsage: caps-protection [100%-0%]\nUsage: global-blacklist\nExample: caps-protection 70%',
    hidden: false,
	perms: ["MANAGE_GUILD"],
	guild: true,
	catagory: "Automod",
	async execute(client, msg, args) {
		if(args.length < 1){
			return await msg.channel.send("Current max caps in a mesage: "+Math.floor(msg.guild.settings.antiCaps*100)+"%")
		}
		let number = Number.parseFloat(args.shift().replace("%","").match(/\d{1,3}/))
		if(Number.isNaN(number) || (number < 0 || number > 100)) return msg.channel.send("I wasnt able to turn that into a number! Please put percentage between 0% and 100%")
		number = number/100
		msg.guild.settings.antiCaps = number
		msg.guild.settings.save((err, newDoc)=>{
			if (err) return errorHandler(err,msg)
			return msg.channel.send(`Max caps per message set to ${newDoc.antiCaps*100}%`)
		})
	},
};