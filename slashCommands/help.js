const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('help')
	.setDescription('Give bunch of available command'),

	async execute(interaction, bot) {
        await interaction.reply('```[Command] [Options] - [Description]\n/help - Give bunch of available commands\n/idea [add:] - Insert Idea into #idea-collector\n/servetea [black_tea] - Send Images of Black Tea\n/servetea [green_tea] - Send Images of Green Tea\n```');
	}
};