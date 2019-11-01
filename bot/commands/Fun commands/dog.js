const Discord = require('discord.js');
const utils = require('../../utils.js')
const request = require('request');
const config = require("../../config.json")

const options = {
    url: 'https://api.thedogapi.com/v1/images/search',
    headers: {
      'x-api-key': config.dogAPI
    }
  };

module.exports = {
	name: 'dog',
	aliases: null,
	description: 'Provides a random dog',
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