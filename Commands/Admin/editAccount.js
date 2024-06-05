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
    /**
     * 
     * @param {import("../../Base/Client")} client 
     * @param {import('discord.js').Message} message 
     * @param {String[]} args 
     */

    async run(client, message, args) {

        let user = await args._hoistedOptions[0].value
        let MxssiveUsername = (await client.db.get(`users.${user}.mxssive`))
        let MxssiveFTN = (await client.db.get(`users.${user}.fortnite`))
        let MxssiveBalance = (await client.db.get(`users.${user}.coins`))
        let userPing = message.guild.members.cache.get(user)



        if(MxssiveBalance === undefined) return message.reply({embeds : [{description : "Ce compte n'existe pas", color: client.color}], ephemeral: true})

        let embed = new Discord.MessageEmbed()
        .setTitle("Modification du compte Mxssive")
        .setDescription(`
__**Compte Mxssive de <@${user}>**__ :
Pseudo Mxssive : ${MxssiveUsername}
Pseudo Fortnite : ${MxssiveFTN}
Solde : ${MxssiveBalance} MxssiveCoins <a:coins:1246850429514416200>

Utilisez le menu ci-dessous pour modifier des informations sur le compte Mxssive de ${userPing.user}
        `)
        .setColor(client.color)
        .setFooter({text : "Mxssive - Modification de compte", iconURL : client.user.displayAvatarURL({dynamic : true})})


        const editbtn = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId("pseudo")
            .setLabel("Modifier le pseudo Mxssive")
            .setStyle("PRIMARY"),
            new Discord.MessageButton()
            .setCustomId("fortnite")
            .setLabel("Modifier le pseudo Fortnite")
            .setStyle("PRIMARY"),
            new Discord.MessageButton()
            .setCustomId("solde")
            .setLabel("Modifier le solde")
            .setStyle("PRIMARY")

        )

        const currency = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("currency")
            .setMaxValues(1)
            .setOptions(
                [
                    {
                        label : "Ajouter",
                        value  : "add",
                        emoji : "➕"
                    },
                    {
                        label  : "Enlever",
                        value   : "remove",
                        emoji  : "➖"
                    }
                ]
            )
        )

        message.reply({embeds : [embed], components : [editbtn]})
        const collector = message.channel.createMessageComponentCollector({
            filter: x => {
                if (x.user.id === message.user.id) {
                    return true;
                } else {
                    x.reply({ embeds: [{ title: "Erreur", description: `${x.user} vous ne pouvez pas utliser ces interactions. Vous n'êtes pas l'auteur du message !`, color: client.color }], ephemeral: true })
                    return false;
                }
            },
            time: 600000,
            idle: 30000
        })

        collector.on("collect", async (interaction) => {
        

            const filterMessage = (m) => m.author.id == message.user.id && !m.author.bot

            if(interaction.isSelectMenu()){
                if(interaction.customId === "currency"){
                    if(interaction.values[0] === "add"){
                        interaction.deferUpdate()
                    const question = await interaction.channel.send({
                        embeds: [{
                            description: "Combien de coins voulez vous ajouter ?",
                            color: client.color
                        }]
                    })
                    const response = await question.channel.awaitMessages({filterMessage, max: 1, time: 60000, errors: ['time']})
                    const newPseudo = response.first().content
                    await client.db.add(`users.${user}.coins`, newPseudo)
                    await question.delete()
                    await response.first().delete()
                    let newMxssiveUsername = (await client.db.get(`users.${user}.mxssive`))
                    let newMxssiveFTN = (await client.db.get(`users.${user}.fortnite`))
                    let newMxssiveBalance = (await client.db.get(`users.${user}.coins`))
                    let newEmbed = new Discord.MessageEmbed()
                    .setTitle("Modification du compte Mxssive")
                    .setDescription(`
__**Compte Mxssive de <@${user}>**__ :
Pseudo Mxssive : ${newMxssiveUsername}
Pseudo Fortnite : ${newMxssiveFTN}
Solde : ${newMxssiveBalance} MxssiveCoins <a:coins:1246850429514416200>

Utilisez le menu ci-dessous pour modifier des informations sur le compte Mxssive de ${userPing.user}
                    `)
                    .setColor(client.color)
                    .setFooter({text : "Mxssive - Modification de compte", iconURL : client.user.displayAvatarURL({dynamic : true})})
                    await interaction.message.edit({embeds : [newEmbed], components : [editbtn]})
                    }
                    if(interaction.values[0] === "remove"){
                        interaction.deferUpdate()
                    const question = await interaction.channel.send({
                        embeds: [{
                            description: "Combien de coins voulez vous retirer ?",
                            color: client.color
                        }]
                    })
                    const response = await question.channel.awaitMessages({filterMessage, max: 1, time: 60000, errors: ['time']})
                    const newPseudo = response.first().content
                    await client.db.sub(`users.${user}.coins`, newPseudo)
                    await question.delete()
                    await response.first().delete()
                    let newMxssiveUsername = (await client.db.get(`users.${user}.mxssive`))
                    let newMxssiveFTN = (await client.db.get(`users.${user}.fortnite`))
                    let newMxssiveBalance = (await client.db.get(`users.${user}.coins`))
                    let newEmbed = new Discord.MessageEmbed()
                    .setTitle("Modification du compte Mxssive")
                    .setDescription(`
__**Compte Mxssive de <@${user}>**__ :
Pseudo Mxssive : ${newMxssiveUsername}
Pseudo Fortnite : ${newMxssiveFTN}
Solde : ${newMxssiveBalance} MxssiveCoins <a:coins:1246850429514416200>

Utilisez le menu ci-dessous pour modifier des informations sur le compte Mxssive de ${userPing.user}
                    `)
                    .setColor(client.color)
                    .setFooter({text : "Mxssive - Modification de compte", iconURL : client.user.displayAvatarURL({dynamic : true})})
                    await interaction.message.edit({embeds : [newEmbed], components : [editbtn]})
                    }
                }
            }
            if(interaction.isButton()) {
                if(interaction.customId === "pseudo") {
                    interaction.deferUpdate()
                    const question = await interaction.channel.send({
                        embeds: [{
                             description: "Quel est le nouveau pseudo Mxssive ?",
                                color: client.color
                        }]
                    })
                    const response = await question.channel.awaitMessages({filterMessage, max: 1, time: 60000, errors: ['time']})
                    const newPseudo = response.first().content
                    await client.db.set(`users.${user}.mxssive`, newPseudo)
                    await question.delete()
                    await response.first().delete()
                    let newMxssiveUsername = (await client.db.get(`users.${user}.mxssive`))
                    let newMxssiveFTN = (await client.db.get(`users.${user}.fortnite`))
                    let newMxssiveBalance = (await client.db.get(`users.${user}.coins`))
                    let newEmbed = new Discord.MessageEmbed()
                    .setTitle("Modification du compte Mxssive")
                    .setDescription(`
__**Compte Mxssive de <@${user}>**__ :
Pseudo Mxssive : ${newMxssiveUsername}
Pseudo Fortnite : ${newMxssiveFTN}
Solde : ${newMxssiveBalance} MxssiveCoins <a:coins:1246850429514416200>

Utilisez le menu ci-dessous pour modifier des informations sur le compte Mxssive de ${userPing.user}
                    `)
                    .setColor(client.color)
                    .setFooter({text : "Mxssive - Modification de compte", iconURL : client.user.displayAvatarURL({dynamic : true})})
                    await interaction.message.edit({embeds : [newEmbed], components : [editbtn]})
                }
                if(interaction.customId === "fortnite") {
                    interaction.deferUpdate()
                    const question = await interaction.channel.send({
                        embeds: [{
                             description: "Quel est le nouveau pseudo Fortnite ?",
                                color: client.color
                        }]
                    })
                    const response = await question.channel.awaitMessages({filterMessage, max: 1, time: 60000, errors: ['time']})
                    const newPseudo = response.first().content
                    await client.db.set(`users.${user}.fortnite`, newPseudo)
                    await question.delete()
                    await response.first().delete()
                    let newMxssiveUsername = (await client.db.get(`users.${user}.mxssive`))
                    let newMxssiveFTN = (await client.db.get(`users.${user}.fortnite`))
                    let newMxssiveBalance = (await client.db.get(`users.${user}.coins`))
                    let newEmbed = new Discord.MessageEmbed()
                    .setTitle("Modification du compte Mxssive")
                    .setDescription(`
__**Compte Mxssive de <@${user}>**__ :
Pseudo Mxssive : ${newMxssiveUsername}
Pseudo Fortnite : ${newMxssiveFTN}
Solde : ${newMxssiveBalance} MxssiveCoins <a:coins:1246850429514416200>

Utilisez le menu ci-dessous pour modifier des informations sur le compte Mxssive de ${userPing.user}
                    `)
                    .setColor(client.color)
                    .setFooter({text : "Mxssive - Modification de compte", iconURL : client.user.displayAvatarURL({dynamic : true})})
                    await interaction.message.edit({embeds : [newEmbed], components : [editbtn]})
                }
                
                if(interaction.customId === "solde") {
                    interaction.deferUpdate()
                    interaction.message.edit({components : [editbtn, currency]})
                }
            }

        })
    },
});