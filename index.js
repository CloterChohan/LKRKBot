const auth = require('./auth.json');
const { Client, Intents } = require('discord.js');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

bot.on('ready', async() => {
    console.log(`Connected`);
    console.log(`Logged in as: `);
    console.log(`${bot.user.tag}`);
});
//command
let prefix = '!';

bot.on("message", function(message) { 
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;                             
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if(command === "servetea"){
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`FUCK YOU BITCH This message had a latency of ${timeTaken}ms.`);
    }
});  


bot.login(auth.token);