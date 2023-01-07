const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

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
        
            // Join the user's voice channel
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
        
            // Pause audio playback
            const player = createAudioPlayer();
            player.pause();
        
            // Subscribe the connection to the audio player (will pause audio on the voice connection)
            connection.subscribe(player);
        
            interaction.reply('Paused audio playback.');
        },
};