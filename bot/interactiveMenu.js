module.exports.Menu = class Menu{
    constructor(name, description, pages, previous, timeout = 60){
        this._name = name //String
        this._description = description //String
        this._pages = pages //Array
        this._previous = previous
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
    set previous(previous){
        // if(!(pages instanceof module.exports.Menu)) throw TypeError("Previous must be a Menu!")
        this._previous = previous
    }
    set timeout(time){
        if(Number.isNaN(time))  throw TypeError("Timeout must be Number!")
        this._timeout = time
    }

    get name(){return this._name}
    get description(){return this._description}
    get pages(){return this._pages}
    get previous(){return this._previous}
    get timeout(){return this._timeout}


    run(message,client){
        return new Promise(async (resolve, reject)=>{
            let menu = "";
            if(this.name) menu+=`**${this.name}**\n`
            if(this.description) menu+=`${this.description}\n`
            menu +="```md\n"
            this.pages.forEach((page, count)=>{
                menu += `[${count+1}]: ${page.name}${page.description ? `\n# ${page.description.split("\n")[0]}` :""}\n`
                if(page instanceof module.exports.Menu){
                    page.previous = this
                }
            })
            if(!this.previous)menu += "\n[0]: Cancel```"
            else menu += "\n[0]: Return```"
            await message.channel.send(menu)
            await message.channel.awaitMessages((message=>message.author.id===message.author.id),{ time: this.timeout*1000, max: 1, errors: ['time'] })
            .then(async response => {
                let select;
                select = response.first().content.toLowerCase()
                if(select == 0 || select == "cancel" || select == "return"){ 
                    if(!this.previous) reject("Canceled")
                    resolve(this.previous.run(message,client))
                }
                let page;
                if(!isNaN(select) && select < this.pages.length+1) page = this.pages[select-1]
                if(!page) page = this.pages.find(page => page.name.toLowerCase() == select)
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

    typeFLAGS = ["BOOLEAN", "STRING", "CHANNEL", "ROLE"]

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
        if(!this.typeFLAGS.includes(type) && type) throw new TypeError("Invalid type flag: "+type)
        this._type = type
    }

    set timeout(timeout){
        if(typeof timeout != "number") throw new TypeError("Timeout must be Number")
        this._timeout = timeout
    }

    get name(){return this._name}
    get description(){return this._description}
    get type(){return this._type}
    get callback(){return this._callback}
    get timeout(){return this._timeout}

    async run(message, client){
        if(!this.callback) throw new Error("Page must have callback!")
        switch(this.type){
                case "BOOLEAN":
                    return await this.callback(client, message, await this.boolean(message.channel, message.author))
                case "STRING":
                    return await this.callback(client,message,await this.string(message.channel,message.author))

                case "CHANNEL":
                    return await this.callback(client,message,await this.channel(message.channel,message.author))

                case "ROLE":
                    return await this.callback(client,message,await this.role(message.channel,message.author))

                case "NONE":
                default:
                    return await this.callback(client,message)
            }
    }

    boolean(channel, author){
       return new Promise(async (resolve, reject)=>{
        let message;
        message = await channel.send(`**${this.name}**\n${this.description || ""}`)
        await message.react("✅")
        await message.react("❌")
        await message.awaitReactions((reaction, user)=>{return (user.id==author.id&&(reaction.emoji.name == "✅"||reaction.emoji.name == "❌"))}, { time: this.timeout*1000, max: 1, errors: ['time'] })
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
            channel.send(`**${this.name}**\n${this.description || ""}`)
            await channel.awaitMessages(message=>message.author.id===author.id, { time: this.timeout*1000, max: 1, errors: ['time'] })
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
            channel.send(`**${this.name}**\n${this.description}`)
            await channel.awaitMessages(message=>message.author.id===author.id, { time: 60000, max: 1, errors: ['time'] })
			.then(async response => {
            let channelRes;
            channelRes = await response.first().mentions.channels.first()
            if(channelRes == undefined) channelRes = await channel.guild.channels.get(response.first().content)
            if(channelRes == undefined) channelRes = await channel.guild.channels.find(val => val.name.toLowerCase()==response.first().content.toLowerCase())
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
            channel.send(`**${this.name}**\n${this.description}`)
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