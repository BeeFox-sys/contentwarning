const Discord = require('discord.js');

module.exports = {
  name: 'info',
  aliases: ['invite', 'github', 'support', 'server'],
  description: 'Shows information about the bot',
  hidden: false,
  args: false,
  usage: undefined,
  example: undefined,
  async execute(client, msg, args) {
    const oauthApp = await client.fetchApplication();
    const clientID = oauthApp.id;
   
    const permissions = Discord.Permissions.resolve(client.config.permissions);

    const inviteUrl = `https://discordapp.com/oauth2/authorize?client_id=${clientID}&scope=bot&permissions=${permissions}`;

    // Generate Embed
    let embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    if(client.config.about)embed.addField("About me!", client.config.about.replace(/PREFIX/g,msg.guild ? msg.guild.settings.prefix : ""))
    if(oauthApp.botPublic)embed.addField("Add the bot!",`[Click here to add Comfort Cloud to your server](${inviteUrl})`)
    if(client.config.github)embed.addField("See the code!",`[Click here to view the GitHub for Comfort Cloud](${client.config.github})`)
    if(client.config.helpServer)embed.addField("Get help!", `[Click here to join our support server](${client.config.helpServer})`)
    embed.setFooter(`Instance Owner: @${oauthApp.owner.tag} | Bot created:`)
    .setTimestamp(oauthApp.createdAt)
    return msg.channel.send(embed);
  }
};