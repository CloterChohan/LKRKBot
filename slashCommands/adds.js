const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const jsonFile = require('../data.json');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('adds')
	.setDescription('What you want to add?')
    .addStringOption(options => options.setName('black_tea').setDescription('Add more images[MUST BE LINK] to Black Tea Command').setRequired(false))
    .addStringOption(options => options.setName('green_tea').setDescription('Add more images[MUST BE LINK] to Green Tea Command').setRequired(false)),

	async execute(interaction, bot) {
        let linkData;
        let lastArray;
        let firstArray = 0;
        if(interaction.options.getString('black_tea') !== null){
            let blackTeaInput = interaction.options.getString('black_tea');
            let data = JSON.parse(fs.readFileSync('./data.json'));
            data.black_tea.push(blackTeaInput);
            fs.writeFileSync('./data.json', JSON.stringify(data, null, 4), "utf-8");
            interaction.reply("Succesfully put Images");
        }
        if(interaction.options.getString('green_tea') !== null){
            let greenTeaInput = interaction.options.getString('green_tea');
            let data = JSON.parse(fs.readFileSync('./data.json'));
            data.green_tea.push(greenTeaInput);
            fs.writeFileSync('./data.json', JSON.stringify(data, null, 4), "utf-8");
            interaction.reply("Succesfully put Images");
        }
        if (interaction.options.getString('green_tea') === null && interaction.options.getString('black_tea') === null){
            interaction.reply("Please Put a link");
        }
        await wait(2000);
        await interaction.deleteReply();
	}
};