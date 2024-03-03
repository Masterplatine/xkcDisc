// discord.js API
const { SlashCommandBuilder } = require('discord.js');

// Common definitions
const xkcdCommon = require('../xkcd_common.js');

// TODO write command summary and parameter here. Maybe use doxygen style

module.exports = {
  data: new SlashCommandBuilder()
  .setName('xkcd')
  .setDescription('Post xkcd comic')
  .addIntegerOption(option =>
    option
      .setName('id')
      .setMinValue(1)
      .setDescription('ID of comic to post. If omitted, post latest comic.')),
  async execute(interaction) {
    // Get number option
    const comicId = interaction.options.getInteger('id') ?? null;

    const comicJson = await xkcdCommon.getComicJson(comicId);

    const reply = xkcdCommon.buildReplyMessage(comicJson);

    // Reply
    await interaction.reply(reply);
  },
};