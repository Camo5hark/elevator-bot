const Discord = require('discord.js');
const commandHandler = require('./command-handler');
commandHandler.createHelpEmbed();

const client = new Discord.Client();
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag} - ${client.user.id}`);

    client.user.setActivity('.help');
});

client.on('message', event => commandHandler.run(client, event));

client.login(process.env.BOT_TOKEN);