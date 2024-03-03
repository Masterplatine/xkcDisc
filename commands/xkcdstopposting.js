// discord.js API
const { SlashCommandBuilder } = require('discord.js');

// Common definitions
const xkcdCommon = require('../xkcd_common.js');

// TODO write command summary and parameter here. Maybe use doxygen style

module.exports = {
  data: new SlashCommandBuilder()
  .setName('xkcdstopposting')
  .setDescription('Stop posting new comics on the channel previously selected with "xkcdstartposting".'),
  async execute(interaction) {
    // Get channel name to show it in reply
    const channelName = await xkcdCommon.getPostingChannelName();

    // Stop interval
    xkcdCommon.stopAutomaticPosting();

    // Build reply message
    let reply;

    if (channelName == null) {
      reply = 'Automatic comic posting is not started.\nTo start automatic posting, use "xkcdstartposting" in the desired channel.';
    } else {
      reply = 'I will stop posting new comics in **' + channelName + '**.\n' +
              'If you want to resume automatic posting, use "xkcdstartposting" in the desired channel.';
    }
    // Reply
    await interaction.reply(reply);
  },
};