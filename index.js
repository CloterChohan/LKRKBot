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

bot.on("messageCreate", (msg) => {
	// console.log(`>>> Message from ${msg.author.tag}: ${msg.content}`);
	let content = msg.content;
	const nyaAnswers = ["o(≧口≦)o", "(○｀ 3′○)", "o((>ω< ))o", "o(一︿一+)o", "(´･ω･`)?", "https://media.discordapp.net/attachments/765856977028907009/897407441048862730/Clotopus.png?width=102&height=102"];
	checkContent = /^n+y+a/g;
	let found = content.match(checkContent);
	if(found){
		printOutNya(msg, nyaAnswers);
	}
	return;
});

let printOutNya = (msg, nyaAnswers) => msg.reply(nyaAnswers[getRandomNum(nyaAnswers.length)]);

let getRandomNum = (max) => {
	min = Math.ceil(0);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}


bot.login(auth.token);