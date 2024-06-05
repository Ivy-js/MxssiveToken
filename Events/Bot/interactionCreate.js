const Event = require("../../Base/Event")
const Discord = require("discord.js")
const BetterMarkdown = require("discord-bettermarkdown");
const { randomElo } = require("../../Functions/randomElo");
const allowedUserIDs = {
    ivy: "1114616280138395738",
    evy : "1197290141350383636"
};
require("colors")

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

    if(interaction.isButton()){
        const [MxId, action] = interaction.customId.split('_');
        if(action === "win"){
            let clicker = interaction.user; 

            if (clicker.id === await client.db.get(`${MxId}.player1`)) {
                let winelo = randomElo(1.25);
                let player2 = await client.users.fetch(await client.db.get(`${MxId}.player2`));
                let embedWin = new Discord.MessageEmbed()
                    .setTitle('Match Terminé !')
                    .setDescription(`
                    **Vainqueur :** ${clicker} (\`📈 +${winelo}\`)
                    **Perdant: ** ${(await player2)} (\`📉 -${winelo}\`)
                    `)
                    .setColor(client.color)
                    .setFooter({text: `Ce lobby sera supprimé dans 15s.`});
            
                let LogsEmbed = new Discord.MessageEmbed()
                    .setTitle('Match Terminé !')
                    .setDescription(`
                    **Vainqueur :** ${clicker} (\`📈 +${winelo}\`)
                    **Perdant: ** ${(await player2)} (\`📉 -${winelo}\`)
            
            
                    *ID Du Match : ${MxId}*
                    `)
                    .setColor(client.color)
                    .setFooter({text: `Ce lobby sera supprimé dans 15s.`});
            
                // 1. On retire de la queue
                await client.db.set(`users.${clicker.id}.inMatch`, false);
                await client.db.set(`users.${player2.id}.inMatch`, false);
                console.log(`[QueueAPI] - Removed ID's : ${clicker.id} / ${player2.id} from QueueAPI`.red);
            
                // 2. On ajoute l'élo
                await client.db.add(`users.${clicker.id}.elo`, winelo);
                await client.db.sub(`users.${player2.id}.elo`, winelo);
                console.log(`[EloAPI] - Added [+${winelo}] to ${clicker.username}`.green);
                console.log(`[EloAPI] - Removed [-${winelo}] to ${player2.username}`.red);
            
                // 3. On edit message
                interaction.message.edit({embeds: [embedWin], components: []}).then(async () => {
                    // Delete après 15s + logs
                    setTimeout(async () => {
                        await interaction.channel.delete();
                        await clicker.send({embeds: [LogsEmbed]});
                        await player2.send({embeds: [LogsEmbed]});
            
                        console.log(`[Match ${MxId}] - Winner : ${clicker.username} (+ ${winelo}) | Looser : ${player2.username}(- ${winelo})`);
                    }, 15000);
                });
            
            } else if (clicker.id === await client.db.get(`${MxId}.player2`)) {
                let winelo = randomElo(1.25);
                let player1 = await client.users.fetch(await client.db.get(`${MxId}.player1`));
                let embedWin = new Discord.MessageEmbed()
                    .setTitle('Match Terminé !')
                    .setDescription(`
                    **Vainqueur :** ${clicker} (\`📈 +${winelo}\`)
                    **Perdant: ** ${(await player1)} (\`📉 -${winelo}\`)
                    `)
                    .setColor(client.color)
                    .setFooter({text: `Ce lobby sera supprimé dans 15s.`});
            
                let LogsEmbed = new Discord.MessageEmbed()
                    .setTitle('Match Terminé !')
                    .setDescription(`
                    **Vainqueur :** ${clicker} (\`📈 +${winelo}\`)
                    **Perdant: ** ${(await player1)} (\`📉 -${winelo}\`)
            
            
                    *ID Du Match : ${MxId}*
                    `)
                    .setColor(client.color)
                    .setFooter({text: `Ce lobby sera supprimé dans 15s.`});
            
                // 1. On retire de la queue
                await client.db.set(`users.${clicker.id}.inMatch`, false);
                await client.db.set(`users.${player1.id}.inMatch`, false);
                console.log(`[QueueAPI] - Removed ID's : ${clicker.id} / ${player1.id} from QueueAPI`.red);
            
                // 2. On ajoute l'élo
                await client.db.add(`users.${clicker.id}.elo`, winelo);
                await client.db.sub(`users.${player1.id}.elo`, winelo);
                console.log(`[EloAPI] - Added [+${winelo}] to ${clicker.username}`.green);
                console.log(`[EloAPI] - Removed [-${winelo}] to ${player1.username}`.red);
            
                // 3. On edit message
                interaction.message.edit({embeds: [embedWin], components: []}).then(async () => {
                    // Delete après 15s + logs
                    setTimeout(async () => {
                        await interaction.channel.delete();
                        await clicker.send({embeds: [LogsEmbed]});
                        await player1.send({embeds: [LogsEmbed]});
            
                        console.log(`[Match ${MxId}] - Winner : ${clicker.username} (+ ${winelo}) | Looser : ${player1.username}(- ${winelo})`);
                    }, 15000);
                });
            }
            
            
        }

        if(action === "profil"){
            interaction.deferUpdate();
            let Host = await client.db.get(`Token.${MxId}.hostId`);
            let header = `🔎 | Profil de ${client.users.cache.get(Host).username}`.blue;

            let embed = new Discord.MessageEmbed()
                .setDescription(`
\`\`\`ansi
${header}
\`\`\`
__**Pseudo Mxssive**__ : ${await client.db.get(`users.${Host}.mxssive`)}

__**Pseudo Fortnite**__ : ${await client.db.get(`users.${Host}.fortnite`)}
__**Pseudo Discord**__ : ${client.users.cache.get(Host).username}

**Son Porte-Monnaie** :
__**Solde**__ : ${await client.db.get(`users.${Host}.coins`)} MxssiveCoins <a:coins:1246850429514416200>
            `)
                .setColor(client.color);

            await interaction.user.send({embeds : [embed], ephemeral: true}).catch(() => false);
        }

        if(action === "reset"){
            let user = await client.users.cache.get(interaction.customId.replace(`reset_`, ""));
            interaction.message.edit({embeds : [{description : `La partie a été annulée.`, color: client.color}], components : []});
            await client.db.delete(`users.${user.id}.game`);
            console.log(`Debug : ${await client.db.get(`users.${user.id}.game`)}`);
        }
    }

    if(interaction.isSelectMenu()){
        if(interaction.customId === `rules`){
            if(interaction.values[0] === "nomental"){
                let noMental = new Discord.MessageEmbed()
                    .setTitle(`Règles No Mental. (Rematch)`)
                    .setDescription(`\`\`\`ansi\n${rulesNoMental}\`\`\``)
                    .setColor(client.color);
                interaction.reply({embeds : [noMental], ephemeral: true});
            }
        }
    }

    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        console.log(interaction.commandName);
        if (!interaction.member.permissions.has(new Discord.Permissions(command.perm)) && command.perm !== Discord.Permissions.FLAGS.VIEW_CHANNEL ) return interaction.reply("Vous n'avez pas la permission requise pour exécuter la commande.");
        if (command.ownerOnly) {
            const userIsAllowed = Object.values(allowedUserIDs).includes(interaction.user.id);
            if (!userIsAllowed) {
                return interaction.reply({ content: "Vous devez être développeur.", ephemeral: true });
            }
        }
        command.run(client, interaction, interaction.options, client.db);
    }
});
