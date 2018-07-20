
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

const Discord = require('discord.js'); //Añadímos la librería de discord.js
const config = require("./config.json") //Añadimos el json de la configuración
const client = new Discord.Client(); //Creamos el cliente