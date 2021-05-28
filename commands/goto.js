module.exports = {
    label: 'goto',
    usage: '<channel>',
    description: 'elevates you to the specified channel',
    run: async function(client, event, payload, args) {
        if (!event.member.voice.channel) {
            event.reply('you must be in a voice channel to use the elevator');

            return;
        }

        const channels = event.guild.channels.cache.array().filter(channel => channel.type == 'voice').sort((a, b) => a.position > b.position ? 1 : -1);
        var targetChannel = channels.filter(channel => channel.name.toLowerCase() == payload.toLowerCase());

        if (!targetChannel) {
            event.reply(`could not find channel **${payload}**`);

            return;
        }

        targetChannel = targetChannel[0];

        var memberChannelPos = event.member.voice.channel.position;
        const moveDirection =  targetChannel.position > memberChannelPos ? 1 : -1;
        var lastMoveTime = Date.now();

        while (targetChannel.position != memberChannelPos) {
            const currentTime = Date.now();

            if (currentTime - lastMoveTime < 1500) continue;

            memberChannelPos += moveDirection;
            lastMoveTime = currentTime;

            var moveFailed;

            await event.member.voice.setChannel(channels[memberChannelPos]).catch(() => moveFailed = true);

            if (moveFailed) {
                event.reply('your elevator trip was cancelled because you disconnected from the voice channel.');

                break;
            }
        }
    }
};