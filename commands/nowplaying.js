const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Returns the currently playing song.'),

        async execute(interaction) {
            // Get the user's voice channel
            const voiceChannel = interaction.member.voice.channel;
        
            // Check if the user is in a voice channel
            if (!voiceChannel) {
                interaction.reply('You must be in a voice channel to see what\'s playing!');
                return;
            }
        
            //global.queue.pause();
            interaction.reply('Currently Playing: ' + global.queue.getTop().title);
        },
};