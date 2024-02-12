/** @format */

const Discord = require("discord.js");

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message | Discord.Interaction} message
 * @param {string[]} args
 */

function RunFunction(client, message, args) {}

class Command {
  /**
   * @typedef {{name: string, description: string, use: string, perm: bigint, category: string, run: RunFunction}}
   * @param {CommandOptions} options
   */
  constructor(options) {
    this.name = options.name;
    this.description = options.description;
    this.use = options.use;
    this.perm = options.perm;
    this.category = options.category;
    this.run = options.run;
    this.ownerOnly = options.ownerOnly
  }
}

module.exports = Command;
