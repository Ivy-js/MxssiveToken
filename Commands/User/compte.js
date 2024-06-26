const Discord = require("discord.js");
const Command = require("../../Base/Command");
var color = require("colors-cli/safe")

module.exports = new Command({
    name: "compte",
    description: "Permet de récupérer les informations ton compte Mxssive",
    use: "compte",
    perm: Discord.Permissions.FLAGS.VIEW_CHANNEL,
    category: "User",

    async run(client, message, args) {

        if((await client.db.get(`users.${message.user.id}.validated`)) === false) return message.reply({embeds : [{title : "Erreur", description : "Tu n'as pas de compte Mxssive !", color : client.color}]})

        let embed = new Discord.MessageEmbed()
        .setTitle("Informations de ton compte Mxssive")
        .setDescription(`
**Votre Compte** : 

__**Pseudo Mxssive**__ : ${await client.db.get(`users.${message.user.id}.mxssive`)}

__**Pseudo Fortnite**__ : ${await client.db.get(`users.${message.user.id}.fortnite`)}
__**Pseudo Discord**__ : ${message.user.username}


__**Elo**__ : \`${await client.db.get(`users.${message.user.id}.elo`)}✨\`

**Votre Porte-Monnaie** :
__**Solde**__ : ${await client.db.get(`users.${message.user.id}.coins`)} MxssiveCoins <a:coins:1246850429514416200>

        `)
        .setColor(client.color)
        .setFooter({text : "Mxssive - Informations de compte", iconURL : client.user.displayAvatarURL({dynamic : true})})
        await message.reply({embeds : [embed]});

        
    },
});