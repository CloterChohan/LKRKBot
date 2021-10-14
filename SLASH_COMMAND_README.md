Before adding new command, run this command in CMD:
``npm install @discordjs/rest discord-api-types``

To add more, just create a new file with command you want.

For example: /music,
then add file 'music.js' in commands folder.
When called it will run anything inside the execute function.

example code (you can copy paste this): 
```js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout); //just to wait until timer runs out then the next is called

module.exports = {
	data: new SlashCommandBuilder()
    .setName('music') //SET YOUR COMMAND NAME HERE TOO, make sure to make it the same as the file name!
	.setDescription('Play Music') //Description
	.addStringOption(options =>
	    options.setName('Search').setDescription('Search Music').setRequired(true)), //Add option for searching music

//Execute when the command being called
	async execute(interaction) {   
		let output = interaction.options.getString('add', true);
    		//code here
	}
};
```

for more guide visit https://discordjs.guide/interactions/registering-slash-commands.html#guild-commands
