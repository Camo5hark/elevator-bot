const Discord = require('discord.js');

const commandToken = '.';
const helpEmbed = new Discord.MessageEmbed();
helpEmbed.setTitle('elevator Help');
helpEmbed.addField('Token', `**${commandToken}**`);

module.exports = {
    commands: [
        require('./commands/goto'),
        require('./commands/ud'),
        require('./commands/roast')
    ],
    createHelpEmbed: function() {
        var commandField = '';

        this.commands.forEach(command => commandField += `**${command.label} ${command.usage}** - ${command.description}\n`);

        helpEmbed.addField('Commands', commandField);
    },
    run: function(client, event) {
        if (!event.content.startsWith(commandToken)) return;

        const args = event.content.toLowerCase().split(/\s/g);
        const label = args.shift().replace(commandToken, '');
        const payload = event.content.replace(`${commandToken}${label}`, '').trimStart();
        const command = this.commands.filter(command => command.label == label);

        if (!command) return;

        if (label == 'help') event.reply(helpEmbed); else command[0].run(client, event, payload, args);
    } 
};