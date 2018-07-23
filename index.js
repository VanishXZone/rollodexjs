const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./controllers').filter(file => file.endsWith('.js'));
const { prefix } = process.env.prefix || require('./config.json');
const { token } = process.env.token || require('./config.json');

var db = 'mongodb://localhost/rollodexjs'

mongoose.connect(db);
console.log("token =" + token);

for (const file of commandFiles) {
    const command = require(`./controllers/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === (`ping`)) {
        client.commands.get('ping').execute(message, args);
    } else if (command === (`npc`)) {
        client.commands.get('npcs').execute(message, args);
    } else if (command === (`faction`)) {
        client.commands.get('factions').execute(message, args);
    } else if (command === 'args-info') {
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        } else if (args[0] === 'foo') {
            return message.channel.send('bar');
        }

        message.channel.send(`First argument: ${args[0]}`);

        message.channel.send(`Command name: ${command}\nArguments: ${args}`);
    } else if (command === 'prune') {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        } else if (amount <= 1 || amount > 100) {
            return message.reply('you need to input a number between 1 and 99.');
        }

        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('there was an error trying to prune messages in this channel!');
        });
    }

});

client.login(token);