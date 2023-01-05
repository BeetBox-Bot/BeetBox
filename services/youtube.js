const ytdl = require('ytdl-core');
const google = require('googleapis');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});

// Search for YouTube videos by keyword and return the first result
const search = async (query, callback) => {
    // Search for videos on YouTube
    const res = await youtube.search.list({
        type: 'video',
        q: query,
        part: 'id',
    });

    // Get the first result
    const video = res.data.items[0];
    if (!video) {
        return callback(null);
    }

    // Get the video's URL
    const url = `https://www.youtube.com/watch?v=${video.id.videoId}`;
    return callback(url);
};

// Play the audio of a YouTube video
const play = (videoId, message) => {
    message.member.voice.channel.join()
        .then(connection => {
            // Play the audio of the YouTube video
            const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly' });
            const dispatcher = connection.play(stream);

            // Leave the voice channel when the stream ends
            dispatcher.on('finish', () => {
                message.member.voice.channel.leave();
            });
        })
};