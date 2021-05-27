const Discord = require("discord.js");
const ud = require("urban-dictionary");
const yomamma = require("yo-mamma");
const funfacts = require("fun-facts");
const client = new Discord.Client();
const helpCmdLabel = "ehelp";

client.on("ready", () => {
    client.user.setActivity(helpCmdLabel, {type: "PLAYING"});

    console.log("Ready");
});

const floorCmdLabel = ".goto";
const udCmdLabel = ".ud";

client.on("message", async msg => {
    var content = msg.content.toLowerCase();

    if (content.startsWith(floorCmdLabel)) {
        if (msg.member.voice.channel == null) {
            msg.reply("You have to be in the elevator for it to move you retard.");

            return;
        }

        var targetChannelName = content.replace(floorCmdLabel, "").trim();
        var channels = msg.guild.channels.cache.array().filter(predicate => predicate.type == "voice").sort((a, b) => a.position > b.position ? 1 : -1);
        var targetChannel = null;

        for (var i = 0; i < channels.length; i++) {
            var channel = channels[i];

            if (targetChannelName == channel.name.toLowerCase()) {
                targetChannel = channel;

                msg.reply("Moving you to room: " + targetChannelName);

                break;
            }
        }

        if (targetChannel == null) {
            msg.reply("Could not find room: " + targetChannelName);

            return;
        }

        var memberChannelPos = msg.member.voice.channel.position;
        var lastMoveTime = Date.now();

        while (targetChannel.position != memberChannelPos) {
            var currentTime = Date.now();

            if (currentTime - lastMoveTime >= 1500) {
                memberChannelPos += targetChannel.position > memberChannelPos ? 1 : -1;
                lastMoveTime = currentTime;

                var moveFailed = false;
    
                await msg.member.voice.setChannel(channels[memberChannelPos]).catch(() => moveFailed = true);

                if (moveFailed) {
                    msg.reply("Elevator trip cancelled because you left like an idiot.");

                    break;
                }
            }
        }
    } else if (content.startsWith(udCmdLabel)) {
        ud.term(content.replace(udCmdLabel, "").trim()).then(result => {
            var entry = result.entries[0];

            msg.reply(new Discord.MessageEmbed()
                .setTitle(entry.word)
                .setDescription(entry.definition)
                .setFooter(entry.example)
            );
        }).catch(() => {
            msg.reply("Something went wrong.");
        });
    } else if (content == ".owoify") {
        msg.channel.messages.fetch({
            limit: 2
        }).then(msgs => {
            msg.channel.send(msgs.last().content.replace(/[l,r]/g, "w"));
        }).catch(err => {
            msg.reply("Something went wrong.");

            console.log(err);
        });
    } else if (content.startsWith(".roast")) {
        var mentionsMembersArray = msg.mentions.members.array();

        if (mentionsMembersArray.length == 0) {
            msg.reply("You are so fucking retarded. You have to mention someone to roast.");

            return;
        }

        msg.channel.send("<@" + mentionsMembersArray[0].user.id + ">, " + yomamma.default());
    } else if (content == helpCmdLabel) {
        msg.reply("\n**elevator guide for retards (you)**\n.goto <channel> - moves u to the specified voice channel\n.ud <term> - prints urban dictionary definition of term\n.owoify - makes the last message sent owo\n.roast <mention> - roasts the member you mentioned");
    } else if (content.startsWith(".fact")) {
        msg.reply(funfacts.get().fact);
    }
});

client.login(process.env.BOT_TOKEN);