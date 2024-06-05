const Event = require("../../Base/Event");
const Discord = require("discord.js");
const slashCmd = require("../../Base/SlashCommand");
const { joinVoiceChannel } = require("@discordjs/voice")
module.exports = new Event("ready", (client) => {
    slashCmd(client);
    console.log(`[DISCORD API]`.green + ` - ${client.user.username} est en ligne`);
    client.user.setActivity({ name: "👋 Je suis sous développement", type: "WATCHING" });

    console.log(`URL : https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`)
});
