const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);

let ideaNum = 2;
module.exports = {
	data: new SlashCommandBuilder()
    .setName('idea')
	.setDescription('Add idea to #idea-collector')
	.addStringOption(options =>
	    options.setName('add').setDescription('Add your idea to the #idea-collector').setRequired(true)),

	async execute(interaction, bot) {
        

		let output = interaction.options.getString('add', true);
        ideaNum++;
        const embed = new MessageEmbed().setColor('#0099ff').setTitle(`Idea#${ideaNum}`).setDescription(`${output}`).setTimestamp()
        await bot.channels.cache.get("897477799126921266").send({embeds: [embed]});
        await interaction.reply(`Idea Added! <@${bot.user.id}>`);
        await wait(2000);
        await interaction.deleteReply();
	}
};