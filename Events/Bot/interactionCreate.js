const Event = require("../../Base/Event");
const Discord = require("discord.js");
const BetterMarkdown = require("discord-bettermarkdown");
const { randomElo } = require("../../Functions/randomElo");
const allowedUserIDs = {
    ivy: "1114616280138395738",
    evy: "1197290141350383636"
};
require("colors");

module.exports = new Event("interactionCreate", async (client, interaction) => {

    let rulesNoMental = `Règlement Rematch No Mental  :
🔴 Interdiction :

Deidara interdite.
Interdit de casser + de 50% du BF.
Interdit de reset les builds si on se fait casser. (vous devez remonter au grappin 1 étage en dessous de votre adversaire.)
Interdit de reset si vous tombez tout seul. (vous remontez avec les builds ou en grappin.)
Interdit de se boxer + de 5 secondes.
Interdit de rester + de 10 secondes sur la même hauteur sans rien faire.
Éviter d'avoir énormément de hauteur sur son adversaire.
    
🟢 Autorisation :
    
Cassage autorisé au bout de 3 90.
Speedy maximum 3.`;
    let rulesMental = `Règlement Rematch Mental   :    
Rematch Mental :
🔴 Interdiction :

Interdit de casser + de 50% du BF.
Interdit de reset les builds si on se fait casser. (vous devez remonter au grappin 1 étage en dessous de votre adversaire.)
Interdit de reset / remonter au grappin si vous tombez tout seul. (vous remontez avec les builds.)
Interdit de se boxer + de 15 secondes.

🟢 Autorisation :

Deidara autorisée.
Speedy autorisé.
Cassage autorisé au bout de 3 90.
Autorisé de monter autant qu'on veut.
Autorisé de rester à la même hauteur le temps qu'on le souhaite.`;

    let rulesPork = `
🔴 Interdiction :

Deidara interdite.
Speedy interdite.
Interdit de reset les builds si on se fait casser. (vous devez remonter au grappin 1 étage en dessous de votre adversaire.)
Interdit de reset / remonter au grappin si vous tombez tout seul. (vous remontez avec les builds.)
Interdit de se boxer + de 5 secondes.
Interdit de rester + de 5 secondes sur la même hauteur sans rien faire.
Spam AR abusif interdit.
    
🟢 Autorisation : Rien.`;

    if (interaction.isButton()) {
        console.log(interaction.customId)
        const [MxId, action] = interaction.customId.split('_');
        const db = client.db;

        if (action === "win") {
            let clicker = interaction.user;
            let confirmButton;

            if (clicker.id === await db.get(`${MxId}.player1`)) {
                let player1 = await client.users.fetch(await db.get(`${MxId}.player1`));
                let player2 = await client.users.fetch(await db.get(`${MxId}.player2`));

                confirmButton = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`${MxId}_confirm_win_p2`)
                        .setLabel(`Confirmer la Victoire`)
                        .setStyle('PRIMARY')
                );
                let embedConfirmation = new Discord.MessageEmbed()
                    .setTitle('Confirmation de la Victoire')
                    .setDescription(`${clicker} a cliqué sur Win. ${player2}, veuillez confirmer la victoire.`)
                    .setColor(client.color);

                // Stocker l'ID du joueur qui a cliqué sur "Win" en tant que gagnant potentiel
                await db.set(`${MxId}.potentialWinner`, player1.id);
                
                interaction.message.edit({ embeds: [embedConfirmation], components: [confirmButton] });

            } else if (clicker.id === await db.get(`${MxId}.player2`)) {
                let player1 = await client.users.fetch(await db.get(`${MxId}.player1`));
                let player2 = await client.users.fetch(await db.get(`${MxId}.player2`));
                confirmButton = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`${MxId}_confirm_win_p1`)
                        .setLabel(`Confirmer la Victoire`)
                        .setStyle('PRIMARY')
                );
                let embedConfirmation = new Discord.MessageEmbed()
                    .setTitle('Confirmation de la Victoire')
                    .setDescription(`${clicker} a cliqué sur Win. ${player1}, veuillez confirmer la victoire.`)
                    .setColor(client.color);

                // Stocker l'ID du joueur qui a cliqué sur "Win" en tant que gagnant potentiel
                await db.set(`${MxId}.potentialWinner`, player2.id);

                interaction.message.edit({ embeds: [embedConfirmation], components: [confirmButton] });
            }
        }

        if (interaction.customId.includes("confirm_win")) {
            let confirmPlayer = interaction.customId.split('_')[2];
            let clicker = interaction.user;
            let player1Id = await db.get(`${MxId}.player1`);
            let player2Id = await db.get(`${MxId}.player2`);

            // Récupérer l'ID du gagnant potentiel stocké précédemment
            let winnerId = await db.get(`${MxId}.potentialWinner`);
            let loserId = winnerId === player1Id ? player2Id : player1Id;

            let winner = await client.users.fetch(winnerId);
            let loser = await client.users.fetch(loserId);

            let winelo = randomElo(1.25);
            let embedWin = new Discord.MessageEmbed()
                .setTitle('Match Terminé !')
                .setDescription(`
                **Vainqueur :** ${winner} (\`📈 +${winelo}\`)
                **Perdant: ** ${loser} (\`📉 -${winelo}\`)
                `)
                .setColor(client.color)
                .setFooter({ text: `Ce lobby sera supprimé dans 15s.` });

            let LogsEmbed = new Discord.MessageEmbed()
                .setTitle('Match Terminé !')
                .setDescription(`
                **Vainqueur :** ${winner} (\`📈 +${winelo}\`) [\`${await client.db.get(`users.${winnerId}.elo`)}✨\`]
                **Perdant: ** ${loser} (\`📉 -${winelo}\`) [\`${await client.db.get(`users.${loserId}.elo`)}✨\`]
                *ID Du Match : ${MxId}*
                `)
                .setColor(client.color)
                .setFooter({ text: `Ce lobby sera supprimé dans 15s.` });

            await db.set(`users.${winner.id}.inMatch`, false);
            await db.set(`users.${loser.id}.inMatch`, false);
            await db.add(`users.${winner.id}.elo`, winelo);
            await db.sub(`users.${loser.id}.elo`, winelo);

            interaction.message.edit({ embeds: [embedWin], components: [] }).then(async () => {
                setTimeout(async () => {
                    await interaction.channel.delete();
                    await winner.send({ embeds: [LogsEmbed] });
                    await loser.send({ embeds: [LogsEmbed] });
                }, 15000);
            });
        }

        if (action === "profil") {
            interaction.deferUpdate();
            let Host = await db.get(`Token.${MxId}.hostId`);
            let header = `🔎 | Profil de ${client.users.cache.get(Host).username}`.blue;

            let embed = new Discord.MessageEmbed()
                .setDescription(`
\`\`\`ansi
${header}
\`\`\`
__**Pseudo Mxssive**__ : ${await db.get(`users.${Host}.mxssive`)}

__**Pseudo Fortnite**__ : ${await db.get(`users.${Host}.fortnite`)}
__**Pseudo Discord**__ : ${client.users.cache.get(Host).username}

**Son Porte-Monnaie** :
__**Solde**__ : ${await db.get(`users.${Host}.coins`)} MxssiveCoins <a:coins:1246850429514416200>
                `)
                .setColor(client.color);

            await interaction.user.send({ embeds: [embed], ephemeral: true }).catch(() => false);
        }

        if (action === "reset") {
            let user = await client.users.cache.get(interaction.customId.replace(`reset_`, ""));
            interaction.message.edit({ embeds: [{ description: `La partie a été annulée.`, color: client.color }], components: [] });
            await db.delete(`users.${user.id}.game`);
        }
    }

    if (interaction.isSelectMenu()) {
        if (interaction.customId === `rules`) {
            if (interaction.values[0] === "nomental") {
                let noMental = new Discord.MessageEmbed()
                    .setTitle(`Règles No Mental. (Rematch)`)
                    .setDescription(`\`\`\`ansi\n${rulesNoMental}\`\`\``)
                    .setColor(client.color);
                interaction.reply({ embeds: [noMental], ephemeral: true });
            }
        }
    }

    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!interaction.member.permissions.has(new Discord.Permissions(command.perm)) && command.perm !== Discord.Permissions.FLAGS.VIEW_CHANNEL) return interaction.reply("Vous n'avez pas la permission requise pour exécuter la commande.");
        if (command.ownerOnly) {
            const userIsAllowed = Object.values(allowedUserIDs).includes(interaction.user.id);
            if (!userIsAllowed) {
                return interaction.reply({ content: "Vous devez être développeur.", ephemeral: true });
            }
        }
        command.run(client, interaction, interaction.options, client.db);
    }
});
