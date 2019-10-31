const Discord = require('discord.js');
const utils = require('../utils.js')
const request = require('request');
const config = require("../../config.json")

const options = {
    url: 'https://randomfox.ca/floof/',
  };

module.exports = {
	name: 'fox',
	aliases: null,
	description: 'Provides a random fox',
    hidden: false,
	perms: null,
	guild: false,
	catagory: "Calming",
	async execute(client, msg, args) {
        request(options, async (error, response, body) => {
            body = JSON.parse(body)
            await msg.channel.send("",new Discord.Attachment(body.image))
        });
	},
};