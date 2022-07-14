const { Client, ClientOptions, Collection, Intents } = require('discord.js');

/**
 * Extension of the discord.js Client class to include extra features. This class includes the
 * addition of:
 *  - message commands
 *  - slash commands
 *  - select menus
 *  - cooldowns
 *  - audio queue
 * @returns {import('../typedefs/discord').DiscordClient} Discord client
 */
class DiscordClient extends Client {
  /**
   * Initialise DiscordClient class.
   * @param {ClientOptions} options - client options
   */
  constructor(options) {
    super(options);

    this.messageCommands = new Collection();
    this.slashCommands = new Collection();
    this.selectMenus = new Collection();
    this.cooldowns = new Collection();
    this.queue = new Map();
  }
}

module.exports = DiscordClient;
