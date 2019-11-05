module.exports = {
	name: 'guild',
	aliases: null,
	description: 'Controls guild settings',
    hidden: false,
	perms: null,
	guild: false,
	catagory: "Misc",
	async execute(client, msg, args) {
		return await msg.channel.send("Pong! "+client.ping+"ms")
	},
};