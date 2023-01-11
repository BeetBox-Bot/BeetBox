const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Lists items in the playback queue.'),

        async execute(interaction) {
            let songs = global.queue.list();
            let resp = "`";
            for (let i = 0; i < songs.length; i++) {
                resp += `${i+1}. ${songs[i]}\n`;
            }
            resp += "`";
            interaction.reply(`Here's what's in the playback queue:\n${resp}`);
        }
};