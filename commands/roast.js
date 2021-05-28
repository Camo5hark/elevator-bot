const yoMamma = require('yo-mamma').default;

module.exports = {
    label: 'roast',
    usage: '<mention>',
    description: 'roasts the mentioned user\'s mom',
    run: function(client, event, payload, args) {
        const memberMentions = event.mentions.members.array();

        if (memberMentions.length < 1) {
            event.reply('you must mention the member for roasting');

            return;
        }

        event.channel.send(`${memberMentions[0].user}, ${yoMamma()}`);
    }
};