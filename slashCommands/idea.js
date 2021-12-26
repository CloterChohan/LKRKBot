const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const jsonFile = require('../data.json');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('idea')
	.setDescription('Add idea to #idea-collector')
    .addSubcommand(subcommand => subcommand.setName("add").setDescription(`Add an idea to the #idea-collector`)
        .addStringOption(options => options.setName("text").setDescription("Enter your idea here").setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName("delete").setDescription(`Delete an idea...`)
        .addIntegerOption(options => options.setName("number").setDescription("Which idea you want to delete?").setRequired(true)))
    ,
	async execute(interaction, bot) {
        let data = JSON.parse(fs.readFileSync('./data.json'));
        let jsonDatas = data.ideas;
        if(interaction.options.getSubcommand() === 'add'){
            let text = interaction.options.getString('text');
            let newIndex;
            if(jsonDatas.index.length === 0){
                jsonDatas.text.push(text);
                jsonDatas.index.push("Idea#" + JSON.stringify(1));
            }
            else{
                newIndex = jsonDatas.index[jsonDatas.index.length - 1].split('#');
                jsonDatas.text.push(text);
                jsonDatas.index.push("Idea#" + JSON.stringify(parseInt(newIndex[1]) + 1));
            }
            newIndex = jsonDatas.index[jsonDatas.index.length - 1].split('#');
            newIndex = parseInt(newIndex[1]);
            const embed = new MessageEmbed()
                .setAuthor(`From: ${interaction.user.username}`, interaction.user.avatarURL())
                .setColor('#0099ff')
                .setTitle(`${jsonDatas.index[jsonDatas.index.length - 1]}`)
                .setDescription(`${text}`)
                .setTimestamp()
            let messageId = await bot.channels.cache.get("897477799126921266").send({embeds: [embed]});
            jsonDatas.id.push(messageId.id);
            await interaction.reply(`Idea Added! <@${interaction.user.id}>`);
            fs.writeFileSync('./data.json', JSON.stringify(data, null, 4), "utf-8");
            await wait(2000);
            await interaction.deleteReply();
            
        }
        if(interaction.options.getSubcommand() === 'delete'){
            let num = interaction.options.getInteger("number");
            let newNum = num.toString();
            let found;
            found = false;
            for(let i=0; i<jsonDatas.index.length;i++){
                let newIndex = jsonDatas.index[i].split('#');
                if(newIndex[1] === newNum){
                    found = true;
                    let newID = jsonDatas.id[i];
                    bot.channels.fetch("897477799126921266").then(channel => 
                        channel.messages.fetch(newID).then(msg => 
                            msg.delete()).catch(it => console.log("Error: " + it))); //Delete message
                    executeDelete(i, jsonDatas); //Delete Data
                    fs.writeFileSync('./data.json', JSON.stringify(data, null, 4), "utf-8");
                    interaction.reply(`Deleted! <@${interaction.user.id}>`);
                    await wait(2000);
                    await interaction.deleteReply();
                    break;
                }
            }
            if(!found){
                interaction.reply("Data not found! please input a correct number!");
            }
        }
	}
};

let executeDelete = (option, jsonDatas) => {
    for(let i = option ; i < jsonDatas.index.length; i++){
        jsonDatas.index[i] = jsonDatas.index[i+1];
        jsonDatas.text[i] = jsonDatas.text[i+1];
        jsonDatas.id[i] = jsonDatas.id[i+1];
    }
    jsonDatas.index.pop();
    jsonDatas.text.pop();
    jsonDatas.id.pop();
}