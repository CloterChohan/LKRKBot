const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const wait = require('util').promisify(setTimeout);
const jsonFile = require('../data.json');
const fs = require('fs');
const cron = require('node-cron');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('scheduler')
	.setDescription('DD/MM/TT:TT')
    .addSubcommand(subcommand => subcommand.setName('list').setDescription('Info about a user'))
    .addSubcommand(subcommand => subcommand.setName('add').setDescription('Create a new schedule')
    .addRoleOption(options => options.setName('role').setDescription('Who do i need to remind? Role Wise').setRequired(true))
    .addStringOption(options => options.setName('text').setDescription('Text to Remind you of').setRequired(true))
    .addStringOption(options => options.setName('date').setDescription('Every what date? 1 - 31').setRequired(false))
    .addStringOption(options => options.setName('day').setDescription('Every what day? 0 = Sunday, 6 = Saturday').setRequired(false))
    .addStringOption(options => options.setName('month').setDescription('Every what month? 1 - 12').setRequired(false))
    .addStringOption(options => options.setName('hour').setDescription('Every what hour? [**HH**:MM] 0 - 23').setRequired(false))
    .addStringOption(options => options.setName('minute').setDescription('Every what minute? [HH:**MM**] 0 - 59').setRequired(false)))
    .addSubcommand(subcommand => subcommand.setName('delete').setDescription('Remove a schedule')
    .addStringOption(options => options.setName('number').setDescription('Which number in the list?').setRequired(true))),

    async execute(interaction, bot) {
        let data = JSON.parse(fs.readFileSync('./data.json'));
        if(interaction.options.getSubcommand() === 'list'){
            const embed = new MessageEmbed().setColor('#0099ff').setTitle('The list of schedules');
            for(let i = 0; i < data.schedule.date.length; i++){
                let date = data.schedule.date[i] == "*" ? "*": zeroBase(data.schedule.date[i]);
                let day = data.schedule.day[i] == "*" ? "*": convertDay(data.schedule.day[i]);
                let month = data.schedule.month[i] == "*" ? "*": convertMonth(data.schedule.month[i]);
                let hour = data.schedule.hour[i] == "*" ? "*": zeroBase(data.schedule.hour[i]);
                let minute = data.schedule.minute[i] == "*" ? "*": zeroBase(data.schedule.minute[i]);
                let role = data.schedule.roleId[i];
                let text = data.schedule.text[i];
                embed.addFields(
                    { name: `List Number#${i+1}`, value: `Role:  ${role.name}\nDate:  ${month}, ${date}\nEvery:  ${day}\nOn:  ${hour}:${minute} WIB\nText: ${text}` },
                )
            }
            await interaction.reply({embeds: [embed]});
        }
        else if(interaction.options.getSubcommand() === 'add'){
            let currDate = interaction.options.getString('date') ?? '*';
            let currDay = interaction.options.getString('day') ?? '*';
            let currMonth = interaction.options.getString('month') ?? '*';
            let currHour = interaction.options.getString('hour') ?? '*';
            let currMinute = interaction.options.getString('minute') ?? '*';
            let currText = interaction.options.getString('text');
            let currRole = interaction.options.getRole('role');
            if(!inputAligibility(parseInt(currDate), parseInt(currDay), parseInt(currMonth), parseInt(currHour), parseInt(currMinute))){
                interaction.reply('Error! please put a corrent number! Read the Description for formatting');
            }
            else{
                data.schedule.text.push(currText);
                data.schedule.roleId.push(currRole);
                data.schedule.date.push(currDate);
                data.schedule.day.push(currDay);
                data.schedule.month.push(currMonth);
                data.schedule.hour.push(currHour);
                data.schedule.minute.push(currMinute);
        
                fs.writeFileSync('./data.json', JSON.stringify(data), "utf-8");
        
                let task = cron.schedule(`${currMinute} ${currHour} ${currDate} ${currMonth} ${currDay}`, () =>  {
                    bot.channels.cache.get("880814120688054312").send(`${currRole}, ` + data.schedule.text);
                }, {
                scheduled: true,
                timezone: "Asia/Jakarta"
                });
                task.start();
                interaction.reply("Ok!");
                await wait(2000);
                await interaction.deleteReply();
            }
        }
        else if(interaction.options.getSubcommand() === 'delete'){
            let option = interaction.options.getString('number') - 1;
            data.schedule.text[option] = null;
            data.schedule.roleId[option] = null;
            data.schedule.date[option] = null;
            data.schedule.day[option] = null;
            data.schedule.month[option] = null;
            data.schedule.hour[option] = null;
            data.schedule.minute[option] = null;
            for(let i = option ; i < data.schedule.date.length; i++){
                data.schedule.text[i] = data.schedule.text[i+1];
                data.schedule.roleId[i] = data.schedule.roleId[i+1];
                data.schedule.date[i] = data.schedule.date[i+1];
                data.schedule.day[i] = data.schedule.day[i+1];
                data.schedule.month[i] = data.schedule.month[i+1];
                data.schedule.hour[i] = data.schedule.hour[i+1];
                data.schedule.minute[i] = data.schedule.minute[i+1];
            }
            data.schedule.text.pop();
            data.schedule.roleId.pop();
            data.schedule.date.pop();
            data.schedule.day.pop();
            data.schedule.month.pop();
            data.schedule.hour.pop();
            data.schedule.minute.pop();
            fs.writeFileSync('./data.json', JSON.stringify(data), "utf-8");
            option++;
            interaction.reply(`List Number ${option} Deleted!`);
        }
    }
}
let convertDay = (day) =>{
    switch (day){
        case '0':
            return 'Sunday';
            break;
        case '1':
            return 'Monday';
            break;       
        case '2':
            return 'Tuesday';
            break;
        case '3':
            return 'Wednesday';
            break;       
        case '4':
            return 'Thursday';
            break;        
        case '5':
            return 'Friday';
            break;
        case '6':
            return 'Saturday';
            break;
    }
}

let convertMonth = (month) =>{
    switch (month){
    case '1':
        return 'January';
        break;       
    case '2':
        return 'February';
        break;
    case '3':
        return 'March';
        break;       
    case '4':
        return 'April';
        break;        
    case '5':
        return 'May';
        break;
    case '6':
        return 'June';
        break;
    case '7':
        return 'July';
        break;
    case '8':
        return 'August';
        break;       
    case '9':
        return 'September';
        break;
    case '10':
        return 'October';
        break;       
    case '11':
        return 'November';
        break;        
    case '12':
        return 'December';
        break;
    default:
        return 'Error';
        break;
    }
}
let inputAligibility = (currDate, currDay, currMonth, currHour, currMinute) => {
    if(currDate !== '*' && (currDate < 1 && currDate > 31)){
        return false;
    }
    if(currDay !== '*' && (currDay < 0 && currDay > 6)){
        return false;
    }
    if(currMonth !== '*' && (currMonth < 1 && currMonth > 12)){
        return false;
    }
    if(currHour !== '*' && (currHour < 0 && currHour > 23)){
        return false;
    }
    if(currMinute !== '*' && (currMinute < 0 && currMinute > 59)){
        return false;
    }
    return true;
}

let zeroBase = (input) =>{
    input.split();
    while(input.length < 2){
        input = '0' + input;
    }
    return input;
}