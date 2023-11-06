// discord.js API
const { SlashCommandBuilder } = require('discord.js');

// Min and Max number of comics one can request
const NB_MIN_COMICS = 1;
const NB_MAX_COMICS = 5;

// TODO write command summary and parameter here. Maybe use doxygen style

module.exports = {
  data: new SlashCommandBuilder()
  .setName('xkcdrand')
  .setDescription('Post up to ' + NB_MAX_COMICS + ' random comics')
  .addIntegerOption(option =>
    option
      .setName('howmany')
      .setMinValue(NB_MIN_COMICS)
      .setMaxValue(NB_MAX_COMICS)
      .setDescription('Number of comics to post. Max is ' + NB_MAX_COMICS + '. If omitted, post 1 comic'))
  .addIntegerOption(option =>
    option
      .setName('after')
      .setMinValue(1)
      .setDescription('Limit random to comic numbers greater than this parameter'))
  .addIntegerOption(option =>
    option
      .setName('before')
      .setMinValue(2)
      .setDescription('Limit random to comic numbers lesser than this parameter')),
  async execute(interaction) {
    // Get number option. If ommited n=1
    const nbOfComicsRequested = interaction.options.getInteger('howmany') ?? 1;
    const randAfter = interaction.options.getInteger('after') ?? 1;
    let randBefore = interaction.options.getInteger('before') ?? null;
    const replyMessages = Array(nbOfComicsRequested);
    const userName = interaction.user.username;
    let nbOfLastComic = 0;
    let response;
    let comicJson;

    // Check command params
    // 'howmany'
    if (nbOfComicsRequested < NB_MIN_COMICS || nbOfComicsRequested > NB_MAX_COMICS) {
      // Should never happen but let's check just in case. It's better than accidentally flooding the channel
      throw new Error('Bad option !\nCommand argument: number of comics out of range');
    }
    // 'after' and 'before'
    if (randBefore != null) {
      // Ensure after < before
      if (randAfter >= randBefore) {
        throw new Error('Bad option !\nCommand argument: "after" should be lesser than "before"');
      }
    }

    // Get max comic num
    response = await fetch('https://xkcd.com/info.0.json');
    // Check response validity
    if (!response.ok) {
      await interaction.reply({ content: 'There was an error while trying to reach xkcd.com. Sorry !', ephemeral: true });
      throw new Error(`Request failed with status ${response.status}`);
    }
    comicJson = await response.json();
    nbOfLastComic = comicJson.num;
    // Ensure 'after' is less than the last comic id
    if (randAfter >= nbOfLastComic) {
      throw new Error('Bad option !\nCommand argument: "after" should be greater than latest comic id (' + nbOfLastComic + ')');
    }
    // If Max parameter not defined, Max = last comic
    if (randBefore == null) {
      randBefore = nbOfLastComic + 1;
    }

    // Generate n random numbers
    for (let l_index = 0; l_index < nbOfComicsRequested; l_index++) {
      const randomComicNumber = Math.floor(randAfter + (randBefore - randAfter) * Math.random());
      let url = 'https://xkcd.com/';

      // Build url
      url = url + randomComicNumber + '/info.0.json';

      // Get xkcd API webpage
      response = await fetch(url);
      // Check response validity
      if (!response.ok) {
        throw new Error('There was an error while trying to reach xkcd.com. Sorry !');
      }
      comicJson = await response.json();

      // Build reply message
      // Constructed in a way that is more visual when editing
      replyMessages[l_index] = '#' + comicJson.num + '\n' +
                               'Posted ' + comicJson.day + '/' + comicJson.month + '/' + comicJson.year + '\n' +
                               '\n' +
                               '**' + comicJson.safe_title + '**\n' +
                               '*' + comicJson.alt + '*\n' +
                               comicJson.img;
    }

    // Intiial reply
    await interaction.reply({ content: userName + ' asked for ' + nbOfComicsRequested + ' random comic(s), here it goes !', ephemeral: false });
    // Additional replies if any
    for (let l_index = 0; l_index < nbOfComicsRequested; l_index++) {
      await interaction.followUp(replyMessages[l_index]);
    }
  },
};