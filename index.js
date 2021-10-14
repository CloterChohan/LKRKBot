const Discord = require('discord.js');
const auth = require('./auth.json');
// Initialize Discord Bot

const bot = new Discord.Client({
    intents: []
});

bot.on('ready', async() => {
    console.log(`Connected`);
    console.log(`Logged in as: `);
    console.log(`${bot.user.tag}`);
});

bot.login(auth.token);