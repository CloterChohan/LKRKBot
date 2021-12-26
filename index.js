//Discord.js
const auth = require('./auth.json');
const { Client, Intents, MessageEmbed, TextChannel } = require('discord.js');

//SlashCommands
const fs = require('fs');
const { Collection } = require('discord.js');
const { token } = require('./auth.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const deployCommand = require('./deploy-command.js');
//SlashCommands - Registering
client.commands = new Collection();
const commandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

//Scheduler
const schedule = require('node-schedule');

for (const file of commandFiles) {
	const command = require(`./slashCommands/${file}`);
    client.commands.set(command.data.name, command);
}

//Initiation
// const bot = new Discord.Client({disableEveryone: False});
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

bot.on('ready', async() => {
    console.log(`Connected`);
    console.log(`Logged in as: `);
    console.log(`${bot.user.tag}`);
    bot.user.setStatus('idle');
    bot.user.setUsername("LKRK's Helper || use /help");
    bot.user.setActivity("with my master UwU", {type: "COMPETING"});
    deployCommand();
    let data = JSON.parse(fs.readFileSync('./data.json'));
    data = data.schedule;
    if(data.index.length > 0){
        for(let i = 0 ; i < data.index.length; i++){
            let task = schedule.scheduleJob(data.index[i] ,`${data.minute[i]} ${data.hour[i]} ${data.date[i]} ${data.month[i]} ${data.day[i]}`, function() {
                bot.channels.cache.get("880814120688054312").send(`Hey! <@${data.roleId[i]}> ` + data.text);
            });
        }
        console.log("Data Loaded Succesfully!");
    }
});

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction, bot);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

bot.on("messageCreate", (msg) => {
	// console.log(`>>> Message from ${msg.author.tag}: ${msg.content}`);
	let content = msg.content;
	const nyaAnswers = ["(=｀ω´=)", "(=｀ェ´=)", "(=´∇｀=)", "(=^ ◡ ^=)", "(=^-ω-^=)", "(＾º◡º＾❁)", "(^≗ω≗^)", "(^つωฅ^)", "（＾・ω・＾❁）","ฅ(＾・ω・＾ฅ)", "o(≧口≦)o", "(○｀ 3′○)", "o((>ω< ))o", "o(一︿一+)o", "(´･ω･`)?", "https://media.discordapp.net/attachments/765856977028907009/897407441048862730/Clotopus.png?width=102&height=102"];
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