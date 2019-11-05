const Discord = require('discord.js');
const request = require('request');

const options = {
    url: 'https://randomfox.ca/floof/',
  };

module.exports = {
	name: 'fox',
	aliases: null,
	description: 'Provides a random fox',
    hidden: false,
	userPerms: null,
	guild: false,
	catagory: "Calming",
	async execute(client, msg, args) {
        request(options, async (error, response, body) => {
            body = JSON.parse(body)
            await msg.channel.send("",new Discord.Attachment(body.image))
        });
	},
};