const Discord = require('discord.js');
const utils = require('./utils.js')
const mongoose = require('mongoose');
const fs = require('fs')
const { errorHandler } = require('./utils')


const client = new Discord.Client();
client.config = require('../config.json');

//load db
mongoose.connect(client.config.db, {
    useNewUrlParser: true,
    reconnectTries: 60,
    reconnectInterval: 1000,
    useUnifiedTopology: true
});
const db = mongoose.connection
    .on('error', console.error.bind(console, 'connection error:'))
    .once('open', function () {
    console.warn("Connected to database")
    });
const schemas = require('./schemas.js')
const guildSettings = mongoose.model('guildSettings', schemas.guildSettings)
const message = mongoose.model('messages', schemas.message)
//load commands
client.commands = new Discord.Collection();
readFiles("./bot/commands")
function readFiles(cdir){
    let files = fs.readdirSync(cdir, {withFileTypes:true})
    for(const file of files){
        if(file.isDirectory()){
            readFiles(cdir+"/"+file.name)
        } else {
            let command = require(cdir.replace("bot/","")+"/"+file.name)
            // if(!command.catagory) command.catagory = cdir.split("/").pop()
            client.commands.set(command.name, command)
        }
    }
}
const blacklist = require('./blacklist.js')
const levels = require('./levels.js')

client
    .on('ready', async () => {
        console.log(`Logged in as ${client.user.tag} (ID: ${client.user.id})!`);
        console.log(`${client.guilds.size} servers`);
        // console.warn(`${client.shard.count} shards`); // for future use once sharding becomes necessary
        await setPresence()
        client.setInterval(()=>{
            setPresence()
        },60*60*1000)
        client.mentionPrefix= new RegExp(`^<@!?${client.user.id}>`,"gi")
        client.channels.get(client.config.logChannel).send("Started Successfully!")
    })
    .on('reconnecting', () => {
        console.warn("Lost connection to the Discord gateway!\nAttempting to resume the websocket connection...")
    })
    .on("guildCreate",(guild)=>{
        utils.getGuild(guild.id)
        setPresence()
    })
    .on("guildLeave",(guild)=>{
        utils.deleteGuild(guild.id)
        setPresence()
    })
    .on("messageDelete",(msg)=>{
		return message.deleteOne({_id:msg.id}, (err)=>{
			if (err) return errorHandler(err,msg)
		})
    })
    .on("message", async (msg)=>{
        try {
            if (msg.author.bot) return
            msg.content = msg.content.replace(/[\u200B-\u200D\uFEFF]/g, '')
            msg.user = await utils.getUser(msg.author.id)
            if(msg.channel.type == 'text'){
                msg.guild.settings = await utils.getGuild(msg.guild.id)
                msg.channel.settings = await utils.getChannel(msg.channel.id)
                blacklist.execute(client, msg)
                levels.execute(client,msg)
            }
            if (msg.guild && msg.content.startsWith(msg.guild.settings.prefix)){
                msg.content = msg.content.substr(msg.guild.settings.prefix.length).trim()
            } else if(client.mentionPrefix.test(msg.content)){
                msg.content = msg.content.replace(client.mentionPrefix, "").trim()
            } else if(!msg.guild){

            } else {
                return;
            }
            let args = msg.content.split(" ")
            if(args[0] == "") return client.commands.get("help").execute(client,msg,args)
            let commandName = args.shift().toLowerCase()

            msg.user = await utils.getUser(msg.author.id)

            const command = await client.commands.get(commandName)
            || await client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if(!command){
                if(msg.channel.type != 'text') return await msg.channel.send("I didn't recognise that command. You don't need to use a prefix here! Just type help for a list of commands")
                let react = await msg.react('⚠').catch((err)=>utils.errorHandeler(err,client,msg))
                return await msg.awaitReactions((reaction, user) => reaction.emoji.name === '⚠' &user.id === msg.author.id,{ time: 15000, max: 1, errors: ['time'] })
                .then(async ()=>{
                    await react.remove()
                    await react.remove(msg.author.id)
                    return await msg.channel.send(`I didn't recognise that command! You can mention me for a list of commands, or use ${msg.guild.settings.prefix}help`)
                })
                .catch(error=>{
                    if(error.size == 0) return
                    utils.errorHandeler(error,client,msg)
                })
            }
            if(command.guild && msg.channel.type !== 'text'){
                return msg.channel.send("That command is only avalible in guilds")
            }
            if(msg.guild && command.userPerms){
                let missingPerms = await msg.member.permissions.missing(command.userPerms)
                if(missingPerms.length > 0){
                    let missingReadable = ""
                    missingPerms.forEach(perm => {
                        missingReadable += "\n"+utils.humanReadablePermissions[perm]
                    })
                    return await msg.channel.send(`Missing Permissions!\nYou must have the following permissions to run this command:**${missingReadable}**`)
                }
            }
 
            if(msg.guild && command.runPerms){
                let missingPerms = await msg.guild.me.permissions.missing(command.runPerms)
                if(missingPerms.length > 0){
                    let missingReadable = ""
                    missingPerms.forEach(perm => {
                        missingReadable += "\n"+utils.humanReadablePermissions[perm]
                    })
                    return await msg.channel.send(`Missing Permissions!**${missingReadable}**\nPlease make sure that ${client.user} has these permissions, and then try the command again. You may need to ask a server administor to check these.`)
                }
            }

            command.execute(client,msg,args)
        } catch (error) {
            utils.errorHandeler(error,client,msg)
        }
    })

    

    client.on('raw', async event => {
        if(event.t !="MESSAGE_DELETE")return
        return message.deleteOne({_id:event.d.id}, (err)=>{
			if (err) return errorHandler(err,msg)
		})
});

client.login(client.config.token);

process.on('SIGINT', function () {
  gracefulExit()
})
process.on('SIGTERM', function () {
  gracefulExit()
})

async function setPresence() {
  if (client.guilds.size < 2) {
    client.user.setActivity(`Mention me for help!`, { type: 'PLAYING' });
  }
  else {
    client.user.setActivity(`Mention for help! | in ${client.guilds.size} servers`, { type: 'PLAYING' });
  }
}

async function gracefulExit() {
  console.warn("\nGracefully shutting down...");
  await client.channels.get(client.config.logChannel).send(`Shutting down`)
  client.destroy();
  console.warn("Goodbye");
  process.exit();
}