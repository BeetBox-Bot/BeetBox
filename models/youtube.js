const ytdl = require('ytdl-core');
const { google } = require('googleapis');
var Meta = require('html-metadata-parser');
const dotenv = require('dotenv').config({ path: `${__dirname}/../.env` })
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});

const Song = require('./song');

const searchYoutube = async (query) => {
    // Search for YouTube videos
    const response = await youtube.search.list({
        part: 'id',
        type: 'video',
        q: query,
    });

    // Get the first result
    return response.data.items[0].id.videoId;
};

class Youtube extends Song {
    constructor (videoId) {
        super();
        this.videoId = videoId;
        this.link = `https://www.youtube.com/watch?v=${videoId}`;
        this.title = "";
    }

    async play (interaction) {
        //this.title = await Youtube.getTitle(`https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${this.videoId}&format=json`);
        //sconsole.log(`TITLE ${this.title}`)
        this.stream = ytdl(this.link, { filter: 'audioonly' });
        await super.play(interaction);
    }

    static async getTitle(link) {
        return (await Meta.parser(link)).meta.title;
    }
}

module.exports = {
    searchYoutube,
    Youtube
};