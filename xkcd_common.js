/*
* Common functions and variables
*/

const { client } = require('./index.js');

/************* EXPORTS ****************/
exports.postComicAutomatic = postComicAutomatic;
exports.setPostingChannel = setPostingChannel;
exports.getPostingChannelName = getPostingChannelName;
exports.startAutomaticPosting = startAutomaticPosting;
exports.stopAutomaticPosting = stopAutomaticPosting;
exports.setPostingLastID = setPostingLastID;
exports.getComicJson = getComicJson;
exports.buildReplyMessage = buildReplyMessage;

/************* MACROS ****************/

// Fixed period for checking new comics and posting them. Set to 4 hours.
const AUTOMATIC_POSTING_INTERVAL_MS = 4 * 60 * 1000;

/************ VARIABLES ***************/

// Channel selected by user for automatic posting
let automaticPostingChannelID = null;

// Interval object used ot start and stop automatic posting
let automaticPostingInterval = null;

// Last comic posted
let automaticPostingLastID = null;

/************ FUNCTIONS ***************/
async function postComicAutomatic() {

  // Get last comic ID
  const comicJson = await getComicJson();
  const lastComicID = comicJson.num;

  // Check if a new comic dropped
  if (lastComicID > automaticPostingLastID) {
    // Build message
    const message = buildReplyMessage(comicJson);

    // Post comic on selected channel
    const channel = await client.channels.fetch(automaticPostingChannelID);
    channel.send({ content: message });

    // Update last posted ID
    automaticPostingLastID = lastComicID;
  }
  else {
    // No new comic, nothing to do
  }
}

function setPostingLastID(ComicID) {
  // would be nice to check ComicID value first
  automaticPostingLastID = ComicID;
}

function setPostingChannel(postingChannelID) {
  // would be nice to check postingChannelID value first
  automaticPostingChannelID = postingChannelID;
}

async function getPostingChannelName() {
  if (automaticPostingChannelID == null) {
    return null;
  }
  const channel = await client.channels.fetch(automaticPostingChannelID);
  return channel.name;
}

function startAutomaticPosting() {
  if (automaticPostingInterval != null) {
    // Stop previous interval if there was one
    clearInterval(automaticPostingInterval);
  }
  // Start new interval
  automaticPostingInterval = setInterval(postComicAutomatic, AUTOMATIC_POSTING_INTERVAL_MS);
}

function stopAutomaticPosting() {
  clearInterval(automaticPostingInterval);
  automaticPostingInterval = null;
  automaticPostingChannelID = null;
}

async function getComicJson(comicId) {
  // Build url
  let url = 'https://xkcd.com/';
  if (comicId != null) {
    url = url + comicId + '/';
  }
  url = url + 'info.0.json';

  // Get xkcd API webpage
  const response = await fetch(url);
  // Check response validity
  if (!response.ok) {
    throw new Error('Bad option !\nComic #' + comicId + ' does not exist\n(Either that or xkcd.com is unreachable)');
  }
  const comicJson = await response.json();

  return comicJson;
}

function buildReplyMessage(comicJson) {
  // would be nice to check comicJson value first

    const reply = '#' + comicJson.num + '\n' +
                  'Posted ' + comicJson.day + '/' + comicJson.month + '/' + comicJson.year + '\n' +
                  '\n' +
                  '**' + comicJson.safe_title + '**\n' +
                  '*' + comicJson.alt + '*\n' +
                  comicJson.img;
    return reply;
}