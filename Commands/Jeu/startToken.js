const Discord = require("discord.js");
const Command = require("../../Base/Command");
var color = require("colors-cli/safe");
const BetterMarkdown = require("discord-bettermarkdown");

module.exports = new Command({
  name: "start-token",
  description: "Permet de démarrer un Token Mxssive",
  use: "start-token",
  perm: Discord.Permissions.FLAGS.VIEW_CHANNEL,
  category: "User",
  /**
   * @param {import("../../Base/Client")} client
   * @param {Discord.Message} message
   * @param {String[]} args
   * @returns {Promise<void>}
   * @example
   *
   */

  async run(client, message, args) {

    

    if(await client.db.get(`users.${message.user.id}.game`) !== undefined){
      let header = `❌ | Une partie est déja en cours. Souhaitez vous l'annuler ?`.red

      let cancel = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
        .setLabel("Annuler")
        .setStyle("DANGER")
        .setCustomId(`reset_${message.user.id}`)
      )
      let embed = new Discord.MessageEmbed()
      .setDescription(`
\`\`\`ansi
${header}
\`\`\`
      `)
      .setColor(client.color)

      return message.reply({embeds : [embed], components: [cancel]})
    } else {
      let MxId = client.createId("MXID", 5);
    let header = `🔮 | Choississez le mode de Token | Votre MxID : ${MxId}`
      .blue;
    let lobbyREA = `👥 | Lobby #${MxId} | Realistic`.yellow;
    let lobbyZW = `👥 | Lobby #${MxId} | Zone Wars`.yellow;
    let lobbyBF = `👥 | Lobby #${MxId} | Build Fight`.yellow;
    let mode = new Discord.MessageActionRow().addComponents(
      new Discord.MessageSelectMenu()
        .setCustomId(`${message.user.id}_mode`)
        .setMaxValues(1)
        .setOptions([
          {
            label: "BF 1v1",
            value: `bf-1v1`,
          },
          {
            label: "Realistic 1v1",
            value: `rea-1v1`,
          },
          {
            label: "Zone Wars 1v1",
            value: `zw-1v1`,
          },
        ])
        .setPlaceholder("Choisissez le mode de jeu")
    );

    let btn = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId(`${MxId}_win`)
        .setStyle("SUCCESS")
        .setLabel("Win"),
      new Discord.MessageButton()
        .setCustomId(`${MxId}_loose`)
        .setStyle("SECONDARY")
        .setLabel("Loose"),
      new Discord.MessageButton()
        .setCustomId(`${MxId}_cancel`)
        .setStyle("DANGER")
        .setLabel("Cancel")
    );

    let Join = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setStyle("PRIMARY")
        .setLabel("Join")
        .setCustomId(`${MxId}_join`),
      new Discord.MessageButton()
        .setStyle("SECONDARY")
        .setLabel("Voir le profil")
        .setCustomId(`${MxId}_profil`)
    );

    let embed = new Discord.MessageEmbed()
      .setDescription(`\`\`\`ansi\n${header} \`\`\``)
      .setColor(client.color)
      .setFooter({ text: "Mxssive On Top" });

    let msg = await message.reply({ embeds: [embed], components: [mode] });

    const collector = message.channel.createMessageComponentCollector({
      time: 600000,
      idle: 30000,
    });

    collector.on("collect", async (x) => {
      const filterMessage = (m) =>
        m.author.id == message.user.id && !m.author.bot;
      if (x.isSelectMenu()) {
        x.deferUpdate();
        let balance = client.db.get(`users.${x.user.id}.coins`);
        if (x.customId === `${x.user.id}_mode`) {
          if (x.values[0] === "bf-1v1") {
            client.db.set(`Token.${MxId}.mode`, "bf");
            let question = await x.channel.send({
              embeds: [
                {
                  description: `Combien de Coins voulez vous jouer ? (Votre balance : ${await client.db.get(
                    `users.${x.user.id}.coins`
                  )})`,
                },
              ],
            });
            let reponse = (
              await message.channel.awaitMessages({ filterMessage, max: 1 })
            ).first();
            question.delete();
            reponse.delete();
            if (isNaN(reponse))
              return x.message.channel.send({
                embeds: [
                  {
                    description: `${reponse} n'est pas un nombre!`,
                    color: client.color,
                  },
                ],
              });
            if (reponse.content > balance)
              return x.message.channel.send({
                embeds: [
                  {
                    description: `Vous n'avez pas assez de coins`,
                    color: client.color,
                  },
                ],
              });
            client.db.set(`Token.${MxId}.player1.coins`, reponse.content);
            let embed = new Discord.MessageEmbed()
              .setDescription(`\`\`\`ansi\n${lobbyBF}\`\`\``)
              .setColor(client.color)
              .setFooter({ text: `ID : ${MxId}` });
            x.message.edit({ embeds: [embed], components: [Join] });
            client.db.set(`Token.${MxId}.hostId`, x.user.id);
            client.db.set(`users.${x.user.id}.game`, MxId);
          }
        }
      }
      if(x.isButton()){
        x.deferUpdate()

        if(x.customId === `${MxId}_join`){
            if(!client.db.has(`Token.${MxId}.player2`)) return x.user.send({embeds : [{description : `Le lobby est complet.`, color: client.color}], ephemeral:true})
            if(x.user.id === await client.db.get(`Token.${MxId}.hostId`)) return x.user.send({embeds: [{description : `Vous êtes l'hébergeur de la partie.`, color: client.color}], ephemeral : true})
            let lobbyHeader = `🔫 1v1 Build Fight | ${MxId} | Joueur 1 : ${client.users.cache.get(await client.db.get(`Token.${MxId}.hostId`)).username} | Joueur 2 : ${x.user.username}`
            client.db.set(`Token.${MxId}.player2`, x.user.id);
            let embed1 = new Discord.MessageEmbed()
               .setDescription(`
\`\`\`ansi
${lobbyBF}
\`\`\`
`)
               .setColor(client.color);
            let embed2 = new Discord.MessageEmbed()
            .setDescription(`
**Un combat va commencer** 
\`\`\`ansi
${lobbyHeader}
\`\`\`        
            `)
            .setColor(client.color)

            x.message.edit({embeds : [embed1, embed2], components : [btn]})
            client.users.cache.get(await client.db.get(`Token.${MxId}.hostId`)).send({embeds : [
                {
                    description : `
                    Un Match a été trouvé !
                    Vous allez affronter ${await client.db.get(`users.${await client.db.get(`Token.${MxId}.player2`)}.mxssive`)}

                    Pseudo Fortnite : \`${await client.db.get(`users.${await client.db.get(`Token.${MxId}.player2`)}.fortnite`)}\` 
                    Ajoutez le.
                    `
                }
            ]})

            x.user.send({embeds : [
                {
                    description : `
                    Un Match a été trouvé !
                    Vous allez affronter ${await client.db.get(`users.${await client.db.get(`Token.${MxId}.hostId`)}.mxssive`)}

                    Pseudo Fortnite : \`${await client.db.get(`users.${await client.db.get(`Token.${MxId}.hostId`)}.fortnite`)}\` 
                    Ajoutez le.
                    `
                }
            ]})

        }
      }
    });
    }
  },
});
