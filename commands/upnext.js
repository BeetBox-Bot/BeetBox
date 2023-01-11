const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('upnext')
        .setDescription('Returns the next song in the queue.'),

    async execute(interaction) {
        // Get the user's voice channel
        const voiceChannel = interaction.member.voice.channel;

        // Check if the user is in a voice channel
        if (!voiceChannel) {
            interaction.reply('You must be in a voice channel to see what\'s playing!');
            return;
        }

        if (global.queue.getNext() != null) {
            interaction.reply("The next song in the queue is: " + global.queue.getNext().title);
        }
        else {
            interaction.reply("There are no more songs in the queue.");
        }
    },
};