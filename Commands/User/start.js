const Discord = require("discord.js");

const Command = require("../../Base/Command");
var color = require("colors-cli/safe")

module.exports = new Command({
    name: "start",
    description: "Permet de créer ton compte Mxssive",
    use: "start",
    perm: Discord.Permissions.FLAGS.VIEW_CHANNEL,
    category: "User",


    async run(client, message, args) {
        if((await client.db.get(`users.${message.user.id}.validated`)) === true) return message.reply({embeds : [{title : "Erreur", description : "Tu as déjà un compte Mxssive !", color : client.color}]})
            const StartEmbed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setTitle("Création de ton compte Mxssive")
                .setDescription(`
Salut ! Je suis ${client.user} ! Et je vais t'aider à créer ton compte Mxssive ! 

Pour commencer, tu dois me donner ton pseudo Mxssive. Un pseudo qui peut être différent de ton pseudo Discord.
Utilise le menu ci-dessous pour me donner ton pseudo Mxssive. 
                `)
                .setFooter({text : "Mxssive - Création de compte", iconURL : client.user.displayAvatarURL({dynamic : true})})

            const PseudoRow = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId("PseudoRow")
                .setMaxValues(1)
                .setPlaceholder("Mxssive - Création de compte")
                .setOptions([{
                    label: "Pseudo Mxssive",
                    value: "pseudo",
                    description: "Ton pseudo Mxssive",
                    emoji: "🎮"
                }])
            )

            const FtnRow = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId("FtnRow")
                .setMaxValues(1)
                .setPlaceholder("Mxssive - Création de compte")
                .setOptions([{
                    label: "Pseudo Fortnite",
                    value: "fortnite",
                    description: "Ton pseudo Fortnite",
                    emoji: "🎮"
                }])
            )
            const BtnEnd = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                .setCustomId("EndRow")
                .setLabel("Valider")
                .setStyle("SUCCESS")
            )


            message.reply({embeds : [StartEmbed], components : [PseudoRow]})

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
                if(interaction.isSelectMenu()) {
                    if(interaction.customId === "PseudoRow") {
                        interaction.deferUpdate()
                        const question = await interaction.channel.send({
                            embeds: [{
                                 description: "Quel est votre pseudo Mxssive ?",
                                 color: client.color
                            }]
                       })
                       const reponse = (await message.channel.awaitMessages({
                            filterMessage,
                            max: 1
                       })).first()
                       question.delete()
                       reponse.delete()

                       client.db.set(`users.${reponse.author.id}.mxssive`, reponse.content)
                       console.log(color.x105(`[Mxssive - Création de compte] - ${reponse.author.tag} a choisi le pseudo ${reponse.content}`))

                       const FtnEmbed = new Discord.MessageEmbed()
                       .setColor(client.color)
                       .setTitle("Création de ton compte Mxssive")
                       .setDescription(`
Alors comme ca tu t'appelles ${reponse.content} sur Mxssive ? J'espère que tu vas bien tryhard !
Maiiis avant tout, passe moi ton pseudo sur Fortnite, histoire que tu fasses connaître un minimum.
                       `)
                       .setFooter({text : "Mxssive - Création de compte", iconURL : client.user.displayAvatarURL({dynamic : true})})
                       
                       interaction.message.edit({embeds : [FtnEmbed], components : [FtnRow]})
                    }
                    if(interaction.customId === "FtnRow") {
                        interaction.deferUpdate()
                        const question = await interaction.channel.send({
                            embeds: [{
                                 description: "Quel est votre pseudo Fortnite ?",
                                 color: client.color
                            }]
                       })
                       const reponse = (await message.channel.awaitMessages({
                            filterMessage,
                            max: 1
                       })).first()
                       question.delete()
                       reponse.delete()

                       client.db.set(`users.${reponse.author.id}.fortnite`, reponse.content)
                       console.log(color.x105(`[Mxssive - Création de compte] - ${reponse.author.tag} a choisi le pseudo ${reponse.content}`))

                       const EndEmbed = new Discord.MessageEmbed()
                       .setColor(client.color)
                       .setTitle("Création de ton compte Mxssive")
                       .setDescription(`
Bon, ok ! Récapitulons :
- Ton pseudo Mxssive : ${(await client.db.get(`users.${reponse.author.id}.mxssive`))}
- Ton pseudo Fortnite : ${(await client.db.get(`users.${reponse.author.id}.fortnite`))}

T'es ok avec ca ? Si oui, clique sur le bouton ci-dessous pour valider ton compte !
                       `)
                       .setFooter({text : "Mxssive - Création de compte", iconURL : client.user.displayAvatarURL({dynamic : true})})
                       
                       interaction.message.edit({embeds : [EndEmbed], components : [BtnEnd]})
                    }
                }
                if(interaction.isButton()){
                    if(interaction.customId === "EndRow"){
                        interaction.deferUpdate()
                        client.db.set(`users.${interaction.user.id}.validated`, true)
                        client.db.add(`users.${interaction.user.id}.coins`, 250)
                        client.db.set(`users.${interaction.user.id}.created`, interaction.createdTimestamp)

                        const userEmbed = new Discord.MessageEmbed()
                        .setColor(client.color)
                        .setTitle("Création de ton compte Mxssive")
                        .setDescription(`
Ton compte est désormais validé chez Mxssive ! Tu peux désormais profiter de toutes les fonctionnalités de Mxssive !
                        `)
                        .setFooter({text : "Mxssive - Création de compte", iconURL : client.user.displayAvatarURL({dynamic : true})})
                        interaction.message.edit({embeds : [userEmbed], components : []})
                    }
                }
            })
        
    },
});