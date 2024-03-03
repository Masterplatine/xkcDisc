// discord.js API
const { SlashCommandBuilder } = require('discord.js');

// Common definitions
const xkcdCommon = require('../xkcd_common.js');

// TODO write command summary and parameter here. Maybe use doxygen style

module.exports = {
  data: new SlashCommandBuilder()
  .setName('xkcdstartposting')
  .setDescription('Set current channel as the place to post new comics. Checks for new comics every 4 hours.'),
  async execute(interaction) {
    // Set current channel as the automatic posting channel
    xkcdCommon.setPostingChannel(interaction.channel.id);

    // Fetch last comic ID
    const comicJson = await xkcdCommon.getComicJson();

    // Store comic ID
    xkcdCommon.setPostingLastID(comicJson.num);

    // Start interval
    xkcdCommon.startAutomaticPosting();

    // Build reply message
    const reply = 'I will post new comics in **' + interaction.channel.name + '** from now on.\n' +
                  'I check for new comics every 4 hours.\n' +
                  'Last comic is **#' + comicJson.num + '**, posted ' + comicJson.day + '/' + comicJson.month + '/' + comicJson.year + '.\n';

    // Reply
    await interaction.reply(reply);
  },
};