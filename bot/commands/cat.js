const Discord = require('discord.js');
const utils = require('../utils.js')
const request = require('request');
const config = require("../../config.json")

const options = {
    url: 'https://api.thecatapi.com/v1/images/search',
    headers: {
      'x-api-key': config.catAPI
    }
  };

module.exports = {
	name: 'cat',
	aliases: null,
	description: 'Provides a random cat',
    hidden: false,
	perms: null,
	guild: false,
	catagory: "Calming",
	async execute(client, msg, args) {
        request(options, async (error, response, body) => {
            body = JSON.parse(body)
            await msg.channel.send("",new Discord.Attachment(body[0].url))
        });
	},
};