const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the current audio track.'),
    async execute(interaction) {
        // Get the user's voice channel
        const voiceChannel = interaction.member.voice.channel;

        // Check if the user is in a voice channel
        if (!voiceChannel) {
            interaction.reply('You must be in a voice channel to resume music!');
            return;
        }

        // Join the user's voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        // Get the audio player
        const player = createAudioPlayer();

        // Subscribe the connection to the audio player (will play audio on the voice connection)
        connection.subscribe(player);

        // Resume the audio
        player.unpause();

        interaction.reply('Resuming audio...');
    },
};