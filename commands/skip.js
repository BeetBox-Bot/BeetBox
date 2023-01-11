const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips to next song in playback queue.'),

        async execute(interaction) {
            // Get the user's voice channel
            const voiceChannel = interaction.member.voice.channel;
        
            // Check if the user is in a voice channel
            if (!voiceChannel) {
                interaction.reply('You must be in a voice channel to skip music!');
                return;
            }
        
            await global.queue.skip(interaction);
            interaction.reply('Song skipped.');
        },
};