const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('servetea')
	.setDescription('Serving you a cup of tea')
    .addSubcommand(subCommand => subCommand.setName('black_tea').setDescription('Serve you a Black Tea'))
    .addSubcommand(subCommand => subCommand.setName('green_tea').setDescription('Serve you a Green Tea')),
	async execute(interaction, bot) {
		let output = interaction.options;
        if(output.getSubcommand() === 'black_tea'){
            const embed = new MessageEmbed().setColor('#0099ff').setTitle('I would politely say here is your fucking Black Tea sir')
            .setDescription('Black Tea')
            .setImage('https://i.imgur.com/4twRlEy.jpeg');
            await interaction.reply({embeds: [embed]});
        }        
        if(output.getSubcommand() === 'green_tea'){
            const embed = new MessageEmbed().setColor('#0099ff').setTitle('I would politely say here is your fucking Green Tea sir')
            .setDescription('Green Tea')
            .setImage('https://i.imgur.com/AecK8x1.jpeg');
            await interaction.reply({embeds: [embed]});
        }
	}
};