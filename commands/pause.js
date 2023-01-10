const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses audio playback.'),

        async execute(interaction) {
            // Get the user's voice channel
            const voiceChannel = interaction.member.voice.channel;
        
            // Check if the user is in a voice channel
            if (!voiceChannel) {
                interaction.reply('You must be in a voice channel to pause music!');
                return;
            }
        
            global.queue.pause();
            interaction.reply('Playback paused.');
        },
};