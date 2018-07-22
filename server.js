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
let pages = [
    {
        title: "Say",
        description:"A command that makes the bot to say what you want",
        icon:"💬"
    },
    {
        title:"Test",
        description:"A test page",
        icon:"ℹ"
    }
]
manager.on("command", (command, message, authorMessage) => {
    if(command=="menu"){
        let author = authorMessage.author.id
        index = 0
        var page
        
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
            await message.react("❌")
            await message.react("✳")
            await renderPage()
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
            reaction.remove(author)
        })
        
    }
})


client.login(config.token)