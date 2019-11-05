module.exports = {
	name: 'ping',
	aliases: ["pong"],
	description: 'Responds to the user',
    hidden: false,
	userPerms: null,
	guild: false,
	catagory: "Misc",
	async execute(client, msg, args) {
		return await msg.channel.send("Pong! "+client.ping+"ms")
	},
};