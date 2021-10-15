//Discord.js
const auth = require('./auth.json');
const { Client, Intents, MessageEmbed } = require('discord.js');

//Trello
const Trello = require("node-trello");
const t = new Trello(auth.trello_key, auth.trello_token);

//SlashCommands
const fs = require('fs');
const { Collection } = require('discord.js');
const { token } = require('./auth.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const deployCommand = require('./deploy-command.js');
//SlashCommands - Registering
client.commands = new Collection();
const commandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./slashCommands/${file}`);
    client.commands.set(command.data.name, command);
}


//Initiation
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

bot.on('ready', async() => {
    console.log(`Connected`);
    console.log(`Logged in as: `);
    console.log(`${bot.user.tag}`);
    bot.user.setStatus('idle');
    bot.user.setUsername("LKRK's Helper || use /help");
    bot.user.setActivity("with my master UwU", {type: "COMPETING"});
    deployCommand();
});

let prefix = '!';

bot.on("messageCreate", (message) => { 
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;                             
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    
    if(command === "servetea"){
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`FUCK YOU BITCH This message had a latency of ${timeTaken}ms.`);
    }
    if(command === "trellodata"){
    	t.get("1/members/me", {cards: "open"}, (err, data) =>{
    		if(err) throw err;
    		message.channel.send(JSON.stringify(data.cards[1]));
    	});
    }
    if(command === "idea"){
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Data Penjualan')
            .setDescription('Hasil Data Penjualan')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Nama:', value: 'Christopher Vincent Welax\nFelix Triprasetya Cakti', inline: true },
                { name: 'Email:', value: 'VincentWelax@gmail.com\nFelixTri@gmail.com', inline: true },
                { name: 'Jenis Service:', value: 'Nasi Goreng Ayam Penyet\nEs Krim Susu Sapi Nasional', inline: true },
            )
            .addField('Harga', 'Rp56.000\nRp12.000', true)
            .addField('Total Harga', 'Rp68.000', true)
            .setTimestamp()
        console.log("run!");
        message.channel.send({ embeds: [exampleEmbed]});
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