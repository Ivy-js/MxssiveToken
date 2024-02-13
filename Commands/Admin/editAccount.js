const Discord = require("discord.js");
const Command = require("../../Base/Command");
var color = require("colors-cli/safe")

module.exports = new Command({
    name: "editaccount",
    description: "Permet à un admin de modifier un compte Mxssive",
    use: "editaccount <user>",
    perm: Discord.Permissions.FLAGS.ADMINISTRATOR,
    ownerOnly : true,
    category: "Admin",

    async run(client, message, args) {

        let user = await args._hoistedOptions[0].value
        let MxssiveUsername = (await client.db.get(`users.${user}.mxssive`))
        let MxssiveFTN = (await client.db.get(`users.${user}.fortnite`))
        let MxssiveBalance = (await client.db.get(`users.${user}.coins`))
        let userPing = message.guild.members.cache.get(user)

        let embed = new Discord.MessageEmbed()
        .setTitle("Modification du compte Mxssive")
        .setDescription(`
__**Compte Mxssive de <@${user}>**__ :
Pseudo Mxssive : ${MxssiveUsername}
Pseudo Fortnite : ${MxssiveFTN}
Solde : ${MxssiveBalance} MxssiveCoins 🧩

Utilisez le menu ci-dessous pour modifier des informations sur le compte Mxssive de ${userPing.user}
        `)
        .setColor(client.color)
        .setFooter({text : "Mxssive - Modification de compte", iconURL : client.user.displayAvatarURL({dynamic : true})})

        const EditRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("EditRow")
            .setMaxValues(1)
            .setPlaceholder("Mxssive - Modification de compte")
            .setOptions([
                
            {
                label: "Pseudo Mxssive",
                value: "pseudo",
                description: "Modifier le pseudo Mxssive",
                emoji: "🎮",
            } ,
            {
                label: "Pseudo Fortnite",
                value: "fortnite",
                description: "Modifier le pseudo Fortnite",
                emoji: "🎮",
            },
            {
                label: "Solde",
                value: "solde",
                description: "Modifier le solde",
                emoji: "💰",
            }
        ])
        )

        message.reply({embeds : [embed], components : [EditRow]})
        const collector = message.channel.createMessageComponentCollector({
            filter: x => {
                if (x.user.id === message.user.id) {
                    return true;
                } else {
                    x.reply({ embeds: [{ title: "Erreur", description: `${x.user} vous ne pouvez pas utliser ces interactions. Vous n'êtes pas l'auteur du message !`, color: bot.color }], ephemeral: true })
                    return false;
                }
            },
            time: 600000,
            idle: 30000
        })

        collector.on("collect", async (interaction) => {

            const filterMessage = (m) => m.author.id == message.user.id && !m.author.bot
            if(interaction.isSelectMenu()){
                if(interaction.customId === "EditRow"){
                    if(interaction.values[0] === "pseudo"){
                        interaction.deferUpdate()
                        const question = await interaction.channel.send({
                            embeds: [{
                                description: "Quel est le nouveau pseudo Mxssive ?",
                                color : client.color
                            }]
                        })
                        const response = await interaction.channel.awaitMessages({filterMessage, max: 1, time: 60000})
                        const newMxssive = response.first().content
                        await client.db.set(`users.${user}.mxssive`, newMxssive)
                        question.delete()
                        response.first().delete()
                        interaction.channel.send({embeds : [{title : "Succès", description : `Le pseudo Mxssive de <@${user}> a été modifié en ${newMxssive}`, color : client.color}]})
                }
            }

            }
        })
    },
});