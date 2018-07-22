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
    }
]
manager.on("command", (command, message, authorMessage) => {
    if(command=="menu"){
        index = 0
        page=pages[index]
        message.edit(
            new Discord.RichEmbed()
            .setTitle(page.title)
            .setDescription(`${page.icon}\n\n${page.description}`)
        )
        /*
        const collector = message.createReactionCollector((reaction, user) => 
        user.id === author).on("collect", (reaction) => {

        })
        */
    }
})


client.login(config.token)