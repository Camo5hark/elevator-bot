const ud = require('urban-dictionary');
const Discord = require('discord.js');

function removeBrackets(text) {
    return text.replace(/\[/g, '').replace(/\]/g, '');
}

module.exports = {
    label: 'ud',
    usage: '<query>',
    description: 'searches the Urban Dictionary with the specified query and sends the definition',
    run: function(client, event, payload, args) {
        ud.define(payload).then(results => {
            const result = results[0];

            event.reply(new Discord.MessageEmbed()
                .setAuthor(result.author)
                .setTitle(result.word)
                .setURL(result.permalink)
                .setDescription(removeBrackets(result.definition))
                .setFooter(removeBrackets(result.example))
                .setTimestamp(result.written_on)
            );
        }).catch(() => event.reply(`no results found for **${payload}**`));
    }
};