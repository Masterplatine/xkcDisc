// discord.js API
const { SlashCommandBuilder } = require('discord.js');

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
    const comicNumber = interaction.options.getInteger('number') ?? null;

    // Build url
    let url = 'https://xkcd.com/';
    if (comicNumber != null) {
      url = url + comicNumber + '/';
    }
    url = url + 'info.0.json';

    // Get xkcd API webpage
    const response = await fetch(url);
    // Check response validity
    if (!response.ok) {
      throw new Error('Bad option !\nComic #' + comicNumber + 'does not exist\n(Either that or xkcd.com is unreachable)');
    }
    const comicJson = await response.json();

    // Build reply message
    // Constructed in a way that is more visual when editing
    const reply = '#' + comicJson.num + '\n' +
                  'Posted ' + comicJson.day + '/' + comicJson.month + '/' + comicJson.year + '\n' +
                  '\n' +
                  '**' + comicJson.safe_title + '**\n' +
                  '*' + comicJson.alt + '*\n' +
                  comicJson.img;

    // Reply
    await interaction.reply(reply);
  },
};