const fs = require("fs")
if(!fs.existsSync(".islocal")){
    const http = require('http');
    const express = require('express');
    const app = express();
    app.get("/", (request, response) => {
    response.sendStatus(200);
    });
    app.listen(process.env.PORT);
    setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 0);

}

const Discord = require('discord.js'); //Añadímos la librería de discord.js
const config = require("./config.json") //Añadimos el json de la configuración
const client = new Discord.Client(); //Creamos el cliente
const events = require("events")
const manager = new events.EventEmitter()

//Dependencias de comandos
    const mathEval = require("math-expression-evaluator")
//Fin de dependencias

//Funciones para comandos (No menú)
    function random(min,max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
//Fin de funciones
client.on("ready", () => {
    console.log("Ready!")
})
client.on("message", (message) => {
    if(message.author.bot) return
    
    if(message.content == client.user){
        let oldmsg = message
        message.channel.send("Loading...").then((message) => {
            manager.emit("command", "menu", message, oldmsg)
        })
    }
})
let pagesDev = [
    {
        title: "Eval",
        description:"Debug command",
        icon:"🤖",
        command:"eval"
    }, 
]
let pagesGeneral = [
    {
        title: "Say",
        description:"A command that makes the bot to say what you want",
        icon:"💬",
        command:"say"
    },
    {
        title:"Hello!",
        description:"Bob will greet you",
        icon:"👋",
        command:"hello"
    },
    {
        title:"Ping!",
        description:"Pong!",
        icon:"🏓",
        command:"ping"
    },
    {
        title:"Calculator",
        description:"Bob will calculate your math expression",
        icon:"🔢",
        command:"calculate"
    },
    {
        title:"Randomizer",
        description:"Select a random number between two numbers (Inclusive)",
        icon:"🔢",
        command:"random"
    }
]
manager.on("command", (command, message, authorMessage) => {
    var pages=pagesGeneral
    if(command=="menu"){
        let author = authorMessage.author.id
        index = 0
        var page
        var developer = false
        function renderPage() {
            page=pages[index]
            
            message.edit(
                new Discord.RichEmbed()
                .setTitle(page.title)
                .setDescription(`${page.icon}\n\n${page.description}`)
                .setFooter(`${index+1}/${pages.length}`)
            )
        }
        async function initialization(){
            await message.react("◀")
            await message.react("▶")
            await message.react("🔢")
            await message.react("✳")
            await message.react("❌")
            await renderPage()
        }
        async function emitCommand() {
            await message.clearReactions()
            await manager.emit("command",page.command,message,authorMessage)
        }
        initialization()
        const collector = message.createReactionCollector((reaction, user) => 
        user.id === author).on("collect", (reaction) => {
            chosen = reaction.emoji.name
            if(chosen=="❌"){
                collector.stop()
                authorMessage.delete()
                message.delete()
            }
            if(chosen=="◀"){
                if(index-1<0)return
                index--
                renderPage()
            }
            if(chosen=="▶"){
                if(index+1>=pages.length)return
                index++
                renderPage()
            }
            if(chosen=="✳"){
                emitCommand()
            }
            if(chosen=="📦"&&config.authorized.indexOf(authorMessage.author.id)>-1){
                pages=pagesDev
                index=0
                renderPage()
            }
            if(chosen=="🔢"){
                message.edit(new Discord.RichEmbed()
                .setDescription("What page?")
            )
                const collector = message.channel.createMessageCollector(m => m.author.id == authorMessage.author.id)
                 collector.on("collect", m => {
                    n = parseInt(m.content)
                    m.delete()
                    collector.stop()
                    if(n>0){
                        if(n>pages.length){
                            index=pages.length-1
                        } else {
                            index=n-1
                        }
                    }
                    renderPage()
                 })
            }
            reaction.remove(author)
        })
        
    }
    if(command=="say"){
        message.edit(new Discord.RichEmbed()
        .setDescription("Send your message...")
    )
        const collector = message.channel.createMessageCollector(m => m.author.id == authorMessage.author.id)
        collector.on("collect", m => {
            message.edit(new Discord.RichEmbed()
            .setDescription(m.content)
        )
        m.delete()
            collector.stop()
        })
    }
    if(command=="hello"){
        message.edit(new Discord.RichEmbed()
        .setDescription(`Hello ${authorMessage.author.username}!`)
        )}
    if(command=="ping"){
        message.edit(new Discord.RichEmbed()
        .setDescription(`Pong 🏓!`)
    )
}
    if(command=="calculate"){
        message.edit(new Discord.RichEmbed()
        .setDescription("Send your math expression...")
    )
        const collector = message.channel.createMessageCollector(m => m.author.id == authorMessage.author.id)
        collector.on("collect", m => {
            message.edit(new Discord.RichEmbed()
            .setDescription(`${m.content} = ${mathEval.eval(m.content)}`)
        )
        m.delete()
            collector.stop()
        })
    }
    if(command=="random"){
        var count = 1
        var min
        message.edit(new Discord.RichEmbed()
        .setDescription("Specify the minimum number...")
    )
        const collector = message.channel.createMessageCollector(m => m.author.id == authorMessage.author.id)
        collector.on("collect", m => {
            if(min==undefined){
                min=parseInt(m.content)
                message.edit(new Discord.RichEmbed()
                .setDescription("Specify the maximum number...")
            )
            m.delete()
            return
            }
            if(min!=undefined){
                message.edit(new Discord.RichEmbed()
                .setDescription(random(min, parseInt(m.content)))
            )
            m.delete()
            }
        
            collector.stop()
        })
    }
    if(command=="eval"){
        message.edit(new Discord.RichEmbed()
        .setDescription("Especifica el código a evaluar")
    )
    const collector = message.channel.createMessageCollector(m => m.author.id == authorMessage.author.id)
    collector.on("collect", m => {
        try {
            message.edit(new Discord.RichEmbed()
            .setDescription(eval(m.content))
        )
        } catch(err){
            message.edit(new Discord.RichEmbed()
            .setDescription(err)
        )
        }
        collector.stop()
    })
    }
})


client.login(config.token)