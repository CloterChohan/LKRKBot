const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
const schedule = require('node-schedule');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('schedule')
	.setDescription('Give yourself a reminder for every x day, month, or weeks')

    //Personal
        .addSubcommand(
            subcommand => subcommand.setName('list').setDescription('Info about a user Schedule')
        )
        .addSubcommand(
            subcommand => subcommand.setName('add').setDescription('Create a new schedule')
            .addStringOption(options => options.setName('text').setDescription('Text to Remind you of').setRequired(true))
            .addRoleOption(options => options.setName('role').setDescription('Who to ping?').setRequired(true))
            .addStringOption(options => options.setName('date').setDescription('Every what date? 1 - 31').setRequired(false))
            .addStringOption(options => options.setName('day').setDescription('Every what day? 0 = Sunday, 6 = Saturday').setRequired(false))
            .addStringOption(options => options.setName('month').setDescription('Every what month? 1 - 12').setRequired(false))
            .addStringOption(options => options.setName('hour').setDescription('Every what hour? [**HH**:MM] 0 - 23').setRequired(false))
            .addStringOption(options => options.setName('minute').setDescription('Every what minute? [HH:**MM**] 0 - 59').setRequired(false))
        )
        .addSubcommand(
            subcommand => subcommand.setName('delete').setDescription('Remove a schedule')
            .addStringOption(options => options.setName('number').setDescription('Which number in the list?').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('deleteall').setDescription('Delete all schedule')),
    async execute(interaction, bot) {
        let data = JSON.parse(fs.readFileSync('./data.json'));
        let input = interaction.options.getSubcommand();
        let jsonDatas = data.schedule;
        let embed = new MessageEmbed().setColor('#0099ff').setTitle('The list of schedules');
        let task;
        //Printout the list
        if(input === 'list'){
            if(jsonDatas.index.length === 0){
                console.log("Run!");
                embed.setTitle("No Data yet!");
                await interaction.reply({embeds: [embed]});
            }
            else{
                searchList(jsonDatas, embed, interaction);
            }
        }
        //Add new personal list 
        if(input === 'add'){
            let currDate = interaction.options.getString('date') ?? '*';
            let currDay = interaction.options.getString('day') ?? '*';
            let currMonth = interaction.options.getString('month') ?? '*';
            let currHour = interaction.options.getString('hour') ?? '*';
            let currMinute = interaction.options.getString('minute') ?? '*';
            let currText = interaction.options.getString('text');
            let currRole = interaction.options.getRole('role').id;
            if(!inputAligibility(parseInt(currDate), parseInt(currDay), parseInt(currMonth), parseInt(currHour), parseInt(currMinute))){
                interaction.reply('Error! please put a corrent number! Read the Description for formatting');
            }
            else{
                pushData(jsonDatas, currDate, currDay, currMonth, currHour, currMinute, currText, currRole);
                fs.writeFileSync('./data.json', JSON.stringify(data, null, 4), "utf-8");
                let uniqueIndex = jsonDatas.index[jsonDatas.index.length - 1];
                task = schedule.scheduleJob(uniqueIndex, `${currMinute} ${currHour} ${currDate} ${currMonth} ${currDay}`, function(){
                    bot.channels.cache.get("880814120688054312").send(`Hey! <@&${currRole}> `+ currText);
                });
                interaction.reply("Done!");
                await wait(2000);
                await interaction.deleteReply();
            }
        }
        //Delete specific schedule
        if(input === 'delete'){
            let option = interaction.options.getString('number') - 1;
            let current_job = schedule.scheduledJobs[jsonDatas.index[option]];
            current_job.cancel();
            executeDelete(option, jsonDatas);
            fs.writeFileSync('./data.json', JSON.stringify(data, null, 4), "utf-8");
            option++;
            interaction.reply(`List Number ${option} Deleted!`);
        }
        //Delete all personal Data
        if(input === 'deleteall'){
            for(let i = jsonDatas.index.length - 1; i >=0 ; i--){
                let current_job = schedule.scheduledJobs[jsonDatas.index[i]];
                current_job.cancel();
                executeDelete(i, jsonDatas);
            }
            fs.writeFileSync('./data.json', JSON.stringify(data, null, 4), "utf-8");
            interaction.reply(`All of your schedule has been Deleted!`);
            await wait(10000);
            await interaction.deleteReply();
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////METHODS///////////////////////////////////////////

let searchList = async (jsonDatas, embed, interaction) => {
    for(let i = 0; i < jsonDatas.date.length; i++){
        let date = jsonDatas.date[i] == "*" ? "*": zeroBase(jsonDatas.date[i]);
        let day = jsonDatas.day[i] == "*" ? "*": convertDay(jsonDatas.day[i]);
        let month = jsonDatas.month[i] == "*" ? "*": convertMonth(jsonDatas.month[i]);
        let hour = jsonDatas.hour[i] == "*" ? "*": zeroBase(jsonDatas.hour[i]);
        let minute = jsonDatas.minute[i] == "*" ? "*": zeroBase(jsonDatas.minute[i]);
        let role = jsonDatas.roleId[i];
        let text = jsonDatas.text[i];
        embed.addFields(
            { name: `List Number#${i+1}`, value: `Role:  ${role}\nDate:  ${month}, ${date}\nEvery:  ${day}\nOn:  ${hour}:${minute} WIB\nText: ${text}` },
        )
    }
    await interaction.reply({embeds: [embed]});
}

let pushData = (jsonDatas, currDate, currDay, currMonth, currHour, currMinute, currText, roleId) => {
    let newIndex;
    if(jsonDatas.text.length === 0){
        jsonDatas.index.push("Index " + JSON.stringify(0));
    }
    else{
        newIndex = jsonDatas.index[jsonDatas.text.length - 1].split(" ");
        jsonDatas.index.push("Index " + JSON.stringify(parseInt(newIndex[1]) + 1));
    }

    jsonDatas.text.push(currText);
    jsonDatas.date.push(currDate);
    jsonDatas.day.push(currDay);
    jsonDatas.month.push(currMonth);
    jsonDatas.hour.push(currHour);
    jsonDatas.minute.push(currMinute);
    jsonDatas.roleId.push(roleId);
}

let executeDelete = (option, jsonDatas) => {
    for(let i = option ; i < jsonDatas.index.length; i++){
        jsonDatas.index[i] = jsonDatas.index[i+1];
        jsonDatas.text[i] = jsonDatas.text[i+1];
        jsonDatas.roleId[i] = jsonDatas.roleId[i+1];
        jsonDatas.date[i] = jsonDatas.date[i+1];
        jsonDatas.day[i] = jsonDatas.day[i+1];
        jsonDatas.month[i] = jsonDatas.month[i+1];
        jsonDatas.hour[i] = jsonDatas.hour[i+1];
        jsonDatas.minute[i] = jsonDatas.minute[i+1];
    }
    jsonDatas.index.pop();
    jsonDatas.text.pop();
    jsonDatas.roleId.pop();
    jsonDatas.date.pop();
    jsonDatas.day.pop();
    jsonDatas.month.pop();
    jsonDatas.hour.pop();
    jsonDatas.minute.pop();
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