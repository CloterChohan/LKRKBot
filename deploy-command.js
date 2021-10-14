const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./auth.json');

module.exports = () =>{
const commands = [];

const rest = new REST({ version: '9' }).setToken(token);

const commandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./slashCommands/${file}`);
		commands.push(command.data.toJSON());
	}

	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
}