const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { SlashCommandBuilder, SlashCommandIntegerOption } = require("@discordjs/builders")
const { Routes } = require('discord-api-types/v10')
require("colors")
const config = require("../Config/config")

module.exports = async bot => {

    let commands = [
        new SlashCommandBuilder() 
        .setName("start")
        .setDescription("Permet de créer ton compte Mxssive"),
        new SlashCommandBuilder()
        .setName("compte")
        .setDescription("Permet de récupérer les informations de ton compte Mxssive"),
        new SlashCommandBuilder()
        .setName("editaccount")
        .setDescription("Permet à un admin de modifier un compte Mxssive")
        .addUserOption(option => option.setName("user").setDescription("L'utilisateur à modifier").setRequired(true)),
        new SlashCommandBuilder()
        .setName("start-token")
        .setDescription("Permet de démarrer un Token Mxssive"),
        new SlashCommandBuilder()
        .setName("join-queue")
        .setDescription("Permet de rejoindre la queue aléatoire."),
        new SlashCommandBuilder()
        .setName("clear-queue")
        .setDescription("Permet de vider la queue aléatoire."),
        new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Permet d'eval du code")
        .addStringOption(option => option.setName(`code`).setDescription(`Le code a eval`).setRequired(true))


    ];
    commands.push.toString(commands)
    
    const rest = new REST({version: '10'}).setToken(config.token);

    await rest.put(Routes.applicationCommands(bot.user.id), {body: commands});
    console.log("[(/)]".cyan + " chargés avec succès".white);
   
}; 