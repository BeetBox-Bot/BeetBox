const { SlashCommandBuilder } = require('discord.js');

const { getPlaylist } = require('../models/spotify');
const { Youtube } = require('../models/youtube');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Add a Spotify playlist to the queue.'),

        async execute(interaction) {
            // Get the user's voice channel
            const voiceChannel = interaction.member.voice.channel;
        
            // Check if the user is in a voice channel
            if (!voiceChannel) {
                interaction.reply('You must be in a voice channel to add a playlist!');
                return;
            }
        
            await interaction.deferReply();
            const query = interaction.options.getString('query') ?? 'No URL or search provided!';
            let song;

            // Check if the query is a Spotify playlist URL
            if (query.includes('open.spotify.com/playlist')) {
                // Find the song by title on youtube
                const playlistId = query.substring(query.lastIndexOf('/') + 1).split('?')[0];
                const playlists = await getPlaylist();

                for (p of playlists) {
                    song = new Youtube(p.name);
                    song.connection = connection;
                    global.queue.push(song, interaction);
                }
            }
            else {
                interaction.editReply('Please enter a valid Spotify playlist URL.');
            }
        },
};