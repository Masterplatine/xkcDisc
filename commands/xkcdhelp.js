// discord.js API
const { SlashCommandBuilder } = require('discord.js');

// TODO write command summary and parameter here. Maybe use doxygen style

const reply = `
**X**kcd **K**ool **C**ommands for **Disc**ord


**/xkcd [id]**
Post an xkcd comic. Use the [id] option to pick a specific comic.
Optional parameter :
 [id]: ID of comic to post. If omited, post latest comic.
 
**/xkcdrand [howmany] [after] [before]**
Post up to 5 random comics.
Optional parameters :
 [howmany]: number of comics to post, max is 5. Default is 1.
 [after]  : limit random to comic IDs higher than this parameter (Comic ID >= after). Default is 1
 [before] : limit random to comic IDs lower than this parameter (Comic ID < before). Default is latest comic ID 

**/xkcdhelp**
Print this help :)`;

module.exports = {
  data: new SlashCommandBuilder()
  .setName('xkcdhelp')
  .setDescription('Display command info'),
  async execute(interaction) {
    // Reply
    await interaction.reply({ content: reply, ephemeral: true });
  },
};