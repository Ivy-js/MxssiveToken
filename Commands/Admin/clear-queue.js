const Discord = require("discord.js");
const Command = require("../../Base/Command");
var color = require("colors-cli/safe");

module.exports = new Command({
  name: "clear-queue",
  description: "Permet de vider la queue aléatoire.",
  use: "clear-queue",
  perm: Discord.Permissions.FLAGS.ADMINISTRATOR, // Permet uniquement aux administrateurs d'utiliser cette commande
  category: "Admin",
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
    const queue = await db.get('matchmaking.queue') || [];

    // Mettre à jour l'état de tous les utilisateurs dans la base de données
    const users = await db.all(); // Récupère tous les utilisateurs
    for (const entry of users) {
      if (entry.id.startsWith('users.') && entry.value.inMatch) {
        await db.set(`${entry.id}.inMatch`, false);
      }
    }

    // Vider la file d'attente
    await db.set('matchmaking.queue', []);

    message.reply({
      content: '> ✅ La queue et tous les matchs en cours ont été vidés et annulés avec succès.',
      ephemeral: true,
    });
  },
});
