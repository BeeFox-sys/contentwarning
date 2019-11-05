module.exports.Menu = class Menu{
    constructor(name, description, pages, timeout = 60){
        this._name = name //String
        this._description = description //String
        this._pages = pages //Array
        this._timeout = timeout
    }

    set name(name){
        if(typeof name != "string") throw TypeError("Name must be String")
        this._name = name
    }
    set description(description){
        if(typeof description != "string") throw TypeError("Description must be String")
        this._description = description
    }
    set pages(pages){
        if(!(pages instanceof Array)) throw TypeError("Pages must be Array")
        this._pages = pages
    }

    run(message,client){
        return new Promise(async (resolve, reject)=>{
            let menu = "";
            if(this._name) menu+=`**${this._name}**\n`
            if(this._description) menu+=`${this._description}\n`
            menu +="```md\n"
            this._pages.forEach((page, count)=>{
                menu += `[${count+1}]: ${page._name}${page._description ? `\n# ${page._description.split("\n")[0]}` :""}\n`
            })
            menu += "\n[0]: Cancel```"
            await message.channel.send(menu)
            await message.channel.awaitMessages((message=>message.author.id===message.author.id),{ time: this._timeout*1000, max: 1, errors: ['time'] })
            .then(async response => {
                let select;
                select = response.first().content.toLowerCase()
                if(select == 0 || select == "cancel") reject("Canceled")
                let page;
                if(!isNaN(select) && select < this._pages.length+1) page = this._pages[select-1]
                if(!page) page = this._pages.find(page => page._name.toLowerCase() == select)
                if(!page) reject("Invalid Option")
                resolve(await page.run(message,client))
            })
            .catch(error=>{
                if(error.size == 0){reject("Timed Out")} 
                reject(error)
            })

        })
    }
}

module.exports.Page = class Page{
    constructor (name,  description, type, callback, timeout = 60){      
        this._name = name //String
        this._description = description//String
        this._type = type //String ["BOOLEAN", "STRING", "CHANNEL", "ROLE"], Used by Menu to decide what to send
        this._timeout = timeout
        this._callback = callback
    }

    typeFLAGS = ["BOOLEAN", "STRING", "CHANNEL", "ROLE", "NONE"]

    set name(name){
        if(!name) throw Error("Page must have name!")
        if(typeof name != "string") throw TypeError("Name must be String")
        this._name = name
    }
    set description(description){
        if(description && typeof description != "string") throw TypeError("Description must be String")
        this._description = description
    }

    set type(type){
        if(!type) throw TypeError("Type must be valid typeFLAG")
        if(!this.typeFLAGS.includes(type)) throw new TypeError("Invalid type flag: "+type)
        this._type = type
    }

    set timeout(timeout){
        if(typeof timeout != "number") throw new TypeError("Timeout must be Number")
        this._timeout = timeout
    }

    async run(message, client){
        switch(this._type){
                case "BOOLEAN":
                    return await this._callback(client, message, await this.boolean(message.channel, message.author))
                case "STRING":
                    return await this._callback(client,message,await this.string(message.channel,message.author))

                case "CHANNEL":
                    return await this._callback(client,message,await this.channel(message.channel,message.author))

                case "ROLE":
                    return await this._callback(client,message,await this.role(message.channel,message.author))

                case "NONE":
                default:
                    return await this._callback(client,message)
            }
    }

    boolean(channel, author){
       return new Promise(async (resolve, reject)=>{
        let message;
        message = await channel.send(`**${this._name}**\n${this._description || ""}`)
        await message.react("✅")
        await message.react("❌")
        await message.awaitReactions((reaction, user)=>{return (user.id==author.id&&(reaction.emoji.name == "✅"||reaction.emoji.name == "❌"))}, { time: this._timeout*1000, max: 1, errors: ['time'] })
                .then(async response => {
                    switch (response.first().emoji.name) {
                        case "✅":
                            return resolve(true)
    
                        case "❌":
                           return resolve(false)
                    
                        default:
                            break;
                    }
                })
                .catch(error=>{
                    if(error.size == 0){reject("Timed Out")} 
                    reject(error)
                })
       })
    }
    string(channel, author){
        return new Promise(async (resolve, reject)=>{
            channel.send(`**${this._name}**\n${this._description || ""}`)
            await channel.awaitMessages(message=>message.author.id===author.id, { time: this._timeout*1000, max: 1, errors: ['time'] })
			.then(async response => {
                resolve(response.first().content)
			})
			.catch(error=>{
				if(error.size == 0) reject("Timed Out")
				reject(error)
			})
        })
        
    }
    channel(channel, author){
        return new Promise(async (resolve,reject)=>{
            channel.send(`**${this._name}**\n${this._description}`)
            await channel.awaitMessages(message=>message.author.id===author.id, { time: 60000, max: 1, errors: ['time'] })
			.then(async response => {
            let channelRes;
            channelRes = await response.first().mentions.channels.first()
            if(channelRes == undefined) resolve(response.first().content)
            resolve(channelRes)
			})
			.catch(error=>{
				if(error.size == 0) return reject("Timed Out")
				reject(error)
			})

        })
    }
    role(channel, author){
        return new Promise(async (resolve,reject)=>{
            channel.send(`**${this._name}**\n${this._description}`)
            await channel.awaitMessages(message=>message.author.id===author.id, { time: 60000, max: 1, errors: ['time'] })
			.then(async response => {
            let role;
            role = await response.first().mentions.roles.first()
            if(role == undefined) role = await channel.guild.roles.get(response.first().content)
            if(role == undefined) role = await channel.guild.roles.find(val => val.name.toLowerCase()==response.first().content.toLowerCase())            
            if(role == undefined) resolve(response.first().content)
            resolve(role)
			})
			.catch(error=>{
				if(error.size == 0) return reject("Timed Out")
				reject(error)
			})

        })
    }
}