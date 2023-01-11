const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjusts the playback volume. Choose a number between 1-10.')
        .addIntegerOption(option =>
            option.setName('volume')
                .setDescription('The volume between 1 - 10.')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(10)),

    async execute(interaction) {
        // Get the user's voice channel
        const voiceChannel = interaction.member.voice.channel;

        // Check if the user is in a voice channel
        if (!voiceChannel) {
            interaction.reply('You must be in a voice channel to adjust volume!');
            return;
        }

        const query = interaction.options.getInteger('volume') ?? 'No volume provided!';

        await global.queue.setVolume(query / 10);
        interaction.reply(`Volume set to ${query} / 10.`);
    },
};