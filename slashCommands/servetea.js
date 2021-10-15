const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require('discord.js');
const jsonFile = require('../data.json');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('servetea')
	.setDescription('Serving you a cup of tea')
    .addSubcommand(subCommand => subCommand.setName('black_tea').setDescription('Serve you a Black Tea'))
    .addSubcommand(subCommand => subCommand.setName('green_tea').setDescription('Serve you a Green Tea')),
	async execute(interaction, bot) {
        const blackTea = jsonFile.black_tea;
        const greenTea = jsonFile.green_tea;
		let output = interaction.options;
        if(output.getSubcommand() === 'black_tea'){
            const embed = new MessageEmbed().setColor('#0099ff').setTitle('I would politely say here is your fucking Black Tea sir')
            .setDescription('Black Tea')
            .setImage(blackTea[getRandomNum(blackTea.length)]);
            await interaction.reply({embeds: [embed]});
            console.log(blackTea[getRandomNum(blackTea.length)]);
        }        
        if(output.getSubcommand() === 'green_tea'){
            const embed = new MessageEmbed().setColor('#0099ff').setTitle('I would politely say here is your fucking Green Tea sir')
            .setDescription('Green Tea')
            .setImage(greenTea[getRandomNum(greenTea.length)]);
            await interaction.reply({embeds: [embed]});
            console.log(greenTea[getRandomNum(greenTea.length)]);
        }
	}
    
};

let getRandomNum = (max) => {
	min = Math.ceil(0);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}
