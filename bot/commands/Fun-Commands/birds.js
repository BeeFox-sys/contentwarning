const Discord = require('discord.js');
const request = require('request');

const options = {
    url: 'https://shibe.online/api/birds',
  };

module.exports = {
	name: 'bird',
	aliases: null,
	description: 'Provides a random bird',
    hidden: false,
	perms: null,
	guild: false,
	catagory: "Calming",
	async execute(client, msg, args) {
        request(options, async (error, response, body) => {
            body = JSON.parse(body)
            await msg.channel.send("",new Discord.Attachment(body[0]))
        });
	},
};