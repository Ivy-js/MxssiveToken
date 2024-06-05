const Discord = require("discord.js");
const Command = require("../../Base/Command");
var color = require("colors-cli/safe");
const BetterMarkdown = require("discord-bettermarkdown");

function generateUniqueId() {
  return `MX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

module.exports = new Command({
  name: "join-queue",
  description: "Permet de rejoindre la queue aléatoire.",
  use: "join-queue",
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
    const db = client.db;
    const userId = message.user.id;
    const queue = await db.get('matchmaking.queue') || [];
    const guildId = message.guild.id;
    const guild = message.guild;

    if (await client.db.get(`users.${userId}.elo`) === undefined) {
      client.db.set(`users.${userId}.elo`, 150);
    }
    if (await client.db.get(`users.${userId}.inMatch`)) {
      return message.reply({
        content: `> :x: Vous êtes déjà dans un match en cours`,
        ephemeral: true,
      });
    }

    if (queue.includes(userId)) {
      return message.reply({
        content: '> :x: Vous êtes déjà en recherche de partie.',
        ephemeral: true,
      });
    }

    queue.push(userId);
    await db.set('matchmaking.queue', queue);

    message.reply({
      content: '> Vous avez rejoint la queue',
      ephemeral: true,
    });

    if (queue.length >= 2) {
      const player1 = queue.shift();
      const player2 = queue.shift();
      await db.set('matchmaking.queue', queue);

      const player1User = await client.users.fetch(player1);
      const player2User = await client.users.fetch(player2);

      const MxId = generateUniqueId();

      await db.set(`users.${player1}.inMatch`, true);
      await db.set(`users.${player2}.inMatch`, true);
      await db.set(`${MxId}.player1`, player1);
      await db.set(`${MxId}.player2`, player2);

      let channel = await guild.channels.create(`${player1User.username}vs${player2User.username}`, {
        type: "GUILD_TEXT",
        permissionOverwrites: [
          {
            id: guildId,
            deny: "VIEW_CHANNEL",
          },
          {
            id: player1User.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          },
          {
            id: player2User.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          },
        ],
      });

      let embed = new Discord.MessageEmbed()
        .setTitle(`${player1User.username} vs ${player2User.username}`)
        .addFields([
          { name: `Joueur N°1`, value: `${player1User.username} \`(${await client.db.get(`users.${player1User.id}.elo`)}✨)\``, inline: true },
          { name: `Joueur N°2`, value: `${player2User.username} \`(${await client.db.get(`users.${player2User.id}.elo`)}✨)\``, inline: true }
        ])
        .setColor(client.color);

      let buttons = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId(`${MxId}_win`)
          .setLabel(`Win`)
          .setStyle('SECONDARY'),
        new Discord.MessageButton()
          .setCustomId(`${MxId}_loose`)
          .setLabel(`Loose`)
          .setStyle('SECONDARY'),
        new Discord.MessageButton()
          .setCustomId(`${MxId}_leave`)
          .setLabel(`Leave`)
          .setStyle('DANGER')
      );

      let rules = new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId(`rules`)
          .setPlaceholder("Cliquez pour voir les règles")
          .addOptions([
            {
              label: `Règles Rematch No Mental`,
              value: "nomental",
            },
            {
              label: `Règles Rematch Mental`,
              value: "mental",
            },
            {
              label: `Règles Pork`,
              value: "pork",
            }
          ])
          .setMaxValues(1)
      );

      channel.send({ content: `${player1User} vs ${player2User}`, embeds: [embed], components: [buttons, rules] });
      player1User.send({ embeds: [embed], flags: "SUPPRESS_NOTIFICATIONS" });
      player2User.send({ embeds: [embed], flags: "SUPPRESS_NOTIFICATIONS" });
    }
  },
});
