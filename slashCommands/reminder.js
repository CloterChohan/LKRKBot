const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const wait = require('util').promisify(setTimeout);
const jsonFile = require('../data.json');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reminder')
	.setDescription('Set a reminder to certain team or someone')
    .addUserOption(options => options.setName('target').setDescription('Who do you want to remind?').setRequired(true))
    .addStringOption(options => options.setName('text').setDescription('Remind me of...').setRequired(true))
    .addIntegerOption(options => options.setName('seconds').setDescription('When to remind you before deadline?').setRequired(false))
    .addIntegerOption(options => options.setName('minutes').setDescription('When to remind you before deadline?').setRequired(false))
    .addIntegerOption(options => options.setName('hours').setDescription('When to remind you before deadline?').setRequired(false))
    .addIntegerOption(options => options.setName('days').setDescription('When to remind you before deadline?').setRequired(false))
    .addStringOption(options => options.setName('date').setDescription('[WARNING! NOT IMPLEMENTED YET] Format: dd/mm/yyyy/hh/mntmnt').setRequired(false)),
    
    async execute(interaction, bot) {
        //remind by date

        //remind by interval
        let message = interaction.options.getString('text');
		try {
			
			// Variables
			let returntime;
            let returntimetext;
		    let timemeasure;
			let userid;
			console.log('Message recieved from ' + bot.user.username + ' at ' + Date.now().toString());

			// Sets the userid for the recipiant
			userid = interaction.options.getUser('target').id;
			
			// Sets the return time
            if(interaction.options.getInteger('seconds') !== null){
                timemeasure = 's';
                returntime = interaction.options.getInteger('seconds');
            }
            if(interaction.options.getInteger('minutes') !== null){
                timemeasure = 'm';
                returntime = interaction.options.getInteger('minutes');
            }
            if(interaction.options.getInteger('hours') !== null){
                timemeasure = 'h';
                returntime = interaction.options.getInteger('hours');
            }
            if(interaction.options.getInteger('days') !== null){
                timemeasure = 'd';
                returntime = interaction.options.getInteger('days');
            }

			// Based off the delimiter, sets the time
			switch (timemeasure) {
				case 's':
                    returntimetext = returntime.toString();
					returntime = returntime * 1000;
                    
					break;

				case 'm':
                    returntimetext = returntime.toString();
					returntime = returntime * 1000 * 60;
					break;

				case 'h':
                    returntimetext = returntime.toString();
					returntime = returntime * 1000 * 60 * 60;
					break;

				case 'd':
                    returntimetext = returntime.toString();
					returntime = returntime * 1000 * 60 * 60 * 24;
					break;

				default:
                    returntimetext = returntime.toString();
					returntime = returntime * 1000;
					break;
			}
            interaction.reply(`Will remind you in ${returntimetext}${timemeasure}`);
            
			// Returns the Message
			setTimeout(function () {
				// Creates the message
				let content = interaction.options.getString('text');
                console.log(userid);
                console.log(content); //Pwease Fuck me now daddy @ニャー#9342 UwU
                bot.channels.cache.get("880814120688054312").send(`<@${userid}>, ` + content);
				console.log('Message sent to ' + userid + ' at ' + Date.now().toString());
			}, returntime)
		} catch (e) {
			interaction.reply("An error has occured, please make sure the command has a time delimiter and message");
			console.error(e.toString());
		}

	}
};